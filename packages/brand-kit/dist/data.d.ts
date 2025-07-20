import { z } from 'zod';

/**
 * @growthub/brand-kit/data
 * Brand Data Coordination and Management Utilities
 *
 * Professional brand data patterns extracted from the AT-03 production system.
 * Provides secure brand kit operations with user isolation and validation.
 */

declare const BrandKitInsertSchema: z.ZodObject<{
    user_id: z.ZodString;
    brand_name: z.ZodString;
    colors: z.ZodDefault<z.ZodNullable<z.ZodAny>>;
    fonts: z.ZodDefault<z.ZodNullable<z.ZodAny>>;
    messaging: z.ZodDefault<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    brand_name: string;
    messaging: string | null;
    colors?: any;
    fonts?: any;
}, {
    user_id: string;
    brand_name: string;
    colors?: any;
    fonts?: any;
    messaging?: string | null | undefined;
}>;
declare const BrandKitDataSchema: z.ZodObject<{
    user_id: z.ZodString;
    brand_name: z.ZodString;
    colors: z.ZodDefault<z.ZodNullable<z.ZodAny>>;
    fonts: z.ZodDefault<z.ZodNullable<z.ZodAny>>;
    messaging: z.ZodDefault<z.ZodNullable<z.ZodString>>;
} & {
    id: z.ZodString;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    brand_name: string;
    messaging: string | null;
    id: string;
    created_at: string;
    updated_at: string;
    colors?: any;
    fonts?: any;
}, {
    user_id: string;
    brand_name: string;
    id: string;
    created_at: string;
    updated_at: string;
    colors?: any;
    fonts?: any;
    messaging?: string | null | undefined;
}>;
declare const BrandKitUpdateSchema: z.ZodObject<{
    brand_name: z.ZodOptional<z.ZodString>;
    colors: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
    fonts: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
    messaging: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    brand_name?: string | undefined;
    colors?: any;
    fonts?: any;
    messaging?: string | null | undefined;
    updated_at?: string | undefined;
}, {
    brand_name?: string | undefined;
    colors?: any;
    fonts?: any;
    messaging?: string | null | undefined;
    updated_at?: string | undefined;
}>;
declare const BrandAssetSchema: z.ZodObject<{
    id: z.ZodString;
    brand_kit_id: z.ZodString;
    asset_type: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner"]>;
    asset_url: z.ZodString;
    storage_path: z.ZodString;
    metadata: z.ZodDefault<z.ZodNullable<z.ZodAny>>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    brand_kit_id: string;
    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner";
    asset_url: string;
    storage_path: string;
    metadata?: any;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    brand_kit_id: string;
    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner";
    asset_url: string;
    storage_path: string;
    metadata?: any;
}>;
declare const BrandAssetInsertSchema: z.ZodObject<{
    brand_kit_id: z.ZodString;
    asset_type: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner"]>;
    asset_url: z.ZodString;
    storage_path: z.ZodString;
    metadata: z.ZodDefault<z.ZodNullable<z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    brand_kit_id: string;
    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner";
    asset_url: string;
    storage_path: string;
    metadata?: any;
}, {
    brand_kit_id: string;
    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner";
    asset_url: string;
    storage_path: string;
    metadata?: any;
}>;
declare const BrandContextSchema: z.ZodObject<{
    brand_name: z.ZodString;
    colors: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    messaging: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    referenceImages: z.ZodDefault<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        type: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        url: string;
        description: string;
    }, {
        type: string;
        url: string;
        description: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    brand_name: string;
    colors: string[];
    messaging: string | null;
    referenceImages: {
        type: string;
        url: string;
        description: string;
    }[];
}, {
    brand_name: string;
    colors?: string[] | undefined;
    messaging?: string | null | undefined;
    referenceImages?: {
        type: string;
        url: string;
        description: string;
    }[] | undefined;
}>;
declare const BrandDataToolResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodOptional<z.ZodString>;
    brandKit: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        brandName: z.ZodString;
        colors: z.ZodOptional<z.ZodAny>;
        fonts: z.ZodOptional<z.ZodAny>;
        messaging: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        brandName: string;
        createdAt: string;
        updatedAt: string;
        colors?: any;
        fonts?: any;
        messaging?: string | null | undefined;
    }, {
        id: string;
        brandName: string;
        createdAt: string;
        updatedAt: string;
        colors?: any;
        fonts?: any;
        messaging?: string | null | undefined;
    }>>;
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        assetType: z.ZodString;
        assetUrl: z.ZodString;
        metadata: z.ZodNullable<z.ZodAny>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: string;
        assetType: string;
        assetUrl: string;
        metadata?: any;
    }, {
        id: string;
        createdAt: string;
        assetType: string;
        assetUrl: string;
        metadata?: any;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    brandKit: {
        id: string;
        brandName: string;
        createdAt: string;
        updatedAt: string;
        colors?: any;
        fonts?: any;
        messaging?: string | null | undefined;
    } | null;
    assets: {
        id: string;
        createdAt: string;
        assetType: string;
        assetUrl: string;
        metadata?: any;
    }[];
    message?: string | undefined;
}, {
    success: boolean;
    brandKit: {
        id: string;
        brandName: string;
        createdAt: string;
        updatedAt: string;
        colors?: any;
        fonts?: any;
        messaging?: string | null | undefined;
    } | null;
    message?: string | undefined;
    assets?: {
        id: string;
        createdAt: string;
        assetType: string;
        assetUrl: string;
        metadata?: any;
    }[] | undefined;
}>;
type BrandKitData = z.infer<typeof BrandKitDataSchema>;
type BrandKitInsert = z.infer<typeof BrandKitInsertSchema>;
type BrandKitUpdate = z.infer<typeof BrandKitUpdateSchema>;
type BrandAsset = z.infer<typeof BrandAssetSchema>;
type BrandAssetInsert = z.infer<typeof BrandAssetInsertSchema>;
type BrandContext = z.infer<typeof BrandContextSchema>;
type BrandDataToolResult = z.infer<typeof BrandDataToolResultSchema>;
interface BrandDatabaseClient {
    from(table: string): TableBuilder;
}
interface TableBuilder {
    select(columns?: string): SelectQueryBuilder;
    insert(data: any): InsertBuilder;
    update(data: any): UpdateQueryBuilder;
    delete(): DeleteQueryBuilder;
}
interface SelectQueryBuilder {
    eq(column: string, value: any): SelectQueryBuilder;
    order(column: string, options?: {
        ascending: boolean;
    }): SelectQueryBuilder;
    single(): Promise<{
        data: any;
        error: any;
    }>;
    limit(count: number): SelectQueryBuilder;
}
interface InsertBuilder {
    select(): {
        single(): Promise<{
            data: any;
            error: any;
        }>;
    };
}
interface UpdateQueryBuilder {
    eq(column: string, value: any): UpdateQueryBuilder;
    select(): {
        single(): Promise<{
            data: any;
            error: any;
        }>;
    };
}
interface DeleteQueryBuilder {
    eq(column: string, value: any): DeleteQueryBuilder;
}
/**
 * Brand Data Manager Class
 * Provides secure brand kit operations with user isolation
 */
