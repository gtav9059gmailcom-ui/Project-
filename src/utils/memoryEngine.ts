import { MemoryNode, MemoryCategory } from '../types/index.ts';

/**
 * Searches memories using keywords and category filters
 */
export function searchMemories(memories: MemoryNode[], query: string, category?: MemoryCategory | 'all'): MemoryNode[] {
  const cleanQuery = query.trim().toLowerCase();
  
  return memories.filter(memory => {
    const matchesCategory = !category || category === 'all' || memory.category === category;
    if (!matchesCategory) return false;
    
    if (!cleanQuery) return true;
    return (
      memory.key.toLowerCase().includes(cleanQuery) ||
      memory.value.toLowerCase().includes(cleanQuery) ||
      memory.category.toLowerCase().includes(cleanQuery)
    );
  }).sort((a, b) => {
    // Pinned memories always surface first, then sorted by confidence / accessCount
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.accessCount - a.accessCount;
  });
}

/**
 * Parses user speech/text to detect candidate long-term facts
 */
export function extractPotentialMemories(text: string): { key: string; value: string; category: MemoryCategory } | null {
  const lower = text.toLowerCase();

  // "Remember that my name is Tony"
  const nameMatch = text.match(/my name is ([a-zA-Z\s]+)/i);
  if (nameMatch) {
    return {
      key: 'User Identity',
      value: nameMatch[1].trim(),
      category: 'personal',
    };
  }

  // "I prefer dark mode / metric units / typescript"
  const preferMatch = text.match(/i prefer ([^.]+)/i);
  if (preferMatch) {
    return {
      key: 'User Preference',
      value: preferMatch[1].trim(),
      category: 'preference',
    };
  }

  // "Protocol: ..." or "Emergency code: ..."
  const protocolMatch = text.match(/(protocol|directive|contingency)[:\s]+([^.]+)/i);
  if (protocolMatch) {
    return {
      key: `Protocol: ${protocolMatch[1].toUpperCase()}`,
      value: protocolMatch[2].trim(),
      category: 'protocol',
    };
  }

  // "Project mark 85 status..."
  if (lower.includes('project') || lower.includes('suit') || lower.includes('mark 85')) {
    return {
      key: 'Active Stark Directive',
      value: text.slice(0, 100),
      category: 'project',
    };
  }

  return null;
}

/**
 * Pins or unpins a memory node
 */
export function togglePinMemory(memories: MemoryNode[], id: string): MemoryNode[] {
  return memories.map(m => m.id === id ? { ...m, pinned: !m.pinned } : m);
}

/**
 * Deletes a memory node
 */
export function deleteMemory(memories: MemoryNode[], id: string): MemoryNode[] {
  return memories.filter(m => m.id !== id);
}

/**
 * Adds or updates a memory node, avoiding duplicates
 */
export function upsertMemory(memories: MemoryNode[], newNode: Omit<MemoryNode, 'id' | 'timestamp' | 'accessCount'>): MemoryNode[] {
  const existingIndex = memories.findIndex(m => m.key.toLowerCase() === newNode.key.toLowerCase());
  
  if (existingIndex >= 0) {
    const updated = [...memories];
    updated[existingIndex] = {
      ...updated[existingIndex],
      value: newNode.value,
      confidence: Math.max(updated[existingIndex].confidence, newNode.confidence),
      timestamp: new Date().toISOString(),
      accessCount: updated[existingIndex].accessCount + 1,
    };
    return updated;
  }

  const memory: MemoryNode = {
    ...newNode,
    id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    accessCount: 1,
  };

  return [memory, ...memories];
}
