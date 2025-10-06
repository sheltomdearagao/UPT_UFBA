
import { AreaConhecimento } from "./types";

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
