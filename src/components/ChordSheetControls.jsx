import React, { useState, useRef, useEffect } from 'react';
import { Grid, Eye, Guitar, Trash2, Save, Plus, ChevronDown } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const ChordSheetControls = ({ gridConfig, onGridChange, onPreview, onClearRequest, onSaveSheet, onNewSheet }) => {
  const { isAuthenticated } = useAuth0();
  const [showActions, setShowActions] = useState(false);


  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleDiagramTypeChange = (event) => {
    const newDiagramType = event.target.value;
    const defaultGridOption = gridOptionsByType[newDiagramType][0];

    const syntheticEvent = {
      target: {
        value: createGridValue(defaultGridOption)
      }
    };

    onGridChange(syntheticEvent);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-8">
      <div className='flex gap-8'>
        {/* Diagram Type Selector */}
        <div className="flex items-center gap-2">
          <Guitar size={20} className="text-gray-600" />
          <select
            value={currentDiagramType}
            onChange={handleDiagramTypeChange}
            className="px-3 py-2 border rounded-md text-gray-700 text-sm min-w-[140px]"
          >
            <option value="6-fret">6-Fret Diagrams</option>
            <option value="12-fret">12-Fret Diagrams</option>
          </select>
        </div>

        {/* Grid Size Selector */}
        <div className="flex items-center gap-2">
          <Grid size={20} className="text-gray-600" />
          <select
            value={getCurrentGridValue()}
            onChange={onGridChange}
            className="px-3 py-2 border rounded-md text-gray-700 text-sm min-w-[100px]"
          >
            {availableGridOptions.map((option) => (
              <option key={createGridValue(option)} value={createGridValue(option)}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>



      {/* Button Group - Fixed widths for consistency */}
      <div className="hidden md:block relative" ref={dropdownRef}>
        <button
          onClick={() => setShowActions(!showActions)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
        >
          Actions
          <ChevronDown size={16} className={showActions ? 'rotate-180' : ''} />
        </button>

        {showActions && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
            <div className="py-2">
              {isAuthenticated && (
                <button
                  onClick={() => {
                    onNewSheet();
                    setShowActions(false); 
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-purple-50 text-purple-600"
                >
                  <Plus size={16} /> New Sheet
                </button>
              )}
              <button
                onClick={() => {
                  onClearRequest();
                  setShowActions(false); 
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-red-50 text-red-600"
              >
                <Trash2 size={16} /> Clear Sheet
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    onSaveSheet();
                    setShowActions(false); 
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-green-50 text-green-600"
                >
                  <Save size={16} /> Save Sheet
                </button>
              )}
              <button
                onClick={() => {
                  onPreview();
                  setShowActions(false); 
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-blue-50 text-blue-600"
              >
                <Eye size={16} /> Preview & Download
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden flex gap-8 justify-center">
        {isAuthenticated && (
          <button onClick={onNewSheet} className="p-2 bg-purple-500 text-white rounded" title="New Sheet">
            <Plus size={18} />
          </button>
        )}
        <button onClick={onClearRequest} className="p-2 bg-red-500 text-white rounded" title="Clear">
          <Trash2 size={18} />
        </button>
        {isAuthenticated && (
          <button onClick={onSaveSheet} className="p-2 bg-green-500 text-white rounded" title="Save">
            <Save size={18} />
          </button>
        )}
        <button onClick={onPreview} className="p-2 bg-blue-500 text-white rounded" title="Preview">
          <Eye size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChordSheetControls;