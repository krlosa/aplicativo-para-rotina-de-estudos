import React from 'react';
import {
  Calendar,
  Pencil,
  Trash2,
  CheckCircle2,
  CircleDashed,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { ObjectiveStatus, StudyObjective } from '../types/objective';

interface ObjectiveCardProps {
  objective: StudyObjective;
  onEdit: (objective: StudyObjective) => void;
  onDeleteRequest: (objective: StudyObjective) => void;
  onStatusChange: (id: string, status: ObjectiveStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  // Configuração visual de cada status
  const statusConfig: Record<
    ObjectiveStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    nao_iniciado: {
      label: 'Não iniciado',
      bg: 'bg-slate-100/90',
      text: 'text-slate-700',
      border: 'border-slate-200',
      icon: <CircleDashed className="w-3.5 h-3.5" />,
    },
    em_andamento: {
      label: 'Em andamento',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200/80',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    concluido: {
      label: 'Concluído',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
  };

  const currentStatus = statusConfig[objective.status];

  // Cálculo de prazo e alerta
  const formatDeadline = (dateStr: string) => {
    if (!dateStr) return { formatted: 'Sem prazo definido', isOverdue: false, isToday: false };

    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const deadlineDate = new Date(year, month - 1, day);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const target = new Date(deadlineDate);
      target.setHours(0, 0, 0, 0);

      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const formatted = deadlineDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const isOverdue = diffDays < 0 && objective.status !== 'concluido';
      const isToday = diffDays === 0;

      return {
        formatted,
        diffDays,
        isOverdue,
        isToday,
      };
    } catch {
      return { formatted: dateStr, isOverdue: false, isToday: false };
    }
  };

  const deadlineInfo = formatDeadline(objective.deadline);

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md ${
        objective.status === 'concluido'
          ? 'border-emerald-200/60 bg-emerald-50/20'
          : deadlineInfo.isOverdue
          ? 'border-rose-200 hover:border-rose-300'
          : 'border-stone-200/80 hover:border-indigo-200'
      }`}
    >
      <div>
        {/* Cabeçalho do Card: Status + Ações Rápidas */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="relative inline-block">
            <select
              value={objective.status}
              onChange={(e) => onStatusChange(objective.id, e.target.value as ObjectiveStatus)}
              className={`appearance-none inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border} cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 pr-6`}
              title="Clique para alterar status rapidamente"
            >
              <option value="nao_iniciado">⚪ Não iniciado</option>
              <option value="em_andamento">🟡 Em andamento</option>
              <option value="concluido">🟢 Concluído</option>
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-current opacity-60 text-[10px]">
              ▼
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(objective)}
              className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Editar objetivo"
              aria-label={`Editar ${objective.title}`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteRequest(objective)}
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label={`Excluir ${objective.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-bold tracking-tight text-stone-900 mb-2 leading-snug ${
            objective.status === 'concluido' ? 'line-through text-stone-500' : ''
          }`}
        >
          {objective.title}
        </h3>

        {/* Descrição */}
        {objective.description ? (
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 mb-4 leading-relaxed font-normal">
            {objective.description}
          </p>
        ) : (
          <p className="text-xs text-stone-400 italic mb-4">Sem descrição adicional</p>
        )}
      </div>

      {/* Rodapé do Card: Prazo e Botão de Conclusão Rápida */}
      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          {objective.deadline ? (
            <span
              className={`font-medium ${
                deadlineInfo.isOverdue
                  ? 'text-rose-600 font-semibold flex items-center gap-1'
                  : deadlineInfo.isToday
                  ? 'text-amber-600 font-semibold'
                  : 'text-stone-600'
              }`}
            >
              {deadlineInfo.isOverdue && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
              {deadlineInfo.formatted}
              {deadlineInfo.isOverdue && ' (Atrasado)'}
              {deadlineInfo.isToday && ' (Hoje!)'}
            </span>
          ) : (
            <span className="text-stone-400">Sem prazo</span>
          )}
        </div>

        {/* Ação rápida de marcar como concluído */}
        {objective.status !== 'concluido' ? (
          <button
            onClick={() => onStatusChange(objective.id, 'concluido')}
            className="text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100/90 active:scale-95 px-2.5 py-1 rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Concluir</span>
          </button>
        ) : (
          <button
            onClick={() => onStatusChange(objective.id, 'em_andamento')}
            className="text-[11px] font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Reabrir</span>
          </button>
        )}
      </div>
    </div>
  );
};
