import { StudyObjective, ObjectiveFormData, ObjectiveStatus } from '../types/objective';

const STORAGE_KEY = 'studyflow_objectives_v1';

export const SAMPLE_OBJECTIVES: StudyObjective[] = [
  {
    id: 'sample-1',
    title: 'Aprender variáveis e tipos primitivos em JavaScript',
    description: 'Compreender a diferença entre let, const e var, e praticar tipos como string, number e boolean.',
    deadline: '2026-11-05',
    status: 'em_andamento',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Revisar regras de concordância verbal para a redação',
    description: 'Fazer um mapa mental dos casos especiais do verbo haver e verbos impessoais.',
    deadline: '2026-11-12',
    status: 'nao_iniciado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Instalar o VS Code e configurar o ambiente de estudos',
    description: 'Instalar extensões recomendadas (Prettier, tema agradável) e testar o primeiro arquivo.',
    deadline: '2026-10-30',
    status: 'concluido',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém todos os objetivos armazenados no localStorage.
   */
  getObjectives(): StudyObjective[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveObjectives(objectives: StudyObjective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria e salva um novo objetivo.
   */
  addObjective(data: ObjectiveFormData): StudyObjective {
    const current = this.getObjectives();
    const newObjective: StudyObjective = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `obj-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newObjective, ...current];
    this.saveObjectives(updated);
    return newObjective;
  },

  /**
   * Atualiza um objetivo existente.
   */
  updateObjective(id: string, data: Partial<ObjectiveFormData>): StudyObjective | null {
    const current = this.getObjectives();
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedObjective: StudyObjective = {
      ...current[index],
      ...data,
      title: data.title !== undefined ? data.title.trim() : current[index].title,
      description: data.description !== undefined ? data.description.trim() : current[index].description,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedObjective;
    this.saveObjectives(current);
    return updatedObjective;
  },

  /**
   * Altera apenas o status de um objetivo.
   */
  updateStatus(id: string, status: ObjectiveStatus): StudyObjective | null {
    return this.updateObjective(id, { status });
  },

  /**
   * Exclui um objetivo pelo ID.
   */
  deleteObjective(id: string): boolean {
    const current = this.getObjectives();
    const filtered = current.filter((item) => item.id !== id);
    if (filtered.length === current.length) return false;
    this.saveObjectives(filtered);
    return true;
  },

  /**
   * Carrega dados de exemplo para o usuário testar a aplicação.
   */
  loadSampleData(): StudyObjective[] {
    this.saveObjectives(SAMPLE_OBJECTIVES);
    return SAMPLE_OBJECTIVES;
  },

  /**
   * Limpa todos os dados armazenados.
   */
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
    }
  },
};
