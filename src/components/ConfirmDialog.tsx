import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const accent = tone === 'danger'
    ? { icon: 'text-rose-400 bg-rose-500/10 border-rose-500/30', btn: 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.25)]' }
    : { icon: 'text-violet-400 bg-violet-500/10 border-violet-500/30', btn: 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-glow' };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-sm rounded-3xl border border-gray-800/80 shadow-glow p-6 animate-scaleIn relative"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${accent.icon}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>

        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">{description}</p>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-xl transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-all ${accent.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
