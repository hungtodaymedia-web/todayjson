
export const DEFAULT_SETUP_DESC = `CHARACTER:
ID: CHAR_1
Tên: Dr. Strong
Loài: Human – Caucasian American
Giới tính: Male
Tuổi: 70 years old, Elderly
Giọng: Confident, authoritative male voice; locale=en-US; accent=General American
Vóc dáng: Healthy and fit for his age, conveying vitality
Khuôn mặt: Distinguished, kind, wise with a warm, trustworthy smile
Tóc: Distinguished silver-white, neatly combed, professional short-to-medium length, full, well-maintained, and dignified
Da: Healthy, clear complexion with natural aging lines
Đặc điểm: Wire-rimmed reading glasses with thin, silver frames and classic, professional rectangular lenses, always worn on his face. Clean-shaven.
Áo: ROYAL BLUE medical scrubs, pristine white medical coat over scrubs
Quần: ROYAL BLUE medical scrub pants
Mũ: None
Giày: 
Phụ kiện: 'Dr. Strong, PT' name badge on LEFT CHEST of white coat, silver/chrome stethoscope draped around his neck.

BACKGROUND:
ID: BACKGROUND_1
Tên: Modern Clinic Setting
Môi trường: A well-lit, modern clinic environment.
Phong cảnh: Modern clinic architecture with professional, clean lines.
Đạo cụ: Minimalist clinic decor; no specific fixed props.
Ánh sáng: Well-lit, professional lighting.`;

export const DEFAULT_INPUT_TEXT = `Tám mươi tám phần trăm người Mỹ mắc bệnh tiểu đường loại 2 được khuyên nên kiểm soát tình trạng của mình bằng thuốc suốt đời. Nhưng điều mà bác sĩ không nói với bạn có thể là sự khác biệt giữa việc đảo ngược hoàn toàn bệnh tiểu đường hoặc mãi mãi phụ thuộc vào thuốc. Đây không phải là về việc kiểm soát bệnh tiểu đường. Đây là về việc chấm dứt nó.`;

export const DEFAULT_VOICE_INSTRUCTIONS = `TONE: WARM, RESPECTFUL, AND REASSURING (AVOID JUVENILE OR HYPER-ENERGETIC TONES).

VOLUME: STABLE AND SLIGHTLY ABOVE AVERAGE VOLUME THROUGHOUT THE ENTIRE TRACK.

EMPHASIS: BOLDLY EMPHASIZE KEYWORDS, NUMBERS, AND CRITICAL INFORMATION.`;

export const getVisualStyleAndNegativePrompt = (aspectRatio: string) => ({
    visualStyle: `Live-action cinematic style, filmed with real actors and realistic environments. Natural human appearance with authentic skin tones, hair, and clothing. Shot with professional cameras, cinematic depth of field, natural lighting. High resolution, ultra sharp detail, cinematic color grading. Aspect ratio (${aspectRatio}) EDGE-TO-EDGE; CENTER-CROP to fit; DO NOT pad. Deliver full-frame only.`,
    negativePrompt: `black bars, letterbox, pillarbox, borders, mattes, padding, blur background, watermark, captions, subtitles, CGI, animated, cartoon, stylized, 3D render`
});

export const FOLEY_BASE = {
    "ambience": [],
    "fx": [],
    "music": ""
};

export const ACTION_FLOWS = [
    {"pre_action": "stands alert, maintaining professional demeanor", "main_action": "looks directly at camera; adopts firm expression; clasps hands loosely in front", "post_action": "holds position, conveying urgency and serious intent"},
    {"pre_action": "maintains an attentive and poised stance", "main_action": "shifts expression to serious concern; leans slightly forward; raises a hand slightly; gestures subtly", "post_action": "holds a watchful, concerned gaze, implying confidentiality"},
    {"pre_action": "holds a serious and attentive posture", "main_action": "stands with grave expression; makes direct eye contact; gestures with both hands, palms slightly open", "post_action": "holds open gesture, emphasizing the choice presented"},
    {"pre_action": "stands with a determined and focused look", "main_action": "steps forward slightly; shows determined and resolute expression; clenches his fist gently", "post_action": "holds a strong, resolved posture, signaling conviction"},
    {"pre_action": "maintains a resolute and trustworthy presence", "main_action": "makes direct, reassuring eye contact; gestures with an open hand; invites the viewer to trust him", "post_action": "holds inviting gaze and open posture, establishing rapport"},
    {"pre_action": "CHAR_1 stands facing the camera, a thoughtful look on his face", "main_action": "CHAR_1 raises his right hand; points his index finger to his temple; his brow furrows slightly; he maintains intense eye contact", "post_action": "His serious expression deepens, conveying internal urgency"},
    {"pre_action": "CHAR_1 stands ready to present, his posture open", "main_action": "CHAR_1 raises his right hand to chest height; holds up an open palm towards the camera; his eyes soften; he gives a confident gaze", "post_action": "A reassuring smile plays on his lips, revealing a proven plan"},
    {"pre_action": "CHAR_1 holds a neutral and attentive posture", "main_action": "CHAR_1's face brightens with a warm smile; his eyes shine with triumph and hope; he nods firmly, once; he maintains eye contact", "post_action": "His hopeful expression lingers, confirming the positive outcome"}
];

export const POSES = [
    {"position": "center frame", "orientation": "facing camera directly", "pose": "standing upright", "foot_placement": "feet shoulder-width on floor", "hand_detail": "hands clasped loosely in front", "expression": "firm, urgent"},
    {"position": "center frame", "orientation": "angled slightly towards camera", "pose": "leaning slightly forward, upper body engaged", "foot_placement": "feet shoulder-width on floor", "hand_detail": "one hand raised slightly, gesturing subtly", "expression": "serious concern"},
    {"position": "center frame", "orientation": "facing camera directly", "pose": "standing with a deliberate posture", "foot_placement": "feet shoulder-width on floor", "hand_detail": "both hands gesturing, palms slightly open", "expression": "grave, solemn"},
    {"position": "center frame, slightly forward", "orientation": "facing camera directly, body slightly angled", "pose": "stepping forward, posture resolute", "foot_placement": "left foot forward, firmly on floor", "hand_detail": "right fist gently clenched at his side", "expression": "determined, resolute"},
    {"position": "center frame", "orientation": "facing camera directly", "pose": "standing, relaxed but engaged", "foot_placement": "feet shoulder-width on floor", "hand_detail": "open hand gesturing towards the viewer", "expression": "reassuring, trustworthy"},
    {"position": "center frame", "orientation": "facing camera", "pose": "standing", "foot_placement": "feet shoulder-width on floor", "hand_detail": "right hand points index finger to temple", "expression": "serious"},
    {"position": "center frame", "orientation": "facing camera", "pose": "standing", "foot_placement": "feet shoulder-width on floor", "hand_detail": "right hand holds up open palm", "expression": "confident and reassuring"},
    {"position": "center frame", "orientation": "facing camera", "pose": "standing", "foot_placement": "feet shoulder-width on floor", "hand_detail": "hands relaxed at sides", "expression": "triumphant and hopeful"}
];
