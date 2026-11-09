import { SecurityThreat, SecurityStatus } from '../types/index.ts';

/**
 * Calculates real-time system integrity score based on active threats and enabled shields
 */
export function calculateIntegrityScore(
  threats: SecurityThreat[],
  shields: SecurityStatus['activeShields']
): number {
  let baseScore = 100;

  // Active threats deduct points according to severity
  for (const threat of threats) {
    if (threat.status === 'active') {
      switch (threat.severity) {
        case 'critical':
          baseScore -= 30;
          break;
        case 'high':
          baseScore -= 18;
          break;
        case 'medium':
          baseScore -= 10;
          break;
        case 'low':
          baseScore -= 4;
          break;
      }
    } else if (threat.status === 'quarantined') {
      // Quarantined items still pose a minor risk until neutralized
      baseScore -= 2;
    }
  }

  // Active shields provide reassurance
  const activeShieldCount = Object.values(shields).filter(Boolean).length;
  if (activeShieldCount < 4) {
    baseScore -= (4 - activeShieldCount) * 4;
  }

  return Math.max(5, Math.min(100, Math.round(baseScore)));
}

/**
 * Neutralizes a single threat by ID
 */
export function neutralizeThreat(threats: SecurityThreat[], id: string): SecurityThreat[] {
  return threats.map(t => (t.id === id ? { ...t, status: 'neutralized' as const } : t));
}

/**
 * Quarantines a single threat by ID
 */
export function quarantineThreat(threats: SecurityThreat[], id: string): SecurityThreat[] {
  return threats.map(t => (t.id === id ? { ...t, status: 'quarantined' as const } : t));
}

/**
 * Neutralizes all active and quarantined threats at once
 */
export function neutralizeAllThreats(threats: SecurityThreat[]): SecurityThreat[] {
  return threats.map(t => ({ ...t, status: 'neutralized' as const }));
}

/**
 * Counts threat quantities by status
 */
export function getThreatStatistics(threats: SecurityThreat[]) {
  const active = threats.filter(t => t.status === 'active').length;
  const quarantined = threats.filter(t => t.status === 'quarantined').length;
  const neutralized = threats.filter(t => t.status === 'neutralized').length;
  const critical = threats.filter(t => t.status === 'active' && t.severity === 'critical').length;

  return { active, quarantined, neutralized, critical, total: threats.length };
}
