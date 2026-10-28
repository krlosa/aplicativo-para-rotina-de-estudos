import React from 'react';
import { BookOpenCheck, SearchX, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenNewModal: () => void;
  onClearFilter?: () => void;
  onLoadSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenNewModal,
  onClearFilter,
  onLoadSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xs">
        <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-stone-500">
          <SearchX className="w-7 h-7 stroke-[1.8]" />
        </div>
        <h3 className="text-lg font-bold text-stone-800 mb-2">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-stone-500 mb-6 leading-relaxed">
          Não encontramos nenhum objetivo correspondente aos filtros ou ao termo de busca digitado.
        </p>
        {onClearFilter && (
          <button
            onClick={onClearFilter}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Limpar filtros e busca
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
      <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-xs">
        <BookOpenCheck className="w-8 h-8 stroke-[1.8]" />
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-3 border border-indigo-100/70">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        Sua jornada começa aqui
      </span>
      <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2 tracking-tight">
        Nenhum objetivo de estudo cadastrado ainda
      </h3>
      <p className="text-sm sm:text-base text-stone-500 mb-8 max-w-md mx-auto leading-relaxed">
        Definir metas claras é o segredo para manter a constância nos estudos. Cadastre seu primeiro tema para começar a acompanhar seu progresso!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenNewModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Primeiro Objetivo</span>
        </button>

        {onLoadSamples && (
          <button
            onClick={onLoadSamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-stone-700 text-sm font-medium rounded-xl transition-all cursor-pointer"
            title="Carrega 3 exemplos de estudo prontos para você testar"
          >
            <Sparkles className="w-4 h-4 text-stone-500" />
            <span>Carregar Exemplos de Estudo</span>
          </button>
        )}
      </div>
    </div>
  );
};
