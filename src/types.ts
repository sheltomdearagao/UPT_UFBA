export interface Student {
  id: string;
  name: string;
}

export type ObjectiveArea = 'Linguagens' | 'Humanas' | 'Natureza' | 'Matemática';

export interface Simulado {
  id: string;
  name: string;
}

export interface Correction {
  id: string;
  studentId: string;
  simuladoId: string;
  submittedAt: string;
  scores: {
    linguagens: number;
    humanas: number;
    natureza: number;
    matematica: number;
    redacao: number;
  };
  objectiveAverage: number;
  generalAverage: number;
}

export interface Redacao {
  id: string;
  title: string;
  prompt: string;
}

// FIX: Add missing types for unused AI correction components (e.g., CorrectionResultDisplay) to fix compilation errors.
export interface CorrectionDetail {
  question: number;
  student_answer: string;
  correct_answer: string;
  status: 'correct' | 'incorrect' | 'blank' | 'multiple';
}

export interface CorrectionResult {
  summary: {
    correct: number;
    incorrect: number;
    blank: number;
  };
  details: CorrectionDetail[];
  score: number;
}

// FIX: Add missing types for unused essay correction components (e.g., CorrigirRedacaoPage, StudentEssaysPage) to fix compilation errors.
export type RedacaoSituation = 'Fuga ao tema' | 'Texto insuficiente' | 'Cópia' | 'Outro';

export interface CorrecaoRedacao {
  id: string;
  studentId: string;
  simuladoId: string;
  submittedAt: string;
  redacaoImageUrl: string;
  scores: {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
  };
  finalScore: number;
  situation?: RedacaoSituation;
  observations?: string;
}
