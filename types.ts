export interface AppState {
  characterDescription: string;
  inputText: string;
  voiceInstructions: string;
  aspectRatio: string;
  outputSetup: string;
  outputScenes: string;
  sceneCount: number;
  totalDuration: number;
  totalWords: number;
  apiKeys: string;
}

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface Character {
  id: string;
  name: string;
  species: string;
  gender: string;
  age: string;
  voice_personality: string;
  body_build: string;
  face_shape: string;
  hair: string;
  skin_or_fur_color: string;
  signature_feature: string;
  outfit_top: string;
  outfit_bottom: string;
  helmet_or_hat: string;
  shoes_or_footwear: string;
  props: string;
  body_metrics: string;
  [key: string]: any; // For additional properties like pose, action_flow etc.
}

export interface Background {
  id: string;
  name: string;
  setting: string;
  scenery: string;
  props: string;
  lighting: string;
}

// A single, unified Scene type to enforce the new consistent layout.
// Every scene now contains the character, background, and a composite prompt.
export interface Scene {
    scene_id: string;
    duration_sec: number;
    visual_style: string;
    negative_prompt?: string;
    character_lock: { [key: string]: Character };
    background_lock: { [key: string]: Background };
    prompt: string; // The composite prompt describing the 1/3 + 2/3 layout
    foley_and_ambience: object;
    dialogue: object[];
    lip_sync_director_note: string;
}

export interface ConversionInput {
    characterDescription: string;
    inputText: string;
    aspectRatio: string;
    voiceInstructions: string;
    apiKeys: string;
}

export interface ConversionResult {
    setupJson: string;
    scenesJson: string;
    stats: {
        sceneCount: number;
        totalDuration: number;
        totalWords: number;
    };
}
