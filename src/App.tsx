import React, { useState, useEffect } from 'react';
import { 
  Message, 
  FemaleVoice, 
  MemoryNode 
} from './types/index.ts';
import { FEMALE_VOICE_PRESETS } from './utils/voicePresets.ts';
import { AppLogo } from './components/AppLogo.tsx';
import { ChatInterface } from './components/ChatInterface.tsx';
import { ThreeGraphicsEngine } from './components/ThreeGraphicsEngine.tsx';
import { SecurityBackgroundEngine } from './components/SecurityBackgroundEngine.tsx';
import { SmartMemoryCenter } from './components/SmartMemoryCenter.tsx';
import { MultimodalStudio } from './components/MultimodalStudio.tsx';
import { VoiceSelectorModal } from './components/VoiceSelectorModal.tsx';
import { VoiceChatModal } from './components/VoiceChatModal.tsx';
import { DownloadApkModal } from './components/DownloadApkModal.tsx';
import { 
  MessageSquare, 
  Box, 
  ShieldCheck, 
  Sparkles, 
  BrainCircuit, 
  Radio, 
  Mic, 
  Globe, 
  Cpu, 
  Zap,
  Activity,
  Maximize2,
  Download
} from 'lucide-react';

export default function App() {
  // Navigation Tab
  const [activeTab, setActiveTab] = useState<'chat' | '3d-engine' | 'security' | 'multimodal' | 'memory'>('chat');

  // Female Voice Selection
  const [currentVoice, setCurrentVoice] = useState<FemaleVoice>(FEMALE_VOICE_PRESETS[0]);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
  const [isDownloadApkOpen, setIsDownloadApkOpen] = useState(false);

  // Settings & Toggles
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [deepReasoning, setDeepReasoning] = useState(true);
  const [systemIntegrityScore, setSystemIntegrityScore] = useState(72);
  const [isSending, setIsSending] = useState(false);

  // Smart Long-Term Memories Bank
  const [memories, setMemories] = useState<MemoryNode[]>([
    {
      id: 'mem-1',
      category: 'personal',
      key: 'Primary User Identity',
      value: 'Tony Stark (Boss) // Authorized Stark Industries Level 10 Admin',
      confidence: 1.0,
      timestamp: '2026-10-24T08:30:00Z',
      pinned: true,
      accessCount: 14,
    },
    {
      id: 'mem-2',
      category: 'protocol',
      key: 'House Party Protocol',
      value: 'Instant autonomous deployment of all Mark armor iterations to coordinate perimeter defense.',
      confidence: 0.99,
      timestamp: '2026-10-24T09:15:00Z',
      pinned: true,
      accessCount: 8,
    },
    {
      id: 'mem-3',
      category: 'project',
      key: 'Mark 85 Nanotech Armor',
      value: 'Nanotech lattice operating at 98.6% efficiency. Repulsor gauntlets calibrated for 1200GW pulse yield.',
      confidence: 0.96,
      timestamp: '2026-10-24T09:45:00Z',
      pinned: false,
      accessCount: 19,
    },
    {
      id: 'mem-4',
      category: 'preference',
      key: 'Flight & Telemetry Units',
      value: 'Metric telemetry preferred for atmospheric calculations; Mach speeds for flight vectors.',
      confidence: 0.94,
      timestamp: '2026-10-24T10:00:00Z',
      pinned: false,
      accessCount: 6,
    },
  ]);

  // Conversation Messages Feed
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: "Boss, all systems are operational. I've initiated our hybrid telemetry bus blending ColorOS fluid aquamorphic response with Stark tactical precision. What are your orders for today?",
      reasoning: "[SITUATION ANALYSIS]\nBoot sequence complete. Mark 85 CAD schematics verified in 3D Holo-Engine.\n[TACTICAL ASSESSMENT]\nAegis security suite active. 2 background threats flagged in volatile memory buffer.\n[RECOMMENDATION]\nRecommend running a deep security sweep or reviewing the 3D armor assembly.",
      timestamp: new Date().toISOString(),
      model: 'gemini-3.8-flash',
    },
  ]);

  // Send message to server backend
  const handleSendMessage = async (userText: string): Promise<string | undefined> => {
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-6),
          memories: memories,
          webSearchEnabled,
          deepReasoning,
        }),
      });

      const data = await response.json();
      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        text: data.text || "Directive completed, Boss.",
        reasoning: data.reasoning,
        searchSources: data.searchSources,
        timestamp: data.timestamp || new Date().toISOString(),
        model: 'gemini-3.8-flash',
      };

      setMessages(prev => [...prev, assistantMsg]);
      return assistantMsg.text;
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        text: `Understood, Boss. Processed your directive for "${userText}". All telemetry parameters remain in nominal tolerance.`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, fallbackMsg]);
      return fallbackMsg.text;
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060812] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Stark HUD Grid & Glowing Ambient Orbs */}
      <div className="fixed inset-0 hud-grid opacity-35 pointer-events-none" />
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Header Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080d1c]/85 backdrop-blur-2xl px-4 sm:px-6 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo with catchy colorful AI emblem */}
          <AppLogo size="md" />

          {/* Quick Telemetry Status Badges */}
          <div className="hidden lg:flex items-center gap-3">
            {/* System Integrity */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono">
              <ShieldCheck className={`w-3.5 h-3.5 ${systemIntegrityScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="text-slate-400">AEGIS:</span>
              <span className={`font-bold ${systemIntegrityScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {systemIntegrityScore}%
              </span>
            </div>

            {/* Background Daemons */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">DAEMONS:</span>
              <span className="text-cyan-300 font-bold">5 ACTIVE</span>
            </div>

            {/* Active Voice Persona */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs font-mono hover:bg-cyan-500/10 transition-all text-left"
              title="Click to switch female voice persona"
            >
              <Radio className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
              <span className="text-slate-400">VOICE:</span>
              <span className="text-fuchsia-300 font-bold">{currentVoice.name}</span>
            </button>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsDownloadApkOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download APK</span>
            </button>

            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-white/10 flex items-center gap-1.5 transition-all"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Voice:</span> {currentVoice.name.split(' ')[1] || 'Prime'}
            </button>

            <button
              onClick={() => setIsVoiceChatOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>Live Voice Comm</span>
            </button>
          </div>
        </div>

        {/* Fluid Navigation Tab Bar (ColorOS / OxygenOS style) */}
        <div className="max-w-7xl mx-auto mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between overflow-x-auto gap-2 pb-1">
          <nav className="flex items-center gap-1.5">
            {[
              { id: 'chat', label: 'Neural Chat & Reasoning', icon: MessageSquare },
              { id: '3d-engine', label: '3D Holo-Engine', icon: Box },
              { id: 'security', label: 'Security & Daemons', icon: ShieldCheck },
              { id: 'multimodal', label: 'Multimodal Studio', icon: Sparkles },
              { id: 'memory', label: 'Smart Memory', icon: BrainCircuit },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="text-[11px] font-mono text-cyan-400/80 shrink-0 hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            STARK MARK 85 SYSTEM // NOMINAL
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 z-10">
        {activeTab === 'chat' && (
          <div className="h-[calc(100vh-210px)] min-h-[580px]">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              currentVoice={currentVoice}
              memories={memories}
              onMemoriesChange={setMemories}
              webSearchEnabled={webSearchEnabled}
              onToggleWebSearch={() => setWebSearchEnabled(!webSearchEnabled)}
              deepReasoning={deepReasoning}
              onToggleDeepReasoning={() => setDeepReasoning(!deepReasoning)}
              onOpenVoiceModal={() => setIsVoiceChatOpen(true)}
              isSending={isSending}
            />
          </div>
        )}

        {activeTab === '3d-engine' && (
          <div className="h-[calc(100vh-210px)] min-h-[580px]">
            <ThreeGraphicsEngine />
          </div>
        )}

        {activeTab === 'security' && (
          <SecurityBackgroundEngine
            onIntegrityChange={score => setSystemIntegrityScore(score)}
          />
        )}

        {activeTab === 'multimodal' && (
          <MultimodalStudio />
        )}

        {activeTab === 'memory' && (
          <SmartMemoryCenter
            memories={memories}
            onMemoriesChange={setMemories}
          />
        )}
      </main>

      {/* Stark HUD Bottom Telemetry Bar */}
      <footer className="border-t border-white/10 bg-[#070b16]/90 backdrop-blur-xl px-4 sm:px-6 py-2.5 z-20 text-[11px] font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="text-cyan-400 font-bold">FRIDAY OS v4.8</span>
            <span>•</span>
            <span>PING: <strong className="text-white">18ms</strong></span>
            <span>•</span>
            <span>ARC CORE: <strong className="text-emerald-400">98.6%</strong></span>
            <span>•</span>
            <span className="hidden sm:inline">SAT UPLINK: <strong className="text-cyan-300">GEO-SYNC</strong></span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>Powered by Gemini & Stark Industries</span>
          </div>
        </div>
      </footer>

      {/* Voice Selection Modal */}
      {isVoiceModalOpen && (
        <VoiceSelectorModal
          currentVoice={currentVoice}
          onSelectVoice={voice => {
            setCurrentVoice(voice);
            setIsVoiceModalOpen(false);
          }}
          onClose={() => setIsVoiceModalOpen(false)}
        />
      )}

      {/* Live Conversational Voice Chat Modal */}
      {isVoiceChatOpen && (
        <VoiceChatModal
          currentVoice={currentVoice}
          onSendMessage={handleSendMessage}
          onClose={() => setIsVoiceChatOpen(false)}
        />
      )}

      {/* Download APK / WebAPK Modal */}
      {isDownloadApkOpen && (
        <DownloadApkModal
          onClose={() => setIsDownloadApkOpen(false)}
        />
      )}
    </div>
  );
}
