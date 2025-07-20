# @growthub/brand-kit

Brand data coordination and asset management utilities for Growthub Marketing OS.

## Overview

This package provides professional brand management patterns extracted from the AT-03 production system:

- **Brand Data Management**: Secure CRUD operations with user isolation
- **Asset Storage Coordination**: File upload and storage management
- **Brand Validation**: Quality assessment with scoring and recommendations
- **Agent Integration**: Brand context transformation for AI content generation

## Installation

```bash
npm install @growthub/brand-kit
```

## Quick Start

```typescript
import { 
  BrandDataManager,
  BrandAssetManager,
  BrandKitValidator 
} from '@growthub/brand-kit'

// Set up brand data management
const brandManager = new BrandDataManager(databaseClient)
const assetManager = new BrandAssetManager(storageClient)
const validator = new BrandKitValidator()

// Create a brand kit
const brandKit = await brandManager.createBrandKit('user-123', {
  brand_name: 'My Awesome Brand',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6'
  }
})

// Validate brand quality
const validation = validator.validateBrandKit(brandKit, assets)
console.log(`Brand strength: ${validation.strength} (${validation.score}/100)`)
```

## Modules

### Data Management (`/data`)

Secure brand kit operations with user isolation:

```typescript
import { 
  BrandDataManager,
  BrandDataUtils,
  DEFAULT_BRAND_KIT_DATA 
} from '@growthub/brand-kit/data'

const manager = new BrandDataManager(databaseClient)

// CRUD operations
const brandKits = await manager.getBrandKits('user-id')
const brandKit = await manager.createBrandKit('user-id', brandData)
const updated = await manager.updateBrandKit('user-id', 'kit-id', updates)

// Transform for agent integration
const context = manager.transformToBrandContext(brandKit, assets)
const toolResult = manager.transformToBrandDataToolResult(brandKit, assets)
```

### Asset Management (`/assets`)

File upload and asset coordination:

```typescript
import { 
  BrandAssetManager,
  AssetServingManager,
  AssetCategoryUtils 
} from '@growthub/brand-kit/assets'

const assetManager = new BrandAssetManager(storageClient, {
  bucket: 'brand-assets',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
})

// Upload file
const result = await assetManager.uploadFile('user-id', 'brand-kit-id', {
  file: uploadedFile,
  assetType: 'logo',
  title: 'Brand Logo'
})

// Serve optimized images
const servingManager = new AssetServingManager('https://myapp.com')
const thumbnailUrl = servingManager.getThumbnailUrl(result.assetUrl, 'medium')
```

### Validation (`/validation`)

Brand quality assessment and validation:

```typescript
import { 
  BrandKitValidator,
  BrandQualityAnalyzer,
  ValidationUtils 
} from '@growthub/brand-kit/validation'

const validator = new BrandKitValidator()
const analyzer = new BrandQualityAnalyzer()

// Comprehensive validation
const validation = validator.validateBrandKit(brandKit, assets)

// Quality analysis
const completeness = analyzer.analyzeCompleteness(brandKit, assets)
const consistency = analyzer.analyzeConsistency(brandKit)

// Get actionable recommendations
const nextAction = ValidationUtils.getNextActionRecommendation(validation)
```

## Brand Kit Structure

### Brand Kit Data
```typescript
interface BrandKitData {
  id: string
  user_id: string
  brand_name: string
  colors: Record<string, string> | null    // { primary: '#FF0000', secondary: '#00FF00' }
  fonts: Record<string, string> | null     // { heading: 'Arial', body: 'Helvetica' }
  messaging: string | null                 // Brand messaging/tagline
  created_at: string
  updated_at: string
}
```

### Brand Assets
```typescript
interface BrandAsset {
  id: string
  brand_kit_id: string
  asset_type: 'logo' | 'product_photo' | 'lifestyle_image' | 'icon' | 'banner'
  asset_url: string        // CDN URL for serving
  storage_path: string     // Internal storage path
  metadata: AssetMetadata  // File info, dimensions, etc.
  created_at: string
  updated_at: string
}
```

### Brand Context (Agent Integration)
```typescript
interface BrandContext {
  brand_name: string
  colors: string[]                    // Array of hex colors
  messaging: string | null
  referenceImages: Array<{
    url: string
    type: string
    description: string
  }>
}
```

## Security Patterns

### User Isolation
All operations automatically filter by user ID for security:

```typescript
// ✅ Secure - only returns user's brand kits
const brandKits = await manager.getBrandKits(userId)

// ✅ Secure - validates ownership before update
await manager.updateBrandKit(userId, brandKitId, updates)

// ✅ Secure - ownership validated before asset creation
await manager.createBrandAsset(userId, assetData)
```

