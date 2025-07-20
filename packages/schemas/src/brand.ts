/**
 * @growthub/schemas - Brand Management Schemas
 * 
 * Pure Zod schemas for brand kit management, assets, and context validation.
 * These schemas are stateless and contain no business logic - perfect for OSS.
 */

import { z } from 'zod';

// ============================================================================
// BRAND KIT SCHEMAS
// ============================================================================

export const BrandKitSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  colors: z.array(z.string().regex(/^#[0-9A-F]{6}$/i)).max(10).optional(),
  fonts: z.array(z.string()).max(5).optional(),
  logo_url: z.string().url().optional(),
  guidelines: z.string().max(2000).optional(),
  industry: z.string().max(50).optional(),
  brand_voice: z.enum(['professional', 'casual', 'friendly', 'authoritative', 'playful', 'luxurious']).optional(),
  target_audience: z.string().max(200).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type BrandKit = z.infer<typeof BrandKitSchema>;

// ============================================================================
// BRAND ASSET SCHEMAS
// ============================================================================

export const BrandAssetTypeSchema = z.enum([
  'logo',
  'product_photo',
  'lifestyle_image',
  'icon',
  'banner',
  'pattern',
  'texture'
]);

export const BrandAssetSchema = z.object({
  id: z.string().uuid().optional(),
  brand_kit_id: z.string().uuid(),
  asset_type: BrandAssetTypeSchema,
  name: z.string().min(1).max(100),
  description: z.string().max(300).optional(),
  url: z.string().url(),
  file_size: z.number().positive().optional(),
  dimensions: z.object({
    width: z.number().positive(),
    height: z.number().positive()
  }).optional(),
  format: z.enum(['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif']),
  tags: z.array(z.string().max(50)).max(10).optional(),
  is_primary: z.boolean().default(false),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type BrandAsset = z.infer<typeof BrandAssetSchema>;
export type BrandAssetType = z.infer<typeof BrandAssetTypeSchema>;

// ============================================================================
// BRAND CONTEXT SCHEMAS
// ============================================================================

export const BrandContextSchema = z.object({
  brand_kit: BrandKitSchema.optional(),
  selected_assets: z.array(BrandAssetSchema).max(10).optional(),
  brand_guidelines: z.string().max(1000).optional(),
  style_preferences: z.object({
    tone: z.string().max(100).optional(),
    style: z.string().max(100).optional(),
    mood: z.string().max(100).optional(),
  }).optional(),
  reference_images: z.array(z.object({
    url: z.string().url(),
    description: z.string().max(200).optional(),
    weight: z.number().min(0).max(1).default(1),
  })).max(5).optional(),
});

export type BrandContext = z.infer<typeof BrandContextSchema>;

// ============================================================================
// BRAND VALIDATION UTILITIES
// ============================================================================

export const CreateBrandKitSchema = BrandKitSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  name: z.string().min(1, 'Brand name is required'),
});

export const UpdateBrandKitSchema = BrandKitSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).partial();

export const BrandAssetUploadSchema = z.object({
  brand_kit_id: z.string().uuid('Invalid brand kit ID'),
  asset_type: BrandAssetTypeSchema,
  name: z.string().min(1, 'Asset name is required'),
  file: z.any(), // File objects can't be validated with Zod
  description: z.string().max(300).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  is_primary: z.boolean().default(false),
});

export type CreateBrandKit = z.infer<typeof CreateBrandKitSchema>;
export type UpdateBrandKit = z.infer<typeof UpdateBrandKitSchema>;
export type BrandAssetUpload = z.infer<typeof BrandAssetUploadSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

export const brandSchemas = {
  BrandKitSchema,
  BrandAssetSchema,
  BrandContextSchema,
  CreateBrandKitSchema,
  UpdateBrandKitSchema,
  BrandAssetUploadSchema,
  BrandAssetTypeSchema,
} as const;