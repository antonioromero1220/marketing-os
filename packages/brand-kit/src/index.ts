/**
 * @growthub/brand-kit
 * Brand data coordination and asset management utilities for Growthub Marketing OS
 * 
 * This package provides professional brand management patterns extracted from
 * the AT-03 production system, including data coordination, asset management,
 * and validation utilities.
 */

// Re-export all data utilities
export * from './data'
export type {
  BrandKitData,
  BrandKitInsert,
  BrandKitUpdate,
  BrandAsset,
  BrandAssetInsert,
  BrandContext,
  BrandDataToolResult,
  BrandDatabaseClient
} from './data'

// Re-export all asset utilities  
export * from './assets'
export type {
  BrandAssetType,
  FileUploadData,
  AssetMetadata,
  UploadResult,
  StorageClient,
  AssetStorageConfig
} from './assets'

// Re-export all validation utilities
export * from './validation'
export type {
  BrandValidationResult,
  ValidationError,
  ValidationWarning
} from './validation'

// Package metadata
export const PACKAGE_INFO = {
  name: '@growthub/brand-kit',
  version: '1.0.0',
  description: 'Brand data coordination and asset management utilities for Growthub Marketing OS',
  patterns: [
    'Brand Data Management',
    'Asset Storage Coordination',
    'Brand Validation & Quality Assessment',
    'User Isolation & Security',
    'File Upload & Processing'
  ],
  compliance: 'AT-03 PROD STABLE'
} as const 