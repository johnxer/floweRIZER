// import axios from 'axios';
import { GoogleGenAI } from '@google/genai';

import { ref } from 'vue';

export const useFlowerChat = () => {
    const answer = ref('');
    const error = ref(null);
    const isLoading = ref(false);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL_NAME;
    const MODEL_INSTRUCTIONS = import.meta.env.VITE_GEMINI_SYSTEM_INSTRUCTIONS;

    const ai = API_KEY ? new GoogleGenAI({apiKey: API_KEY}) : null;
   
    const askFlowerBot = async (question) => {
        if (!question || !ai) {
            if (!ai) error.value = 'Gemini API Key není načten.';
            return;
        }

        error.value = null;
        isLoading.value = true;

        try {
            console.log(`asking ${MODEL_NAME}...`);

            
            const response = await ai.models.generateContent({
                model: MODEL_NAME,

                contents: [{ 
                    role: 'user', 
                    parts: [{ text: question }] 
                }],

                config: {
                    systemInstruction: MODEL_INSTRUCTIONS,
                },
            });

            answer.value = response.text;
            console.log("Gemini answer:", answer.value);

            return true;
        } catch (err) {
            console.error('Gemini API error:', err);
            error.value = err.response?.data?.error?.message || err.message;
        } finally {
            isLoading.value = false;
        }
    };

    
    return {
        answer,
        error,
        isLoading,
        askFlowerBot,
    };
};
