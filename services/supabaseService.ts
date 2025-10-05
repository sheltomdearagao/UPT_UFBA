import { supabase } from '../config/supabase';
import { 
  Student, 
  Simulado, 
  AnswerKeyItem, 
  CorrectionResult, 
  CorrectionSummary, 
  CorrectionDetail,
  Redacao,
  CorrecaoRedacao,
  RedacaoSituation 
} from '../types';

// Students operations
export const studentService = {
  async getAllStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching students:', error);
      throw new Error('Failed to fetch students');
    }

    return data || [];
  },

  async getStudentById(id: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      console.error('Error fetching student:', error);
      throw new Error('Failed to fetch student');
    }

    return data;
  },

  async createStudent(student: Omit<Student, 'id'>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert([{ ...student }])
      .select()
      .single();

    if (error) {
      console.error('Error creating student:', error);
      throw new Error('Failed to create student');
    }

    return data;
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating student:', error);
      throw new Error('Failed to update student');
    }

    return data;
  },

  async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting student:', error);
      throw new Error('Failed to delete student');
    }
  },
};

// Simulados operations
export const simuladoService = {
  async getAllSimulados(): Promise<Simulado[]> {
    const { data, error } = await supabase
      .from('simulados')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching simulados:', error);
      throw new Error('Failed to fetch simulados');
    }

    return data?.map(item => ({
      id: item.id,
      name: item.name,
      answerKey: item.answer_key as AnswerKeyItem[]
    })) || [];
  },

  async getSimuladoById(id: string): Promise<Simulado | null> {
    const { data, error } = await supabase
      .from('simulados')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      console.error('Error fetching simulado:', error);
      throw new Error('Failed to fetch simulado');
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      answerKey: data.answer_key as AnswerKeyItem[]
    };
  },

  async createSimulado(simulado: Omit<Simulado, 'id'>): Promise<Simulado> {
    const { data, error } = await supabase
      .from('simulados')
      .insert([{ 
        name: simulado.name, 
        answer_key: simulado.answerKey 
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating simulado:', error);
      throw new Error('Failed to create simulado');
    }

    return {
      id: data.id,
      name: data.name,
      answerKey: data.answer_key as AnswerKeyItem[]
    };
  },

  async updateSimulado(id: string, updates: Partial<Simulado>): Promise<Simulado> {
    const { data, error } = await supabase
      .from('simulados')
      .update({ 
        name: updates.name,
        answer_key: updates.answerKey
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating simulado:', error);
      throw new Error('Failed to update simulado');
    }

    return {
      id: data.id,
      name: data.name,
      answerKey: data.answer_key as AnswerKeyItem[]
    };
  },

  async deleteSimulado(id: string): Promise<void> {
    const { error } = await supabase
      .from('simulados')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting simulado:', error);
      throw new Error('Failed to delete simulado');
    }
  },
};

// Correction Results operations
export const correctionService = {
  async getAllCorrectionResults(): Promise<CorrectionResult[]> {
    const { data, error } = await supabase
      .from('correction_results')
      .select(`
        *,
        students (id, name)
      `)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching correction results:', error);
      throw new Error('Failed to fetch correction results');
    }

    return data?.map(item => ({
      id: item.id,
      studentId: item.student_id,
      simuladoId: item.simulado_id,
      submittedAt: item.submitted_at,
      answerSheetUrl: item.answer_sheet_url,
      score: item.score,
      summary: item.summary as CorrectionSummary,
      details: item.details as CorrectionDetail[]
    })) || [];
  },

  async getCorrectionResultsByStudent(studentId: string): Promise<CorrectionResult[]> {
    const { data, error } = await supabase
      .from('correction_results')
      .select('*')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching correction results for student:', error);
      throw new Error('Failed to fetch correction results for student');
    }

    return data?.map(item => ({
      id: item.id,
      studentId: item.student_id,
      simuladoId: item.simulado_id,
      submittedAt: item.submitted_at,
      answerSheetUrl: item.answer_sheet_url,
      score: item.score,
      summary: item.summary as CorrectionSummary,
      details: item.details as CorrectionDetail[]
    })) || [];
  },

  async getCorrectionResultById(id: string): Promise<CorrectionResult | null> {
    const { data, error } = await supabase
      .from('correction_results')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      console.error('Error fetching correction result:', error);
      throw new Error('Failed to fetch correction result');
    }

    if (!data) return null;

    return {
      id: data.id,
      studentId: data.student_id,
      simuladoId: data.simulado_id,
      submittedAt: data.submitted_at,
      answerSheetUrl: data.answer_sheet_url,
      score: data.score,
      summary: data.summary as CorrectionSummary,
      details: data.details as CorrectionDetail[]
    };
  },

  async createCorrectionResult(correction: Omit<CorrectionResult, 'id'>): Promise<CorrectionResult> {
    const { data, error } = await supabase
      .from('correction_results')
      .insert([{
        student_id: correction.studentId,
        simulado_id: correction.simuladoId,
        submitted_at: correction.submittedAt,
        answer_sheet_url: correction.answerSheetUrl,
        score: correction.score,
        summary: correction.summary,
        details: correction.details
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating correction result:', error);
      throw new Error('Failed to create correction result');
    }

    return {
      id: data.id,
      studentId: data.student_id,
      simuladoId: data.simulado_id,
      submittedAt: data.submitted_at,
      answerSheetUrl: data.answer_sheet_url,
      score: data.score,
      summary: data.summary as CorrectionSummary,
      details: data.details as CorrectionDetail[]
    };
  },

  async updateCorrectionResult(id: string, updates: Partial<CorrectionResult>): Promise<CorrectionResult> {
    const { data, error } = await supabase
      .from('correction_results')
      .update({
        student_id: updates.studentId,
        simulado_id: updates.simuladoId,
        submitted_at: updates.submittedAt,
        answer_sheet_url: updates.answerSheetUrl,
        score: updates.score,
        summary: updates.summary,
        details: updates.details
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating correction result:', error);
      throw new Error('Failed to update correction result');
    }

    return {
      id: data.id,
      studentId: data.student_id,
      simuladoId: data.simulado_id,
      submittedAt: data.submitted_at,
      answerSheetUrl: data.answer_sheet_url,
      score: data.score,
      summary: data.summary as CorrectionSummary,
      details: data.details as CorrectionDetail[]
    };
  },

  async deleteCorrectionResult(id: string): Promise<void> {
    const { error } = await supabase
      .from('correction_results')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting correction result:', error);
      throw new Error('Failed to delete correction result');
    }
  },
};

// Redacoes operations
export const redacaoService = {
  async getAllRedacoes(): Promise<Redacao[]> {
    const { data, error } = await supabase
      .from('redacoes')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching redacoes:', error);
      throw new Error('Failed to fetch redacoes');
    }

    return data || [];
  },

  async getRedacaoById(id: string): Promise<Redacao | null> {
    const { data, error } = await supabase
      .from('redacoes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      console.error('Error fetching redacao:', error);
      throw new Error('Failed to fetch redacao');
    }

    return data;
  },

  async createRedacao(redacao: Omit<Redacao, 'id'>): Promise<Redacao> {
    const { data, error } = await supabase
      .from('redacoes')
      .insert([redacao])
      .select()
      .single();

    if (error) {
      console.error('Error creating redacao:', error);
      throw new Error('Failed to create redacao');
    }

    return data;
  },

  async updateRedacao(id: string, updates: Partial<Redacao>): Promise<Redacao> {
    const { data, error } = await supabase
      .from('redacoes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating redacao:', error);
      throw new Error('Failed to update redacao');
    }

    return data;
  },

  async deleteRedacao(id: string): Promise<void> {
    const { error } = await supabase
      .from('redacoes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting redacao:', error);
      throw new Error('Failed to delete redacao');
    }
  },
};

