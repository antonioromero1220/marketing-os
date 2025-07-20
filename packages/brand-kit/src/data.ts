/**
 * @growthub/brand-kit/data
 * Brand Data Coordination and Management Utilities
 * 
 * Professional brand data patterns extracted from the AT-03 production system.
 * Provides secure brand kit operations with user isolation and validation.
 */

import { z } from 'zod'

// Re-use existing validation schemas from the main app
export const BrandKitInsertSchema = z.object({
  user_id: z.string().uuid(),
  brand_name: z.string().min(1, 'Brand name is required').max(100, 'Brand name too long'),
  colors: z.any().nullable().default(null), // JSON type in database
  fonts: z.any().nullable().default(null),  // JSON type in database
  messaging: z.string().nullable().default(null),
})

export const BrandKitDataSchema = BrandKitInsertSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const BrandKitUpdateSchema = z.object({
  brand_name: z.string().min(1).max(100).optional(),
  colors: z.any().nullable().optional(),
  fonts: z.any().nullable().optional(),
  messaging: z.string().nullable().optional(),
  updated_at: z.string().datetime().optional(),
})

export const BrandAssetSchema = z.object({
  id: z.string().uuid(),
  brand_kit_id: z.string().uuid(),
  asset_type: z.enum(['logo', 'product_photo', 'lifestyle_image', 'icon', 'banner']),
  asset_url: z.string().url(),
  storage_path: z.string(),
  metadata: z.any().nullable().default(null),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const BrandAssetInsertSchema = z.object({
  brand_kit_id: z.string().uuid(),
  asset_type: z.enum(['logo', 'product_photo', 'lifestyle_image', 'icon', 'banner']),
  asset_url: z.string().url(),
  storage_path: z.string(),
  metadata: z.any().nullable().default(null),
})

export const BrandContextSchema = z.object({
  brand_name: z.string(),
  colors: z.array(z.string()).default([]),
  messaging: z.string().nullable().default(null),
  referenceImages: z.array(z.object({
    url: z.string(),
    type: z.string(),
    description: z.string()
  })).default([])
})

export const BrandDataToolResultSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  brandKit: z.object({
    id: z.string(),
    brandName: z.string(),
    colors: z.any().optional(),
    fonts: z.any().optional(), 
    messaging: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }).nullable(),
  assets: z.array(z.object({
    id: z.string(),
    assetType: z.string(),
    assetUrl: z.string(),
    metadata: z.any().nullable(),
    createdAt: z.string()
  })).default([])
})

export type BrandKitData = z.infer<typeof BrandKitDataSchema>
export type BrandKitInsert = z.infer<typeof BrandKitInsertSchema>
export type BrandKitUpdate = z.infer<typeof BrandKitUpdateSchema>
export type BrandAsset = z.infer<typeof BrandAssetSchema>
export type BrandAssetInsert = z.infer<typeof BrandAssetInsertSchema>
export type BrandContext = z.infer<typeof BrandContextSchema>
export type BrandDataToolResult = z.infer<typeof BrandDataToolResultSchema>

// Simplified database client interface that matches Supabase
export interface BrandDatabaseClient {
  from(table: string): TableBuilder
}

interface TableBuilder {
  select(columns?: string): SelectQueryBuilder
  insert(data: any): InsertBuilder
  update(data: any): UpdateQueryBuilder
  delete(): DeleteQueryBuilder
}

interface SelectQueryBuilder {
  eq(column: string, value: any): SelectQueryBuilder
  order(column: string, options?: { ascending: boolean }): SelectQueryBuilder
  single(): Promise<{ data: any; error: any }>
  limit(count: number): SelectQueryBuilder
}

interface InsertBuilder {
  select(): { single(): Promise<{ data: any; error: any }> }
}

interface UpdateQueryBuilder {
  eq(column: string, value: any): UpdateQueryBuilder
  select(): { single(): Promise<{ data: any; error: any }> }
}

interface DeleteQueryBuilder {
  eq(column: string, value: any): DeleteQueryBuilder
}

interface DeleteResult {
  error: any
}

/**
 * Brand Data Manager Class
 * Provides secure brand kit operations with user isolation
 */
export class BrandDataManager {
  private client: BrandDatabaseClient

  constructor(databaseClient: BrandDatabaseClient) {
    this.client = databaseClient
  }

