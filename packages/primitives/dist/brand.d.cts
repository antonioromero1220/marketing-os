/**
 * Brand utilities for the Growthub Marketing OS
 */
/**
 * Extract colors from a hex color string
 */
declare function parseHexColor(hex: string): {
    r: number;
    g: number;
    b: number;
} | null;
/**
 * Convert RGB to HSL
 */
declare function rgbToHsl(r: number, g: number, b: number): {
    h: number;
    s: number;
    l: number;
};
/**
 * Generate a color palette from a base color
 */
declare function generateColorPalette(baseColor: string, count?: number): string[];
/**
 * Brand voice tone analyzer
 */
declare function analyzeBrandVoice(text: string): {
    tone: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'playful' | 'luxurious';
    confidence: number;
};

export { analyzeBrandVoice, generateColorPalette, parseHexColor, rgbToHsl };
