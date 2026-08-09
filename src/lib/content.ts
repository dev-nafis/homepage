import type { CharityCampaign, VerseCue } from '../types';

export function isCharityActive(campaign: CharityCampaign, now = new Date()) {
  return campaign.active && new Date(campaign.verifiedAt) <= now && new Date(campaign.expiresAt) > now;
}

export function getCueAtTime(cues: VerseCue[], time: number) {
  return [...cues].reverse().find((cue) => time >= cue.start && (cue.end === undefined || time < cue.end));
}

export function validateCueOrder(cues: VerseCue[], duration: number) {
  return cues.every((cue, index) => cue.start >= 0 && cue.start < duration && (cue.end === undefined || (cue.end > cue.start && cue.end <= duration)) && (index === 0 || cue.start > cues[index - 1].start));
}
