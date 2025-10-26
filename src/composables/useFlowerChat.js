import axios from 'axios';
import { ref } from 'vue';

export const useFlowerChat = () => {
    const answer = ref('');
    const error = ref(null);
    const isLoading = ref(false);

    const MODEL_NAME = 'gemini-2.5-flash';
    const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;

    const askFlowerBot = async (question) => {
        if (!question) return;

        error.value = null;
        isLoading.value = true;

        try {
            console.log(`asking ${MODEL_NAME}...`);

            const endpoint = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

            const response = await axios.post(endpoint, {
                // generationConfig: {
                //     systemInstruction: "You are an expert and helpful botanical advisor. Only answer questions related to plants, flowers, gardening, and botany. Politely decline to answer any other topic and remind the user that they should ask about plants. IMPORTANT: You MUST respond in the same language as the user's question.",
                // },

                contents: [
                    {
                        role: 'user',
                        parts: [{ text: question }],
                    },
                ],
            });

            answer.value = response.data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Žádná odpověď';
            console.log('Gemini answer:', answer.value);

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
