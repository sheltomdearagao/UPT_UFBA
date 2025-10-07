import type { RedacaoSituation } from './types';

export const SCORE_AREAS = [
    { id: 'linguagens', name: 'Linguagens' },
    { id: 'humanas', name: 'Ciências Humanas' },
    { id: 'natureza', name: 'Ciências da Natureza' },
    { id: 'matematica', name: 'Matemática' },
    { id: 'redacao', name: 'Redação' },
] as const;

export const OBJECTIVE_SCORE_AREAS = SCORE_AREAS.filter(area => area.id !== 'redacao');

// FIX: Add missing constant for unused SettingsPage.tsx component to fix compilation error.
export const DEFAULT_AI_PROMPT = `You are an AI assistant for correcting tests. Your goal is to identify the number of correct, incorrect, and blank answers based on a provided answer key and a student's answer sheet.

ANSWER KEY:
{{ANSWER_KEY}}

Analyze the student's answer sheet and return a JSON object with the following structure:
{
  "summary": {
    "correct": <number>,
    "incorrect": <number>,
    "blank": <number>
  },
  "details": [
    { "question": <number>, "student_answer": "<A|B|C|D|E|blank|multiple>", "correct_answer": "<A|B|C|D|E>", "status": "<correct|incorrect|blank|multiple>" }
  ],
  "score": <number>
}
- "blank" status is for questions left unanswered.
- "multiple" status is for questions with more than one answer marked.
- The final score is the number of correct answers.`;

// FIX: Add missing constants for unused CorrigirRedacaoPage.tsx component to fix compilation error.
export const COMPETENCY_LEVELS = [
    { level: 0, score: 0 },
    { level: 1, score: 40 },
    { level: 2, score: 80 },
    { level: 3, score: 120 },
    { level: 4, score: 160 },
    { level: 5, score: 200 },
];

export const COMPETENCY_2_LEVELS = [
    { level: 0, score: 0 },
    { level: 1, score: 40 },
    { level: 2, score: 80 },
    { level: 3, score: 120 },
    { level: 4, score: 160 },
    { level: 5, score: 200 },
];

export const REDACAO_SITUATIONS: RedacaoSituation[] = ['Fuga ao tema', 'Texto insuficiente', 'Cópia', 'Outro'];
