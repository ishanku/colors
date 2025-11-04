import Papa from 'papaparse';
import { Color, convertColor } from './colorUtils';

export const exportToCSV = (palette: Color[], paletteName: string): void => {
  const csvData = palette.map((color, index) => {
    const formats = convertColor(color.hex);
    return {
      'Palette Name': paletteName,
      'Color Index': index + 1,
      'Color Name': color.name || `Color ${index + 1}`,
      'HEX': formats.hex,
      'RGB': formats.rgb,
      'HSL': formats.hsl,
      'CMYK': formats.cmyk,
      'LAB': formats.lab,
      'Generated On': new Date().toLocaleDateString()
    };
  });

  const csv = Papa.unparse(csvData, {
    header: true,
    delimiter: ',',
    newline: '\n'
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const fileName = `${paletteName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_palette.csv`;
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};