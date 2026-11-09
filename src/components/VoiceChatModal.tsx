import React, { useState, useEffect, useRef } from 'react';
import { FemaleVoice, Message } from '../types/index.ts';
import { speakText } from '../utils/voicePresets.ts';
import { Mic, MicOff, Volume2, X, Sparkles, Activity, Radio, PhoneOff } from 'lucide-react';

interface VoiceChatModalProps {
  currentVoice: FemaleVoice;
  onSendMessage: (text: string) => Promise<string | undefined>;
  onClose: () => void;
}

export const VoiceChatModal: React.FC<VoiceChatModalProps> = ({
  currentVoice,
  onSendMessage,
  onClose,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastFridayReply, setLastFridayReply] = useState<string>(
    `Online and awaiting your verbal directive, Boss. Using voice profile: ${currentVoice.name}.`
  );

  const recognitionRef = useRef<any>(null);
  const stopSpeechRef = useRef<(() => void) | null>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);

        if (event.results[current].isFinal) {
          handleVoiceSubmit(resultTranscript);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Play greeting
    stopSpeechRef.current = speakText(
      `FRIDAY voice channel open. Ready for orders, Boss.`,
      currentVoice,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );

    return () => {
      if (stopSpeechRef.current) stopSpeechRef.current();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [currentVoice]);

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (stopSpeechRef.current) stopSpeechRef.current();
      setIsSpeaking(false);
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        // Fallback simulated voice input prompt
        const promptInput = prompt("Microphone access pending. Type what you'd like to say to FRIDAY:");
        if (promptInput) {
          handleVoiceSubmit(promptInput);
        }
      }
    }
  };

  const handleVoiceSubmit = async (userText: string) => {
    if (!userText.trim()) return;
    setIsThinking(true);
    setTranscript(userText);

    try {
      const reply = await onSendMessage(userText);
      const cleanReply = reply || "I've processed your directive, Boss.";
      setLastFridayReply(cleanReply);
      setIsThinking(false);

      // Speak back using active female voice
      stopSpeechRef.current = speakText(
        cleanReply,
        currentVoice,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    } catch (err) {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#060913]/90 backdrop-blur-2xl z-50 flex flex-col items-center justify-between p-6 md:p-12 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white tracking-wider text-base">F.R.I.D.A.Y. LIVE COMM</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {currentVoice.name}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Full-Duplex Conversational Voice Channel
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Holographic Frequency Sphere & Visualizer */}
      <div className="flex flex-col items-center justify-center space-y-8 my-auto relative">
        {/* Holographic Glowing Pulse Rings */}
        <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
          <div
            className={`absolute inset-0 rounded-full border border-cyan-400/30 transition-all duration-700 ${
              isSpeaking || isListening ? 'scale-125 opacity-60 animate-ping' : 'scale-100 opacity-20'
            }`}
          />
          <div
            className={`absolute -inset-4 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-2xl transition-all duration-500 ${
              isSpeaking ? 'opacity-80 scale-110' : 'opacity-30 scale-95'
            }`}
          />

          {/* Central Arc Core Orb */}
          <div className="w-44 h-44 md:w-56 md:h-56 rounded-full bg-slate-950 border-2 border-cyan-400/80 shadow-[0_0_60px_rgba(0,240,255,0.4)] flex items-center justify-center relative overflow-hidden backdrop-blur-xl">
            {/* Holographic HUD Grid inside */}
            <div className="absolute inset-0 hud-grid opacity-30" />
            
            {/* Concentric Gyroscopic Rings */}
            <div
              className={`w-36 h-36 rounded-full border border-dashed border-cyan-400/50 flex items-center justify-center transition-transform ${
                isSpeaking ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '6s' }}
            >
              <div
                className={`w-24 h-24 rounded-full border border-fuchsia-400/60 flex items-center justify-center transition-transform ${
                  isSpeaking ? 'animate-spin' : ''
                }`}
                style={{ animationDirection: 'reverse', animationDuration: '4s' }}
              >
                {/* Glowing Core */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-300 to-white shadow-[0_0_30px_#00f0ff] ${
                  isSpeaking ? 'scale-125 animate-pulse' : 'scale-100'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* State readout */}
        <div className="text-center space-y-2 max-w-xl px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs font-mono">
            {isSpeaking ? (
              <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                FRIDAY SPEAKING ({currentVoice.accent})
              </span>
            ) : isListening ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LISTENING TO YOUR DIRECTIVE...
              </span>
            ) : isThinking ? (
              <span className="text-amber-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                SYNTHESIZING TACTICAL REASONING...
              </span>
            ) : (
              <span className="text-slate-400">TAP MIC TO SPEAK DIRECTLY</span>
            )}
          </div>

          {/* Transcript / Reply Display */}
          <div className="min-h-[72px] flex items-center justify-center">
            {transcript && (
              <p className="text-sm md:text-base text-cyan-200 font-medium italic">
                "{transcript}"
              </p>
            )}
            {!transcript && lastFridayReply && (
              <p className="text-sm md:text-base text-slate-200 leading-relaxed max-w-lg">
                {lastFridayReply}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-md flex items-center justify-center gap-6 pb-4">
        {/* Microphone Button */}
        <button
          onClick={toggleMic}
          className={`w-18 h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
            isListening
              ? 'bg-rose-500 text-white shadow-rose-500/40 animate-pulse ring-8 ring-rose-500/20'
              : 'bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 shadow-cyan-500/40 hover:brightness-110'
          }`}
        >
          {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        {/* Quick Say Suggestions */}
        <div className="hidden sm:flex flex-col gap-1.5 text-xs text-slate-400 font-mono">
          <button
            onClick={() => handleVoiceSubmit("FRIDAY, status report on Mark 85 armor")}
            className="text-left px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-all truncate max-w-xs"
          >
            "Status report on Mark 85 armor"
          </button>
          <button
            onClick={() => handleVoiceSubmit("Run deep security scan and malware sweep")}
            className="text-left px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-all truncate max-w-xs"
          >
            "Run deep security scan"
          </button>
        </div>
      </div>
    </div>
  );
};
