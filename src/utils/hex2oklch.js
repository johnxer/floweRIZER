// functions that convert the hex value to oklch format

const hexToRgb = (hex) => {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((x) => x + x)
            .join('');
    }

    const num = parseInt(hex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
};

const srgbToLinear = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

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
        L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
        a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
        b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
    };
};

const oklabToOklch = (L, a, b) => {
    const C = Math.sqrt(a * a + b * b);
    const h = (Math.atan2(b, a) * 180) / Math.PI;
    return { L, C, h: (h + 360) % 360 };
};

export const hexToOklch = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    const { L, a, b: bb } = rgbToOklab(r, g, b);
    const { C, h } = oklabToOklch(L, a, bb);
    return { L, C, h };
};

export const generateOklchShades = (hex) => {
    const base = hexToOklch(hex);

    // this emulates the tailwind scale, when in the extremes, 
    // the shades are closer to each other, not linear
    const multipliers = {
        50: 1.30,
        100: 1.20,
        200: 1.08,
        300: 0.95,
        400: 0.85,
        500: 1.00,
        600: 0.83,
        700: 0.71,
        800: 0.57,
        900: 0.45
    }

    const shades = {}
    for (const [key, value] of Object.entries(multipliers)) {
        const L = Math.min(1, base.L * value)
        shades[key] = `oklch(${L.toFixed(4)} ${base.C.toFixed(4)} ${base.h.toFixed(2)})`
    }
    return shades;
};
