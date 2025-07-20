import { z } from 'zod';

/**
 * @growthub/schemas - Brand Management Schemas
 *
 * Pure Zod schemas for brand kit management, assets, and context validation.
 * These schemas are stateless and contain no business logic - perfect for OSS.
 */

declare const BrandKitSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    colors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    fonts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    logo_url: z.ZodOptional<z.ZodString>;
    guidelines: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    brand_voice: z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>;
    target_audience: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    id?: string | undefined;
    colors?: string[] | undefined;
    fonts?: string[] | undefined;
    logo_url?: string | undefined;
    guidelines?: string | undefined;
    industry?: string | undefined;
    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
    target_audience?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    id?: string | undefined;
    colors?: string[] | undefined;
    fonts?: string[] | undefined;
    logo_url?: string | undefined;
    guidelines?: string | undefined;
    industry?: string | undefined;
    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
    target_audience?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}>;
type BrandKit = z.infer<typeof BrandKitSchema>;
declare const BrandAssetTypeSchema: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
declare const BrandAssetSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    brand_kit_id: z.ZodString;
    asset_type: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    url: z.ZodString;
    file_size: z.ZodOptional<z.ZodNumber>;
    dimensions: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
    }, {
        width: number;
        height: number;
    }>>;
    format: z.ZodEnum<["png", "jpg", "jpeg", "svg", "webp", "gif"]>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    is_primary: z.ZodDefault<z.ZodBoolean>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url: string;
    name: string;
    brand_kit_id: string;
    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
    format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
    is_primary: boolean;
    description?: string | undefined;
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    file_size?: number | undefined;
    dimensions?: {
        width: number;
        height: number;
    } | undefined;
    tags?: string[] | undefined;
}, {
    url: string;
    name: string;
    brand_kit_id: string;
    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
    format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
    description?: string | undefined;
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    file_size?: number | undefined;
    dimensions?: {
        width: number;
        height: number;
    } | undefined;
    tags?: string[] | undefined;
    is_primary?: boolean | undefined;
}>;
type BrandAsset = z.infer<typeof BrandAssetSchema>;
type BrandAssetType = z.infer<typeof BrandAssetTypeSchema>;
declare const BrandContextSchema: z.ZodObject<{
    brand_kit: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        colors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        fonts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        logo_url: z.ZodOptional<z.ZodString>;
        guidelines: z.ZodOptional<z.ZodString>;
        industry: z.ZodOptional<z.ZodString>;
        brand_voice: z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>;
        target_audience: z.ZodOptional<z.ZodString>;
        created_at: z.ZodOptional<z.ZodString>;
        updated_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        id?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
    }, {
        name: string;
        description?: string | undefined;
        id?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
    }>>;
    selected_assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        brand_kit_id: z.ZodString;
        asset_type: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        url: z.ZodString;
        file_size: z.ZodOptional<z.ZodNumber>;
        dimensions: z.ZodOptional<z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            width: number;
            height: number;
        }, {
            width: number;
            height: number;
        }>>;
        format: z.ZodEnum<["png", "jpg", "jpeg", "svg", "webp", "gif"]>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        is_primary: z.ZodDefault<z.ZodBoolean>;
        created_at: z.ZodOptional<z.ZodString>;
        updated_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        name: string;
        brand_kit_id: string;
        asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
        format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
        is_primary: boolean;
        description?: string | undefined;
        id?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        file_size?: number | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        tags?: string[] | undefined;
    }, {
        url: string;
        name: string;
        brand_kit_id: string;
        asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
        format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
        description?: string | undefined;
        id?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        file_size?: number | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        tags?: string[] | undefined;
        is_primary?: boolean | undefined;
    }>, "many">>;
    brand_guidelines: z.ZodOptional<z.ZodString>;
    style_preferences: z.ZodOptional<z.ZodObject<{
        tone: z.ZodOptional<z.ZodString>;
        style: z.ZodOptional<z.ZodString>;
        mood: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tone?: string | undefined;
        style?: string | undefined;
        mood?: string | undefined;
    }, {
        tone?: string | undefined;
        style?: string | undefined;
        mood?: string | undefined;
    }>>;
    reference_images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        weight: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        weight: number;
        description?: string | undefined;
    }, {
        url: string;
        description?: string | undefined;
        weight?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    brand_kit?: {
        name: string;
        description?: string | undefined;
        id?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
    } | undefined;
    selected_assets?: {
        url: string;
        name: string;
        brand_kit_id: string;
        asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
        format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
        is_primary: boolean;
        description?: string | undefined;
        id?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        file_size?: number | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        tags?: string[] | undefined;
    }[] | undefined;
    brand_guidelines?: string | undefined;
    style_preferences?: {
        tone?: string | undefined;
        style?: string | undefined;
        mood?: string | undefined;
    } | undefined;
    reference_images?: {
        url: string;
        weight: number;
        description?: string | undefined;
    }[] | undefined;
}, {
    brand_kit?: {
        name: string;
        description?: string | undefined;
        id?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
    } | undefined;
    selected_assets?: {
        url: string;
        name: string;
        brand_kit_id: string;
        asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
        format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
        description?: string | undefined;
        id?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        file_size?: number | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        tags?: string[] | undefined;
        is_primary?: boolean | undefined;
    }[] | undefined;
    brand_guidelines?: string | undefined;
    style_preferences?: {
        tone?: string | undefined;
        style?: string | undefined;
        mood?: string | undefined;
    } | undefined;
    reference_images?: {
        url: string;
        description?: string | undefined;
        weight?: number | undefined;
    }[] | undefined;
}>;
type BrandContext = z.infer<typeof BrandContextSchema>;
declare const CreateBrandKitSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    colors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    fonts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    logo_url: z.ZodOptional<z.ZodString>;
    guidelines: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    brand_voice: z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>;
    target_audience: z.ZodOptional<z.ZodString>;
} & {
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    colors?: string[] | undefined;
    fonts?: string[] | undefined;
    logo_url?: string | undefined;
    guidelines?: string | undefined;
    industry?: string | undefined;
    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
    target_audience?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    colors?: string[] | undefined;
    fonts?: string[] | undefined;
    logo_url?: string | undefined;
    guidelines?: string | undefined;
    industry?: string | undefined;
    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
    target_audience?: string | undefined;
}>;
declare const UpdateBrandKitSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    name: z.ZodOptional<z.ZodString>;
    colors: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    fonts: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    logo_url: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    guidelines: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    industry: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    brand_voice: z.ZodOptional<z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>>;
    target_audience: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    name?: string | undefined;
    colors?: string[] | undefined;
    fonts?: string[] | undefined;
    logo_url?: string | undefined;
    guidelines?: string | undefined;
    industry?: string | undefined;
    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
    target_audience?: string | undefined;
}, {
    description?: string | undefined;
    name?: string | undefined;
    colors?: string[] | undefined;
    fonts?: string[] | undefined;
    logo_url?: string | undefined;
    guidelines?: string | undefined;
    industry?: string | undefined;
    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
    target_audience?: string | undefined;
}>;
declare const BrandAssetUploadSchema: z.ZodObject<{
    brand_kit_id: z.ZodString;
    asset_type: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
    name: z.ZodString;
    file: z.ZodAny;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    is_primary: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    brand_kit_id: string;
    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
    is_primary: boolean;
    description?: string | undefined;
    tags?: string[] | undefined;
    file?: any;
}, {
    name: string;
    brand_kit_id: string;
    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
    description?: string | undefined;
    tags?: string[] | undefined;
    is_primary?: boolean | undefined;
    file?: any;
}>;
type CreateBrandKit = z.infer<typeof CreateBrandKitSchema>;
type UpdateBrandKit = z.infer<typeof UpdateBrandKitSchema>;
type BrandAssetUpload = z.infer<typeof BrandAssetUploadSchema>;
declare const brandSchemas: {
    readonly BrandKitSchema: z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        colors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        fonts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        logo_url: z.ZodOptional<z.ZodString>;
        guidelines: z.ZodOptional<z.ZodString>;
        industry: z.ZodOptional<z.ZodString>;
        brand_voice: z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>;
        target_audience: z.ZodOptional<z.ZodString>;
        created_at: z.ZodOptional<z.ZodString>;
        updated_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        id?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
    }, {
        name: string;
        description?: string | undefined;
        id?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
    }>;
    readonly BrandAssetSchema: z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        brand_kit_id: z.ZodString;
        asset_type: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        url: z.ZodString;
        file_size: z.ZodOptional<z.ZodNumber>;
        dimensions: z.ZodOptional<z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            width: number;
            height: number;
        }, {
            width: number;
            height: number;
        }>>;
        format: z.ZodEnum<["png", "jpg", "jpeg", "svg", "webp", "gif"]>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        is_primary: z.ZodDefault<z.ZodBoolean>;
        created_at: z.ZodOptional<z.ZodString>;
        updated_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        name: string;
        brand_kit_id: string;
        asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
        format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
        is_primary: boolean;
        description?: string | undefined;
        id?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        file_size?: number | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        tags?: string[] | undefined;
    }, {
        url: string;
        name: string;
        brand_kit_id: string;
        asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
        format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
        description?: string | undefined;
        id?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        file_size?: number | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        tags?: string[] | undefined;
        is_primary?: boolean | undefined;
    }>;
    readonly BrandContextSchema: z.ZodObject<{
        brand_kit: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            colors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            fonts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            logo_url: z.ZodOptional<z.ZodString>;
            guidelines: z.ZodOptional<z.ZodString>;
            industry: z.ZodOptional<z.ZodString>;
            brand_voice: z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>;
            target_audience: z.ZodOptional<z.ZodString>;
            created_at: z.ZodOptional<z.ZodString>;
            updated_at: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description?: string | undefined;
            id?: string | undefined;
            colors?: string[] | undefined;
            fonts?: string[] | undefined;
            logo_url?: string | undefined;
            guidelines?: string | undefined;
            industry?: string | undefined;
            brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
            target_audience?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
        }, {
            name: string;
            description?: string | undefined;
            id?: string | undefined;
            colors?: string[] | undefined;
            fonts?: string[] | undefined;
            logo_url?: string | undefined;
            guidelines?: string | undefined;
            industry?: string | undefined;
            brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
            target_audience?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
        }>>;
        selected_assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            brand_kit_id: z.ZodString;
            asset_type: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            url: z.ZodString;
            file_size: z.ZodOptional<z.ZodNumber>;
            dimensions: z.ZodOptional<z.ZodObject<{
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                width: number;
                height: number;
            }, {
                width: number;
                height: number;
            }>>;
            format: z.ZodEnum<["png", "jpg", "jpeg", "svg", "webp", "gif"]>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            is_primary: z.ZodDefault<z.ZodBoolean>;
            created_at: z.ZodOptional<z.ZodString>;
            updated_at: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            name: string;
            brand_kit_id: string;
            asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
            format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
            is_primary: boolean;
            description?: string | undefined;
            id?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
            file_size?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            tags?: string[] | undefined;
        }, {
            url: string;
            name: string;
            brand_kit_id: string;
            asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
            format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
            description?: string | undefined;
            id?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
            file_size?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            tags?: string[] | undefined;
            is_primary?: boolean | undefined;
        }>, "many">>;
        brand_guidelines: z.ZodOptional<z.ZodString>;
        style_preferences: z.ZodOptional<z.ZodObject<{
            tone: z.ZodOptional<z.ZodString>;
            style: z.ZodOptional<z.ZodString>;
            mood: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            tone?: string | undefined;
            style?: string | undefined;
            mood?: string | undefined;
        }, {
            tone?: string | undefined;
            style?: string | undefined;
            mood?: string | undefined;
        }>>;
        reference_images: z.ZodOptional<z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            weight: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            weight: number;
            description?: string | undefined;
        }, {
            url: string;
            description?: string | undefined;
            weight?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        brand_kit?: {
            name: string;
            description?: string | undefined;
            id?: string | undefined;
            colors?: string[] | undefined;
            fonts?: string[] | undefined;
            logo_url?: string | undefined;
            guidelines?: string | undefined;
            industry?: string | undefined;
            brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
            target_audience?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
        } | undefined;
        selected_assets?: {
            url: string;
            name: string;
            brand_kit_id: string;
            asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
            format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
            is_primary: boolean;
            description?: string | undefined;
            id?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
            file_size?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            tags?: string[] | undefined;
        }[] | undefined;
        brand_guidelines?: string | undefined;
        style_preferences?: {
            tone?: string | undefined;
            style?: string | undefined;
            mood?: string | undefined;
        } | undefined;
        reference_images?: {
            url: string;
            weight: number;
            description?: string | undefined;
        }[] | undefined;
    }, {
        brand_kit?: {
            name: string;
            description?: string | undefined;
            id?: string | undefined;
            colors?: string[] | undefined;
            fonts?: string[] | undefined;
            logo_url?: string | undefined;
            guidelines?: string | undefined;
            industry?: string | undefined;
            brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
            target_audience?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
        } | undefined;
        selected_assets?: {
            url: string;
            name: string;
            brand_kit_id: string;
            asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
            format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
            description?: string | undefined;
            id?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
            file_size?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            tags?: string[] | undefined;
            is_primary?: boolean | undefined;
        }[] | undefined;
        brand_guidelines?: string | undefined;
        style_preferences?: {
            tone?: string | undefined;
            style?: string | undefined;
            mood?: string | undefined;
        } | undefined;
        reference_images?: {
            url: string;
            description?: string | undefined;
            weight?: number | undefined;
        }[] | undefined;
    }>;
    readonly CreateBrandKitSchema: z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        colors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        fonts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        logo_url: z.ZodOptional<z.ZodString>;
        guidelines: z.ZodOptional<z.ZodString>;
        industry: z.ZodOptional<z.ZodString>;
        brand_voice: z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>;
        target_audience: z.ZodOptional<z.ZodString>;
    } & {
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
    }, {
        name: string;
        description?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
    }>;
    readonly UpdateBrandKitSchema: z.ZodObject<{
        description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        name: z.ZodOptional<z.ZodString>;
        colors: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        fonts: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        logo_url: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        guidelines: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        industry: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        brand_voice: z.ZodOptional<z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>>;
        target_audience: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        name?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
    }, {
        description?: string | undefined;
        name?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
    }>;
    readonly BrandAssetUploadSchema: z.ZodObject<{
        brand_kit_id: z.ZodString;
        asset_type: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
        name: z.ZodString;
        file: z.ZodAny;
        description: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        is_primary: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        brand_kit_id: string;
        asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
        is_primary: boolean;
        description?: string | undefined;
        tags?: string[] | undefined;
        file?: any;
    }, {
        name: string;
        brand_kit_id: string;
        asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
        description?: string | undefined;
        tags?: string[] | undefined;
        is_primary?: boolean | undefined;
        file?: any;
    }>;
    readonly BrandAssetTypeSchema: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
};

export { type BrandAsset, BrandAssetSchema, type BrandAssetType, BrandAssetTypeSchema, type BrandAssetUpload, BrandAssetUploadSchema, type BrandContext, BrandContextSchema, type BrandKit, BrandKitSchema, type CreateBrandKit, CreateBrandKitSchema, type UpdateBrandKit, UpdateBrandKitSchema, brandSchemas };
