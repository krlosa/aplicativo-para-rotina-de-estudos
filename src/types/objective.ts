export type ObjectiveStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyObjective {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD ou vazio
  status: ObjectiveStatus;
  createdAt: string;
  updatedAt: string;
}

export type ObjectiveFormData = {
  title: string;
  description: string;
  deadline: string;
  status: ObjectiveStatus;
};

export interface ObjectiveFilter {
  status: 'todos' | ObjectiveStatus;
  search: string;
}
