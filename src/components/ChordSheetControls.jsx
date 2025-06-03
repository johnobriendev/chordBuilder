import React from 'react';
import { Grid, Eye, Guitar, Trash2, Save } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const ChordSheetControls = ({ gridConfig, onGridChange, onPreview, onClearRequest, onSaveSheet }) => {
  const { isAuthenticated } = useAuth0();
  
  
  // Organize options by diagram type for better UX
  const gridOptionsByType = {
    '6-fret': [
      { label: '4 x 4', rows: 4, cols: 4, diagramType: '6-fret' },
      { label: '6 x 6', rows: 6, cols: 6, diagramType: '6-fret' },
      { label: '8 x 8', rows: 8, cols: 8, diagramType: '6-fret' }
    ],
    '12-fret': [
      { label: '2 x 1', rows: 1, cols: 2, diagramType: '12-fret' },
      { label: '2 x 2', rows: 2, cols: 2, diagramType: '12-fret' }
    ]
  };

  const currentDiagramType = gridConfig.diagramType || '6-fret';
  const availableGridOptions = gridOptionsByType[currentDiagramType] || gridOptionsByType['6-fret'];

  const createGridValue = (option) => `${option.cols}x${option.rows}-${option.diagramType}`;

  const getCurrentGridValue = () => {
    const constructedValue = `${gridConfig.cols}x${gridConfig.rows}-${currentDiagramType}`;
    const matchingOption = availableGridOptions.find(opt => createGridValue(opt) === constructedValue);
    return matchingOption ? constructedValue : createGridValue(availableGridOptions[0]);
  };

  // Handle diagram type change - this will also reset to first grid option of that type
  const handleDiagramTypeChange = (event) => {
    const newDiagramType = event.target.value;
    const defaultGridOption = gridOptionsByType[newDiagramType][0];

    // Create a synthetic event to trigger grid change with the default option for this type
    const syntheticEvent = {
      target: {
        value: createGridValue(defaultGridOption)
      }
    };

    onGridChange(syntheticEvent);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Diagram Type Selector */}
      <div className="flex items-center gap-2">
        <Guitar size={20} className="text-gray-600" />
        <select
          value={currentDiagramType}
          onChange={handleDiagramTypeChange}
          className="px-3 py-2 border rounded-md text-gray-700 text-sm"
        >
          <option value="6-fret">6-Fret Diagrams</option>
          <option value="12-fret">12-Fret Diagrams</option>
        </select>
      </div>

      {/* Grid Size Selector - options change based on diagram type */}
      <div className="flex items-center gap-2">
        <Grid size={20} className="text-gray-600" />
        <select
          value={getCurrentGridValue()}
          onChange={onGridChange}
          className="px-3 py-2 border rounded-md text-gray-700 text-sm"
        >
          {availableGridOptions.map((option) => (
            <option key={createGridValue(option)} value={createGridValue(option)}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onClearRequest}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        title="Clear all chords from the sheet"
      >
        <Trash2 size={16} />
        Clear Sheet
      </button>

       {isAuthenticated && (
        <button
          onClick={onSaveSheet}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          title="Save sheet to your account"
        >
          <Save size={16} />
          Save Sheet
        </button>
      )}

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