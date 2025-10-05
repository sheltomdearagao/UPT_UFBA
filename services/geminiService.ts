
import { GoogleGenAI, Type } from "@google/genai";
import { CorrectionResult, AnswerKeyItem } from '../types';
import { DEFAULT_AI_PROMPT } from '../constants';

if (!process.env.API_KEY) {
  // In a real app, this would be a fatal error. Here, we'll just log it.
  // The user must have API_KEY set in their environment.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const multipleChoiceResponseSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "Total number of correct answers." },
    summary: {
      type: Type.OBJECT,
      properties: {
        correct: { type: Type.NUMBER, description: "Count of correct answers." },
        incorrect: { type: Type.NUMBER, description: "Count of incorrect answers." },
        blank: { type: Type.NUMBER, description: "Count of blank answers." },
      },
      required: ["correct", "incorrect", "blank"],
    },
    details: {
      type: Type.ARRAY,
      description: "A detailed breakdown of each question.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.NUMBER, description: "The question number." },
          student_answer: { type: Type.STRING, description: "The answer marked by the student (e.g., 'A', 'blank', 'multiple')." },
          correct_answer: { type: Type.STRING, description: "The correct answer from the key." },
          status: { type: Type.STRING, description: "The status: 'correct', 'incorrect', 'blank', or 'multiple'." },
          area: { type: Type.STRING, description: "The area of knowledge for the question, from the key." },
        },
        required: ["question", "student_answer", "correct_answer", "status", "area"],
      },
    },
  },
  required: ["score", "summary", "details"],
};


export const correctTestWithAI = async (
  base64Image: string,
  answerKey: AnswerKeyItem[]
): Promise<Omit<CorrectionResult, 'id' | 'studentId' | 'simuladoId' | 'submittedAt' | 'answerSheetUrl'>> => {
  try {
    const model = 'gemini-2.5-flash';
    const fullPrompt = DEFAULT_AI_PROMPT.replace('{{ANSWER_KEY}}', JSON.stringify(answerKey));

    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };

    const textPart = { text: fullPrompt };
    
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: multipleChoiceResponseSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Validate the parsed result against the expected structure
    if (result && typeof result.score === 'number' && result.summary && Array.isArray(result.details)) {
        return result;
    } else {
        throw new Error("AI response did not match the expected format.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid correction from the AI. Please check the console for details.");
  }
};