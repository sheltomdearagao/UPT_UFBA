import { AreaConhecimento } from "./types";

// FIX: Add missing DEFAULT_AI_PROMPT constant.
export const DEFAULT_AI_PROMPT = `You are an AI assistant specialized in correcting multiple-choice answer sheets from images.
Analyze the provided image and compare the student's answers to the official answer key below.
The official answer key is: {{ANSWER_KEY}}
For each question, determine if the student's answer is 'correct', 'incorrect', 'blank' (no answer marked), or 'multiple' (more than one answer marked).
You MUST return your response as a valid JSON object that strictly adheres to the provided schema. Do not include any text or markdown formatting before or after the JSON object.`;

export const COMPETENCY_LEVELS: { level: number; score: number }[] = [
  { level: 0, score: 0 },
  { level: 1, score: 40 },
  { level: 2, score: 80 },
  { level: 3, score: 120 },
  { level: 4, score: 160 },
  { level: 5, score: 200 },
];

// Competency 2 does not have a level 0 (score 0)
export const COMPETENCY_2_LEVELS = COMPETENCY_LEVELS.filter(l => l.level !== 0);

export const REDACAO_SITUATIONS = [
  "Em Branco",
  "Texto Insuficiente",
  "FEA",
  "Cópia",
  "Fuga ao Tema",
  "NATT",
  "PD",
];

export const AREAS_CONHECIMENTO: AreaConhecimento[] = ['Linguagens', 'Humanas', 'Natureza', 'Matemática', 'Geral'];