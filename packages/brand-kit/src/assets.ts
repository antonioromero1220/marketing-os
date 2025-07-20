/**
 * @growthub/brand-kit/assets
 * Brand Asset Management and File Operations
 * 
 * Professional asset management patterns extracted from the AT-03 production system.
 * Provides secure file upload, storage coordination, and asset serving utilities.
 */

import { z } from 'zod'

// Asset Type Enum
export type BrandAssetType = 'logo' | 'product_photo' | 'lifestyle_image' | 'icon' | 'banner'

// File Upload Schema
export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  assetType: z.enum(['logo', 'product_photo', 'lifestyle_image', 'icon', 'banner']),
  title: z.string().optional(),
  description: z.string().optional(),
})

export type FileUploadData = z.infer<typeof FileUploadSchema>

// Asset Metadata Schema
export const AssetMetadataSchema = z.object({
  file_name: z.string(),
  file_size: z.number().int().positive(),
  file_type: z.string(),
  uploaded_at: z.string().datetime(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt_text: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

export type AssetMetadata = z.infer<typeof AssetMetadataSchema>

// Upload Result Schema
export const UploadResultSchema = z.object({
  success: z.boolean(),
  assetUrl: z.string().url().optional(),
  storagePath: z.string().optional(),
  assetId: z.string().uuid().optional(),
  error: z.object({
    message: z.string(),
    code: z.string(),
    details: z.any().optional()
  }).optional()
})

export type UploadResult = z.infer<typeof UploadResultSchema>

// Storage Client Interface
export interface StorageClient {
  upload(path: string, file: File, options?: { 
    cacheControl?: string; 
    upsert?: boolean 
  }): Promise<{ error: any }>
  
  getPublicUrl(path: string): { 
    data: { publicUrl: string } 
  }
  
  remove(paths: string[]): Promise<{ error: any }>
}

// Asset Storage Configuration
export interface AssetStorageConfig {
  bucket: string
  pathPrefix: string
  allowedTypes: string[]
  maxFileSize: number // in bytes
  cacheControl: string
}

/**
 * Brand Asset Manager Class
 * Handles file upload, storage coordination, and asset management
 */
export class BrandAssetManager {
  private storageClient: StorageClient
  private config: AssetStorageConfig

  constructor(
    storageClient: StorageClient,
    config?: Partial<AssetStorageConfig>
  ) {
    this.storageClient = storageClient
    this.config = {
      bucket: 'node_documents',
      pathPrefix: 'public',
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      cacheControl: '3600',
      ...config
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check file type
    if (!this.config.allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type. Allowed types: ${this.config.allowedTypes.join(', ')}`)
    }

    // Check file size
    if (file.size > this.config.maxFileSize) {
      errors.push(`File too large. Maximum size: ${this.config.maxFileSize / (1024 * 1024)}MB`)
    }

    // Check file name
    if (!file.name || file.name.trim().length === 0) {
      errors.push('File name is required')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Generate storage path for asset
   */
  generateStoragePath(
    userId: string, 
    brandKitId: string, 
    assetType: BrandAssetType, 
    fileName: string
  ): string {
    const timestamp = Date.now()
    const sanitizedFileName = this.sanitizeFileName(fileName)
    return `${this.config.pathPrefix}/${userId}/brand_assets/${brandKitId}/${assetType}/${timestamp}_${sanitizedFileName}`
  }

  /**
   * Sanitize file name for safe storage
   */
  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 100)
  }

  /**
   * Upload file to storage
   */
  async uploadFile(
    userId: string,
    brandKitId: string,
    uploadData: FileUploadData
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(uploadData.file)
      if (!validation.valid) {
        return {
          success: false,
          error: {
            message: validation.errors.join(', '),
            code: 'VALIDATION_ERROR',
            details: validation.errors
          }
        }
      }

      // Generate storage path
      const storagePath = this.generateStoragePath(
        userId,
        brandKitId,
        uploadData.assetType,
        uploadData.file.name
      )

      // Upload to storage
      const { error: uploadError } = await this.storageClient.upload(
        storagePath,
        uploadData.file,
        {
          cacheControl: this.config.cacheControl,
          upsert: false
        }
      )

      if (uploadError) {
        return {
          success: false,
          error: {
            message: `File upload failed: ${uploadError.message}`,
            code: 'UPLOAD_ERROR',
            details: uploadError
          }
        }
      }

      // Get public URL
      const { data: { publicUrl } } = this.storageClient.getPublicUrl(storagePath)

      return {
        success: true,
        assetUrl: publicUrl,
        storagePath
      }

    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown upload error',
          code: 'UPLOAD_ERROR',
          details: error
        }
      }
    }
  }

  /**
   * Delete asset from storage
   */
  async deleteAsset(storagePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.storageClient.remove([storagePath])
      
      if (error) {
        return {
          success: false,
          error: `Failed to delete asset: ${error.message}`
        }
      }

      return { success: true }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown deletion error'
      }
    }
  }

  /**
   * Create asset metadata from file
   */
  createAssetMetadata(file: File, additionalData?: Partial<AssetMetadata>): AssetMetadata {
    return {
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      uploaded_at: new Date().toISOString(),
      tags: [],
      ...additionalData
    }
  }

  /**
   * Get image dimensions (client-side)
   */
  async getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null)
        return
      }

      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        })
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(null)
      }

      img.src = url
    })
  }

  /**
   * Process file before upload (resize, optimize, etc.)
   */
  async processFile(
    file: File,
    options?: {
      maxWidth?: number
      maxHeight?: number
      quality?: number
    }
  ): Promise<File> {
    // For now, return the original file
    // In a full implementation, this would handle image resizing/optimization
    return file
  }
}

/**
 * Asset Serving Utilities
 */
export class AssetServingManager {
  private baseUrl: string
  private secureProxyPath: string

  constructor(baseUrl: string, secureProxyPath: string = '/api/secure-image') {
    this.baseUrl = baseUrl
    this.secureProxyPath = secureProxyPath
  }

  /**
   * Generate secure asset URL through proxy
   */
  generateSecureUrl(assetUrl: string, options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpeg' | 'png'
  }): string {
    const url = new URL(this.secureProxyPath, this.baseUrl)
    url.searchParams.set('url', assetUrl)
    
    if (options) {
      if (options.width) url.searchParams.set('w', options.width.toString())
      if (options.height) url.searchParams.set('h', options.height.toString())
      if (options.quality) url.searchParams.set('q', options.quality.toString())
      if (options.format) url.searchParams.set('f', options.format)
    }
    
    return url.toString()
  }

  /**
   * Generate responsive image set
   */
  generateResponsiveImageSet(assetUrl: string): {
    src: string
    srcSet: string
    sizes: string
  } {
    const sizes = [320, 640, 768, 1024, 1280, 1920]
    
    const srcSet = sizes
      .map(size => `${this.generateSecureUrl(assetUrl, { width: size })} ${size}w`)
      .join(', ')

    return {
      src: this.generateSecureUrl(assetUrl, { width: 1024 }),
      srcSet,
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    }
  }

  /**
   * Get optimized thumbnail URL
   */
  getThumbnailUrl(
    assetUrl: string, 
    size: 'small' | 'medium' | 'large' = 'medium'
  ): string {
    const dimensions = {
      small: { width: 150, height: 150 },
      medium: { width: 300, height: 300 },
      large: { width: 600, height: 600 }
    }

    return this.generateSecureUrl(assetUrl, {
      ...dimensions[size],
      quality: 80,
      format: 'webp'
    })
  }
}

/**
 * Asset Category Utilities
 */
export const AssetCategoryUtils = {
  /**
   * Get asset type display name
   */
  getDisplayName: (assetType: BrandAssetType): string => {
    const displayNames: Record<BrandAssetType, string> = {
      logo: 'Logo',
      product_photo: 'Product Photo',
      lifestyle_image: 'Lifestyle Image',
      icon: 'Icon',
      banner: 'Banner'
    }
    return displayNames[assetType]
  },

  /**
   * Get asset type description
   */
  getDescription: (assetType: BrandAssetType): string => {
    const descriptions: Record<BrandAssetType, string> = {
      logo: 'Brand logos and logotypes',
      product_photo: 'Product photography and shots',
      lifestyle_image: 'Lifestyle and brand imagery',
      icon: 'Icons and small graphics',
      banner: 'Marketing banners and headers'
    }
    return descriptions[assetType]
  },

  /**
   * Get recommended dimensions for asset type
   */
  getRecommendedDimensions: (assetType: BrandAssetType): { width: number; height: number; aspectRatio: string } => {
    const dimensions: Record<BrandAssetType, { width: number; height: number; aspectRatio: string }> = {
      logo: { width: 512, height: 512, aspectRatio: '1:1' },
      product_photo: { width: 1200, height: 1200, aspectRatio: '1:1' },
      lifestyle_image: { width: 1920, height: 1080, aspectRatio: '16:9' },
      icon: { width: 256, height: 256, aspectRatio: '1:1' },
      banner: { width: 1920, height: 600, aspectRatio: '16:5' }
    }
    return dimensions[assetType]
  },

  /**
   * Get asset priorities for different use cases
   */
  getAssetPriority: (assetType: BrandAssetType): number => {
    // Lower numbers = higher priority
    const priorities: Record<BrandAssetType, number> = {
      logo: 1,
      product_photo: 2,
      lifestyle_image: 3,
      icon: 4,
      banner: 5
    }
    return priorities[assetType]
  }
}

/**
 * File validation utilities
 */
export const FileValidationUtils = {
  /**
   * Check if file is an image
   */
  isImage: (file: File): boolean => {
    return file.type.startsWith('image/')
  },

  /**
   * Get file size in human readable format
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  /**
   * Validate file extension
   */
  validateExtension: (fileName: string, allowedExtensions: string[]): boolean => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    return extension ? allowedExtensions.includes(extension) : false
  },

  /**
   * Generate unique filename
   */
  generateUniqueFileName: (originalName: string): string => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    const baseName = originalName.replace(/\.[^/.]+$/, "")
    
    return `${baseName}_${timestamp}_${random}.${extension}`
  }
} 