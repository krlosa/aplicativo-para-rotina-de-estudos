import React from 'react';
import { Search, X } from 'lucide-react';
import { ObjectiveFilter, ObjectiveStatus, StudyObjective } from '../types/objective';

interface FilterBarProps {
  filter: ObjectiveFilter;
  onChangeFilter: (filter: ObjectiveFilter) => void;
  objectives: StudyObjective[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChangeFilter,
  objectives,
}) => {
  const countAll = objectives.length;
  const countNaoIniciados = objectives.filter((o) => o.status === 'nao_iniciado').length;
  const countEmAndamento = objectives.filter((o) => o.status === 'em_andamento').length;
  const countConcluidos = objectives.filter((o) => o.status === 'concluido').length;

  const statusTabs: Array<{ id: 'todos' | ObjectiveStatus; label: string; count: number }> = [
    { id: 'todos', label: 'Todos', count: countAll },
    { id: 'nao_iniciado', label: 'Não iniciados', count: countNaoIniciados },
    { id: 'em_andamento', label: 'Em andamento', count: countEmAndamento },
    { id: 'concluido', label: 'Concluídos', count: countConcluidos },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Abas de Status */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl overflow-x-auto scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = filter.status === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeFilter({ ...filter, status: tab.id })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  isActive
                    ? 'bg-stone-100 text-stone-800'
                    : 'bg-stone-300/60 text-stone-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Campo de Busca */}
      <div className="relative w-full sm:w-64">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filter.search}
          onChange={(e) => onChangeFilter({ ...filter, search: e.target.value })}
          placeholder="Buscar objetivos..."
          className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-2xs"
        />
        {filter.search && (
          <button
            onClick={() => onChangeFilter({ ...filter, search: '' })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded cursor-pointer"
            title="Limpar busca"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
