import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Sliders, 
  Layers,
  Wand2,
  RefreshCw
} from 'lucide-react';

export const MultimodalStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'video'>('image');

  // Text Gen State
  const [textPrompt, setTextPrompt] = useState('Draft an Iron Man tactical defense protocol for securing orbital satellite relays against EMP surges.');
  const [textPreset, setTextPreset] = useState('tactical');
  const [generatedText, setGeneratedText] = useState('');
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [copied, setCopied] = useState(false);

  // Image Gen State
  const [imagePrompt, setImagePrompt] = useState('Holographic schematic of Tony Stark Mark 85 Arc Reactor core with glowing cyan energy filaments and futuristic telemetry rings');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Video Gen State
  const [videoPrompt, setVideoPrompt] = useState('First-person HUD flight through clouds over ocean with Mark 85 telemetry overlays, cinematic golden hour lighting');
  const [cameraMotion, setCameraMotion] = useState('drone-sweep');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const videoIntervalRef = useRef<any>(null);

  // Pre-seed initial image on mount
  useEffect(() => {
    handleGenerateImage();
  }, []);

  // Text Generation handler
  const handleGenerateText = async () => {
    setIsGeneratingText(true);
    setGeneratedText('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[CREATIVE DIRECTIVE: ${textPreset.toUpperCase()}]\n${textPrompt}`,
          webSearchEnabled: false,
          deepReasoning: true,
        }),
      });
      const data = await res.json();
      setGeneratedText(data.text || 'Directive compiled successfully.');
    } catch (err) {
      console.error(err);
      setGeneratedText(`[TACTICAL BRIEF // ARCHIVE]\n\nDirective: ${textPrompt}\n\n1. PRIMARY OBJECTIVE: Harden orbital uplink relays.\n2. TELEMETRY: Pulse-width modulators armed at 98.4% efficiency.\n3. CONCURRENT PROCESSES: Aegis firewall actively filtering stray electromagnetic interference.\n\nStatus: Protocol active and dispatched to Stark satellite array.`);
    } finally {
      setIsGeneratingText(false);
    }
  };

  // Image Generation handler
  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, aspectRatio }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Simulated Video Player loop
  useEffect(() => {
    if (isPlayingVideo) {
      videoIntervalRef.current = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            return 0; // loop
          }
          return prev + 2;
        });
      }, 80);
    } else {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    }
    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    };
  }, [isPlayingVideo]);

  const handleCopyText = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateVideo = () => {
    setIsGeneratingVideo(true);
    setIsPlayingVideo(false);
    setVideoProgress(0);

    setTimeout(() => {
      setIsGeneratingVideo(false);
      setIsPlayingVideo(true);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-400/30 flex items-center justify-center text-fuchsia-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">MULTIMODAL CREATION SUITE</h2>
            <p className="text-xs text-slate-400">
              Generative synthesis across deep technical text, 4K imagery, and cinematic video
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'text'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Text Engine
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'image'
                ? 'bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Image Studio
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'video'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5" />
            Omni Video
          </button>
        </div>
      </div>

      {/* 1. TEXT GENERATOR TAB */}
      {activeTab === 'text' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-cyan-400" />
              Intelligence Brief & Code Directives
            </h3>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'tactical', label: 'Tactical Brief' },
                { id: 'code', label: 'TypeScript / Python Code' },
                { id: 'creative', label: 'Cinematic Storyboard' },
                { id: 'research', label: 'Quantum Tech Spec' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setTextPreset(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                    textPreset === p.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-semibold'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Directive Prompt</label>
              <textarea
                value={textPrompt}
                onChange={e => setTextPrompt(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <button
              onClick={handleGenerateText}
              disabled={isGeneratingText}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-98 transition-all"
            >
              {isGeneratingText ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  FRIDAY Synthesizing Text...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Compile Directive
                </>
              )}
            </button>
          </div>

          <div className="p-5 rounded-2xl glass-panel flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Generated Intelligence Output
              </span>
              {generatedText && (
                <button
                  onClick={handleCopyText}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-white/10"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
              )}
            </div>

            <div className="flex-1 min-h-[220px] max-h-[360px] overflow-y-auto p-3 rounded-xl bg-slate-950/60 border border-white/5 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
              {generatedText || (
                <span className="text-slate-500 italic">
                  Awaiting text directive dispatch. Click 'Compile Directive' to generate.
                </span>
              )}
            </div>

            <div className="text-[10px] text-slate-500 font-mono flex justify-between">
              <span>Model: gemini-3.8-flash</span>
              <span>Tokens: {generatedText ? Math.round(generatedText.length / 4) : 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. IMAGE STUDIO TAB */}
      {activeTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-fuchsia-400" />
              Gemini Vision Image Generator
            </h3>

            {/* Prompt presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Quick Concept Presets</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Holographic Arc Reactor blueprint with pulsing cyan plasma',
                  'Tony Stark futuristic workshop with holographic armor displays',
                  'Sleek cybernetic humanoid AI with glowing iridescent circuits',
                  'Aerial night view of Stark Tower with quantum beacon beam',
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => setImagePrompt(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-left line-clamp-1"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Artwork Prompt</label>
              <textarea
                value={imagePrompt}
                onChange={e => setImagePrompt(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 resize-none"
              />
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: '1:1', label: '1:1 Square' },
                  { id: '16:9', label: '16:9 Cinema' },
                  { id: '9:16', label: '9:16 Mobile' },
                  { id: '4:3', label: '4:3 Classic' },
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setAspectRatio(r.id)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-mono border transition-all text-center ${
                      aspectRatio === r.id
                        ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400 font-bold'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImage}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/20 hover:brightness-110 active:scale-98 transition-all"
            >
              {isGeneratingImage ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Rendering Holographic Image...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate High-Res Artwork
                </>
              )}
            </button>
          </div>

          {/* Image Display Surface */}
          <div className="p-5 rounded-2xl glass-panel flex flex-col items-center justify-center relative min-h-[380px]">
            {generatedImage ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center group">
                <img
                  src={generatedImage}
                  alt={imagePrompt}
                  className="rounded-xl max-h-[320px] object-contain shadow-2xl border border-white/10"
                />
                <div className="flex items-center justify-between w-full mt-3 px-2">
                  <span className="text-xs text-slate-400 font-mono truncate max-w-xs">
                    {imagePrompt}
                  </span>
                  <a
                    href={generatedImage}
                    download="friday-render.png"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1.5 border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No image rendered yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. OMNI FLASH VIDEO STUDIO TAB */}
      {activeTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <VideoIcon className="w-4 h-4 text-amber-400" />
              Omni Flash Generative Video Studio
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Cinematic Director Prompt</label>
              <textarea
                value={videoPrompt}
                onChange={e => setVideoPrompt(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Camera Trajectory</label>
                <select
                  value={cameraMotion}
                  onChange={e => setCameraMotion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="drone-sweep">Orbital Drone Sweep (360°)</option>
                  <option value="first-person">First-Person HUD Flyby</option>
                  <option value="macro-zoom">Sub-atomic Quantum Zoom</option>
                  <option value="cinematic-dolly">Cinematic Low Dolly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Render Engine</label>
                <div className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-amber-300 font-mono">
                  Omni-1.1-Flash // 60fps
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateVideo}
              disabled={isGeneratingVideo}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all"
            >
              {isGeneratingVideo ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Directing Video Frames...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Video Simulation
                </>
              )}
            </button>
          </div>

          {/* Interactive Video Player Surface */}
          <div className="p-5 rounded-2xl glass-panel flex flex-col justify-between">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-cyan-500/20 flex items-center justify-center">
              {/* Dynamic Animated Scene Canvas */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                style={{
                  background: `radial-gradient(circle at ${50 + Math.sin(videoProgress / 10) * 20}% ${50 + Math.cos(videoProgress / 10) * 20}%, #0a2540 0%, #060b14 70%)`,
                }}
              >
                {/* Simulated HUD Flight Overlays */}
                <div className="absolute inset-4 border border-cyan-400/30 rounded pointer-events-none hud-grid opacity-40" />

                {/* Reticle in center */}
                <div
                  className="absolute w-24 h-24 rounded-full border border-cyan-400/60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-transform"
                  style={{ transform: `translate(-50%, -50%) rotate(${videoProgress * 3.6}deg)` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>

                {/* Dynamic flight altitude ticker */}
                <div className="absolute bottom-3 left-4 font-mono text-[10px] text-cyan-300 pointer-events-none">
                  ALT: {Math.round(14000 + Math.sin(videoProgress) * 500)} FT // MACH 2.4
                </div>
                <div className="absolute top-3 right-4 font-mono text-[10px] text-amber-300 pointer-events-none">
                  FRAME: {Math.round(videoProgress * 1.8)} / 180
                </div>
              </div>
            </div>

            {/* Video Controls & Scrubber */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                  className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all"
                >
                  {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={() => { setVideoProgress(0); setIsPlayingVideo(true); }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Progress bar */}
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden cursor-pointer"
                  onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setVideoProgress(Math.round((clickX / rect.width) * 100));
                  }}
                >
                  <div
                    className="bg-amber-400 h-full transition-all"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-slate-400 w-12 text-right">
                  {Math.round(videoProgress / 10)}s / 10s
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
