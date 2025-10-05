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

export interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'grader' | 'student';
}

export interface TemaRedacao {
    id: string;
    title: string;
    prompt: string;
}

export type RedacaoSituation = "Em Branco" | "Texto Insuficiente" | "FEA" | "Cópia" | "Fuga ao Tema" | "NATT" | "PD";

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

// Legacy type, to be removed once pages are refactored
export interface Student {
  id:string;
  name: string;
  cpf: string;
  login: string;
  password?: string;
  simulados: Simulado[];
}

// Legacy type, to be removed
export interface CorrectionResult {
  id: string;
  studentId: string;
  simuladoId: string;
  submittedAt: string;
  answerSheetUrl: string;
  score: number;
  summary: any;
  details: any[];
}

// Legacy type, to be removed
export interface Redacao {
    id: string;
    title: string;
    prompt: string;
}