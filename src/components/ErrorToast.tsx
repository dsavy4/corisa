'use client';

import { X, AlertCircle } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export default function ErrorToast({ message, onClose }: ErrorToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 slide-up">
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 max-w-md">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-red-400 font-medium mb-1">Error</h4>
            <p className="text-red-300 text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}