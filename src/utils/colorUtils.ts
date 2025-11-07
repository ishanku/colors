import chroma from 'chroma-js';

export interface Color {
  id: string;
  hex: string;
  name?: string;
}

export interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  cmyk: string;
  lab: string;
}

export const convertColor = (hex: string): ColorFormats => {
  try {
    const color = chroma(hex);
    const rgb = color.rgb();
    const hsl = color.hsl();
    const lab = color.lab();
    const cmyk = color.cmyk();

    return {
      hex: color.hex(),
      rgb: `rgb(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])})`,
      hsl: `hsl(${Math.round(hsl[0] || 0)}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`,
      cmyk: `cmyk(${Math.round(cmyk[0] * 100)}%, ${Math.round(cmyk[1] * 100)}%, ${Math.round(cmyk[2] * 100)}%, ${Math.round(cmyk[3] * 100)}%)`,
      lab: `lab(${Math.round(lab[0])}, ${Math.round(lab[1])}, ${Math.round(lab[2])})`
    };
  } catch (error) {
    return {
      hex: '#000000',
      rgb: 'rgb(0, 0, 0)',
      hsl: 'hsl(0, 0%, 0%)',
      cmyk: 'cmyk(0%, 0%, 0%, 100%)',
      lab: 'lab(0, 0, 0)'
    };
  }
};

export const generateRandomColor = (): string => {
  return chroma.random().hex();
};

export const isValidHex = (hex: string): boolean => {
  try {
    chroma(hex);
    return true;
  } catch {
    return false;
  }
};

export const getContrastColor = (hex: string): string => {
  try {
    const color = chroma(hex);
    const luminance = color.luminance();

    // More strict contrast threshold for better readability
    if (luminance > 0.4) {
      return '#000000';
    } else {
      return '#ffffff';
    }
  } catch {
    return '#000000';
  }
};

export interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export const hexToHsv = (hex: string): HSV => {
  try {
    const color = chroma(hex);
    const [h, s, v] = color.hsv();
    return {
      h: isNaN(h) ? 0 : h,
      s: s * 100,
      v: v * 100
    };
  } catch {
    return { h: 0, s: 0, v: 0 };
  }
};

export const hsvToHex = (h: number, s: number, v: number): string => {
  try {
    return chroma.hsv(h, s / 100, v / 100).hex();
  } catch {
    return '#000000';
  }
};

export const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
  try {
    const rgb = chroma.hsv(h, s / 100, v / 100).rgb();
    return [Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2])];
  } catch {
    return [0, 0, 0];
  }
};

export const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

export const cartesianToPolar = (centerX: number, centerY: number, x: number, y: number) => {
  const dx = x - centerX;
  const dy = y - centerY;
  const radius = Math.sqrt(dx * dx + dy * dy);
  let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
  if (angle < 0) angle += 360;
  return { radius, angle };
};

// Accessibility Features
export interface ContrastResult {
  ratio: number;
  level: 'AA' | 'AAA' | 'fail';
  score: 'pass' | 'fail';
}

export const getContrastRatio = (color1: string, color2: string): number => {
  try {
    return chroma.contrast(color1, color2);
  } catch {
    return 1;
  }
};

export const checkAccessibility = (foreground: string, background: string): ContrastResult => {
  const ratio = getContrastRatio(foreground, background);

  let level: 'AA' | 'AAA' | 'fail';
  let score: 'pass' | 'fail';

  if (ratio >= 7) {
    level = 'AAA';
    score = 'pass';
  } else if (ratio >= 4.5) {
    level = 'AA';
    score = 'pass';
  } else {
    level = 'fail';
    score = 'fail';
  }

  return { ratio, level, score };
};

export const getBestContrastColor = (backgroundColor: string, options: string[] = ['#000000', '#ffffff']): string => {
  let bestColor = options[0];
  let bestContrast = 0;

  options.forEach(color => {
    const contrast = getContrastRatio(color, backgroundColor);
    if (contrast > bestContrast) {
      bestContrast = contrast;
      bestColor = color;
    }
  });

  return bestColor;
};