// Correcoes Redacao operations
export const correcaoRedacaoService = {
  async getAllCorrecoesRedacao(): Promise<CorrecaoRedacao[]> {
    const { data, error } = await supabase
      .from('correcoes_redacao')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching correcoes redacao:', error);
      throw new Error('Failed to fetch correcoes redacao');
    }

    return data?.map(item => ({
      id: item.id,
      studentId: item.student_id,
      simuladoId: item.simulado_id,
      submittedAt: item.submitted_at,
      redacaoImageUrl: item.redacao_image_url,
      scores: item.scores,
      finalScore: item.final_score,
      situation: item.situation as RedacaoSituation,
      observations: item.observations
    })) || [];
  },

  async getCorrecoesRedacaoByStudent(studentId: string): Promise<CorrecaoRedacao[]> {
    const { data, error } = await supabase
      .from('correcoes_redacao')
      .select('*')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching correcoes redacao for student:', error);
      throw new Error('Failed to fetch correcoes redacao for student');
    }

    return data?.map(item => ({
      id: item.id,
      studentId: item.student_id,
      simuladoId: item.simulado_id,
      submittedAt: item.submitted_at,
      redacaoImageUrl: item.redacao_image_url,
      scores: item.scores,
      finalScore: item.final_score,
      situation: item.situation as RedacaoSituation,
      observations: item.observations
    })) || [];
  },

  async getCorrecaoRedacaoById(id: string): Promise<CorrecaoRedacao | null> {
    const { data, error } = await supabase
      .from('correcoes_redacao')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      console.error('Error fetching correcao redacao:', error);
      throw new Error('Failed to fetch correcao redacao');
    }

    if (!data) return null;

    return {
      id: data.id,
      studentId: data.student_id,
      simuladoId: data.simulado_id,
      submittedAt: data.submitted_at,
      redacaoImageUrl: data.redacao_image_url,
      scores: data.scores,
      finalScore: data.final_score,
      situation: data.situation as RedacaoSituation,
      observations: data.observations
    };
  },

  async createCorrecaoRedacao(correcao: Omit<CorrecaoRedacao, 'id'>): Promise<CorrecaoRedacao> {
    const { data, error } = await supabase
      .from('correcoes_redacao')
      .insert([{
        student_id: correcao.studentId,
        simulado_id: correcao.simuladoId,
        submitted_at: correcao.submittedAt,
        redacao_image_url: correcao.redacaoImageUrl,
        scores: correcao.scores,
        final_score: correcao.finalScore,
        situation: correcao.situation,
        observations: correcao.observations
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating correcao redacao:', error);
      throw new Error('Failed to create correcao redacao');
    }

    return {
      id: data.id,
      studentId: data.student_id,
      simuladoId: data.simulado_id,
      submittedAt: data.submitted_at,
      redacaoImageUrl: data.redacao_image_url,
      scores: data.scores,
      finalScore: data.final_score,
      situation: data.situation as RedacaoSituation,
      observations: data.observations
    };
  },

  async updateCorrecaoRedacao(id: string, updates: Partial<CorrecaoRedacao>): Promise<CorrecaoRedacao> {
    const { data, error } = await supabase
      .from('correcoes_redacao')
      .update({
        student_id: updates.studentId,
        simulado_id: updates.simuladoId,
        submitted_at: updates.submittedAt,
        redacao_image_url: updates.redacaoImageUrl,
        scores: updates.scores,
        final_score: updates.finalScore,
        situation: updates.situation,
        observations: updates.observations
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating correcao redacao:', error);
      throw new Error('Failed to update correcao redacao');
    }

    return {
      id: data.id,
      studentId: data.student_id,
      simuladoId: data.simulado_id,
      submittedAt: data.submitted_at,
      redacaoImageUrl: data.redacao_image_url,
      scores: data.scores,
      finalScore: data.final_score,
      situation: data.situation as RedacaoSituation,
      observations: data.observations
    };
  },

  async deleteCorrecaoRedacao(id: string): Promise<void> {
    const { error } = await supabase
      .from('correcoes_redacao')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting correcao redacao:', error);
      throw new Error('Failed to delete correcao redacao');
    }
  },
};