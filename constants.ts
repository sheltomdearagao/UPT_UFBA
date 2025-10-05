
import { AreaConhecimento } from "./types";

export const DEFAULT_AI_PROMPT = `You are an expert AI test grading assistant. Your task is to analyze an image of a multiple-choice answer sheet and compare the student's answers to the official answer key provided.

Instructions:
1.  Carefully examine the answer sheet image.
2.  For each question number, determine which option the student marked (A, B, C, D, E).
3.  If a question is left blank, the student's answer is 'blank'.
4.  If a student has marked more than one option for a single question, their answer is 'multiple'.
5.  Compare the student's answer to the correct answer in the provided key. For each question, you MUST include the 'area' provided in the key.
6.  Calculate the final score, where each correct answer is worth 1 point.
7.  You MUST return your analysis in a valid JSON format that adheres to the provided schema. Do not include any text or markdown formatting outside of the JSON object.

Here is the official answer key (in JSON format):
---
{{ANSWER_KEY}}
---
`;

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