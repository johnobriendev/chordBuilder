import React, { useState } from 'react';
import { Grid } from 'lucide-react';


// Separate controls component
const ChordSheetControls = ({ gridConfig, onGridChange, onExport, onPreview }) => {
  const gridOptions = [
    { label: '4 x 4', rows: 4, cols: 4 },
    { label: '6 x 6', rows: 6, cols: 6 },
    { label: '8 x 8', rows: 8, cols: 8 }
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Grid size={20} className="text-gray-600" />
        <select
          value={`${gridConfig.cols}x${gridConfig.rows}`}
          onChange={onGridChange}
          className="px-3 py-2 border rounded-md text-gray-700 text-sm"
        >
          {gridOptions.map((option) => (
            <option key={option.label} value={`${option.cols}x${option.rows}`}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button 
        onClick={onPreview}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Preview PDF
      </button>
      <button 
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Export PDF
      </button>
    </div>
  );
};

export default ChordSheetControls;