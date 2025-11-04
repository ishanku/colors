import React from 'react';
import { Color } from '../utils/colorUtils';
import { exportToPDF } from '../utils/pdfExporter';
import { exportToCSV } from '../utils/csvExporter';
import './ExportControls.css';

interface ExportControlsProps {
  palette: Color[];
  paletteName: string;
}

const ExportControls: React.FC<ExportControlsProps> = ({ palette, paletteName }) => {
  const handlePDFExport = async () => {
    try {
      await exportToPDF(palette, paletteName);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleCSVExport = () => {
    try {
      exportToCSV(palette, paletteName);
    } catch (error) {
      console.error('Failed to export CSV:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  return (
    <div className="export-controls">
      <h3>Export Palette</h3>
      <div className="export-buttons">
        <button onClick={handlePDFExport} className="export-btn pdf-btn">
          📄 Export as PDF
        </button>
        <button onClick={handleCSVExport} className="export-btn csv-btn">
          📊 Export as CSV
        </button>
      </div>
      <p className="export-info">
        Export includes palette name, color names, and all color formats (HEX, RGB, HSL, CMYK, LAB)
      </p>
    </div>
  );
};

export default ExportControls;