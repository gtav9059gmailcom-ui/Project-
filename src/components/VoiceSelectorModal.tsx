import React from 'react';
import { FemaleVoice } from '../types/index.ts';
import { FEMALE_VOICE_PRESETS, speakText } from '../utils/voicePresets.ts';
import { Volume2, Check, Sparkles, X, Radio } from 'lucide-react';

interface VoiceSelectorModalProps {
  currentVoice: FemaleVoice;
  onSelectVoice: (voice: FemaleVoice) => void;
  onClose: () => void;
}

export const VoiceSelectorModal: React.FC<VoiceSelectorModalProps> = ({
  currentVoice,
  onSelectVoice,
  onClose,
}) => {
  const [playingVoiceId, setPlayingVoiceId] = React.useState<string | null>(null);

  const handleTestVoice = (voice: FemaleVoice) => {
    setPlayingVoiceId(voice.id);
    speakText(
      voice.sampleQuote,
      voice,
      () => setPlayingVoiceId(voice.id),
      () => setPlayingVoiceId(null)
    );
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0b101e] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-5 animate-in fade-in zoom-in-95">
        {/* Iridescent background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-fuchsia-500/10 to-transparent rounded-full pointer-events-none blur-3xl" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                SELECT FRIDAY FEMALE VOICE
              </h3>
              <p className="text-xs text-slate-400">
                Multiple nuanced female voice personas with custom pitch, cadence, and timbre
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voices List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 relative z-10 max-h-[460px] overflow-y-auto pr-1">
          {FEMALE_VOICE_PRESETS.map(voice => {
            const isSelected = currentVoice.id === voice.id;
            const isPlaying = playingVoiceId === voice.id;

            return (
              <div
                key={voice.id}
                onClick={() => onSelectVoice(voice)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-500/15'
                    : 'bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${voice.avatarColor} p-0.5 shadow-md flex items-center justify-center text-white text-xs font-bold`}>
                        {voice.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          {voice.name}
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />}
                        </div>
                        <div className="text-[11px] text-cyan-300 font-mono">
                          {voice.accent}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleTestVoice(voice);
                      }}
                      className={`p-2 rounded-xl transition-all ${
                        isPlaying
                          ? 'bg-cyan-500 text-black font-bold animate-pulse'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                      title="Play sample voice clip"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                    {voice.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Timbre: {voice.character}</span>
                  <span className="text-cyan-400">Rate: {voice.webSpeechRate}x</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
          >
            Apply & Confirm Voice
          </button>
        </div>
      </div>
    </div>
  );
};
