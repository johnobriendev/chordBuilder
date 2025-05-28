import React, { useState } from 'react';
import { Grid, Eye } from 'lucide-react';

// Separate controls component with extended grid options
const ChordSheetControls = ({ gridConfig, onGridChange, onPreview }) => {
  // Extended grid options that include diagram type information
  const gridOptions = [
    // 6-fret diagram options (original functionality)
    { label: '4 x 4 (6-fret)', rows: 4, cols: 4, diagramType: '6-fret' },
    { label: '6 x 6 (6-fret)', rows: 6, cols: 6, diagramType: '6-fret' },
    { label: '8 x 8 (6-fret)', rows: 8, cols: 8, diagramType: '6-fret' },
    
    // 12-fret diagram options (new functionality)
    { label: '2 x 1 (12-fret)', rows: 1, cols: 2, diagramType: '12-fret' },
    { label: '2 x 2 (12-fret)', rows: 2, cols: 2, diagramType: '12-fret' }
  ];

  // Create a unique value for each grid option that includes diagram type
  const createGridValue = (option) => `${option.cols}x${option.rows}-${option.diagramType}`;
  
  // This is the fixed version - it properly handles the diagramType formatting
  const getCurrentValue = () => {
    // The gridConfig.diagramType comes in as "6-fret" or "12-fret" 
    // We need to make sure we match exactly what our options expect
    const currentDiagramType = gridConfig.diagramType || '6-fret';
    const constructedValue = `${gridConfig.cols}x${gridConfig.rows}-${currentDiagramType}`;
    
    // Debug logging to help understand what's happening (remove in production)
    console.log('Current gridConfig:', gridConfig);
    console.log('Constructed value:', constructedValue);
    console.log('Available options:', gridOptions.map(opt => createGridValue(opt)));
    
    // Verify this value exists in our options
    const matchingOption = gridOptions.find(opt => createGridValue(opt) === constructedValue);
    if (!matchingOption) {
      console.warn('No matching option found for:', constructedValue);
      // Fallback to first option if no match found
      return createGridValue(gridOptions[0]);
    }
    
    return constructedValue;
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="flex items-center gap-2">
        <Grid size={20} className="text-gray-600" />
        <select
          value={getCurrentValue()}
          onChange={onGridChange}
          className="w-full sm:w-auto px-3 py-2 border rounded-md text-gray-700 text-sm"
        >
          {gridOptions.map((option) => (
            <option key={createGridValue(option)} value={createGridValue(option)}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button 
        onClick={onPreview}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <Eye size={16} />
        Preview & Download PDF
      </button>
    </div>
  );
};

export default ChordSheetControls;