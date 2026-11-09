import React, { useState } from 'react';
import { MemoryNode, MemoryCategory } from '../types/index.ts';
import { searchMemories, togglePinMemory, deleteMemory, upsertMemory } from '../utils/memoryEngine.ts';
import { 
  BrainCircuit, 
  Search, 
  Pin, 
  PinOff, 
  Plus, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Sparkles,
  Tag,
  Shield,
  User,
  Sliders,
  FolderGit2
} from 'lucide-react';

interface SmartMemoryCenterProps {
  memories: MemoryNode[];
  onMemoriesChange: (memories: MemoryNode[]) => void;
}

export const SmartMemoryCenter: React.FC<SmartMemoryCenterProps> = ({ memories, onMemoriesChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('preference');
  const [isPinned, setIsPinned] = useState(false);

  const filteredMemories = searchMemories(memories, searchQuery, selectedCategory);

  const handleTogglePin = (id: string) => {
    const updated = togglePinMemory(memories, id);
    onMemoriesChange(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteMemory(memories, id);
    onMemoriesChange(updated);
  };

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    const updated = upsertMemory(memories, {
      key: newKey.trim(),
      value: newValue.trim(),
      category: newCategory,
      confidence: 0.95,
      pinned: isPinned,
    });

    onMemoriesChange(updated);
    setNewKey('');
    setNewValue('');
    setShowAddModal(false);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(memories, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `friday-memory-vault-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: MemoryCategory) => {
    switch (category) {
      case 'personal':
        return <User className="w-3.5 h-3.5 text-cyan-400" />;
      case 'preference':
        return <Sliders className="w-3.5 h-3.5 text-emerald-400" />;
      case 'protocol':
        return <Shield className="w-3.5 h-3.5 text-amber-400" />;
      case 'project':
        return <FolderGit2 className="w-3.5 h-3.5 text-fuchsia-400" />;
      case 'security':
        return <Shield className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">SMART MEMORY VAULT</h2>
              <p className="text-xs text-slate-400">
                Persistent contextual recall of preferences, directives, and protocols
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Store New Fact
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-white/10 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export Vault
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel text-center flex flex-col justify-center">
          <div className="text-2xl font-black text-cyan-300 font-mono">{memories.length}</div>
          <div className="text-xs text-slate-400 uppercase font-mono tracking-wider mt-1">Total Indexed Facts</div>
          <div className="text-[10px] text-emerald-400 mt-1">99.8% Recall Integrity</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel text-center flex flex-col justify-center">
          <div className="text-2xl font-black text-amber-400 font-mono">
            {memories.filter(m => m.pinned).length}
          </div>
          <div className="text-xs text-slate-400 uppercase font-mono tracking-wider mt-1">Priority Pinned</div>
          <div className="text-[10px] text-slate-400 mt-1">Always Loaded in Context</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl glass-panel">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search memories by keyword, value, or directive..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'personal', 'preference', 'protocol', 'project', 'security'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize shrink-0 border transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Memories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMemories.map(mem => (
          <div
            key={mem.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative group ${
              mem.pinned
                ? 'bg-slate-900/80 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/50 border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-slate-400">
                  {getCategoryIcon(mem.category)}
                  {mem.category}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePin(mem.id)}
                    title={mem.pinned ? 'Unpin from priority context' : 'Pin to priority context'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      mem.pinned ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mem.pinned ? <Pin className="w-3.5 h-3.5 fill-current" /> : <Pin className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(mem.id)}
                    title="Delete memory"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="font-bold text-white text-sm mb-1">{mem.key}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{mem.value}</p>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[10px] font-mono text-slate-500">
              <span>Confidence: {Math.round(mem.confidence * 100)}%</span>
              <span>Accessed: {mem.accessCount}x</span>
            </div>
          </div>
        ))}
      </div>

      {filteredMemories.length === 0 && (
        <div className="p-8 rounded-2xl glass-panel text-center text-slate-400 text-xs">
          No memories match the filter criteria. FRIDAY will automatically learn as you chat, or you can add facts manually.
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Store Knowledge in FRIDAY Vault</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMemory} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Knowledge Title / Key</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={e => setNewKey(e.target.value)}
                  placeholder="e.g. Flight Trajectory Preference"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Fact / Directive Value</label>
                <textarea
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  placeholder="e.g. Always compute orbital paths avoiding restricted commercial airspace..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as MemoryCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="personal">Personal</option>
                    <option value="preference">Preference</option>
                    <option value="protocol">Protocol</option>
                    <option value="project">Project</option>
                    <option value="security">Security</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={e => setIsPinned(e.target.checked)}
                      className="rounded accent-cyan-400"
                    />
                    Pin to Priority Context
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
                >
                  Save Fact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
