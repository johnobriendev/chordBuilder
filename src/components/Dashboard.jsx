import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserSheets, deleteSheet } from '../services/api';
import { Calendar, Trash2, FileText, Eye, Clock } from 'lucide-react';

const Dashboard = ({ onLoadSheet, onClose }) => {
  const { isAuthenticated } = useAuth0();
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);


  useEffect(() => {
    if (isAuthenticated) {
      loadUserSheets();
    }
  }, [isAuthenticated]);

  const loadUserSheets = async () => {
    try {
      setLoading(true);
      const response = await getUserSheets();
      setSheets(response.sheets || []);
    } catch (error) {
      console.error('Error loading sheets:', error);
      setError('Failed to load your sheets');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (sheet) => {
    setDeleteConfirm(sheet);
  };

  const handleDeleteSheet = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteSheet(deleteConfirm.id);
      setSheets(sheets.filter(sheet => sheet.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting sheet:', error);
      setError('Failed to delete sheet');
    }
  };

  const handleLoadSheet = async (sheet) => {
    try {
      onLoadSheet(sheet);
      onClose();
    } catch (error) {
      console.error('Error loading sheet:', error);
      setError('Failed to load sheet');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading your sheets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
        {error}
      </div>
    );
  }

  if (sheets.length === 0) {
    return (
      <div className="text-center p-8">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No saved sheets yet</h3>
        <p className="text-gray-600">Create and save your first chord sheet to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Your Saved Sheets ({sheets.length})
      </h3>

      <div className="grid gap-4">
        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-medium text-gray-900 truncate">
                  {sheet.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {sheet._count?.chords || 0} chords • {sheet.gridType} • {sheet.gridRows}x{sheet.gridCols}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    Created: {new Date(sheet.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    Updated: {formatDateTime(sheet.updatedAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleLoadSheet(sheet)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Load this sheet"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleDeleteConfirm(sheet)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete this sheet"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Sheet</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSheet}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Sheet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;