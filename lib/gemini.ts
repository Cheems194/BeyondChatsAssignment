import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCwjQHmBMBwbYm8n9aXOuTnbBQUB7mAGFU" });

export async function generateAnswer(prompt: string): Promise<string> {
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const text = result.text;
  console.log(text);
  return text ?? '';
}