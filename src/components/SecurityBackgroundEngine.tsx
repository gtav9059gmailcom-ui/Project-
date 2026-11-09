import React, { useState, useEffect } from 'react';
import { 
  SecurityStatus, 
  BackgroundDaemon, 
  SecurityThreat 
} from '../types/index.ts';
import { 
  calculateIntegrityScore, 
  neutralizeThreat, 
  quarantineThreat, 
  neutralizeAllThreats,
  getThreatStatistics 
} from '../utils/securityEngine.ts';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Play, 
  Pause, 
  RefreshCw, 
  Trash2, 
  Cpu, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Terminal,
  Lock,
  Radio
} from 'lucide-react';

interface SecurityBackgroundEngineProps {
  onIntegrityChange?: (score: number) => void;
}

export const SecurityBackgroundEngine: React.FC<SecurityBackgroundEngineProps> = ({ onIntegrityChange }) => {
  // Background Daemons State
  const [daemons, setDaemons] = useState<BackgroundDaemon[]>([
    {
      id: 'd1',
      name: 'Orbital Telemetry Uplink',
      category: 'network',
      status: 'running',
      intervalSec: 15,
      lastRun: 'Just now',
      cpuPercent: 1.2,
      memoryKB: 2450,
      totalExecutions: 842,
      description: 'Continuous satellite bridge syncing real-time web intelligence and planetary news.',
    },
    {
      id: 'd2',
      name: 'Aegis Heuristic Watchdog',
      category: 'security',
      status: 'running',
      intervalSec: 8,
      lastRun: '4s ago',
      cpuPercent: 2.8,
      memoryKB: 4180,
      totalExecutions: 1950,
      description: 'Zero-day memory scanner detecting unauthorized script injection and buffer hooks.',
    },
    {
      id: 'd3',
      name: 'Stark Neural Indexer',
      category: 'indexing',
      status: 'running',
      intervalSec: 30,
      lastRun: '18s ago',
      cpuPercent: 1.5,
      memoryKB: 3200,
      totalExecutions: 312,
      description: 'Compresses long-term memory nodes into high-density semantic recall tables.',
    },
    {
      id: 'd4',
      name: 'Sub-Zero Cache Compactor',
      category: 'telemetry',
      status: 'idle',
      intervalSec: 60,
      lastRun: '45s ago',
      cpuPercent: 0.6,
      memoryKB: 1800,
      totalExecutions: 94,
      description: 'Purges volatile heap scratchpads and reclaims memory headroom for 3D shaders.',
    },
    {
      id: 'd5',
      name: 'Port Sentinel & Socket Guard',
      category: 'security',
      status: 'running',
      intervalSec: 10,
      lastRun: '2s ago',
      cpuPercent: 1.1,
      memoryKB: 2100,
      totalExecutions: 1420,
      description: 'Inspects inbound packets against known Trojan payloads and unauthorized telemetry leaks.',
    },
  ]);

  // Security Aegis State
  const [security, setSecurity] = useState<SecurityStatus>({
    integrityScore: 72,
    isScanning: false,
    scanProgress: 0,
    lastScanTimestamp: '12m ago',
    activeShields: {
      realtimeProtection: true,
      memoryWatchdog: true,
      networkFirewall: true,
      zeroDayHeuristics: true,
    },
    threats: [
      {
        id: 't-101',
        name: 'Trojan.ScriptInject.v4',
        category: 'trojan',
        severity: 'critical',
        targetPath: '/sys/runtime/eval_hook.so',
        detectedAt: '3m ago',
        status: 'active',
        description: 'Unauthorized heap payload attempting to override browser context permissions.',
        remediationAction: 'Terminate daemon & rewrite memory block',
      },
      {
        id: 't-102',
        name: 'Adware.TelemetryLeak.Beacon',
        category: 'telemetry-leak',
        severity: 'medium',
        targetPath: '/cache/analytics_tracker.min.js',
        detectedAt: '8m ago',
        status: 'active',
        description: 'Third-party tracking beacon attempting unauthenticated outbound data transmission.',
        remediationAction: 'Sever outbound socket and delete file',
      },
      {
        id: 't-103',
        name: 'Buffer.Overflow.Anomaly',
        category: 'buffer-overflow',
        severity: 'high',
        targetPath: '/mem/shared/pipe_0x8F',
        detectedAt: '15m ago',
        status: 'quarantined',
        description: 'Rogue thread allocating oversized memory chunks without safety boundary checks.',
        remediationAction: 'Flush buffer and reinitialize safe mutex',
      },
    ],
  });

  const [currentScanningFile, setCurrentScanningFile] = useState<string>('');
  const [logMessages, setLogMessages] = useState<string[]>([
    '[INIT] Aegis Kernel loaded with Stark security definitions v2026.10',
    '[WATCHDOG] 5 Background Daemons spawned in isolated worker pools',
    '[ALERT] 2 Active Threats detected during perimeter sweep',
  ]);

  // Calculate integrity score when threats or shields change
  useEffect(() => {
    const score = calculateIntegrityScore(security.threats, security.activeShields);
    setSecurity(prev => ({ ...prev, integrityScore: score }));
    onIntegrityChange?.(score);
  }, [security.threats, security.activeShields]);

  // Handle Full System Malware Scan
  const startDeepScan = () => {
    if (security.isScanning) return;

    setSecurity(prev => ({ ...prev, isScanning: true, scanProgress: 0 }));
    const sampleFiles = [
      '/sys/core/daemon.bin',
      '/mem/buffer/0x4F8A',
      '/net/socket/tls_handler',
      '/scripts/sandbox/eval_proxy',
      '/storage/cache/applet_state',
      '/sys/drivers/gpu_hologram',
      '/mem/shared/stark_memory_v2',
      '/net/firewall/rules.iptables',
      '/sys/auth/token_vault.enc',
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += 12;
      const fileIdx = Math.floor((progress / 100) * sampleFiles.length);
      setCurrentScanningFile(sampleFiles[Math.min(fileIdx, sampleFiles.length - 1)]);

      if (progress >= 100) {
        clearInterval(interval);
        setSecurity(prev => ({
          ...prev,
          isScanning: false,
          scanProgress: 100,
          lastScanTimestamp: 'Just now',
        }));
        setCurrentScanningFile('');
        setLogMessages(prev => [
          `[SCAN COMPLETE] 9,410 memory blocks and binaries scanned. All anomalies indexed.`,
          ...prev,
        ]);
      } else {
        setSecurity(prev => ({ ...prev, scanProgress: progress }));
      }
    }, 250);
  };

  // Remediate individual threat
  const handleNeutralize = (id: string, name: string) => {
    setSecurity(prev => ({
      ...prev,
      threats: neutralizeThreat(prev.threats, id),
    }));
    setLogMessages(prev => [`[NEUTRALIZED] ${name} permanently eradicated from system memory.`, ...prev]);
  };

  const handleQuarantine = (id: string, name: string) => {
    setSecurity(prev => ({
      ...prev,
      threats: quarantineThreat(prev.threats, id),
    }));
    setLogMessages(prev => [`[QUARANTINED] ${name} isolated in encrypted sandbox vault.`, ...prev]);
  };

  // One-click Clean & Purge All
  const handleCleanAll = () => {
    setSecurity(prev => ({
      ...prev,
      threats: neutralizeAllThreats(prev.threats),
    }));
    setLogMessages(prev => [
      `[AEGIS PURGE] All active and quarantined threats neutralized. Memory heap integrity restored to 100%.`,
      ...prev,
    ]);
  };

  // Toggle Background Daemon
  const toggleDaemon = (id: string) => {
    setDaemons(prev =>
      prev.map(d => {
        if (d.id === id) {
          const nextStatus = d.status === 'running' ? 'paused' : 'running';
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  // Trigger immediate daemon execution
  const executeDaemonNow = (id: string, name: string) => {
    setDaemons(prev =>
      prev.map(d => {
        if (d.id === id) {
          return {
            ...d,
            status: 'executing',
            totalExecutions: d.totalExecutions + 1,
            lastRun: 'Just now',
          };
        }
        return d;
      })
    );

    setTimeout(() => {
      setDaemons(prev =>
        prev.map(d => (d.id === id ? { ...d, status: 'running' } : d))
      );
    }, 1200);

    setLogMessages(prev => [`[EXECUTE] Background task "${name}" manually triggered. Execution complete.`, ...prev]);
  };

  const threatStats = getThreatStatistics(security.threats);

  return (
    <div className="space-y-6">
      {/* Top Overview Cards: System Integrity & Malware Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Integrity Gauge Card */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Aegis System Integrity
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
              security.integrityScore >= 90
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : security.integrityScore >= 70
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {security.integrityScore >= 90 ? 'SECURE' : security.integrityScore >= 70 ? 'WARNING' : 'COMPROMISED'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {security.integrityScore}%
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100 NOMINAL</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden my-2">
            <div
              className={`h-full transition-all duration-500 ${
                security.integrityScore >= 90
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                  : security.integrityScore >= 70
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                  : 'bg-gradient-to-r from-rose-500 to-red-600'
              }`}
              style={{ width: `${security.integrityScore}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            Real-time heuristic evaluation of system memory, runtime binaries, and network traffic.
          </p>
        </div>

        {/* Threat Summary & Quick Cleanup Card */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Active Threat Registry
            </span>
            <span className="text-xs font-mono text-slate-400">
              Total: {threatStats.total}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-rose-500/20 text-center">
              <div className="text-xl font-bold text-rose-400">{threatStats.active}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Active</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-amber-500/20 text-center">
              <div className="text-xl font-bold text-amber-400">{threatStats.quarantined}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Quarantine</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-emerald-500/20 text-center">
              <div className="text-xl font-bold text-emerald-400">{threatStats.neutralized}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Cleaned</div>
            </div>
          </div>

          <button
            onClick={handleCleanAll}
            disabled={threatStats.active === 0 && threatStats.quarantined === 0}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              threatStats.active > 0 || threatStats.quarantined > 0
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:brightness-110 active:scale-[0.98]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Neutralize & Purge All Threats
          </button>
        </div>

        {/* Deep Scanner Action Card */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                Malware Scanner
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Last: {security.lastScanTimestamp}
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Deep scans memory heaps, background daemons, socket traffic, and scripts.
            </p>
          </div>

          {security.isScanning ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-cyan-300">
                <span>SCANNING HEAPS...</span>
                <span>{security.scanProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full transition-all duration-200"
                  style={{ width: `${security.scanProgress}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                {currentScanningFile || 'Analyzing memory boundaries...'}
              </div>
            </div>
          ) : (
            <button
              onClick={startDeepScan}
              className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Launch Deep System Scan
            </button>
          )}
        </div>
      </div>

      {/* Threats Section */}
      <div className="rounded-2xl glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">DETECTED MALWARE & ANOMALIES</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Protected by Stark Aegis Engine
          </span>
        </div>

        <div className="space-y-3">
          {security.threats.map(threat => (
            <div
              key={threat.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                threat.status === 'neutralized'
                  ? 'bg-emerald-950/20 border-emerald-500/20 opacity-70'
                  : threat.status === 'quarantined'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-rose-950/30 border-rose-500/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{threat.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    threat.severity === 'critical'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : threat.severity === 'high'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}>
                    {threat.severity}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    threat.status === 'neutralized'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : threat.status === 'quarantined'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {threat.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{threat.description}</p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span>Target: <span className="text-cyan-300">{threat.targetPath}</span></span>
                  <span>•</span>
                  <span>Detected: {threat.detectedAt}</span>
                </div>
              </div>

              {/* Action buttons */}
              {threat.status !== 'neutralized' && (
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {threat.status !== 'quarantined' && (
                    <button
                      onClick={() => handleQuarantine(threat.id, threat.name)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all"
                    >
                      Quarantine
                    </button>
                  )}
                  <button
                    onClick={() => handleNeutralize(threat.id, threat.name)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 border border-rose-500/40 transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3 h-3" />
                    Neutralize
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Background Daemons Engine */}
      <div className="rounded-2xl glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">SYSTEM-LEVEL BACKGROUND DAEMONS</h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {daemons.filter(d => d.status === 'running').length} Active Services
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Autonomous subroutines executing in background threads to maintain telemetry sync, memory indexing, and security shields.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 font-mono text-[11px] text-slate-400 uppercase border-b border-white/10">
              <tr>
                <th className="py-2.5 px-3">Service Name</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Interval</th>
                <th className="py-2.5 px-3">CPU / Heap</th>
                <th className="py-2.5 px-3">Runs</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {daemons.map(daemon => (
                <tr key={daemon.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{daemon.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{daemon.description}</div>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      daemon.status === 'running'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : daemon.status === 'executing'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {daemon.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">
                    every {daemon.intervalSec}s
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-300">
                    {daemon.cpuPercent}% / {daemon.memoryKB} KB
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {daemon.totalExecutions}
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => executeDaemonNow(daemon.id, daemon.name)}
                      title="Trigger immediate execution"
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] transition-all"
                    >
                      Run Now
                    </button>
                    <button
                      onClick={() => toggleDaemon(daemon.id)}
                      title={daemon.status === 'running' ? 'Pause Daemon' : 'Resume Daemon'}
                      className={`px-2.5 py-1 rounded font-mono text-[11px] transition-all ${
                        daemon.status === 'running'
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                      }`}
                    >
                      {daemon.status === 'running' ? 'Pause' : 'Resume'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Terminal Log */}
      <div className="rounded-2xl glass-panel p-4 font-mono text-xs space-y-2">
        <div className="flex items-center gap-2 text-slate-400 border-b border-white/10 pb-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase text-[11px] tracking-wider">Aegis Real-Time Audit Log</span>
        </div>
        <div className="space-y-1 max-h-36 overflow-y-auto">
          {logMessages.map((msg, i) => (
            <div key={i} className="text-slate-300 text-[11px]">
              <span className="text-cyan-400">» </span>{msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
