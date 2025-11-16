
import { GoogleGenAI, Chat, Content, Modality } from "@google/genai";

// Ensure the API key is available. In a real app, this should be handled more securely.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chat: Chat | null = null;

const SYSTEM_INSTRUCTION = "You are Sahayak, a calm, friendly, empathetic mental-wellness assistant. Keep replies short (2-4 sentences). Validate feelings, avoid clinical advice, and offer one simple micro-step when suitable.";

function getChatInstance(history: Content[]): Chat {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        });
    }
    return chat;
}

export const generateTextResponse = async (prompt: string, history: Content[]): Promise<string> => {
    try {
        const chatInstance = getChatInstance(history);
        const response = await chatInstance.sendMessage({ message: prompt });
        return response.text;
    } catch (error) {
        console.error("Gemini text generation error:", error);
        // Reset chat on error
        chat = null;
        throw new Error("Failed to generate text response from Gemini.");
    }
};

export const generateSpeechResponse = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say calmly and gently: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!audioData) {
            throw new Error("No audio data returned from Gemini TTS.");
        }
        
        return audioData;

    } catch (error) {
        console.error("Gemini TTS error:", error);
        throw new Error("Failed to generate speech response from Gemini.");
    }
};
