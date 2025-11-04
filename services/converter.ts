import { Type } from '@google/genai';
import type { Character, Background, ConversionInput, ConversionResult, Scene } from '../types';
import { POSES, ACTION_FLOWS, FOLEY_BASE, getVisualStyleAndNegativePrompt } from '../constants';
import { generateContentWithRotation } from './geminiService';

interface ScenePlan {
  scene_text: string;
  illustration_prompt: string;
}

const countWords = (text: string): number => {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
};

const generateSetupJson = async (description: string, aspectRatio: string, apiKeys: string): Promise<any> => {
    const { visualStyle, negativePrompt } = getVisualStyleAndNegativePrompt(aspectRatio);

    const prompt = `You are an expert video production assistant. Your task is to analyze a detailed description and create a complete setup JSON object. The JSON must have four top-level keys: 'character_lock', 'background_lock', 'visual_style', and 'negative_prompt'.

- From the description, extract all details for a single character and place them in an object. This character object should be the value for the key 'CHAR_1' inside the 'character_lock' object. Ensure the character 'id' is 'CHAR_1'.
- From the description, extract all details for a single background setting and place them in an object. This background object should be the value for the key 'BACKGROUND_1' inside the 'background_lock' object. Ensure the background 'id' is 'BACKGROUND_1'.
- Use the exact 'visual_style' text provided below.
- Use the exact 'negative_prompt' text provided below.

Description:
---
${description}
---

Visual Style Text:
---
${visualStyle}
---

Negative Prompt Text:
---
${negativePrompt}
---
`;

    const characterSchema = {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "Character ID, must be CHAR_1" },
            name: { type: Type.STRING },
            species: { type: Type.STRING },
            gender: { type: Type.STRING },
            age: { type: Type.STRING },
            voice_personality: { type: Type.STRING },
            body_build: { type: Type.STRING },
            face_shape: { type: Type.STRING },
            hair: { type: Type.STRING },
            skin_or_fur_color: { type: Type.STRING },
            signature_feature: { type: Type.STRING },
            outfit_top: { type: Type.STRING },
            outfit_bottom: { type: Type.STRING },
            helmet_or_hat: { type: Type.STRING },
            shoes_or_footwear: { type: Type.STRING },
            props: { type: Type.STRING },
            body_metrics: { type: Type.STRING },
        },
        required: ["id", "name"]
    };

    const backgroundSchema = {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "Background ID, must be BACKGROUND_1" },
            name: { type: Type.STRING },
            setting: { type: Type.STRING },
            scenery: { type: Type.STRING },
            props: { type: Type.STRING },
            lighting: { type: Type.STRING },
        },
        required: ["id", "name"]
    };

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            character_lock: {
                type: Type.OBJECT,
                properties: { CHAR_1: characterSchema }
            },
            background_lock: {
                type: Type.OBJECT,
                properties: { BACKGROUND_1: backgroundSchema }
            },
            visual_style: { type: Type.STRING },
            negative_prompt: { type: Type.STRING }
        },
        required: ["character_lock", "visual_style", "negative_prompt"]
    };

    try {
        const response = await generateContentWithRotation(apiKeys, {
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        return JSON.parse(response.text);
    } catch (e) {
        console.error("Gemini API Error (Setup Generation):", e);
        throw new Error(`Không thể tạo JSON cài đặt từ AI. Lỗi: ${e instanceof Error ? e.message : String(e)}`);
    }
}

const generateScenePlans = async (inputText: string, apiKeys: string): Promise<ScenePlan[]> => {
    const prompt = `You are a meticulous AI video production director governed by a strict set of laws. Your primary task is to process a Vietnamese script, translate it into English, and break it down into a sequence of scenes for a VEO video generation pipeline. You must adhere to the following laws without fail.

**LAW 1: ABSOLUTE CONTENT INTEGRITY (VERBATIM LOCK)**
1.  **COMPLETE & FAITHFUL TRANSLATION:** You MUST translate the ENTIRE Vietnamese script into English. The translation must be verbatim and faithful to the original's meaning and intent.
2.  **ZERO TOLERANCE FOR ALTERATION:** It is STRICTLY FORBIDDEN to add, omit, summarize, or reinterpret any part of the original script during translation. The full translated text must represent 100% of the source text.

**LAW 3: SCRIPT CONTROL SYSTEM**
1.  **STRICT SEGMENTATION:** After the complete translation, you MUST segment the entire English text into scenes. The 'scene_text' for each and every scene MUST contain between 10 and 15 English words. This is a non-negotiable, critical rule.
2.  **INTELLIGENT & LOGICAL SPLITTING:** Your highest priority when segmenting is to maintain a natural, conversational flow. You MUST split sentences at logical and grammatical breakpoints (e.g., after commas, at the end of clauses). Avoid nonsensical or abrupt cuts mid-phrase at all costs. The goal is for the dialogue in each scene to sound complete and make sense on its own, even though it's part of a larger script.
3.  **TOTAL COVERAGE:** The combination of all 'scene_text' segments MUST perfectly reconstruct the complete, unabridged English translation. Not a single word from the translation should be dropped.

**Your Task:**
1.  Perform a complete and faithful translation of the Vietnamese script below into English, following LAW 1.
2.  Segment the entire translated text into scenes, strictly following LAW 3.
3.  For EACH scene, write a clear, concise 'illustration_prompt' (in English). This prompt will describe the visual that appears in the 2/3 portion of the screen next to the doctor. The prompt should be cinematic and metaphorical, not literal.
4.  Output a single JSON array of scene objects.

**Vietnamese Script to Process:**
---
${inputText}
---

**JSON Output Structure (Array of Objects):**
- Each object must have 'scene_text' (the English segment, 10-15 words) and 'illustration_prompt' (in English).
`;

    const scenePlanSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                scene_text: { type: Type.STRING, description: 'The spoken dialogue for this scene in English (10-15 words).' },
                illustration_prompt: { type: Type.STRING, description: 'A detailed English prompt for the illustrative part of the video.' }
            },
            required: ['scene_text', 'illustration_prompt']
        }
    };
    
    try {
        const response = await generateContentWithRotation(apiKeys, {
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: scenePlanSchema,
            },
        });
        const result = JSON.parse(response.text);
        if (!Array.isArray(result) || result.length === 0) {
            throw new Error("AI did not return a valid scene plan array.");
        }
        return result as ScenePlan[];
    } catch (e) {
        console.error("Gemini API Error (Scene Planning):", e);
        throw new Error(`Không thể tạo kế hoạch phân cảnh từ AI. Lỗi: ${e instanceof Error ? e.message : String(e)}`);
    }
};

