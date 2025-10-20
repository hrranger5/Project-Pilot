
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  // This is a placeholder for environments where the API key is not set.
  // The app will function, but AI features will be disabled.
  console.warn("API_KEY environment variable not set. Gemini API features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const suggestSubtasks = async (title: string, description: string): Promise<string[]> => {
  if (!process.env.API_KEY) {
    // Simulate a delay and return mock data if API key is not available
    await new Promise(resolve => setTimeout(resolve, 1000));
    return ["Mock Subtask 1: Analyze requirements", "Mock Subtask 2: Create action plan", "Mock Subtask 3: Review and finalize"];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following task, suggest a short, actionable checklist of 3 to 5 sub-tasks.
      Task Title: "${title}"
      Description: "${description}"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: 'A single, actionable sub-task.'
              }
            }
          }
        },
      },
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && Array.isArray(result.subtasks)) {
      return result.subtasks;
    }

    return [];
  } catch (error) {
    console.error("Error suggesting subtasks:", error);
    // Return an error-indicative or empty array upon failure
    return ["Error generating suggestions. Please try again."];
  }
};
