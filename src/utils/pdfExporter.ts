import jsPDF from 'jspdf';
import { Color, convertColor } from './colorUtils';

export const exportToPDF = async (palette: Color[], paletteName: string): Promise<void> => {
  const pdf = new jsPDF();
  const pageHeight = pdf.internal.pageSize.getHeight();

  let yPosition = 20;
  const margin = 20;
  const colorBoxSize = 30;
  const spacing = 10;

  pdf.setFontSize(20);
  pdf.text(paletteName, margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(12);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 10;

  pdf.text(`Colors: ${palette.length}`, margin, yPosition);
  yPosition += 20;

  palette.forEach((color, index) => {
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 20;
    }

    const formats = convertColor(color.hex);

    const colorR = parseInt(color.hex.slice(1, 3), 16);
    const colorG = parseInt(color.hex.slice(3, 5), 16);
    const colorB = parseInt(color.hex.slice(5, 7), 16);

    pdf.setFillColor(colorR, colorG, colorB);
    pdf.rect(margin, yPosition, colorBoxSize, colorBoxSize, 'F');

    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margin, yPosition, colorBoxSize, colorBoxSize, 'S');

    const textX = margin + colorBoxSize + spacing;

    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(color.name || `Color ${index + 1}`, textX, yPosition + 10);

    pdf.setFontSize(10);
    let textY = yPosition + 20;

    pdf.text(`HEX: ${formats.hex}`, textX, textY);
    textY += 6;
    pdf.text(`RGB: ${formats.rgb}`, textX, textY);
    textY += 6;
    pdf.text(`HSL: ${formats.hsl}`, textX, textY);
    textY += 6;
    pdf.text(`CMYK: ${formats.cmyk}`, textX, textY);
    textY += 6;
    pdf.text(`LAB: ${formats.lab}`, textX, textY);

    yPosition += colorBoxSize + spacing + 10;
  });

  const fileName = `${paletteName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_palette.pdf`;
  pdf.save(fileName);
};