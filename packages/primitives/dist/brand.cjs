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

// src/brand.ts
var brand_exports = {};
__export(brand_exports, {
  analyzeBrandVoice: () => analyzeBrandVoice,
  generateColorPalette: () => generateColorPalette,
  parseHexColor: () => parseHexColor,
  rgbToHsl: () => rgbToHsl
});
module.exports = __toCommonJS(brand_exports);
function parseHexColor(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
function generateColorPalette(baseColor, count = 5) {
  const rgb = parseHexColor(baseColor);
  if (!rgb) return [baseColor];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const palette = [];
  for (let i = 0; i < count; i++) {
    const lightness = Math.max(10, Math.min(90, hsl.l + (i - Math.floor(count / 2)) * 20));
    const newHsl = { ...hsl, l: lightness };
    palette.push(hslToHex(newHsl.h, newHsl.s, newHsl.l));
  }
  return palette;
}
function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  const hue2rgb = (p2, q2, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t;
    if (t < 1 / 2) return q2;
    if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6;
    return p2;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
function analyzeBrandVoice(text) {
  const patterns = {
    professional: /\b(solution|expertise|quality|professional|business|enterprise)\b/gi,
    casual: /\b(hey|cool|awesome|great|nice|fun)\b/gi,
    friendly: /\b(welcome|hello|thanks|please|happy|enjoy)\b/gi,
    authoritative: /\b(proven|leader|best|expert|trusted|reliable)\b/gi,
    playful: /\b(amazing|fantastic|exciting|fun|creative|innovative)\b/gi,
    luxurious: /\b(premium|exclusive|elegant|sophisticated|luxury|finest)\b/gi
  };
  let maxScore = 0;
  let dominantTone = "professional";
  Object.entries(patterns).forEach(([tone, pattern]) => {
    const matches = text.match(pattern);
    const score = matches ? matches.length : 0;
    if (score > maxScore) {
      maxScore = score;
      dominantTone = tone;
    }
  });
  const totalWords = text.split(/\s+/).length;
  const confidence = Math.min(1, maxScore / Math.max(1, totalWords * 0.1));
  return {
    tone: dominantTone,
    confidence
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  analyzeBrandVoice,
  generateColorPalette,
  parseHexColor,
  rgbToHsl
});
//# sourceMappingURL=brand.cjs.map