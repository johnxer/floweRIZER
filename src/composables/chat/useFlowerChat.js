import { GoogleGenAI } from '@google/genai';

import { ref } from 'vue';

export const useFlowerChat = () => {
    const answer = ref('');
    const error = ref(null);
    const isPending = ref(false);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL_NAME;
    const MODEL_INSTRUCTIONS = import.meta.env.VITE_GEMINI_CHAT_INSTRUCTIONS;

    const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

    const askFlowerBot = async (question) => {
        if (!question || !ai) {
            if (!ai) error.value = 'Gemini API Key not loaded';
            return;
        }

        error.value = null;
        isPending.value = true;

        try {
            const response = await ai.models.generateContent({
                model: MODEL_NAME,

                contents: [
                    {
                        role: 'user',
                        parts: [{ text: question }],
                    },
                ],

                config: {
                    systemInstruction: MODEL_INSTRUCTIONS,
                },
            });

            answer.value = response.text;

            return true;
        } catch (err) {
            error.value = err.response?.data?.error?.message || err.message;
        } finally {
            isPending.value = false;
        }
    };

    return {
        answer,
        error,
        isPending,
        askFlowerBot,
    };
};