export const convertScriptToJsons = async (input: ConversionInput): Promise<ConversionResult> => {
    const { characterDescription, inputText, aspectRatio, voiceInstructions, apiKeys } = input;

    // Run AI generation tasks in parallel
    const [setupJsonData, scenePlan] = await Promise.all([
        generateSetupJson(characterDescription, aspectRatio, apiKeys),
        generateScenePlans(inputText, apiKeys)
    ]);

    const character = setupJsonData?.character_lock?.CHAR_1;
    const background = setupJsonData?.background_lock?.BACKGROUND_1;

    if (!character) {
        throw new Error("AI không thể tạo dữ liệu nhân vật hợp lệ từ mô tả.");
    }
    
    const visualStyle = setupJsonData.visual_style;
    const negativePrompt = setupJsonData.negative_prompt;
    let totalDuration = 0;
    const sceneObjects: Scene[] = [];

    scenePlan.forEach((plan, index) => {
        const wordCount = countWords(plan.scene_text);
        // The AI is now constrained to 10-15 words, this calculation will naturally fall within 3-8s.
        const calculatedDuration = Math.round(wordCount / 2.5); 
        const sceneDurationSec = Math.max(3, Math.min(8, calculatedDuration));
        totalDuration += sceneDurationSec;
        
        const poseIndex = index % POSES.length;
        const actionIndex = index % ACTION_FLOWS.length;

        let characterLock: { [key: string]: Character } = {};
        characterLock[character.id] = {
            ...character,
            ...POSES[poseIndex],
            action_flow: ACTION_FLOWS[actionIndex]
        };
        
        let backgroundLock: { [key: string]: Background } = {};
        if (background) {
            backgroundLock[background.id] = background;
        }

        const layoutDescription = aspectRatio === '16:9'
          ? `The doctor, CHAR_1, is framed on the left third of the screen, speaking to the camera against BACKGROUND_1. The right two-thirds of the screen displays an illustrative visual:`
          : `The doctor, CHAR_1, is framed on the top third of the screen, speaking to the camera against BACKGROUND_1. The bottom two-thirds of the screen displays an illustrative visual:`;

        const finalPrompt = `${layoutDescription} ${plan.illustration_prompt}`;

        const sceneExpression = POSES[poseIndex].expression;
        let dialogueDelivery = `${sceneExpression}. ${voiceInstructions.trim()}`;
        const baseDialogue = {
            speaker: character.id,
            language: "en-US",
            line: plan.scene_text,
        };

        const sceneObj: Scene = {
            scene_id: String(index + 1),
            duration_sec: sceneDurationSec,
            visual_style: visualStyle,
            negative_prompt: negativePrompt,
            character_lock: characterLock,
            background_lock: backgroundLock,
            prompt: finalPrompt,
            foley_and_ambience: FOLEY_BASE,
            dialogue: [{ ...baseDialogue, delivery: dialogueDelivery }],
            lip_sync_director_note: 
                `Voice-over must begin IMMEDIATELY at the start of the scene. Direct ${character.id} to deliver the line naturally within the scene's ${sceneDurationSec}-second duration, framed within their portion of the screen. Pacing should be adjusted to fit the line's length. Ensure clear, synchronized mouth movements.`
        };
        sceneObjects.push(sceneObj);
    });
    
    const scenesOutput = sceneObjects.map(obj => JSON.stringify(obj)).join('\n');
    const totalWords = scenePlan.reduce((sum, p) => sum + countWords(p.scene_text), 0);

    return {
        setupJson: JSON.stringify(setupJsonData, null, 2),
        scenesJson: scenesOutput.trim(),
        stats: {
            sceneCount: scenePlan.length,
            totalDuration: totalDuration,
            totalWords: totalWords,
        }
    };
};