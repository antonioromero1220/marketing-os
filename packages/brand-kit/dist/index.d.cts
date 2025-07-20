export { BrandAsset, BrandAssetInsert, BrandAssetInsertSchema, BrandAssetSchema, BrandContext, BrandContextSchema, BrandDataManager, BrandDataToolResult, BrandDataToolResultSchema, BrandDataUtils, BrandDatabaseClient, BrandKitData, BrandKitDataSchema, BrandKitInsert, BrandKitInsertSchema, BrandKitUpdate, BrandKitUpdateSchema, DEFAULT_BRAND_KIT_DATA } from './data.cjs';
export { AssetCategoryUtils, AssetMetadata, AssetMetadataSchema, AssetServingManager, AssetStorageConfig, BrandAssetManager, BrandAssetType, FileUploadData, FileUploadSchema, FileValidationUtils, StorageClient, UploadResult, UploadResultSchema } from './assets.cjs';
export { BrandKitValidator, BrandQualityAnalyzer, BrandValidationResult, ColorValidationSchema, FontValidationSchema, ValidationError, ValidationUtils, ValidationWarning } from './validation.cjs';
import 'zod';

/**
 * @growthub/brand-kit
 * Brand data coordination and asset management utilities for Growthub Marketing OS
 *
 * This package provides professional brand management patterns extracted from
 * the AT-03 production system, including data coordination, asset management,
 * and validation utilities.
 */

declare const PACKAGE_INFO: {
    readonly name: "@growthub/brand-kit";
    readonly version: "1.0.0";
    readonly description: "Brand data coordination and asset management utilities for Growthub Marketing OS";
    readonly patterns: readonly ["Brand Data Management", "Asset Storage Coordination", "Brand Validation & Quality Assessment", "User Isolation & Security", "File Upload & Processing"];
    readonly compliance: "AT-03 PROD STABLE";
};

export { PACKAGE_INFO };
