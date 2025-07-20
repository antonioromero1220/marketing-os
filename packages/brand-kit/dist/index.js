/* @growthub/brand-kit - Brand data coordination and asset management utilities */

// src/data.ts
import { z } from "zod";
var BrandKitInsertSchema = z.object({
  user_id: z.string().uuid(),
  brand_name: z.string().min(1, "Brand name is required").max(100, "Brand name too long"),
  colors: z.any().nullable().default(null),
  // JSON type in database
  fonts: z.any().nullable().default(null),
  // JSON type in database
  messaging: z.string().nullable().default(null)
});
var BrandKitDataSchema = BrandKitInsertSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});
var BrandKitUpdateSchema = z.object({
  brand_name: z.string().min(1).max(100).optional(),
  colors: z.any().nullable().optional(),
  fonts: z.any().nullable().optional(),
  messaging: z.string().nullable().optional(),
  updated_at: z.string().datetime().optional()
});
var BrandAssetSchema = z.object({
  id: z.string().uuid(),
  brand_kit_id: z.string().uuid(),
  asset_type: z.enum(["logo", "product_photo", "lifestyle_image", "icon", "banner"]),
  asset_url: z.string().url(),
  storage_path: z.string(),
  metadata: z.any().nullable().default(null),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});
var BrandAssetInsertSchema = z.object({
  brand_kit_id: z.string().uuid(),
  asset_type: z.enum(["logo", "product_photo", "lifestyle_image", "icon", "banner"]),
  asset_url: z.string().url(),
  storage_path: z.string(),
  metadata: z.any().nullable().default(null)
});
var BrandContextSchema = z.object({
  brand_name: z.string(),
  colors: z.array(z.string()).default([]),
  messaging: z.string().nullable().default(null),
  referenceImages: z.array(z.object({
    url: z.string(),
    type: z.string(),
    description: z.string()
  })).default([])
});
var BrandDataToolResultSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  brandKit: z.object({
    id: z.string(),
    brandName: z.string(),
    colors: z.any().optional(),
    fonts: z.any().optional(),
    messaging: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string()
  }).nullable(),
  assets: z.array(z.object({
    id: z.string(),
    assetType: z.string(),
    assetUrl: z.string(),
    metadata: z.any().nullable(),
    createdAt: z.string()
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

// src/assets.ts
import { z as z2 } from "zod";
var FileUploadSchema = z2.object({
  file: z2.instanceof(File),
  assetType: z2.enum(["logo", "product_photo", "lifestyle_image", "icon", "banner"]),
  title: z2.string().optional(),
  description: z2.string().optional()
});
var AssetMetadataSchema = z2.object({
  file_name: z2.string(),
  file_size: z2.number().int().positive(),
  file_type: z2.string(),
  uploaded_at: z2.string().datetime(),
  width: z2.number().int().positive().optional(),
  height: z2.number().int().positive().optional(),
  alt_text: z2.string().optional(),
  title: z2.string().optional(),
  description: z2.string().optional(),
  tags: z2.array(z2.string()).default([])
});
var UploadResultSchema = z2.object({
  success: z2.boolean(),
  assetUrl: z2.string().url().optional(),
  storagePath: z2.string().optional(),
  assetId: z2.string().uuid().optional(),
  error: z2.object({
    message: z2.string(),
    code: z2.string(),
    details: z2.any().optional()
  }).optional()
});
var BrandAssetManager = class {
  constructor(storageClient, config) {
    this.storageClient = storageClient;
    this.config = {
      bucket: "node_documents",
      pathPrefix: "public",
      allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
      maxFileSize: 10 * 1024 * 1024,
      // 10MB
      cacheControl: "3600",
      ...config
    };
  }
  /**
   * Validate file before upload
   */
  validateFile(file) {
    const errors = [];
    if (!this.config.allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type. Allowed types: ${this.config.allowedTypes.join(", ")}`);
    }
    if (file.size > this.config.maxFileSize) {
      errors.push(`File too large. Maximum size: ${this.config.maxFileSize / (1024 * 1024)}MB`);
    }
    if (!file.name || file.name.trim().length === 0) {
      errors.push("File name is required");
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }
  /**
   * Generate storage path for asset
   */
  generateStoragePath(userId, brandKitId, assetType, fileName) {
    const timestamp = Date.now();
    const sanitizedFileName = this.sanitizeFileName(fileName);
    return `${this.config.pathPrefix}/${userId}/brand_assets/${brandKitId}/${assetType}/${timestamp}_${sanitizedFileName}`;
  }
  /**
   * Sanitize file name for safe storage
   */
  sanitizeFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/_+/g, "_").substring(0, 100);
  }
  /**
   * Upload file to storage
   */
  async uploadFile(userId, brandKitId, uploadData) {
    try {
      const validation = this.validateFile(uploadData.file);
      if (!validation.valid) {
        return {
          success: false,
          error: {
            message: validation.errors.join(", "),
            code: "VALIDATION_ERROR",
            details: validation.errors
          }
        };
      }
      const storagePath = this.generateStoragePath(
        userId,
        brandKitId,
        uploadData.assetType,
        uploadData.file.name
      );
      const { error: uploadError } = await this.storageClient.upload(
        storagePath,
        uploadData.file,
        {
          cacheControl: this.config.cacheControl,
          upsert: false
        }
      );
      if (uploadError) {
        return {
          success: false,
          error: {
            message: `File upload failed: ${uploadError.message}`,
            code: "UPLOAD_ERROR",
            details: uploadError
          }
        };
      }
      const { data: { publicUrl } } = this.storageClient.getPublicUrl(storagePath);
      return {
        success: true,
        assetUrl: publicUrl,
        storagePath
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Unknown upload error",
          code: "UPLOAD_ERROR",
          details: error
        }
      };
    }
  }
  /**
   * Delete asset from storage
   */
  async deleteAsset(storagePath) {
    try {
      const { error } = await this.storageClient.remove([storagePath]);
      if (error) {
        return {
          success: false,
          error: `Failed to delete asset: ${error.message}`
        };
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown deletion error"
      };
    }
  }
  /**
   * Create asset metadata from file
   */
  createAssetMetadata(file, additionalData) {
    return {
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      uploaded_at: (/* @__PURE__ */ new Date()).toISOString(),
      tags: [],
      ...additionalData
    };
  }
  /**
   * Get image dimensions (client-side)
   */
  async getImageDimensions(file) {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        resolve(null);
        return;
      }
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  }
  /**
   * Process file before upload (resize, optimize, etc.)
   */
  async processFile(file, options) {
    return file;
  }
};
var AssetServingManager = class {
  constructor(baseUrl, secureProxyPath = "/api/secure-image") {
    this.baseUrl = baseUrl;
    this.secureProxyPath = secureProxyPath;
  }
  /**
   * Generate secure asset URL through proxy
   */
  generateSecureUrl(assetUrl, options) {
    const url = new URL(this.secureProxyPath, this.baseUrl);
    url.searchParams.set("url", assetUrl);
    if (options) {
      if (options.width) url.searchParams.set("w", options.width.toString());
      if (options.height) url.searchParams.set("h", options.height.toString());
      if (options.quality) url.searchParams.set("q", options.quality.toString());
      if (options.format) url.searchParams.set("f", options.format);
    }
    return url.toString();
  }
  /**
   * Generate responsive image set
   */
  generateResponsiveImageSet(assetUrl) {
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    const srcSet = sizes.map((size) => `${this.generateSecureUrl(assetUrl, { width: size })} ${size}w`).join(", ");
    return {
      src: this.generateSecureUrl(assetUrl, { width: 1024 }),
      srcSet,
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    };
  }
  /**
   * Get optimized thumbnail URL
   */
  getThumbnailUrl(assetUrl, size = "medium") {
    const dimensions = {
      small: { width: 150, height: 150 },
      medium: { width: 300, height: 300 },
      large: { width: 600, height: 600 }
    };
    return this.generateSecureUrl(assetUrl, {
      ...dimensions[size],
      quality: 80,
      format: "webp"
    });
  }
};
var AssetCategoryUtils = {
  /**
   * Get asset type display name
   */
  getDisplayName: (assetType) => {
    const displayNames = {
      logo: "Logo",
      product_photo: "Product Photo",
      lifestyle_image: "Lifestyle Image",
      icon: "Icon",
      banner: "Banner"
    };
    return displayNames[assetType];
  },
  /**
   * Get asset type description
   */
  getDescription: (assetType) => {
    const descriptions = {
      logo: "Brand logos and logotypes",
      product_photo: "Product photography and shots",
      lifestyle_image: "Lifestyle and brand imagery",
      icon: "Icons and small graphics",
      banner: "Marketing banners and headers"
    };
    return descriptions[assetType];
  },
  /**
   * Get recommended dimensions for asset type
   */
  getRecommendedDimensions: (assetType) => {
    const dimensions = {
      logo: { width: 512, height: 512, aspectRatio: "1:1" },
      product_photo: { width: 1200, height: 1200, aspectRatio: "1:1" },
      lifestyle_image: { width: 1920, height: 1080, aspectRatio: "16:9" },
      icon: { width: 256, height: 256, aspectRatio: "1:1" },
      banner: { width: 1920, height: 600, aspectRatio: "16:5" }
    };
    return dimensions[assetType];
  },
  /**
   * Get asset priorities for different use cases
   */
  getAssetPriority: (assetType) => {
    const priorities = {
      logo: 1,
      product_photo: 2,
      lifestyle_image: 3,
      icon: 4,
      banner: 5
    };
    return priorities[assetType];
  }
};
var FileValidationUtils = {
  /**
   * Check if file is an image
   */
  isImage: (file) => {
    return file.type.startsWith("image/");
  },
  /**
   * Get file size in human readable format
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },
  /**
   * Validate file extension
   */
  validateExtension: (fileName, allowedExtensions) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension ? allowedExtensions.includes(extension) : false;
  },
  /**
   * Generate unique filename
   */
  generateUniqueFileName: (originalName) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split(".").pop();
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    return `${baseName}_${timestamp}_${random}.${extension}`;
  }
};

// src/validation.ts
import { z as z3 } from "zod";
var ColorValidationSchema = z3.object({
  primary: z3.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format"),
  secondary: z3.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format").optional(),
  accent: z3.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format").optional(),
  neutral: z3.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format").optional()
});
var FontValidationSchema = z3.object({
  heading: z3.string().min(1, "Heading font is required").optional(),
  body: z3.string().min(1, "Body font is required").optional(),
  accent: z3.string().min(1, "Accent font name is required").optional()
});
var BrandKitValidator = class {
  /**
   * Validate complete brand kit
   */
  validateBrandKit(brandKit, assets = []) {
    const errors = [];
    const warnings = [];
    const recommendations = [];
    let score = 0;
    const completeness = {
      name: false,
      colors: false,
      fonts: false,
      messaging: false,
      assets: false
    };
    const nameResult = this.validateBrandName(brandKit.brand_name);
    if (nameResult.valid) {
      score += 20;
      completeness.name = true;
    } else {
      errors.push(...nameResult.errors);
    }
    warnings.push(...nameResult.warnings);
    recommendations.push(...nameResult.recommendations);
    const colorsResult = this.validateBrandColors(brandKit.colors);
    if (colorsResult.valid) {
      score += 25;
      completeness.colors = true;
    } else {
      errors.push(...colorsResult.errors);
    }
    warnings.push(...colorsResult.warnings);
    recommendations.push(...colorsResult.recommendations);
    const fontsResult = this.validateBrandFonts(brandKit.fonts);
    if (fontsResult.valid) {
      score += 15;
      completeness.fonts = true;
    } else {
      errors.push(...fontsResult.errors);
    }
    warnings.push(...fontsResult.warnings);
    recommendations.push(...fontsResult.recommendations);
    const messagingResult = this.validateBrandMessaging(brandKit.messaging);
    if (messagingResult.valid) {
      score += 20;
      completeness.messaging = true;
    } else {
      errors.push(...messagingResult.errors);
    }
    warnings.push(...messagingResult.warnings);
    recommendations.push(...messagingResult.recommendations);
    const assetsResult = this.validateBrandAssets(assets);
    if (assetsResult.valid) {
      score += 20;
      completeness.assets = true;
    } else {
      errors.push(...assetsResult.errors);
    }
    warnings.push(...assetsResult.warnings);
    recommendations.push(...assetsResult.recommendations);
    const strength = this.calculateBrandStrength(score);
    return {
      valid: errors.length === 0,
      score,
      strength,
      errors,
      warnings,
      recommendations,
      completeness
    };
  }
  /**
   * Validate brand name
   */
  validateBrandName(brandName) {
    const errors = [];
    const warnings = [];
    const recommendations = [];
    if (!brandName || brandName.trim().length === 0) {
      errors.push({
        field: "brand_name",
        message: "Brand name is required",
        code: "BRAND_NAME_REQUIRED",
        severity: "error"
      });
      return { valid: false, errors, warnings, recommendations };
    }
    if (brandName.length < 2) {
      errors.push({
        field: "brand_name",
        message: "Brand name must be at least 2 characters",
        code: "BRAND_NAME_TOO_SHORT",
        severity: "error"
      });
    }
    if (brandName.length > 50) {
      warnings.push({
        field: "brand_name",
        message: "Brand name is very long",
        suggestion: "Consider a shorter, more memorable name"
      });
    }
    if (/^\s|\s$/.test(brandName)) {
      warnings.push({
        field: "brand_name",
        message: "Brand name has leading or trailing spaces",
        suggestion: "Remove extra whitespace"
      });
    }
    if (brandName.toLowerCase() === brandName) {
      recommendations.push("Consider proper capitalization for your brand name");
    }
    if (brandName.includes("test") || brandName.includes("demo") || brandName.includes("sample")) {
      recommendations.push("Replace placeholder text with your actual brand name");
    }
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations
    };
  }
  /**
   * Validate brand colors
   */
  validateBrandColors(colors) {
    const errors = [];
    const warnings = [];
    const recommendations = [];
    if (!colors || Object.keys(colors).length === 0) {
      errors.push({
        field: "colors",
        message: "At least one brand color is required",
        code: "COLORS_REQUIRED",
        severity: "error"
      });
      recommendations.push("Add a primary color to establish your brand identity");
      return { valid: false, errors, warnings, recommendations };
    }
    if (!colors.primary) {
      errors.push({
        field: "colors.primary",
        message: "Primary color is required",
        code: "PRIMARY_COLOR_REQUIRED",
        severity: "error"
      });
    } else if (!this.isValidHexColor(colors.primary)) {
      errors.push({
        field: "colors.primary",
        message: "Primary color must be a valid hex color",
        code: "INVALID_COLOR_FORMAT",
        severity: "error"
      });
    }
    Object.entries(colors).forEach(([key, value]) => {
      if (value && !this.isValidHexColor(value)) {
        errors.push({
          field: `colors.${key}`,
          message: `${key} color must be a valid hex color`,
          code: "INVALID_COLOR_FORMAT",
          severity: "error"
        });
      }
    });
    const colorValues = Object.values(colors).filter(Boolean);
    if (colorValues.length === 1) {
      recommendations.push("Add secondary colors to create a more complete brand palette");
    }
    if (colors.primary && colors.secondary) {
      const contrast = this.calculateColorContrast(colors.primary, colors.secondary);
      if (contrast < 2) {
        warnings.push({
          field: "colors",
          message: "Primary and secondary colors may have low contrast",
          suggestion: "Consider adjusting colors for better contrast"
        });
      }
    }
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations
    };
  }
  /**
   * Validate brand fonts
   */
  validateBrandFonts(fonts) {
    const errors = [];
    const warnings = [];
    const recommendations = [];
    if (!fonts || Object.keys(fonts).length === 0) {
      recommendations.push("Add font selections to strengthen your brand identity");
      return { valid: true, errors, warnings, recommendations };
    }
    Object.entries(fonts).forEach(([key, value]) => {
      if (!value || value.trim().length === 0) {
        warnings.push({
          field: `fonts.${key}`,
          message: `${key} font is empty`,
          suggestion: `Select a ${key} font or remove this entry`
        });
      }
    });
    if (!fonts.heading || !fonts.body) {
      recommendations.push("Consider defining both heading and body fonts");
    }
    const fontValues = Object.values(fonts).filter(Boolean);
    if (new Set(fontValues).size === 1 && fontValues.length > 1) {
      recommendations.push("Using different fonts for headings and body can improve visual hierarchy");
    }
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations
    };
  }
  /**
   * Validate brand messaging
   */
  validateBrandMessaging(messaging) {
    const errors = [];
    const warnings = [];
    const recommendations = [];
    if (!messaging || messaging.trim().length === 0) {
      recommendations.push("Add brand messaging to communicate your value proposition");
      return { valid: true, errors, warnings, recommendations };
    }
    if (messaging.length < 10) {
      warnings.push({
        field: "messaging",
        message: "Brand messaging is very short",
        suggestion: "Expand your messaging to better communicate your brand values"
      });
    }
    if (messaging.length > 500) {
      warnings.push({
        field: "messaging",
        message: "Brand messaging is very long",
        suggestion: "Consider condensing to key points for better impact"
      });
    }
    if (messaging.toLowerCase().includes("lorem ipsum") || messaging.includes("placeholder")) {
      recommendations.push("Replace placeholder text with your actual brand messaging");
    }
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations
    };
  }
  /**
   * Validate brand assets
   */
  validateBrandAssets(assets) {
    const errors = [];
    const warnings = [];
    const recommendations = [];
    if (!assets || assets.length === 0) {
      recommendations.push("Upload brand assets like logos and product images");
      return { valid: true, errors, warnings, recommendations };
    }
    const logoAssets = assets.filter((asset) => asset.asset_type === "logo");
    if (logoAssets.length === 0) {
      recommendations.push("Upload a logo to strengthen your brand presence");
    }
    const assetTypes = new Set(assets.map((asset) => asset.asset_type));
    if (assetTypes.size === 1 && assets.length > 1) {
      recommendations.push("Consider diversifying your asset types for more versatile branding");
    }
    assets.forEach((asset, index) => {
      if (!asset.asset_url || !this.isValidUrl(asset.asset_url)) {
        errors.push({
          field: `assets[${index}].asset_url`,
          message: "Invalid asset URL",
          code: "INVALID_ASSET_URL",
          severity: "error"
        });
      }
    });
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations
    };
  }
  /**
   * Validate brand context for agent integration
   */
  validateBrandContext(context) {
    const errors = [];
    const warnings = [];
    const recommendations = [];
    let score = 0;
    const completeness = {
      name: false,
      colors: false,
      fonts: false,
      messaging: false,
      assets: false
    };
    if (context.brand_name && context.brand_name !== "Your Brand") {
      score += 30;
      completeness.name = true;
    } else {
      recommendations.push("Set a specific brand name");
    }
    if (context.colors && context.colors.length > 0) {
      score += 25;
      completeness.colors = true;
    } else {
      recommendations.push("Define brand colors");
    }
    if (context.messaging && context.messaging.length > 10) {
      score += 25;
      completeness.messaging = true;
    } else {
      recommendations.push("Add brand messaging");
    }
    if (context.referenceImages && context.referenceImages.length > 0) {
      score += 20;
      completeness.assets = true;
    } else {
      recommendations.push("Upload reference images");
    }
    const strength = this.calculateBrandStrength(score);
    return {
      valid: errors.length === 0,
      score,
      strength,
      errors,
      warnings,
      recommendations,
      completeness
    };
  }
  /**
   * Helper: Validate hex color format
   */
  isValidHexColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }
  /**
   * Helper: Validate URL format
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Helper: Calculate color contrast ratio
   */
  calculateColorContrast(color1, color2) {
    const luminance1 = this.getColorLuminance(color1);
    const luminance2 = this.getColorLuminance(color2);
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  /**
   * Helper: Get relative luminance of color
   */
  getColorLuminance(hexColor) {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  /**
   * Helper: Calculate brand strength from score
   */
  calculateBrandStrength(score) {
    if (score >= 85) return "excellent";
    if (score >= 65) return "strong";
    if (score >= 40) return "moderate";
    return "weak";
  }
};
var BrandQualityAnalyzer = class {
  /**
   * Analyze brand completeness
   */
  analyzeCompleteness(brandKit, assets) {
    const missingElements = [];
    const recommendations = [];
    let score = 0;
    const maxScore = 100;
    if (brandKit.brand_name && brandKit.brand_name.length > 2) {
      score += 20;
    } else {
      missingElements.push("Brand Name");
      recommendations.push("Set a distinctive brand name");
    }
    if (brandKit.colors && Object.keys(brandKit.colors).length >= 2) {
      score += 25;
    } else {
      missingElements.push("Brand Colors");
      recommendations.push("Define a primary and secondary color");
    }
    if (brandKit.fonts && Object.keys(brandKit.fonts).length >= 1) {
      score += 15;
    } else {
      missingElements.push("Brand Fonts");
      recommendations.push("Choose fonts for your brand typography");
    }
    if (brandKit.messaging && brandKit.messaging.length > 20) {
      score += 20;
    } else {
      missingElements.push("Brand Messaging");
      recommendations.push("Write a compelling brand message");
    }
    if (assets.length > 0) {
      score += 15;
      if (assets.some((a) => a.asset_type === "logo")) {
        score += 5;
      }
    } else {
      missingElements.push("Brand Assets");
      recommendations.push("Upload brand assets like logos and images");
    }
    return {
      score: Math.round(score / maxScore * 100),
      missingElements,
      recommendations
    };
  }
  /**
   * Analyze brand consistency
   */
  analyzeConsistency(brandKit) {
    const issues = [];
    const suggestions = [];
    let score = 100;
    if (brandKit.colors && Object.keys(brandKit.colors).length > 1) {
      const colors = Object.values(brandKit.colors).filter(Boolean);
      if (colors.length > 4) {
        issues.push("Too many colors may reduce brand focus");
        suggestions.push("Consider limiting to 3-4 core brand colors");
        score -= 10;
      }
    }
    if (brandKit.brand_name) {
      if (brandKit.brand_name.includes("  ")) {
        issues.push("Brand name has inconsistent spacing");
        suggestions.push("Clean up spacing in brand name");
        score -= 5;
      }
    }
    return {
      score: Math.max(0, score),
      issues,
      suggestions
    };
  }
};
var ValidationUtils = {
  /**
   * Create validation summary
   */
  createValidationSummary(result) {
    const parts = [];
    parts.push(`Brand Strength: ${result.strength.toUpperCase()} (${result.score}/100)`);
    if (result.errors.length > 0) {
      parts.push(`Errors: ${result.errors.length}`);
    }
    if (result.warnings.length > 0) {
      parts.push(`Warnings: ${result.warnings.length}`);
    }
    if (result.recommendations.length > 0) {
      parts.push(`Recommendations: ${result.recommendations.length}`);
    }
    return parts.join(" | ");
  },
  /**
   * Get next action recommendation
   */
  getNextActionRecommendation(result) {
    if (result.errors.length > 0) {
      return `Fix ${result.errors.length} error${result.errors.length > 1 ? "s" : ""} to improve your brand`;
    }
    if (!result.completeness.name) {
      return "Set your brand name to get started";
    }
    if (!result.completeness.colors) {
      return "Add brand colors to establish visual identity";
    }
    if (!result.completeness.assets) {
      return "Upload a logo to complete your brand kit";
    }
    if (!result.completeness.messaging) {
      return "Add brand messaging to communicate your value";
    }
    return "Your brand kit is looking great! Consider fine-tuning details";
  },
  /**
   * Filter validation results by severity
   */
  filterBySeverity(errors, severity) {
    return errors.filter((error) => error.severity === severity);
  }
};

// src/index.ts
var PACKAGE_INFO = {
  name: "@growthub/brand-kit",
  version: "1.0.0",
  description: "Brand data coordination and asset management utilities for Growthub Marketing OS",
  patterns: [
    "Brand Data Management",
    "Asset Storage Coordination",
    "Brand Validation & Quality Assessment",
    "User Isolation & Security",
    "File Upload & Processing"
  ],
  compliance: "AT-03 PROD STABLE"
};
export {
  AssetCategoryUtils,
  AssetMetadataSchema,
  AssetServingManager,
  BrandAssetInsertSchema,
  BrandAssetManager,
  BrandAssetSchema,
  BrandContextSchema,
  BrandDataManager,
  BrandDataToolResultSchema,
  BrandDataUtils,
  BrandKitDataSchema,
  BrandKitInsertSchema,
  BrandKitUpdateSchema,
  BrandKitValidator,
  BrandQualityAnalyzer,
  ColorValidationSchema,
  DEFAULT_BRAND_KIT_DATA,
  FileUploadSchema,
  FileValidationUtils,
  FontValidationSchema,
  PACKAGE_INFO,
  UploadResultSchema,
  ValidationUtils
};
//# sourceMappingURL=index.js.map