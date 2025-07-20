/* @growthub/brand-kit - Brand data coordination and asset management utilities */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/data.ts
var data_exports = {};
__export(data_exports, {
  BrandAssetInsertSchema: () => BrandAssetInsertSchema,
  BrandAssetSchema: () => BrandAssetSchema,
  BrandContextSchema: () => BrandContextSchema,
  BrandDataManager: () => BrandDataManager,
  BrandDataToolResultSchema: () => BrandDataToolResultSchema,
  BrandDataUtils: () => BrandDataUtils,
  BrandKitDataSchema: () => BrandKitDataSchema,
  BrandKitInsertSchema: () => BrandKitInsertSchema,
  BrandKitUpdateSchema: () => BrandKitUpdateSchema,
  DEFAULT_BRAND_KIT_DATA: () => DEFAULT_BRAND_KIT_DATA
});
module.exports = __toCommonJS(data_exports);
var import_zod = require("zod");
var BrandKitInsertSchema = import_zod.z.object({
  user_id: import_zod.z.string().uuid(),
  brand_name: import_zod.z.string().min(1, "Brand name is required").max(100, "Brand name too long"),
  colors: import_zod.z.any().nullable().default(null),
  // JSON type in database
  fonts: import_zod.z.any().nullable().default(null),
  // JSON type in database
  messaging: import_zod.z.string().nullable().default(null)
});
var BrandKitDataSchema = BrandKitInsertSchema.extend({
  id: import_zod.z.string().uuid(),
  created_at: import_zod.z.string().datetime(),
  updated_at: import_zod.z.string().datetime()
});
var BrandKitUpdateSchema = import_zod.z.object({
  brand_name: import_zod.z.string().min(1).max(100).optional(),
  colors: import_zod.z.any().nullable().optional(),
  fonts: import_zod.z.any().nullable().optional(),
  messaging: import_zod.z.string().nullable().optional(),
  updated_at: import_zod.z.string().datetime().optional()
});
var BrandAssetSchema = import_zod.z.object({
  id: import_zod.z.string().uuid(),
  brand_kit_id: import_zod.z.string().uuid(),
  asset_type: import_zod.z.enum(["logo", "product_photo", "lifestyle_image", "icon", "banner"]),
  asset_url: import_zod.z.string().url(),
  storage_path: import_zod.z.string(),
  metadata: import_zod.z.any().nullable().default(null),
  created_at: import_zod.z.string().datetime(),
  updated_at: import_zod.z.string().datetime()
});
var BrandAssetInsertSchema = import_zod.z.object({
  brand_kit_id: import_zod.z.string().uuid(),
  asset_type: import_zod.z.enum(["logo", "product_photo", "lifestyle_image", "icon", "banner"]),
  asset_url: import_zod.z.string().url(),
  storage_path: import_zod.z.string(),
  metadata: import_zod.z.any().nullable().default(null)
});
var BrandContextSchema = import_zod.z.object({
  brand_name: import_zod.z.string(),
  colors: import_zod.z.array(import_zod.z.string()).default([]),
  messaging: import_zod.z.string().nullable().default(null),
  referenceImages: import_zod.z.array(import_zod.z.object({
    url: import_zod.z.string(),
    type: import_zod.z.string(),
    description: import_zod.z.string()
  })).default([])
});
var BrandDataToolResultSchema = import_zod.z.object({
  success: import_zod.z.boolean(),
  message: import_zod.z.string().optional(),
  brandKit: import_zod.z.object({
    id: import_zod.z.string(),
    brandName: import_zod.z.string(),
    colors: import_zod.z.any().optional(),
    fonts: import_zod.z.any().optional(),
    messaging: import_zod.z.string().nullable().optional(),
    createdAt: import_zod.z.string(),
    updatedAt: import_zod.z.string()
  }).nullable(),
  assets: import_zod.z.array(import_zod.z.object({
    id: import_zod.z.string(),
    assetType: import_zod.z.string(),
    assetUrl: import_zod.z.string(),
    metadata: import_zod.z.any().nullable(),
    createdAt: import_zod.z.string()
  })).default([])
});
var BrandDataManager = class {
  constructor(databaseClient) {
    this.client = databaseClient;
  }
  /**
   * Get all brand kits for a user with ownership validation
   */
  async getBrandKits(userId) {
    try {
      const query = this.client.from("brand_kits").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      const result = await query;
      if (result?.error) {
        throw new Error(`Failed to fetch brand kits: ${result.error.message}`);
      }
      return (result?.data || []).map((item) => BrandKitDataSchema.parse(item));
    } catch (error) {
      console.error("[getBrandKits] Error:", error);
      throw error;
    }
  }
  /**
   * Get a specific brand kit by ID with ownership validation
   */
  async getBrandKitById(userId, brandKitId) {
    try {
      const { data, error } = await this.client.from("brand_kits").select("*").eq("id", brandKitId).eq("user_id", userId).single();
      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }
        throw new Error(`Failed to fetch brand kit: ${error.message}`);
      }
      return BrandKitDataSchema.parse(data);
    } catch (error) {
      console.error("[getBrandKitById] Error:", error);
      throw error;
    }
  }
  /**
   * Create a new brand kit with user assignment
   */
  async createBrandKit(userId, brandData) {
    try {
      const insertData = BrandKitInsertSchema.parse({
        ...brandData,
        user_id: userId
      });
      const { data, error } = await this.client.from("brand_kits").insert({
        ...insertData,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).select().single();
      if (error) {
        throw new Error(`Failed to create brand kit: ${error.message}`);
      }
      return BrandKitDataSchema.parse(data);
    } catch (error) {
      console.error("[createBrandKit] Error:", error);
      throw error;
    }
  }
  /**
   * Update an existing brand kit with ownership validation
   */
  async updateBrandKit(userId, brandKitId, updates) {
    try {
      const updateData = BrandKitUpdateSchema.parse({
        ...updates,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      const { data, error } = await this.client.from("brand_kits").update(updateData).eq("id", brandKitId).eq("user_id", userId).select().single();
      if (error) {
        throw new Error(`Failed to update brand kit: ${error.message}`);
      }
      return BrandKitDataSchema.parse(data);
    } catch (error) {
      console.error("[updateBrandKit] Error:", error);
      throw error;
    }
  }
  /**
   * Delete a brand kit with ownership validation
   */
  async deleteBrandKit(userId, brandKitId) {
    try {
      const deleteQuery = this.client.from("brand_kits").delete().eq("id", brandKitId).eq("user_id", userId);
      const result = await deleteQuery;
      if (result?.error) {
        throw new Error(`Failed to delete brand kit: ${result.error.message}`);
      }
      return true;
    } catch (error) {
      console.error("[deleteBrandKit] Error:", error);
      throw error;
    }
  }
  /**
   * Get brand assets for a specific brand kit with ownership validation
   */
  async getBrandAssets(userId, brandKitId, assetTypes) {
    try {
      const brandKit = await this.getBrandKitById(userId, brandKitId);
      if (!brandKit) {
        throw new Error("Brand kit not found or access denied");
      }
      const query = this.client.from("brand_assets").select("*").eq("brand_kit_id", brandKitId);
      const result = await query;
      if (result?.error) {
        throw new Error(`Failed to fetch brand assets: ${result.error.message}`);
      }
      let assets = (result?.data || []).map((item) => BrandAssetSchema.parse(item));
      if (assetTypes && assetTypes.length > 0) {
        assets = assets.filter((asset) => assetTypes.includes(asset.asset_type));
      }
      return assets;
    } catch (error) {
      console.error("[getBrandAssets] Error:", error);
      throw error;
    }
  }
  /**
   * Create a brand asset with ownership validation
   */
  async createBrandAsset(userId, assetData) {
    try {
      const brandKit = await this.getBrandKitById(userId, assetData.brand_kit_id);
      if (!brandKit) {
        throw new Error("Brand kit not found or access denied");
      }
      const insertData = BrandAssetInsertSchema.parse(assetData);
      const { data, error } = await this.client.from("brand_assets").insert({
        ...insertData,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).select().single();
      if (error) {
        throw new Error(`Failed to create brand asset: ${error.message}`);
      }
      return BrandAssetSchema.parse(data);
    } catch (error) {
      console.error("[createBrandAsset] Error:", error);
      throw error;
    }
  }
  /**
   * Transform brand kit data to brand context for agent integration
   */
  transformToBrandContext(brandKit, assets = []) {
    if (!brandKit) {
      return {
        brand_name: "Your Brand",
        colors: [],
        messaging: null,
        referenceImages: []
      };
    }
    return {
      brand_name: brandKit.brand_name,
      colors: brandKit.colors ? Object.values(brandKit.colors).filter(Boolean) : [],
      messaging: brandKit.messaging,
      referenceImages: assets.map((asset) => ({
        url: asset.asset_url,
        type: asset.asset_type,
        description: asset.metadata?.description || asset.asset_type
      }))
    };
  }
  /**
   * Transform brand data to tool result format
   */
  transformToBrandDataToolResult(brandKit, assets = []) {
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
      assets: assets.map((asset) => ({
        id: asset.id,
        assetType: asset.asset_type,
        assetUrl: asset.asset_url,
        metadata: asset.metadata,
        createdAt: asset.created_at
      }))
    };
  }
};
var DEFAULT_BRAND_KIT_DATA = {
  brand_name: "My New Brand",
  colors: {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    accent: "#06B6D4",
    neutral: "#6B7280"
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
    accent: "Roboto"
  },
  messaging: null
};
var BrandDataUtils = {
  /**
   * Validate brand kit ownership
   */
  validateOwnership: (brandKit, userId) => {
    return brandKit.user_id === userId;
  },
  /**
   * Generate storage path for brand assets
   */
  generateAssetStoragePath: (userId, brandKitId, assetType, fileName) => {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/_+/g, "_").substring(0, 100);
    return `public/${userId}/brand_assets/${brandKitId}/${assetType}/${timestamp}_${sanitizedFileName}`;
  },
  /**
   * Extract brand colors as array
   */
  extractBrandColors: (brandKit) => {
    if (!brandKit || !brandKit.colors) return [];
    return Object.values(brandKit.colors).filter(Boolean);
  },
  /**
   * Check if brand kit is complete
   */
  isBrandKitComplete: (brandKit) => {
    return !!(brandKit.brand_name && brandKit.colors && Object.keys(brandKit.colors).length > 0);
  },
  /**
   * Calculate brand strength score
   */
  calculateBrandStrength: (brandKit, assets) => {
    let score = 0;
    if (brandKit.brand_name && brandKit.brand_name.length > 3) score += 20;
    if (brandKit.colors && Object.keys(brandKit.colors).length >= 2) score += 25;
    if (brandKit.colors && Object.keys(brandKit.colors).length >= 4) score += 10;
    if (brandKit.fonts && Object.keys(brandKit.fonts).length >= 1) score += 15;
    if (brandKit.messaging && brandKit.messaging.length > 20) score += 15;
    const logoAssets = assets.filter((a) => a.asset_type === "logo");
    if (logoAssets.length > 0) score += 15;
    if (assets.length > 2) score += 10;
    if (score >= 85) return "excellent";
    if (score >= 65) return "strong";
    if (score >= 40) return "moderate";
    return "weak";
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BrandAssetInsertSchema,
  BrandAssetSchema,
  BrandContextSchema,
  BrandDataManager,
  BrandDataToolResultSchema,
  BrandDataUtils,
  BrandKitDataSchema,
  BrandKitInsertSchema,
  BrandKitUpdateSchema,
  DEFAULT_BRAND_KIT_DATA
});
//# sourceMappingURL=data.cjs.map