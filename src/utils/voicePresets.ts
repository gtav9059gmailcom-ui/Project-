import { FemaleVoice } from '../types/index.ts';

export const FEMALE_VOICE_PRESETS: FemaleVoice[] = [
  {
    id: 'friday-prime',
    name: 'FRIDAY Prime',
    accent: 'Irish / Sophisticated',
    character: 'Tony Stark Primary AI',
    description: 'Composed, sharply observant with a smooth, warm Irish cadence. Built for tactical operations and wit.',
    geminiVoice: 'Kore',
    webSpeechPitch: 1.05,
    webSpeechRate: 1.02,
    avatarColor: 'from-cyan-400 to-blue-600',
    sampleQuote: "Boss, all Mark 85 subroutines are online. Ready when you are.",
  },
  {
    id: 'friday-aqua',
    name: 'FRIDAY Aqua',
    accent: 'Aquamorphic Silky',
    character: 'ColorOS Fluid Entity',
    description: 'Gentle, organic, and ultra-smooth. Designed to reduce cognitive load with a soothing natural flow.',
    geminiVoice: 'Zephyr',
    webSpeechPitch: 1.15,
    webSpeechRate: 0.98,
    avatarColor: 'from-teal-300 to-emerald-500',
    sampleQuote: "System vitals are flowing smoothly. Let's create something wonderful together.",
  },
  {
    id: 'friday-oxygen',
    name: 'FRIDAY Oxygen',
    accent: 'Studio Neutral / Crisp',
    character: 'OxygenOS Precision Core',
    description: 'Clean, direct, and distraction-free studio diction with zero hesitation. Optimized for rapid workflow.',
    geminiVoice: 'Fenrir',
    webSpeechPitch: 0.98,
    webSpeechRate: 1.08,
    avatarColor: 'from-rose-400 to-red-500',
    sampleQuote: "Directive executed. Diagnostic telemetry compiled and awaiting your review.",
  },
  {
    id: 'friday-nova',
    name: 'FRIDAY Nova',
    accent: 'Modern Cosmopolitan',
    character: 'Gemini Next-Gen Companion',
    description: 'Vibrant, bright, and intellectually inquisitive. Radiates positive momentum and scientific enthusiasm.',
    geminiVoice: 'Puck',
    webSpeechPitch: 1.2,
    webSpeechRate: 1.05,
    avatarColor: 'from-violet-400 to-fuchsia-600',
    sampleQuote: "Fascinating query! I've synthesized our latest findings across our neural network.",
  },
  {
    id: 'friday-valkyrie',
    name: 'FRIDAY Valkyrie',
    accent: 'Tactical Commander',
    character: 'Avenger Defense Specialist',
    description: 'Crisp, resolute, and commanding. Prioritizes threat elimination, perimeter security, and decisive guidance.',
    geminiVoice: 'Kore',
    webSpeechPitch: 0.92,
    webSpeechRate: 1.02,
    avatarColor: 'from-amber-400 to-orange-600',
    sampleQuote: "Perimeter shields locked at maximum. Threat vectors neutralized on my mark.",
  },
];

/**
 * Text-to-speech speaker using browser SpeechSynthesis with fallback tuning
 */
export function speakText(
  text: string,
  voice: FemaleVoice,
  onStart?: () => void,
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this environment');
    onEnd?.();
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown tags and clean up speech text
  const clean = text
    .replace(/<[^>]*>/g, '')
    .replace(/[*_#`[\]()]/g, '')
    .replace(/https?:\/\/\S+/g, 'link')
    .slice(0, 500);

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.pitch = voice.webSpeechPitch;
  utterance.rate = voice.webSpeechRate;

  // Attempt to select a female voice from available speech synthesis voices
  const voices = window.speechSynthesis.getVoices();
  const femaleVoiceCandidate = voices.find(v => {
    const name = v.name.toLowerCase();
    return (
      (name.includes('female') || name.includes('zira') || name.includes('samantha') || name.includes('victoria') || name.includes('karen') || name.includes('fiona') || name.includes('serena') || name.includes('google us english') || name.includes('natural')) &&
      !name.includes('male') &&
      !name.includes('david') &&
      !name.includes('george')
    );
  }) || voices[0];

  if (femaleVoiceCandidate) {
    utterance.voice = femaleVoiceCandidate;
  }

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}
