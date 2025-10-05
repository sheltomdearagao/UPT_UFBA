-- Compatibility views to map Portuguese table names to the English names expected by the app
-- These are safe read-only views. Execute in Supabase SQL Editor.

CREATE OR REPLACE VIEW public.students AS
SELECT id, name, created_at FROM public.alunos;

CREATE OR REPLACE VIEW public.correction_results AS
SELECT id, student_id, simulado_id, submitted_at, answer_sheet_url, score, summary, details, created_at
FROM public.resultados_provas
;

-- If you have correcoes_redacao as a table, map it too
CREATE OR REPLACE VIEW public.correcoes_redacao AS
SELECT * FROM public.correcoes_redacao
;

-- If you have temas_redacao table but app expects redacoes
CREATE OR REPLACE VIEW public.redacoes AS
SELECT id, title, prompt, created_at FROM public.temas_redacao;

-- If 'simulados' already exists, no view needed; otherwise create mapping
CREATE OR REPLACE VIEW public.simulados AS
SELECT id, name, answer_key, created_at FROM public.simulados;
