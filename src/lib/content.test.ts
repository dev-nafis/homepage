import { describe, expect, it } from 'vitest';
import { getCueAtTime, isCharityActive, validateCueOrder } from './content';

describe('content helpers', () => {
  it('selects the active verse cue', () => {
    const cues = [{ verse: 1, start: 2, end: 5 }, { verse: 2, start: 5, end: 9 }];
    expect(getCueAtTime(cues, 6)?.verse).toBe(2);
    expect(getCueAtTime(cues, 1)).toBeUndefined();
  });

  it('rejects overlapping or out-of-order cues', () => {
    expect(validateCueOrder([{ verse: 1, start: 2, end: 5 }, { verse: 2, start: 5, end: 9 }], 10)).toBe(true);
    expect(validateCueOrder([{ verse: 1, start: 5 }, { verse: 2, start: 4 }], 10)).toBe(false);
  });

  it('shows only currently active verified charity campaigns', () => {
    const campaign = { id: 'relief', organisation: 'Example', title: 'Relief', summary: 'Help', url: 'https://example.com', image: '/image.jpg', imageAlt: 'Aid', verifiedAt: '2026-01-01', expiresAt: '2026-12-31', active: true };
    expect(isCharityActive(campaign, new Date('2026-06-01'))).toBe(true);
    expect(isCharityActive(campaign, new Date('2027-01-01'))).toBe(false);
  });
});
