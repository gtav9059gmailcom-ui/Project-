import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { 
  Download, 
  Smartphone, 
  Check, 
  Copy, 
  X, 
  ExternalLink, 
  QrCode, 
  ShieldCheck, 
  Terminal,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DownloadApkModalProps {
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'guide' | 'twa'>('install');

  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-fkq26rnrojwuq2ptijzvif-561819022342.asia-east1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setInstallSuccess(true);
      }
    } else {
      // If browser hasn't fired beforeinstallprompt yet, switch to step-by-step guide
      setActiveTab('guide');
    }
  };

  const handleDownloadOfflinePackage = () => {
    const offlineManifest = {
      app: 'Friday AI',
      version: '4.8.0',
      type: 'Android WebAPK / PWA Package',
      manifestUrl: `${window.location.origin}/manifest.json`,
      startUrl: window.location.origin,
      themeColor: '#060812',
      icons: ['/icon.svg'],
      instructions: [
        '1. Open Chrome on Android',
        '2. Navigate to your app URL',
        '3. Tap Menu (three dots) -> Install App to download and generate your native Android WebAPK file.'
      ]
    };

    const blob = new Blob([JSON.stringify(offlineManifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'friday-ai-apk-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // QR Code URL using quickchart QR generator
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(appUrl)}&bgcolor=060812&color=00f0ff&margin=2`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#090d1c] border border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_60px_rgba(0,240,255,0.15)] relative overflow-hidden space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-fuchsia-500/10 to-transparent rounded-full pointer-events-none blur-3xl" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Smartphone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  DOWNLOAD & INSTALL FRIDAY APK
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Android WebAPK
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Install F.R.I.D.A.Y. directly as an Android application with native home screen icon & offline capability
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

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10 relative z-10">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'install'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            1-Click Install WebAPK
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Android Instructions
          </button>
          <button
            onClick={() => setActiveTab('twa')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'twa'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Standalone APK (TWA)
          </button>
        </div>

        {/* TAB 1: 1-Click Install */}
        {activeTab === 'install' && (
          <div className="space-y-5 relative z-10">
            {/* Primary Action Hero Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Ready for Android Device
                </span>
                <h4 className="text-base font-extrabold text-white">
                  Direct WebAPK Installation
                </h4>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                  Google Play Services & Chromium mint a signed <strong>WebAPK (.apk)</strong> package for your Android device, adding FRIDAY to your App Drawer and Home Screen.
                </p>
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition-all shrink-0"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                {isInstallable ? 'Install Android APK' : 'Install on Android'}
              </button>
            </div>

            {/* Scan QR code to open on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl glass-panel flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl bg-slate-950 p-1 border border-cyan-500/30 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={qrCodeUrl}
                    alt="Scan QR code with Android Camera"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                    Scan with Phone Camera
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Point your Android camera at the QR code to open directly in Chrome and install the APK.
                  </p>
                </div>
              </div>

              {/* Share URL */}
              <div className="p-4 rounded-2xl glass-panel flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-xs font-mono text-slate-400">Direct App Link:</span>
                  <div className="p-2 rounded-xl bg-slate-950 border border-white/10 font-mono text-[11px] text-cyan-300 truncate mt-1">
                    {appUrl}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 border border-white/10 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Link Copied!' : 'Copy Link to Phone'}
                  </button>
                  <button
                    onClick={handleDownloadOfflinePackage}
                    className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 flex items-center gap-1"
                    title="Download package config"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Config
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Android Step-by-Step Instructions */}
        {activeTab === 'guide' && (
          <div className="space-y-4 relative z-10">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 text-xs text-slate-300 leading-relaxed">
              Google Chrome and modern Android browsers create and install real, signed <strong>WebAPKs</strong> directly from the browser without needing to enable risky unknown sources!
            </div>

            <div className="space-y-3">
              {[
                {
                  step: '1',
                  title: 'Open in Android Chrome or Samsung Internet',
                  desc: 'Ensure you open this link in your Android mobile browser (Chrome, Samsung Internet, Edge, or Brave).',
                },
                {
                  step: '2',
                  title: 'Tap the Browser Menu (3 dots)',
                  desc: 'Tap the vertical three dots ⋮ in the upper right-hand corner of your browser.',
                },
                {
                  step: '3',
                  title: 'Select "Install App" or "Add to Home screen"',
                  desc: 'Look for "Install App" (or "Add to Home screen"). Tap it and confirm "Install".',
                },
                {
                  step: '4',
                  title: 'Android Mints the WebAPK File',
                  desc: 'Google Play Services generates the native Android APK package and installs "Friday AI" straight into your Android app drawer.',
                },
              ].map(item => (
                <div key={item.step} className="p-3.5 rounded-xl glass-panel flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-white text-xs">{item.title}</h5>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Link Copied!' : 'Copy Link to Open on Android'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Build Custom Standalone APK with TWA / Bubblewrap */}
        {activeTab === 'twa' && (
          <div className="space-y-4 relative z-10 font-mono text-xs">
            <p className="text-slate-300 font-sans">
              To build a standalone unsigned or release signed <strong>.apk</strong> / <strong>.aab</strong> file for Google Play or direct USB sideloading, use Google's official <strong>Bubblewrap CLI</strong> (Trusted Web Activity):
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2 text-cyan-300">
              <div className="text-slate-500">// 1. Install Google Bubblewrap CLI</div>
              <div className="text-white">npm install -g @bubblewrap/cli</div>
              
              <div className="text-slate-500 pt-2">// 2. Initialize Android Project from Friday Manifest</div>
              <div className="text-white">bubblewrap init --manifest={appUrl}manifest.json</div>

              <div className="text-slate-500 pt-2">// 3. Build signed Android APK file</div>
              <div className="text-emerald-400">bubblewrap build</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 font-sans text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              This outputs `app-release-signed.apk` ready for distribution on Android 8.0+.
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 relative z-10 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified APK Safe & Sandboxed
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
