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
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      {/* Diagram Type Selector */}
      <div className="flex items-center gap-1.5">
        <Guitar size={16} className="text-text-secondary" />
        <select
          value={currentDiagramType}
          onChange={handleDiagramTypeChange}
          className="px-2 py-1.5 border border-border rounded-lg text-text-primary text-xs bg-surface hover:border-primary transition-colors"
        >
          <option value="6-fret">6-Fret</option>
          <option value="12-fret">12-Fret</option>
        </select>
      </div>

      {/* Grid Size Selector */}
      <div className="flex items-center gap-1.5">
        <Grid size={16} className="text-text-secondary" />
        <select
          value={getCurrentGridValue()}
          onChange={onGridChange}
          className="px-2 py-1.5 border border-border rounded-lg text-text-primary text-sm bg-surface hover:border-primary transition-colors"
        >
          {availableGridOptions.map((option) => (
            <option key={createGridValue(option)} value={createGridValue(option)}>
              {option.label}
            </option>
          ))}
        </select>
      </div>



      {/* Button Group - Fixed widths for consistency */}
      <div className="hidden md:block relative" ref={dropdownRef}>
        <button
          onClick={() => setShowActions(!showActions)}
          className="flex text-sm items-center gap-1.5 px-3 py-1.5 bg-surface-alt hover:bg-gray-100 text-text-secondary rounded-lg transition-colors"
        >
          Actions
          <ChevronDown size={14} className={showActions ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </button>

        {showActions && (
          <div className="absolute right-0 mt-1 w-44 bg-surface border border-border rounded-xl shadow-lg z-50">
            <div className="py-2">
              {isAuthenticated && (
                <button
                  onClick={() => {
                    onNewSheet();
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-secondary hover:bg-opacity-10 text-secondary transition-colors"
                >
                  <Plus size={14} /> New Sheet
                </button>
              )}
              <button
                onClick={() => {
                  onClearRequest();
                  setShowActions(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-red-50 text-red-600 transition-colors"
              >
                <Trash2 size={14} /> Clear Sheet
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    onSaveSheet();
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-green-50 text-green-600 transition-colors"
                >
                  <Save size={14} /> Save Sheet
                </button>
              )}
              <button
                onClick={() => {
                  onPreview();
                  setShowActions(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-primary hover:bg-opacity-10 text-primary transition-colors"
              >
                <Eye size={14} /> Preview & Download
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden flex gap-8 justify-center">
        {isAuthenticated && (
          <button onClick={onNewSheet} className="p-1.5 bg-secondary text-white rounded-lg hover:bg-secondary-hover transition-colors shadow-sm" title="New Sheet">
            <Plus size={16} />
          </button>
        )}
        <button onClick={onClearRequest} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm" title="Clear">
          <Trash2 size={16} />
        </button>
        {isAuthenticated && (
          <button onClick={onSaveSheet} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm" title="Save">
            <Save size={16} />
          </button>
        )}
        <button onClick={onPreview} className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-sm" title="Preview">
          <Eye size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChordSheetControls;