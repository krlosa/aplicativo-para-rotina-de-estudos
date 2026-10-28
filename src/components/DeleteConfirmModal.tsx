import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  objective: StudyObjective | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  objective,
  onConfirm,
  onCancel,
}) => {
  // Fechar com a tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !objective) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="flex-1 pr-4">
            <h3
              id="delete-modal-title"
              className="text-lg font-bold text-stone-900 mb-1"
            >
              Excluir objetivo de estudo?
            </h3>
            <p className="text-sm text-stone-600 mb-2 leading-relaxed">
              Você tem certeza de que deseja excluir este objetivo?
            </p>
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 my-3">
              <span className="text-xs text-stone-400 block mb-0.5">Objetivo selecionado:</span>
              <p className="text-sm font-semibold text-stone-800 line-clamp-2">
                {objective.title}
              </p>
            </div>
            <p className="text-xs text-stone-400">
              Esta ação removerá o objetivo do seu armazenamento local e não poderá ser desfeita.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
};
