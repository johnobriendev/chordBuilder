import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface rounded-xl shadow-xl max-w-4xl w-full my-4">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className={`p-8 bg-surface-alt overflow-auto max-h-[80vh] modal-preview-content ${!actions ? 'rounded-b-xl' : ''}`}>
          {children}
        </div>
        {actions && (
          <div className="p-4 border-t border-border flex justify-end gap-2 rounded-b-xl">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
