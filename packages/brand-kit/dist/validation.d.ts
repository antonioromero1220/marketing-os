import { z } from 'zod';
import { BrandKitData, BrandAsset, BrandContext } from './data.js';

/**
 * @growthub/brand-kit/validation
 * Brand Data Validation and Quality Assessment
 *
 * Professional validation patterns extracted from the AT-03 production system.
 * Provides comprehensive brand data validation with quality scoring and recommendations.
 */

interface BrandValidationResult {
    valid: boolean;
    score: number;
    strength: 'weak' | 'moderate' | 'strong' | 'excellent';
    errors: ValidationError[];
    warnings: ValidationWarning[];
    recommendations: string[];
    completeness: {
        name: boolean;
        colors: boolean;
        fonts: boolean;
        messaging: boolean;
        assets: boolean;
    };
}
interface ValidationError {
    field: string;
    message: string;
    code: string;
    severity: 'error' | 'warning' | 'info';
}
interface ValidationWarning {
    field: string;
    message: string;
    suggestion: string;
}
declare const ColorValidationSchema: z.ZodObject<{
    primary: z.ZodString;
    secondary: z.ZodOptional<z.ZodString>;
    accent: z.ZodOptional<z.ZodString>;
    neutral: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    primary: string;
    secondary?: string | undefined;
    accent?: string | undefined;
    neutral?: string | undefined;
}, {
    primary: string;
    secondary?: string | undefined;
    accent?: string | undefined;
    neutral?: string | undefined;
}>;
declare const FontValidationSchema: z.ZodObject<{
    heading: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    accent: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    accent?: string | undefined;
    heading?: string | undefined;
    body?: string | undefined;
}, {
    accent?: string | undefined;
    heading?: string | undefined;
    body?: string | undefined;
}>;
/**
 * Brand Kit Validator Class
 * Comprehensive validation for brand kits with quality assessment
 */
declare class BrandKitValidator {
    /**
     * Validate complete brand kit
     */
    validateBrandKit(brandKit: BrandKitData, assets?: BrandAsset[]): BrandValidationResult;
    /**
     * Validate brand name
     */
    validateBrandName(brandName: string): {
        valid: boolean;
        errors: ValidationError[];
        warnings: ValidationWarning[];
        recommendations: string[];
    };
    /**
     * Validate brand colors
     */
    validateBrandColors(colors: Record<string, string> | null): {
        valid: boolean;
        errors: ValidationError[];
        warnings: ValidationWarning[];
        recommendations: string[];
    };
    /**
     * Validate brand fonts
     */
    validateBrandFonts(fonts: Record<string, string> | null): {
        valid: boolean;
        errors: ValidationError[];
        warnings: ValidationWarning[];
        recommendations: string[];
    };
    /**
     * Validate brand messaging
     */
    validateBrandMessaging(messaging: string | null): {
        valid: boolean;
        errors: ValidationError[];
        warnings: ValidationWarning[];
        recommendations: string[];
    };
    /**
     * Validate brand assets
     */
    validateBrandAssets(assets: BrandAsset[]): {
        valid: boolean;
        errors: ValidationError[];
        warnings: ValidationWarning[];
        recommendations: string[];
    };
    /**
     * Validate brand context for agent integration
     */
    validateBrandContext(context: BrandContext): BrandValidationResult;
    /**
     * Helper: Validate hex color format
     */
    private isValidHexColor;
    /**
     * Helper: Validate URL format
     */
    private isValidUrl;
    /**
     * Helper: Calculate color contrast ratio
     */
    private calculateColorContrast;
    /**
     * Helper: Get relative luminance of color
     */
    private getColorLuminance;
    /**
     * Helper: Calculate brand strength from score
     */
    private calculateBrandStrength;
}
/**
 * Brand Quality Analyzer
 * Advanced quality assessment and improvement suggestions
 */
declare class BrandQualityAnalyzer {
    /**
     * Analyze brand completeness
     */
    analyzeCompleteness(brandKit: BrandKitData, assets: BrandAsset[]): {
        score: number;
        missingElements: string[];
        recommendations: string[];
    };
    /**
     * Analyze brand consistency
     */
    analyzeConsistency(brandKit: BrandKitData): {
        score: number;
        issues: string[];
        suggestions: string[];
    };
}
/**
 * Validation utilities
 */
declare const ValidationUtils: {
    /**
     * Create validation summary
     */
    createValidationSummary(result: BrandValidationResult): string;
    /**
     * Get next action recommendation
     */
    getNextActionRecommendation(result: BrandValidationResult): string;
    /**
     * Filter validation results by severity
     */
    filterBySeverity(errors: ValidationError[], severity: ValidationError["severity"]): ValidationError[];
};

export { BrandKitValidator, BrandQualityAnalyzer, type BrandValidationResult, ColorValidationSchema, FontValidationSchema, type ValidationError, ValidationUtils, type ValidationWarning };
