import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, CircleDashed, Clock, Calendar, AlertCircle } from 'lucide-react';
import { ObjectiveFormData, ObjectiveStatus, StudyObjective } from '../types/objective';

interface ObjectiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ObjectiveFormData) => void;
  initialData?: StudyObjective | null;
}

export const ObjectiveFormModal: React.FC<ObjectiveFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ObjectiveStatus>('nao_iniciado');
  const [error, setError] = useState<string | null>(null);

  // Inicializa os campos quando abrir ou trocar o objetivo em edição
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setDeadline(initialData.deadline || '');
      setStatus(initialData.status);
    } else {
      setTitle('');
      setDescription('');
      setDeadline('');
      setStatus('nao_iniciado');
    }
    setError(null);
  }, [initialData, isOpen]);

  // Tecla Escape para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Por favor, informe o título do seu objetivo de estudo.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
  };

  const statusOptions: Array<{
    value: ObjectiveStatus;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      value: 'nao_iniciado',
      label: 'Não iniciado',
      description: 'Ainda vou começar a estudar',
      icon: <CircleDashed className="w-4 h-4" />,
      color: 'peer-checked:border-slate-500 peer-checked:bg-slate-50 peer-checked:text-slate-900',
    },
    {
      value: 'em_andamento',
      label: 'Em andamento',
      description: 'Estudo em progresso',
      icon: <Clock className="w-4 h-4" />,
      color: 'peer-checked:border-amber-500 peer-checked:bg-amber-50 peer-checked:text-amber-900',
    },
    {
      value: 'concluido',
      label: 'Concluído',
      description: 'Objetivo finalizado com sucesso',
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: 'peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-900',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 relative my-8 animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 p-1.5 rounded-lg transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            {isEditing ? 'Atualização de Meta' : 'Novo Aprendizado'}
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            {isEditing ? 'Editar Objetivo de Estudo' : 'Cadastrar Objetivo de Estudo'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {isEditing
              ? 'Atualize as informações do seu objetivo de estudo.'
              : 'Defina o que você quer aprender, o prazo e acompanhe seu progresso.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs sm:text-sm text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-stone-800 mb-1">
              Título do objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ex.: Aprender laços de repetição (for e while)"
              maxLength={120}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
              autoFocus
            />
            <span className="text-[11px] text-stone-400 block mt-1">
              Dica: Seja específico e direto sobre o tópico que deseja dominar.
            </span>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-stone-800 mb-1">
              Descrição ou anotações <span className="text-stone-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: Assistir à aula 4 do curso, resolver os exercícios da lista e anotar dúvidas sobre 'break' e 'continue'."
              rows={3}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors resize-none"
            />
          </div>

          {/* Prazo */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-stone-500" />
              <span>Prazo de conclusão</span>
              <span className="text-stone-400 font-normal">(opcional)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
              />
              {deadline && (
                <button
                  type="button"
                  onClick={() => setDeadline('')}
                  className="px-3 py-2.5 text-xs text-stone-500 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Remover data de prazo"
                >
                  Limpar data
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-stone-800 mb-2">
              Status atual
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {statusOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="relative flex items-center gap-2.5 p-2.5 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50/40"
                >
                  <input
                    type="radio"
                    name="objective-status"
                    value={opt.value}
                    checked={status === opt.value}
                    onChange={() => setStatus(opt.value)}
                    className="accent-indigo-600"
                  />
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-600">{opt.icon}</span>
                    <span className="text-xs font-semibold text-stone-800">
                      {opt.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
