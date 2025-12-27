import { GoogleGenAI } from '@google/genai';
import { ref } from 'vue';

const plantSchema = {
    type: 'object',

    properties: {
        name: { type: 'string' },
        desc: { type: 'string' },
        wateringFrequency: { type: 'number' },
        lightRequirements: { type: 'string' },
        isToxic: { type: 'boolean' },
    },
    required: ['name', 'desc', 'wateringFrequency', 'lightRequirements', 'isToxic'],
};

export const useRecognizePlant = () => {
    const error = ref(null);
    const isPending = ref(false);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL_NAME || 'gemini-2.0-flash-exp';

    const fileToBase64 = (file: Blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    resolve(reader.result.toString().split(',')[1]);
                } else {
                    reject(new Error('Failed to read file as base64'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const identifyPlantWithGemini = async (file: Blob, mimeType: string) => {
        try {
            isPending.value = true;
            error.value = null;

            if (!API_KEY) {
                throw new Error('VITE_GEMINI_API_KEY is not set in .env file');
            }

            const correctedMimeType = mimeType === 'image/jpg' ? 'image/jpeg' : mimeType;

            const base64 = await fileToBase64(file);

            const client = new GoogleGenAI({
                apiKey: API_KEY,
            });

            const prompt = `Analyze the provided image.
1. STRICTLY check if the main subject of the image is a real plant.
2. If the image contains a person, animal, artificial object, or if it is ambiguous and NOT clearly a plant, you MUST return:
{
  "name": "No plant identified",
  "desc": "The image does not appear to contain a plant.",
  "wateringFrequency": 0,
  "lightRequirements": "low",
  "isToxic": false
}
3. If it IS a plant, identify it and return:
{
  "name": "Common Plant Name",
  "desc": "Brief 2-3 sentence description.",
  "wateringFrequency": <number of days>,
  "lightRequirements": "low" | "medium" | "high",
  "isToxic": <boolean>
}

IMPORTANT: Return ONLY the JSON object, no markdown, no additional text, no explanations.`;
            const result = await client.models.generateContent({
                model: MODEL_NAME,
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    mimeType: correctedMimeType,
                                    data: base64,
                                },
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.1,
                    responseMimeType: 'application/json',
                    responseSchema: plantSchema,
                },
            });

            const json = result.candidates[0].content.parts[0].text;

            let cleanJson = json.trim();
            if (cleanJson.startsWith('```')) {
                const match = cleanJson.match(/```(?:json)?\s*([\s\S]*?)```/);
                if (match) {
                    cleanJson = match[1].trim();
                }
            }

            const parsedJson = JSON.parse(cleanJson);

            if (!parsedJson || !parsedJson.name) {
                throw new Error('Invalid response format from Gemini');
            }

            if (parsedJson.name === 'No plant identified') {
                throw new Error('No plant identified in the image. Please try another photo.');
            }

            return parsedJson;
        } catch (e) {
            console.error('Gemini error:', e);
            console.error('Error details:', {
                message: e.message,
                stack: e.stack,
                response: e.response,
            });
            error.value = e.message || 'Failed to identify plant';
            throw e;
        } finally {
            isPending.value = false;
        }
    };

    return {
        error,
        isPending,
        identifyPlantWithGemini,
    };
};