### Data Validation
Comprehensive validation with Zod schemas:

```typescript
// All data is validated before processing
const validation = validator.validateBrandKit(brandKit, assets)

if (!validation.valid) {
  console.log('Validation errors:', validation.errors)
  console.log('Recommendations:', validation.recommendations)
}
```

## Asset Upload Flow

Complete file upload with validation and storage:

```typescript
const assetManager = new BrandAssetManager(storageClient)

// Upload with automatic validation
const uploadResult = await assetManager.uploadFile(userId, brandKitId, {
  file: selectedFile,
  assetType: 'logo',
  title: 'Company Logo',
  description: 'Primary brand logo'
})

if (uploadResult.success) {
  // Create database record
  const asset = await brandManager.createBrandAsset(userId, {
    brand_kit_id: brandKitId,
    asset_type: 'logo',
    asset_url: uploadResult.assetUrl,
    storage_path: uploadResult.storagePath,
    metadata: assetManager.createAssetMetadata(selectedFile, {
      title: 'Company Logo',
      description: 'Primary brand logo'
    })
  })
}
```

## Validation & Quality Assessment

### Brand Strength Scoring
Comprehensive scoring system (0-100 points):

- **Brand Name** (20 points): Required, length, uniqueness
- **Colors** (25 points): Primary required, palette completeness
- **Fonts** (15 points): Typography selections
- **Messaging** (20 points): Brand messaging quality
- **Assets** (20 points): Logo and visual assets

### Strength Levels
- **Excellent** (85-100): Complete, professional brand kit
- **Strong** (65-84): Well-developed brand with minor improvements
- **Moderate** (40-64): Basic brand kit with key elements missing
- **Weak** (0-39): Incomplete brand kit requiring significant work

### Validation Example
```typescript
const validation = validator.validateBrandKit(brandKit, assets)

console.log(`Brand Strength: ${validation.strength}`)
console.log(`Score: ${validation.score}/100`)
console.log(`Completeness:`, validation.completeness)
console.log(`Next Action: ${ValidationUtils.getNextActionRecommendation(validation)}`)
```

## Agent Integration

Transform brand data for AI content generation:

```typescript
// Transform for agent consumption
const brandContext = manager.transformToBrandContext(brandKit, assets)

// Use in content generation
const contentPrompt = `
Create marketing content for ${brandContext.brand_name}
Colors: ${brandContext.colors.join(', ')}
Messaging: ${brandContext.messaging}
Reference Images: ${brandContext.referenceImages.length} available
`

// Tool result format for structured agents
const toolResult = manager.transformToBrandDataToolResult(brandKit, assets)
```

## Asset Serving & Optimization

Secure and optimized asset serving:

```typescript
const servingManager = new AssetServingManager('https://myapp.com')

// Generate responsive image set
const responsive = servingManager.generateResponsiveImageSet(assetUrl)

// Optimized thumbnails
const thumbnail = servingManager.getThumbnailUrl(assetUrl, 'medium')

// Custom sizing and optimization
const optimized = servingManager.generateSecureUrl(assetUrl, {
  width: 800,
  height: 600,
  quality: 85,
  format: 'webp'
})
```

## Production Usage

This package powers the Growthub Marketing OS brand management system:

- **Brand Kit Management**: Complete CRUD operations for brand identities
- **Asset Pipeline**: Secure upload, processing, and serving of brand assets
- **AI Integration**: Brand context feeding into content generation agents
- **Quality Assurance**: Automated validation and improvement recommendations

## TypeScript Support

Full TypeScript support with strict type definitions:

```typescript
import type { 
  BrandKitData,
  BrandValidationResult,
  AssetMetadata 
} from '@growthub/brand-kit'

function processBrandKit(brandKit: BrandKitData): BrandValidationResult {
  // Full type safety and IntelliSense
}
```

## Integration Examples

### Next.js API Route
```typescript
import { BrandDataManager } from '@growthub/brand-kit'

export async function POST(req: Request) {
  const manager = new BrandDataManager(databaseClient)
  const brandKit = await manager.createBrandKit(userId, await req.json())
  return Response.json({ brandKit })
}
```

### React Hook
```typescript
import { BrandKitValidator } from '@growthub/brand-kit'

function useBrandValidation(brandKit: BrandKitData, assets: BrandAsset[]) {
  const validator = new BrandKitValidator()
  return useMemo(() => 
    validator.validateBrandKit(brandKit, assets), 
    [brandKit, assets]
  )
}
```

## License

MIT © Growthub Team

---

**Part of [Growthub Marketing OS](https://github.com/growthub-os/marketing-os) - Open-core marketing automation platform** 