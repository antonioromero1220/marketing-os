/* @growthub/brand-kit - Brand data coordination and asset management utilities */

// src/validation.ts
import { z } from "zod";
var ColorValidationSchema = z.object({
  primary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format"),
  secondary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format").optional(),
  accent: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format").optional(),
  neutral: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format").optional()
});
var FontValidationSchema = z.object({
  heading: z.string().min(1, "Heading font is required").optional(),
  body: z.string().min(1, "Body font is required").optional(),
  accent: z.string().min(1, "Accent font name is required").optional()
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
export {
  BrandKitValidator,
  BrandQualityAnalyzer,
  ColorValidationSchema,
  FontValidationSchema,
  ValidationUtils
};
//# sourceMappingURL=validation.js.map