import { z } from 'zod';

/**
 * @growthub/brand-kit/assets
 * Brand Asset Management and File Operations
 *
 * Professional asset management patterns extracted from the AT-03 production system.
 * Provides secure file upload, storage coordination, and asset serving utilities.
 */

type BrandAssetType = 'logo' | 'product_photo' | 'lifestyle_image' | 'icon' | 'banner';
declare const FileUploadSchema: z.ZodObject<{
    file: z.ZodType<File, z.ZodTypeDef, File>;
    assetType: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner"]>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    assetType: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner";
    file: File;
    description?: string | undefined;
    title?: string | undefined;
}, {
    assetType: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner";
    file: File;
    description?: string | undefined;
    title?: string | undefined;
}>;
type FileUploadData = z.infer<typeof FileUploadSchema>;
declare const AssetMetadataSchema: z.ZodObject<{
    file_name: z.ZodString;
    file_size: z.ZodNumber;
    file_type: z.ZodString;
    uploaded_at: z.ZodString;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    alt_text: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    file_name: string;
    file_size: number;
    file_type: string;
    uploaded_at: string;
    tags: string[];
    description?: string | undefined;
    title?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
    alt_text?: string | undefined;
}, {
    file_name: string;
    file_size: number;
    file_type: string;
    uploaded_at: string;
    description?: string | undefined;
    title?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
    alt_text?: string | undefined;
    tags?: string[] | undefined;
}>;
type AssetMetadata = z.infer<typeof AssetMetadataSchema>;
declare const UploadResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    assetUrl: z.ZodOptional<z.ZodString>;
    storagePath: z.ZodOptional<z.ZodString>;
    assetId: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
        code: z.ZodString;
        details: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: any;
    }, {
        code: string;
        message: string;
        details?: any;
    }>>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    assetUrl?: string | undefined;
    error?: {
        code: string;
        message: string;
        details?: any;
    } | undefined;
    storagePath?: string | undefined;
    assetId?: string | undefined;
}, {
    success: boolean;
    assetUrl?: string | undefined;
    error?: {
        code: string;
        message: string;
        details?: any;
    } | undefined;
    storagePath?: string | undefined;
    assetId?: string | undefined;
}>;
type UploadResult = z.infer<typeof UploadResultSchema>;
interface StorageClient {
    upload(path: string, file: File, options?: {
        cacheControl?: string;
        upsert?: boolean;
    }): Promise<{
        error: any;
    }>;
    getPublicUrl(path: string): {
        data: {
            publicUrl: string;
        };
    };
    remove(paths: string[]): Promise<{
        error: any;
    }>;
}
interface AssetStorageConfig {
    bucket: string;
    pathPrefix: string;
    allowedTypes: string[];
    maxFileSize: number;
    cacheControl: string;
}
/**
 * Brand Asset Manager Class
 * Handles file upload, storage coordination, and asset management
 */
declare class BrandAssetManager {
    private storageClient;
    private config;
    constructor(storageClient: StorageClient, config?: Partial<AssetStorageConfig>);
    /**
     * Validate file before upload
     */
    validateFile(file: File): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Generate storage path for asset
     */
    generateStoragePath(userId: string, brandKitId: string, assetType: BrandAssetType, fileName: string): string;
    /**
     * Sanitize file name for safe storage
     */
    private sanitizeFileName;
    /**
     * Upload file to storage
     */
    uploadFile(userId: string, brandKitId: string, uploadData: FileUploadData): Promise<UploadResult>;
    /**
     * Delete asset from storage
     */
    deleteAsset(storagePath: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * Create asset metadata from file
     */
    createAssetMetadata(file: File, additionalData?: Partial<AssetMetadata>): AssetMetadata;
    /**
     * Get image dimensions (client-side)
     */
    getImageDimensions(file: File): Promise<{
        width: number;
        height: number;
    } | null>;
    /**
     * Process file before upload (resize, optimize, etc.)
     */
    processFile(file: File, options?: {
        maxWidth?: number;
        maxHeight?: number;
        quality?: number;
    }): Promise<File>;
}
/**
 * Asset Serving Utilities
 */
declare class AssetServingManager {
    private baseUrl;
    private secureProxyPath;
    constructor(baseUrl: string, secureProxyPath?: string);
    /**
     * Generate secure asset URL through proxy
     */
    generateSecureUrl(assetUrl: string, options?: {
        width?: number;
        height?: number;
        quality?: number;
        format?: 'webp' | 'jpeg' | 'png';
    }): string;
    /**
     * Generate responsive image set
     */
    generateResponsiveImageSet(assetUrl: string): {
        src: string;
        srcSet: string;
        sizes: string;
    };
    /**
     * Get optimized thumbnail URL
     */
    getThumbnailUrl(assetUrl: string, size?: 'small' | 'medium' | 'large'): string;
}
/**
 * Asset Category Utilities
 */
declare const AssetCategoryUtils: {
    /**
     * Get asset type display name
     */
    getDisplayName: (assetType: BrandAssetType) => string;
    /**
     * Get asset type description
     */
    getDescription: (assetType: BrandAssetType) => string;
    /**
     * Get recommended dimensions for asset type
     */
    getRecommendedDimensions: (assetType: BrandAssetType) => {
        width: number;
        height: number;
        aspectRatio: string;
    };
    /**
     * Get asset priorities for different use cases
     */
    getAssetPriority: (assetType: BrandAssetType) => number;
};
/**
 * File validation utilities
 */
declare const FileValidationUtils: {
    /**
     * Check if file is an image
     */
    isImage: (file: File) => boolean;
    /**
     * Get file size in human readable format
     */
    formatFileSize: (bytes: number) => string;
    /**
     * Validate file extension
     */
    validateExtension: (fileName: string, allowedExtensions: string[]) => boolean;
    /**
     * Generate unique filename
     */
    generateUniqueFileName: (originalName: string) => string;
};

export { AssetCategoryUtils, type AssetMetadata, AssetMetadataSchema, AssetServingManager, type AssetStorageConfig, BrandAssetManager, type BrandAssetType, type FileUploadData, FileUploadSchema, FileValidationUtils, type StorageClient, type UploadResult, UploadResultSchema };
