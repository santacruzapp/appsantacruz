export interface Ensalamento {
  semestre: string;
  curso: string;
  periodo: string;
  disciplina: string;
  professor: string;
  dia: string;
  horario: string;
  sala: string;
  turno: string;
}

export interface Evento {
  titulo: string;
  data: string;
  horario: string;
  descricao: string;
  local: string;
}

export interface FAQItem {
  pergunta: string;
  resposta: string;
  categoria: string;
}

export type View = 'home' | 'ensalamento' | 'eventos' | 'faq';
