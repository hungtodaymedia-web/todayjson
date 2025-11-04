import { GoogleGenAI } from '@google/genai';
import type { GenerateContentParameters, GenerateContentResponse } from '@google/genai';

/**
 * Executes a generateContent request with automatic API key rotation on failure.
 * It will try each provided API key in sequence until one succeeds or all fail.
 *
 * @param apiKeys A string containing one or more API keys, separated by whitespace.
 * @param request The parameters for the generateContent request.
 * @returns A Promise that resolves with the GenerateContentResponse on success.
 * @throws An error if all API keys fail.
 */
export const generateContentWithRotation = async (
    apiKeys: string,
    request: GenerateContentParameters
): Promise<GenerateContentResponse> => {
    // Split by any whitespace and remove empty strings
    const keys = apiKeys.trim().split(/\s+/).filter(Boolean);
    if (keys.length === 0) {
        throw new Error("Không có API key nào được cung cấp.");
    }

    let lastError: any = null;

    for (const key of keys) {
        try {
            const ai = new GoogleGenAI({ apiKey: key });
            const response = await ai.models.generateContent(request);
            // Success! Return the response immediately.
            return response; 
        } catch (error) {
            console.warn(`API Key ...${key.slice(-4)} failed. Trying next key.`, error);
            lastError = error;
            // Continue to the next key in the loop
        }
    }

    // If the loop completes, it means all keys have failed.
    console.error("All available API keys failed.", lastError);
    throw new Error("Tất cả các API key đều không hợp lệ hoặc đã đạt đến giới hạn. Vui lòng kiểm tra lại.");
};
