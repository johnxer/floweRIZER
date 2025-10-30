// functions that convert the hex value to oklch format

const  hexToRgb = hex => {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }

    const num = parseInt(hex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

const srgbToLinear = c => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

const rgbToOklab = (r, g, b) => {
    r = srgbToLinear(r);
    g = srgbToLinear(g);
    b = srgbToLinear(b);

    const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    return {
        L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    };
}

const oklabToOklch = (L, a, b) => {
    const C = Math.sqrt(a * a + b * b);
    const h = (Math.atan2(b, a) * 180) / Math.PI;
    return { L, C, h: (h + 360) % 360 };
}

export const hexToOklch = hex => {
    const { r, g, b } = hexToRgb(hex);
    const { L, a, b: bb } = rgbToOklab(r, g, b);
    const { C, h } = oklabToOklch(L, a, bb);
    return { L, C, h }
}

export const generateOklchShades = hex => {
    const base = hexToOklch(hex)
    const levels = {
        50: 0.95, 100: 0.90, 200: 0.80, 300: 0.70, 400: 0.60,
        500: base.L, 600: 0.45, 700: 0.35, 800: 0.25, 900: 0.15
    }

    const shades = {}
    for (const [key, lightness] of Object.entries(levels)) {
        shades[key] = `oklch(${(lightness * 100).toFixed(2)}% ${(base.C * 100).toFixed(2)} ${base.h.toFixed(2)})`
    }
    return shades
}