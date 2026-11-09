export type MessageRole = 'user' | 'assistant' | 'system';

export interface SearchSource {
  title: string;
  url: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  reasoning?: string;
  searchSources?: SearchSource[];
  timestamp: string;
  audioUrl?: string;
  isStreaming?: boolean;
  model?: string;
}

export type MemoryCategory = 'personal' | 'preference' | 'protocol' | 'project' | 'security';

export interface MemoryNode {
  id: string;
  category: MemoryCategory;
  key: string;
  value: string;
  confidence: number;
  timestamp: string;
  pinned: boolean;
  accessCount: number;
}

export type DaemonStatus = 'running' | 'idle' | 'paused' | 'executing';

export interface BackgroundDaemon {
  id: string;
  name: string;
  category: 'security' | 'indexing' | 'telemetry' | 'network' | 'sync';
  status: DaemonStatus;
  intervalSec: number;
  lastRun: string;
  cpuPercent: number;
  memoryKB: number;
  totalExecutions: number;
  description: string;
}

export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ThreatStatus = 'active' | 'quarantined' | 'neutralized';

export interface SecurityThreat {
  id: string;
  name: string;
  category: 'malware' | 'trojan' | 'telemetry-leak' | 'buffer-overflow' | 'suspicious-hook';
  severity: ThreatSeverity;
  targetPath: string;
  detectedAt: string;
  status: ThreatStatus;
  description: string;
  remediationAction: string;
}

export interface SecurityStatus {
  integrityScore: number; // 0 - 100
  isScanning: boolean;
  scanProgress: number; // 0 - 100
  lastScanTimestamp: string;
  activeShields: {
    realtimeProtection: boolean;
    memoryWatchdog: boolean;
    networkFirewall: boolean;
    zeroDayHeuristics: boolean;
  };
  threats: SecurityThreat[];
}

export interface FemaleVoice {
  id: string;
  name: string;
  accent: string;
  character: string;
  description: string;
  geminiVoice: string; // 'Kore', 'Zephyr', etc.
  webSpeechPitch: number;
  webSpeechRate: number;
  avatarColor: string;
  sampleQuote: string;
}

export type HoloEngineMode = 'core' | 'armor' | 'threat-map';

export interface HoloEngineSettings {
  mode: HoloEngineMode;
  theme: 'arc-blue' | 'gemini-iridescent' | 'aquamorphic-emerald' | 'stark-gold';
  wireframe: boolean;
  explodedProgress: number; // 0 to 1
  rotationSpeed: number;
  particleDensity: number;
  bloom: boolean;
}

export interface MultimodalCreation {
  id: string;
  type: 'text' | 'image' | 'video';
  prompt: string;
  resultUrl?: string;
  resultContent?: string;
  aspectRatio?: string;
  timestamp: string;
  status: 'idle' | 'generating' | 'completed' | 'failed';
}
