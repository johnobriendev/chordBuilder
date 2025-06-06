import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-300 rounded-lg shadow-xl max-w-4xl w-full my-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-8 bg-stone-200 overflow-auto max-h-[80vh] modal-preview-content">
          {children}
        </div>
        {actions && (
          <div className="p-4 border-t flex justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