export const generateAccessiblePalette = (baseColor: string, count: number = 5): Color[] => {
  const colors: Color[] = [];
  const base = chroma(baseColor);

  // Generate colors with good contrast ratios
  for (let i = 0; i < count; i++) {
    const lightness = 0.2 + (i / (count - 1)) * 0.6; // Spread from 0.2 to 0.8
    const newColor = base.set('hsl.l', lightness).hex();

    colors.push({
      id: `accessible-${i}`,
      hex: newColor,
      name: `Accessible ${i + 1}`
    });
  }

  return colors;
};

// Color Blindness Simulation
export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly' | 'achromatopsia' | 'achromatomaly';

// Color blindness transformation matrices
const BLINDNESS_MATRICES = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758]
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7]
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525]
  ],
  protanomaly: [
    [0.817, 0.183, 0],
    [0.333, 0.667, 0],
    [0, 0.125, 0.875]
  ],
  deuteranomaly: [
    [0.8, 0.2, 0],
    [0.258, 0.742, 0],
    [0, 0.142, 0.858]
  ],
  tritanomaly: [
    [0.967, 0.033, 0],
    [0, 0.733, 0.267],
    [0, 0.183, 0.817]
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114]
  ],
  achromatomaly: [
    [0.618, 0.320, 0.062],
    [0.163, 0.775, 0.062],
    [0.163, 0.320, 0.516]
  ]
};

export const simulateColorBlindness = (hex: string, type: ColorBlindnessType): string => {
  try {
    const rgb = chroma(hex).rgb();
    const matrix = BLINDNESS_MATRICES[type];

    const r = Math.round(matrix[0][0] * rgb[0] + matrix[0][1] * rgb[1] + matrix[0][2] * rgb[2]);
    const g = Math.round(matrix[1][0] * rgb[0] + matrix[1][1] * rgb[1] + matrix[1][2] * rgb[2]);
    const b = Math.round(matrix[2][0] * rgb[0] + matrix[2][1] * rgb[1] + matrix[2][2] * rgb[2]);

    return chroma.rgb(
      Math.max(0, Math.min(255, r)),
      Math.max(0, Math.min(255, g)),
      Math.max(0, Math.min(255, b))
    ).hex();
  } catch {
    return hex;
  }
};

export const getColorBlindnessInfo = (type: ColorBlindnessType): { name: string; description: string; prevalence: string } => {
  const info = {
    protanopia: {
      name: 'Protanopia',
      description: 'Missing long-wavelength (red) photopigments',
      prevalence: '~1% of males'
    },
    deuteranopia: {
      name: 'Deuteranopia',
      description: 'Missing medium-wavelength (green) photopigments',
      prevalence: '~1% of males'
    },
    tritanopia: {
      name: 'Tritanopia',
      description: 'Missing short-wavelength (blue) photopigments',
      prevalence: '~0.002% of population'
    },
    protanomaly: {
      name: 'Protanomaly',
      description: 'Shifted long-wavelength (red) photopigments',
      prevalence: '~1% of males'
    },
    deuteranomaly: {
      name: 'Deuteranomaly',
      description: 'Shifted medium-wavelength (green) photopigments',
      prevalence: '~5% of males, ~0.4% of females'
    },
    tritanomaly: {
      name: 'Tritanomaly',
      description: 'Shifted short-wavelength (blue) photopigments',
      prevalence: '~0.01% of population'
    },
    achromatopsia: {
      name: 'Achromatopsia',
      description: 'Complete absence of color vision',
      prevalence: '~0.003% of population'
    },
    achromatomaly: {
      name: 'Achromatomaly',
      description: 'Partial absence of color vision',
      prevalence: '~0.001% of population'
    }
  };

  return info[type];
};