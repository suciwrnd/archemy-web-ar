/* ==========================================================================
   ReactionConfig.js — Central registry of all available reaction packs
   
   To add a new reaction:
   1. Create a new file in reactions/ following the schema
   2. Import it here
   3. Add it to REACTION_REGISTRY
   
   Engine code never changes when adding new reactions.
   ========================================================================== */

import { NO2_N2O4   } from './NO2_N2O4.js';
import { FeSCN      } from './FeSCN.js';
import { AceticAcid } from './AceticAcid.js';
import { AgCl       } from './AgCl.js';
import { H2I2       } from './H2I2.js';

/**
 * Central registry — maps reaction ID to config object.
 * Used by the mission selector UI and the engine launcher.
 */
export const REACTION_REGISTRY = {
  [NO2_N2O4.id]:    NO2_N2O4,
  [FeSCN.id]:       FeSCN,
  [AceticAcid.id]:  AceticAcid,
  [AgCl.id]:        AgCl,
  [H2I2.id]:        H2I2,
};

/**
 * Get a reaction config by ID.
 * Falls back to NO2_N2O4 if ID is unknown.
 */
export function getReaction(id) {
  return REACTION_REGISTRY[id] || NO2_N2O4;
}

/**
 * Get all reaction configs as an array (for mission selector UI).
 */
export function getAllReactions() {
  return Object.values(REACTION_REGISTRY);
}

// Legacy compatibility — maps old misiId strings to new reaction IDs
export const LEGACY_ID_MAP = {
  misi1: 'H2I2',
  misi2: 'NO2_N2O4',
  misi3: 'FeSCN',
  misi4: 'AceticAcid',
};

export function resolveReactionId(rawId) {
  return LEGACY_ID_MAP[rawId] || rawId;
}

// Re-export configs for direct import
export { NO2_N2O4, FeSCN, AceticAcid, AgCl, H2I2 };

// MISI_DATA compatibility shim — keeps main.js working without changes
export const MISI_DATA = Object.fromEntries(
  Object.entries(LEGACY_ID_MAP).map(([misiKey, reactionId]) => [
    misiKey,
    {
      ...REACTION_REGISTRY[reactionId],
      judul:     REACTION_REGISTRY[reactionId]?.name      || reactionId,
      persamaan: REACTION_REGISTRY[reactionId]?.equation  || '',
      hook:      REACTION_REGISTRY[reactionId]?.missions?.[1]?.hook || '',
    }
  ])
);
