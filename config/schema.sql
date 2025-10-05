-- Students table
CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simulados table
CREATE TABLE simulados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    answer_key JSONB NOT NULL, -- Stores the AnswerKeyItem[] as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Correction results table (for multiple-choice tests)
CREATE TABLE correction_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    simulado_id UUID REFERENCES simulados(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    answer_sheet_url TEXT, -- Base64 data URL
    score INTEGER NOT NULL,
    summary JSONB NOT NULL, -- Stores CorrectionSummary as JSON
    details JSONB NOT NULL, -- Stores CorrectionDetail[] as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Essay topics table
CREATE TABLE redacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Essay corrections table
CREATE TABLE correcoes_redacao (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    simulado_id UUID REFERENCES simulados(id) ON DELETE CASCADE, -- Associate with a simulado
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    redacao_image_url TEXT, -- Base64 URL of the essay image
    scores JSONB NOT NULL, -- Stores the scores object as JSON {c1, c2, c3, c4, c5}
    final_score NUMERIC NOT NULL,
    situation TEXT, -- RedacaoSituation
    observations TEXT, -- Optional field for grader's observations
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_correction_results_student_id ON correction_results(student_id);
CREATE INDEX idx_correction_results_simulado_id ON correction_results(simulado_id);
CREATE INDEX idx_correcoes_redacao_student_id ON correcoes_redacao(student_id);
CREATE INDEX idx_correcoes_redacao_simulado_id ON correcoes_redacao(simulado_id);