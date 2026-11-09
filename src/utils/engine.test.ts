import test from 'node:test';
import assert from 'node:assert/strict';
import { searchMemories, extractPotentialMemories, togglePinMemory, upsertMemory } from './memoryEngine.ts';
import { calculateIntegrityScore, neutralizeThreat, quarantineThreat, neutralizeAllThreats } from './securityEngine.ts';
import { parseReasoning } from './reasoningFormatter.ts';
import { SecurityThreat, MemoryNode } from '../types/index.ts';

test('memoryEngine: correctly searches and prioritizes pinned memories', () => {
  const sampleMemories: MemoryNode[] = [
    {
      id: '1',
      category: 'personal',
      key: 'User Identity',
      value: 'Tony Stark',
      confidence: 0.95,
      timestamp: '2026-10-24T10:00:00Z',
      pinned: false,
      accessCount: 5,
    },
    {
      id: '2',
      category: 'protocol',
      key: 'House Party Protocol',
      value: 'Activate automated armor deployment',
      confidence: 0.99,
      timestamp: '2026-10-24T10:00:00Z',
      pinned: true,
      accessCount: 2,
    },
  ];

  // Search by query
  const results = searchMemories(sampleMemories, 'protocol');
  assert.equal(results.length, 1);
  assert.equal(results[0].key, 'House Party Protocol');

  // Pinned items rank higher
  const allResults = searchMemories(sampleMemories, '');
  assert.equal(allResults[0].pinned, true);
});

test('memoryEngine: extracts facts from user natural language', () => {
  const result = extractPotentialMemories('My name is Pepper Potts');
  assert.notEqual(result, null);
  assert.equal(result?.key, 'User Identity');
  assert.equal(result?.value, 'Pepper Potts');

  const prefResult = extractPotentialMemories('I prefer dark mode');
  assert.notEqual(prefResult, null);
  assert.equal(prefResult?.key, 'User Preference');
  assert.equal(prefResult?.value, 'dark mode');
});

test('securityEngine: accurately calculates integrity score and remediates threats', () => {
  const shields = {
    realtimeProtection: true,
    memoryWatchdog: true,
    networkFirewall: true,
    zeroDayHeuristics: true,
  };

  const threats: SecurityThreat[] = [
    {
      id: 't1',
      name: 'Trojan.ScriptInject.v2',
      category: 'trojan',
      severity: 'critical',
      targetPath: '/sys/mem/hook.so',
      detectedAt: '2026-10-24T10:00:00Z',
      status: 'active',
      description: 'Unauthorized heap injection attempt',
      remediationAction: 'Neutralize payload',
    },
  ];

  // With 1 active critical threat, score drops by 30 points
  const initialScore = calculateIntegrityScore(threats, shields);
  assert.equal(initialScore, 70);

  // Quarantining threat recovers points
  const quarantined = quarantineThreat(threats, 't1');
  const quarantinedScore = calculateIntegrityScore(quarantined, shields);
  assert.equal(quarantinedScore, 98);

  // Neutralizing threat restores score to 100
  const neutralized = neutralizeThreat(threats, 't1');
  const restoredScore = calculateIntegrityScore(neutralized, shields);
  assert.equal(restoredScore, 100);

  // Neutralize all
  const allNeutralized = neutralizeAllThreats(threats);
  assert.equal(allNeutralized.every(t => t.status === 'neutralized'), true);
});

test('reasoningFormatter: extracts structured reasoning blocks', () => {
  const textWithReasoning = `<reasoning>
[SITUATION ANALYSIS]
The perimeter sensor triggered an alert at Sector 4.
[TACTICAL ASSESSMENT]
Telemetry confirms high electromagnetic signature.
</reasoning>
Perimeter scan complete, Boss. I recommend sending a reconnaissance drone.`;

  const parsed = parseReasoning(textWithReasoning);
  assert.equal(parsed.cleanedText.includes('<reasoning>'), false);
  assert.equal(parsed.cleanedText.startsWith('Perimeter scan complete'), true);
  assert.equal(parsed.sections.length, 2);
  assert.equal(parsed.sections[0].label, 'SITUATION ANALYSIS');
  assert.equal(parsed.sections[1].label, 'TACTICAL ASSESSMENT');
});
