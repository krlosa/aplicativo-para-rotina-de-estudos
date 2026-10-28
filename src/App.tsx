import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { ObjectiveCard } from './components/ObjectiveCard';
import { ObjectiveFormModal } from './components/ObjectiveFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { storageService } from './services/storageService';
import { StudyObjective, ObjectiveFormData, ObjectiveFilter, ObjectiveStatus } from './types/objective';
import { Check, Lightbulb, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [objectives, setObjectives] = useState<StudyObjective[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados de modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<StudyObjective | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState<StudyObjective | null>(null);

  // Feedback temporário (toast/notificação amigável)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtros
  const [filter, setFilter] = useState<ObjectiveFilter>({
    status: 'todos',
    search: '',
  });

  // Carrega objetivos do localStorage na inicialização
  useEffect(() => {
    const loaded = storageService.getObjectives();
    setObjectives(loaded);
    setIsLoaded(true);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3200);
  };

  // Abrir modal de criação
  const handleOpenCreateModal = () => {
    setEditingObjective(null);
    setIsFormModalOpen(true);
  };

  // Abrir modal de edição
  const handleOpenEditModal = (obj: StudyObjective) => {
    setEditingObjective(obj);
    setIsFormModalOpen(true);
  };

  // Submissão do formulário (Criar ou Atualizar)
  const handleFormSubmit = (formData: ObjectiveFormData) => {
    if (editingObjective) {
      const updated = storageService.updateObjective(editingObjective.id, formData);
      if (updated) {
        setObjectives((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        showToast('Objetivo de estudo atualizado com sucesso!');
      }
    } else {
      const created = storageService.addObjective(formData);
      setObjectives((prev) => [created, ...prev]);
      showToast('Novo objetivo de estudo cadastrado!');
    }
    setIsFormModalOpen(false);
    setEditingObjective(null);
  };

  // Alteração direta de status
  const handleStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    const updated = storageService.updateStatus(id, newStatus);
    if (updated) {
      setObjectives((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      if (newStatus === 'concluido') {
        showToast('Parabéns! Mais um objetivo concluído 🎉');
      } else {
        showToast('Status do objetivo atualizado.');
      }
    }
  };

  // Solicitar exclusão (abre confirmação)
  const handleDeleteRequest = (obj: StudyObjective) => {
    setObjectiveToDelete(obj);
    setIsDeleteModalOpen(true);
  };

  // Confirmar exclusão
  const handleConfirmDelete = () => {
    if (objectiveToDelete) {
      const success = storageService.deleteObjective(objectiveToDelete.id);
      if (success) {
        setObjectives((prev) => prev.filter((item) => item.id !== objectiveToDelete.id));
        showToast('Objetivo excluído com sucesso.');
      }
    }
    setIsDeleteModalOpen(false);
    setObjectiveToDelete(null);
  };

  // Carregar dados de exemplo para teste rápido
  const handleLoadSamples = () => {
    const samples = storageService.loadSampleData();
    setObjectives(samples);
    showToast('Exemplos de estudos carregados com sucesso!');
  };

  // Filtragem dos objetivos
  const filteredObjectives = useMemo(() => {
    return objectives.filter((item) => {
      // Filtro por status
      if (filter.status !== 'todos' && item.status !== filter.status) {
        return false;
      }
      // Filtro por termo de busca
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }
      return true;
    });
  }, [objectives, filter]);

  const hasActiveFilters = filter.status !== 'todos' || filter.search.trim() !== '';

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-stone-500 text-sm font-medium animate-pulse">
          Carregando seus objetivos de estudo...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast de Notificação */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <Header
        onOpenNewModal={handleOpenCreateModal}
        totalObjectives={objectives.length}
      />

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-6 sm:space-y-8">
        {/* Painel com contagem e resumo */}
        <StatsBar objectives={objectives} />

        {/* Barra de Filtros e Busca (exibida se houver objetivos ou filtros ativos) */}
        {(objectives.length > 0 || hasActiveFilters) && (
          <FilterBar
            filter={filter}
            onChangeFilter={setFilter}
            objectives={objectives}
          />
        )}

        {/* Lista de Objetivos ou Estado Vazio */}
        {filteredObjectives.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
                <span>Metas em foco</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700">
                  {filteredObjectives.length} {filteredObjectives.length === 1 ? 'item' : 'itens'}
                </span>
              </h2>

              {objectives.length > 0 && (
                <button
                  onClick={handleOpenCreateModal}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  + Adicionar outro
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredObjectives.map((obj) => (
                <ObjectiveCard
                  key={obj.id}
                  objective={obj}
                  onEdit={handleOpenEditModal}
                  onDeleteRequest={handleDeleteRequest}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            isFiltered={hasActiveFilters}
            onOpenNewModal={handleOpenCreateModal}
            onClearFilter={() => setFilter({ status: 'todos', search: '' })}
            onLoadSamples={objectives.length === 0 ? handleLoadSamples : undefined}
          />
        )}

        {/* Dicas Pedagógicas para Estudantes Iniciantes */}
        <section className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-5 sm:p-6 mt-8">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-amber-950 mb-1">
                Dicas do StudyFlow para quem está começando
              </h4>
              <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed mb-3">
                Grandes conquistas são feitas de pequenos blocos de estudo diários.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-900/90">
                <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
                  <strong className="block font-semibold text-amber-950 mb-1">🎯 Metas específicas</strong>
                  Em vez de "Estudar Matemática", prefira "Resolver 5 exercícios de frações".
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
                  <strong className="block font-semibold text-amber-950 mb-1">⏱️ Prazos realistas</strong>
                  Defina datas alcançáveis para evitar frustração e manter o entusiasmo.
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
                  <strong className="block font-semibold text-amber-950 mb-1">✨ Comemore o progresso</strong>
                  Ao concluir um objetivo, marque-o como concluído para reforçar sua sensação de avanço!
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé Simples e Acolhedor */}
      <footer className="border-t border-stone-200 bg-white/70 py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-stone-700">StudyFlow</span>
            <span>— Seu organizador de estudos para iniciantes</span>
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Dados salvos automaticamente no seu navegador</span>
          </div>
        </div>
      </footer>

      {/* Modal de Criação / Edição */}
      <ObjectiveFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingObjective(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingObjective}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        objective={objectiveToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setObjectiveToDelete(null);
        }}
      />
    </div>
  );
}
