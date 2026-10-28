import React from 'react';
import { Target, CircleDashed, Clock, CheckCircle2 } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface StatsBarProps {
  objectives: StudyObjective[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ objectives }) => {
  const total = objectives.length;
  const naoIniciados = objectives.filter((o) => o.status === 'nao_iniciado').length;
  const emAndamento = objectives.filter((o) => o.status === 'em_andamento').length;
  const concluidos = objectives.filter((o) => o.status === 'concluido').length;

  const percentage = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Painel Geral
          </span>
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            Resumo dos seus Estudos
          </h2>
        </div>

        {total > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-stone-500 block">Taxa de conclusão</span>
              <span className="text-sm font-bold text-emerald-600">{percentage}% das metas</span>
            </div>
            <div className="w-28 h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total cadastrados */}
        <div className="bg-stone-50 hover:bg-stone-100/80 transition-colors p-3.5 rounded-xl border border-stone-200/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-200/70 text-stone-700 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-stone-900 leading-tight">
              {total}
            </div>
            <div className="text-xs text-stone-600 font-medium">
              {total === 1 ? 'Objetivo cadastrado' : 'Objetivos cadastrados'}
            </div>
          </div>
        </div>

        {/* Não Iniciados */}
        <div className="bg-slate-50/70 hover:bg-slate-50 transition-colors p-3.5 rounded-xl border border-slate-200/70 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
            <CircleDashed className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800 leading-tight">
              {naoIniciados}
            </div>
            <div className="text-xs text-slate-600 font-medium">Não iniciados</div>
          </div>
        </div>

        {/* Em Andamento */}
        <div className="bg-amber-50/70 hover:bg-amber-50 transition-colors p-3.5 rounded-xl border border-amber-200/70 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-900 leading-tight">
              {emAndamento}
            </div>
            <div className="text-xs text-amber-700 font-medium">Em andamento</div>
          </div>
        </div>

        {/* Concluídos */}
        <div className="bg-emerald-50/70 hover:bg-emerald-50 transition-colors p-3.5 rounded-xl border border-emerald-200/70 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-900 leading-tight">
              {concluidos}
            </div>
            <div className="text-xs text-emerald-700 font-medium">Concluídos</div>
          </div>
        </div>
      </div>
    </div>
  );
};
