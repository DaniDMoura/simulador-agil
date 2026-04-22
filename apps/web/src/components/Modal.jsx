import React from "react";
import { X } from "lucide-react";

const Modal = ({ title, children, footer, onClose, maxWidth = "max-w-md" }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-fadeIn" 
        onClick={onClose}
        role="button"
        aria-label="Close modal backdrop"
      />
      
      {/* Modal Container */}
      <div className={`relative bg-neutral-800 w-full ${maxWidth} rounded-2xl shadow-2xl overflow-hidden animate-slideUp border border-neutral-700/50`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-semibold text-text tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 cursor-pointer hover:text-white hover:bg-neutral-700 rounded-lg transition-all duration-200 active:scale-95"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 pt-4 border-t border-neutral-700/50 bg-neutral-800/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
