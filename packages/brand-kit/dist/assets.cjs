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

// src/assets.ts
var assets_exports = {};
__export(assets_exports, {
  AssetCategoryUtils: () => AssetCategoryUtils,
  AssetMetadataSchema: () => AssetMetadataSchema,
  AssetServingManager: () => AssetServingManager,
  BrandAssetManager: () => BrandAssetManager,
  FileUploadSchema: () => FileUploadSchema,
  FileValidationUtils: () => FileValidationUtils,
  UploadResultSchema: () => UploadResultSchema
});
module.exports = __toCommonJS(assets_exports);
var import_zod = require("zod");
var FileUploadSchema = import_zod.z.object({
  file: import_zod.z.instanceof(File),
  assetType: import_zod.z.enum(["logo", "product_photo", "lifestyle_image", "icon", "banner"]),
  title: import_zod.z.string().optional(),
  description: import_zod.z.string().optional()
});
var AssetMetadataSchema = import_zod.z.object({
  file_name: import_zod.z.string(),
  file_size: import_zod.z.number().int().positive(),
  file_type: import_zod.z.string(),
  uploaded_at: import_zod.z.string().datetime(),
  width: import_zod.z.number().int().positive().optional(),
  height: import_zod.z.number().int().positive().optional(),
  alt_text: import_zod.z.string().optional(),
  title: import_zod.z.string().optional(),
  description: import_zod.z.string().optional(),
  tags: import_zod.z.array(import_zod.z.string()).default([])
});
var UploadResultSchema = import_zod.z.object({
  success: import_zod.z.boolean(),
  assetUrl: import_zod.z.string().url().optional(),
  storagePath: import_zod.z.string().optional(),
  assetId: import_zod.z.string().uuid().optional(),
  error: import_zod.z.object({
    message: import_zod.z.string(),
    code: import_zod.z.string(),
    details: import_zod.z.any().optional()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AssetCategoryUtils,
  AssetMetadataSchema,
  AssetServingManager,
  BrandAssetManager,
  FileUploadSchema,
  FileValidationUtils,
  UploadResultSchema
});
//# sourceMappingURL=assets.cjs.map