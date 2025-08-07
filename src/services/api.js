const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let getToken = null;

export const setTokenGetter = (tokenFunction) => {
  getToken = tokenFunction;
};

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  let token = null;
  if (getToken) {
    try {
      token = await getToken({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }
      });
      console.log('Got token:', token ? 'Token received' : 'No token'); // Debug log
    } catch (error) {
      console.error('Error getting token:', error);
    }
  }

  console.log('Making API request to:', url); // Debug log

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  console.log('Request headers:', config.headers); // Debug log

  const response = await fetch(url, config);

  if (!response.ok) {
    console.error('API Error Response:', response.status, response.statusText);
    const errorText = await response.text();
    console.error('Error details:', errorText);
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// User endpoints
export const getCurrentUser = () => request('/users/me');

// Sheet endpoints
export const getUserSheets = () => request('/sheets');

export const createSheet = (sheetData) => {
  console.log('Creating sheet with data:', sheetData);
  return request('/sheets', {
    method: 'POST',
    body: JSON.stringify(sheetData),
  });
};

export const getSheet = (id) => request(`/sheets/${id}`);

export const updateSheet = (id, sheetData) => request(`/sheets/${id}`, {
  method: 'PUT',
  body: JSON.stringify(sheetData),
});

export const deleteSheet = (id) => request(`/sheets/${id}`, {
  method: 'DELETE',
});

export const duplicateSheet = async (originalSheetId, newTitle) => {
  const originalSheet = await getSheet(originalSheetId);
  return createSheet({
    title: newTitle,
    description: originalSheet.sheet.description,
    gridType: originalSheet.sheet.gridType,
    gridRows: originalSheet.sheet.gridRows,
    gridCols: originalSheet.sheet.gridCols,
    chords: originalSheet.sheet.chords.map((chord, index) => ({
      title: chord.title,
      positionInSheet: index,
      numStrings: chord.numStrings,
      numFrets: chord.numFrets,
      fretNumbers: chord.fretNumbers,
      notes: chord.notes,
      openStrings: chord.openStrings,
      rootNotes: chord.rootNotes || []
    }))
  });
};