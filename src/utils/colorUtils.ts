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
    return color.luminance() > 0.5 ? '#000000' : '#ffffff';
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