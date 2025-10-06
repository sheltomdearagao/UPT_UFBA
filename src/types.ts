
export interface Student {
  id: string;
  name: string;
}

export type AreaConhecimento = 'Linguagens' | 'Humanas' | 'Natureza' | 'Matemática' | 'Geral';

export interface AnswerKeyItem {
  question: number;
  answer: string;
  area: AreaConhecimento;
}

export interface Simulado {
  id: string;
  name: string;
  answerKey: AnswerKeyItem[];
}

export interface CorrectionDetail {
  question: number;
  student_answer: string;
  correct_answer: string;
  status: 'correct' | 'incorrect' | 'blank' | 'multiple';
  area: AreaConhecimento;
}

export interface CorrectionSummary {
  correct: number;
  incorrect: number;
  blank: number;
  multiple: number;
}

export interface CorrectionResult {
  id: string;
  studentId: string;
  simuladoId: string;
  submittedAt: string; // Using string for easier serialization in localStorage
  answerSheetUrl: string; // Base64 data URL
  score: number;
  summary: CorrectionSummary;
  details: CorrectionDetail[];
}

// FIX: Add Redacao interface for essay topics
export interface Redacao {
  id: string;
  title: string;
  prompt: string;
}

// New types for Manual Essay Correction
export type RedacaoSituation = 'Em Branco' | 'Texto Insuficiente' | 'FEA' | 'Cópia' | 'Fuga ao Tema' | 'NATT' | 'PD';

export interface CorrecaoRedacao {
  id: string;
  studentId: string;
  simuladoId: string; // Associate with a simulado for reporting
  submittedAt: string;
  redacaoImageUrl: string; // Base64 URL of the essay image
  scores: {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
  };
  finalScore: number;
  situation?: RedacaoSituation;
  observations?: string; // Optional field for grader's observations
}