  /**
   * Get all brand kits for a user with ownership validation
   */
  async getBrandKits(userId: string): Promise<BrandKitData[]> {
    try {
      const query = this.client
        .from('brand_kits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        
      // Note: This assumes the SelectQueryBuilder implements a promise for non-single queries
      const result = await (query as any)
      
      if (result?.error) {
        throw new Error(`Failed to fetch brand kits: ${result.error.message}`)
      }
      
      return (result?.data || []).map((item: any) => BrandKitDataSchema.parse(item))
    } catch (error) {
      console.error('[getBrandKits] Error:', error)
      throw error
    }
  }

  /**
   * Get a specific brand kit by ID with ownership validation
   */
  async getBrandKitById(userId: string, brandKitId: string): Promise<BrandKitData | null> {
    try {
      const { data, error } = await this.client
        .from('brand_kits')
        .select('*')
        .eq('id', brandKitId)
        .eq('user_id', userId)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null // Not found
        }
        throw new Error(`Failed to fetch brand kit: ${error.message}`)
      }
      
      return BrandKitDataSchema.parse(data)
    } catch (error) {
      console.error('[getBrandKitById] Error:', error)
      throw error
    }
  }

  /**
   * Create a new brand kit with user assignment
   */
  async createBrandKit(userId: string, brandData: Omit<BrandKitInsert, 'user_id'>): Promise<BrandKitData> {
    try {
      const insertData = BrandKitInsertSchema.parse({
        ...brandData,
        user_id: userId
      })

      const { data, error } = await this.client
        .from('brand_kits')
        .insert({
          ...insertData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) {
        throw new Error(`Failed to create brand kit: ${error.message}`)
      }
      
      return BrandKitDataSchema.parse(data)
    } catch (error) {
      console.error('[createBrandKit] Error:', error)
      throw error
    }
  }

  /**
   * Update an existing brand kit with ownership validation
   */
  async updateBrandKit(userId: string, brandKitId: string, updates: BrandKitUpdate): Promise<BrandKitData> {
    try {
      const updateData = BrandKitUpdateSchema.parse({
        ...updates,
        updated_at: new Date().toISOString()
      })

      const { data, error } = await this.client
        .from('brand_kits')
        .update(updateData)
        .eq('id', brandKitId)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) {
        throw new Error(`Failed to update brand kit: ${error.message}`)
      }
      
      return BrandKitDataSchema.parse(data)
    } catch (error) {
      console.error('[updateBrandKit] Error:', error)
      throw error
    }
  }

  /**
   * Delete a brand kit with ownership validation
   */
  async deleteBrandKit(userId: string, brandKitId: string): Promise<boolean> {
    try {
      const deleteQuery = this.client
        .from('brand_kits')
        .delete()
        .eq('id', brandKitId)
        .eq('user_id', userId)
        
      // Note: This assumes the DeleteQueryBuilder implements a promise
      const result = await (deleteQuery as any)
      
      if (result?.error) {
        throw new Error(`Failed to delete brand kit: ${result.error.message}`)
      }
      
      return true
    } catch (error) {
      console.error('[deleteBrandKit] Error:', error)
      throw error
    }
  }

  /**
   * Get brand assets for a specific brand kit with ownership validation
   */
  async getBrandAssets(userId: string, brandKitId: string, assetTypes?: string[]): Promise<BrandAsset[]> {
    try {
      // First verify brand kit ownership
      const brandKit = await this.getBrandKitById(userId, brandKitId)
      if (!brandKit) {
        throw new Error('Brand kit not found or access denied')
      }

      const query = this.client
        .from('brand_assets')
        .select('*')
        .eq('brand_kit_id', brandKitId)
        
      // Note: This assumes the SelectQueryBuilder implements a promise for non-single queries
      const result = await (query as any)
      
      if (result?.error) {
        throw new Error(`Failed to fetch brand assets: ${result.error.message}`)
      }
      
      let assets = (result?.data || []).map((item: any) => BrandAssetSchema.parse(item))
      
      // Client-side filtering if assetTypes specified
      if (assetTypes && assetTypes.length > 0) {
        assets = assets.filter((asset: BrandAsset) => assetTypes.includes(asset.asset_type))
      }
      
      return assets
    } catch (error) {
      console.error('[getBrandAssets] Error:', error)
      throw error
    }
  }

  /**
   * Create a brand asset with ownership validation
   */
  async createBrandAsset(userId: string, assetData: BrandAssetInsert): Promise<BrandAsset> {
    try {
      // Verify brand kit ownership
      const brandKit = await this.getBrandKitById(userId, assetData.brand_kit_id)
      if (!brandKit) {
        throw new Error('Brand kit not found or access denied')
      }

      const insertData = BrandAssetInsertSchema.parse(assetData)

      const { data, error } = await this.client
        .from('brand_assets')
        .insert({
          ...insertData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) {
        throw new Error(`Failed to create brand asset: ${error.message}`)
      }
      
      return BrandAssetSchema.parse(data)
    } catch (error) {
      console.error('[createBrandAsset] Error:', error)
      throw error
    }
  }

  /**
   * Transform brand kit data to brand context for agent integration
   */
  transformToBrandContext(brandKit: BrandKitData | null, assets: BrandAsset[] = []): BrandContext {
    if (!brandKit) {
      return {
        brand_name: 'Your Brand',
        colors: [],
        messaging: null,
        referenceImages: []
      }
    }

    return {
      brand_name: brandKit.brand_name,
      colors: brandKit.colors ? Object.values(brandKit.colors).filter(Boolean) as string[] : [],
      messaging: brandKit.messaging,
      referenceImages: assets.map(asset => ({
        url: asset.asset_url,
        type: asset.asset_type,
        description: asset.metadata?.description || asset.asset_type
      }))
    }
  }

  /**
   * Transform brand data to tool result format
   */
  transformToBrandDataToolResult(brandKit: BrandKitData | null, assets: BrandAsset[] = []): BrandDataToolResult {
    return {
      success: true,
      brandKit: brandKit ? {
        id: brandKit.id,
        brandName: brandKit.brand_name,
        colors: brandKit.colors,
        fonts: brandKit.fonts,
        messaging: brandKit.messaging,
        createdAt: brandKit.created_at,
        updatedAt: brandKit.updated_at
      } : null,
      assets: assets.map(asset => ({
        id: asset.id,
        assetType: asset.asset_type,
        assetUrl: asset.asset_url,
        metadata: asset.metadata,
        createdAt: asset.created_at
      }))
    }
  }
}

