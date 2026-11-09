import React, { useState, useRef, useEffect } from 'react';
import { Message, FemaleVoice, MemoryNode } from '../types/index.ts';
import { parseReasoning } from '../utils/reasoningFormatter.ts';
import { extractPotentialMemories, upsertMemory } from '../utils/memoryEngine.ts';
import { speakText } from '../utils/voicePresets.ts';
import { 
  Send, 
  Sparkles, 
  Globe, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  BrainCircuit, 
  ShieldCheck, 
  Radio, 
  Bot, 
  User as UserIcon,
  Mic,
  Copy,
  Check
} from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<string | undefined>;
  currentVoice: FemaleVoice;
  memories: MemoryNode[];
  onMemoriesChange: (memories: MemoryNode[]) => void;
  webSearchEnabled: boolean;
  onToggleWebSearch: () => void;
  deepReasoning: boolean;
  onToggleDeepReasoning: () => void;
  onOpenVoiceModal: () => void;
  isSending: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  currentVoice,
  memories,
  onMemoriesChange,
  webSearchEnabled,
  onToggleWebSearch,
  deepReasoning,
  onToggleDeepReasoning,
  onOpenVoiceModal,
  isSending,
}) => {
  const [inputText, setInputText] = useState('');
  const [expandedReasoningMap, setExpandedReasoningMap] = useState<Record<string, boolean>>({});
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const stopSpeechRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isSending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const userText = inputText.trim();
    setInputText('');

    // Check if user text contains potential long-term memory to extract
    const extracted = extractPotentialMemories(userText);
    if (extracted) {
      const updated = upsertMemory(memories, {
        key: extracted.key,
        value: extracted.value,
        category: extracted.category,
        confidence: 0.95,
        pinned: false,
      });
      onMemoriesChange(updated);
    }

    await onSendMessage(userText);
  };

  const toggleReasoning = (messageId: string) => {
    setExpandedReasoningMap(prev => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const handleSpeak = (messageId: string, text: string) => {
    if (playingMessageId === messageId) {
      if (stopSpeechRef.current) stopSpeechRef.current();
      setPlayingMessageId(null);
      return;
    }

    if (stopSpeechRef.current) stopSpeechRef.current();
    setPlayingMessageId(messageId);

    stopSpeechRef.current = speakText(
      text,
      currentVoice,
      () => setPlayingMessageId(messageId),
      () => setPlayingMessageId(null)
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d]/70 rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl backdrop-blur-xl">
      {/* Chat Sub-Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-white/10 bg-slate-900/60 z-10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono text-cyan-300 tracking-wider">
            CONTEXT REASONING // STARK NEURAL BUS
          </span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            ({memories.length} Memories Recalled)
          </span>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center gap-2">
          {/* Deep Reasoning Toggle */}
          <button
            onClick={onToggleDeepReasoning}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all ${
              deepReasoning
                ? 'bg-purple-500/20 text-purple-300 border-purple-400/40 font-semibold shadow-sm'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Tactical Reasoning: {deepReasoning ? 'ON' : 'OFF'}
          </button>

          {/* Web Search Uplink Toggle */}
          <button
            onClick={onToggleWebSearch}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all ${
              webSearchEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 font-semibold shadow-sm'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Web Uplink: {webSearchEnabled ? 'LIVE' : 'OFF'}
          </button>

          {/* Voice Mode Quick Button */}
          <button
            onClick={onOpenVoiceModal}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Mic className="w-3.5 h-3.5" />
            Voice Chat
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          const { sections, cleanedText } = parseReasoning(msg.text);
          const hasReasoning = msg.reasoning || sections.length > 0;
          const reasoningContent = msg.reasoning || (sections.length > 0 ? sections.map(s => `[${s.label}]\n${s.content}`).join('\n\n') : '');
          const isReasoningExpanded = Boolean(expandedReasoningMap[msg.id]);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-3xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              {/* Message Header Label */}
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-slate-400">
                {isUser ? (
                  <>
                    <span>Boss (You)</span>
                    <UserIcon className="w-3 h-3 text-cyan-400" />
                  </>
                ) : (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 p-[1px] flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-slate-950" />
                    </div>
                    <span className="text-cyan-300 font-bold">F.R.I.D.A.Y.</span>
                    <span className="text-[10px] text-slate-500">
                      • Voice: {currentVoice.name}
                    </span>
                  </>
                )}
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Message Bubble Container */}
              <div
                className={`p-4 rounded-2xl relative shadow-md transition-all ${
                  isUser
                    ? 'bg-gradient-to-tr from-cyan-600 to-blue-700 text-white rounded-tr-none'
                    : 'glass-panel text-slate-200 border-white/10 rounded-tl-none w-full'
                }`}
              >
                {/* Collapsible Deep Reasoning Card (for Assistant messages) */}
                {!isUser && hasReasoning && (
                  <div className="mb-3 rounded-xl bg-purple-950/30 border border-purple-500/30 overflow-hidden">
                    <button
                      onClick={() => toggleReasoning(msg.id)}
                      className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-mono text-purple-300 hover:bg-purple-500/10 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Tactical Reasoning Process (Stark Matrix)
                      </span>
                      {isReasoningExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {isReasoningExpanded && (
                      <div className="px-3 pb-3 pt-1 text-xs text-purple-200/90 font-mono leading-relaxed whitespace-pre-wrap border-t border-purple-500/20 bg-black/20">
                        {reasoningContent}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Message Text */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {cleanedText}
                </div>

                {/* Live Web Search Citations */}
                {!isUser && msg.searchSources && msg.searchSources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10">
                    <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1 mb-1.5">
                      <Globe className="w-3 h-3" />
                      Live Grounding Uplink Sources:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.searchSources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 text-[11px] transition-all"
                        >
                          <span className="truncate max-w-[160px]">{source.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assistant Bubble Actions: Voice playback & Copy */}
                {!isUser && (
                  <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleCopy(msg.id, cleanedText)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSpeak(msg.id, cleanedText)}
                      className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                        playingMessageId === msg.id
                          ? 'text-cyan-400 bg-cyan-500/20 font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                      title="Speak response in FRIDAY voice"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono">
                        {playingMessageId === msg.id ? 'Speaking...' : 'Listen'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 p-3 rounded-2xl glass-panel max-w-sm text-xs font-mono text-cyan-300 animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
            <span>FRIDAY computing contextual response...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Directives */}
      <div className="px-4 py-2 border-t border-white/5 bg-slate-900/40 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">Directives:</span>
        {[
          "FRIDAY, report Mark 85 status and perimeter defense",
          "Search recent orbital space station telemetry",
          "Scan memory buffers for malware anomalies",
          "Remember: Always prioritize civilian shielding protocols",
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-cyan-300 text-slate-300 border border-white/5 shrink-0 transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-white/10 bg-slate-950/80 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Speak or enter directive for FRIDAY (e.g., 'Execute defense protocol', 'Who are you?')..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
            inputText.trim() && !isSending
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
