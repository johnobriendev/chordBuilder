import React, { useState } from 'react';
import { Grid } from 'lucide-react';
import GuitarDiagram from './components/GuitarDiagram';
import ChordDisplay from './components/ChordDisplay';

// Separate controls component
const ChordSheetControls = ({ gridConfig, onGridChange, onExport }) => {
  const gridOptions = [
    { label: '4 x 4', rows: 4, cols: 4 },
    { label: '6 x 6', rows: 6, cols: 6 },
    { label: '8 x 8', rows: 8, cols: 8 }
  ];

  return (
    <div className="flex items-center justify-between mb-4">
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
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default ChordSheetControls;