/**
 * Default brand kit data for new users
 */
export const DEFAULT_BRAND_KIT_DATA: Partial<BrandKitInsert> = {
  brand_name: 'My New Brand',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    neutral: '#6B7280'
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    accent: 'Roboto'
  },
  messaging: null
}

/**
 * Utility functions for brand data operations
 */
export const BrandDataUtils = {
  /**
   * Validate brand kit ownership
   */
  validateOwnership: (brandKit: BrandKitData, userId: string): boolean => {
    return brandKit.user_id === userId
  },

  /**
   * Generate storage path for brand assets
   */
  generateAssetStoragePath: (userId: string, brandKitId: string, assetType: string, fileName: string): string => {
    const timestamp = Date.now()
    const sanitizedFileName = fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 100)
    return `public/${userId}/brand_assets/${brandKitId}/${assetType}/${timestamp}_${sanitizedFileName}`
  },

  /**
   * Extract brand colors as array
   */
  extractBrandColors: (brandKit: BrandKitData | null): string[] => {
    if (!brandKit || !brandKit.colors) return []
    return Object.values(brandKit.colors).filter(Boolean) as string[]
  },

  /**
   * Check if brand kit is complete
   */
  isBrandKitComplete: (brandKit: BrandKitData): boolean => {
    return !!(brandKit.brand_name && brandKit.colors && Object.keys(brandKit.colors).length > 0)
  },

  /**
   * Calculate brand strength score
   */
  calculateBrandStrength: (brandKit: BrandKitData, assets: BrandAsset[]): 'weak' | 'moderate' | 'strong' | 'excellent' => {
    let score = 0
    
    // Brand name (required)
    if (brandKit.brand_name && brandKit.brand_name.length > 3) score += 20
    
    // Colors
    if (brandKit.colors && Object.keys(brandKit.colors).length >= 2) score += 25
    if (brandKit.colors && Object.keys(brandKit.colors).length >= 4) score += 10
    
    // Fonts
    if (brandKit.fonts && Object.keys(brandKit.fonts).length >= 1) score += 15
    
    // Messaging
    if (brandKit.messaging && brandKit.messaging.length > 20) score += 15
    
    // Assets
    const logoAssets = assets.filter(a => a.asset_type === 'logo')
    if (logoAssets.length > 0) score += 15
    if (assets.length > 2) score += 10
    
    if (score >= 85) return 'excellent'
    if (score >= 65) return 'strong'
    if (score >= 40) return 'moderate'
    return 'weak'
  }
} 