declare class BrandDataManager {
    private client;
    constructor(databaseClient: BrandDatabaseClient);
    /**
     * Get all brand kits for a user with ownership validation
     */
    getBrandKits(userId: string): Promise<BrandKitData[]>;
    /**
     * Get a specific brand kit by ID with ownership validation
     */
    getBrandKitById(userId: string, brandKitId: string): Promise<BrandKitData | null>;
    /**
     * Create a new brand kit with user assignment
     */
    createBrandKit(userId: string, brandData: Omit<BrandKitInsert, 'user_id'>): Promise<BrandKitData>;
    /**
     * Update an existing brand kit with ownership validation
     */
    updateBrandKit(userId: string, brandKitId: string, updates: BrandKitUpdate): Promise<BrandKitData>;
    /**
     * Delete a brand kit with ownership validation
     */
    deleteBrandKit(userId: string, brandKitId: string): Promise<boolean>;
    /**
     * Get brand assets for a specific brand kit with ownership validation
     */
    getBrandAssets(userId: string, brandKitId: string, assetTypes?: string[]): Promise<BrandAsset[]>;
    /**
     * Create a brand asset with ownership validation
     */
    createBrandAsset(userId: string, assetData: BrandAssetInsert): Promise<BrandAsset>;
    /**
     * Transform brand kit data to brand context for agent integration
     */
    transformToBrandContext(brandKit: BrandKitData | null, assets?: BrandAsset[]): BrandContext;
    /**
     * Transform brand data to tool result format
     */
    transformToBrandDataToolResult(brandKit: BrandKitData | null, assets?: BrandAsset[]): BrandDataToolResult;
}
/**
 * Default brand kit data for new users
 */
declare const DEFAULT_BRAND_KIT_DATA: Partial<BrandKitInsert>;
/**
 * Utility functions for brand data operations
 */
declare const BrandDataUtils: {
    /**
     * Validate brand kit ownership
     */
    validateOwnership: (brandKit: BrandKitData, userId: string) => boolean;
    /**
     * Generate storage path for brand assets
     */
    generateAssetStoragePath: (userId: string, brandKitId: string, assetType: string, fileName: string) => string;
    /**
     * Extract brand colors as array
     */
    extractBrandColors: (brandKit: BrandKitData | null) => string[];
    /**
     * Check if brand kit is complete
     */
    isBrandKitComplete: (brandKit: BrandKitData) => boolean;
    /**
     * Calculate brand strength score
     */
    calculateBrandStrength: (brandKit: BrandKitData, assets: BrandAsset[]) => "weak" | "moderate" | "strong" | "excellent";
};

export { type BrandAsset, type BrandAssetInsert, BrandAssetInsertSchema, BrandAssetSchema, type BrandContext, BrandContextSchema, BrandDataManager, type BrandDataToolResult, BrandDataToolResultSchema, BrandDataUtils, type BrandDatabaseClient, type BrandKitData, BrandKitDataSchema, type BrandKitInsert, BrandKitInsertSchema, type BrandKitUpdate, BrandKitUpdateSchema, DEFAULT_BRAND_KIT_DATA };
