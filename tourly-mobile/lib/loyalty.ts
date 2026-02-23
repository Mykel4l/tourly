import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";

// ─── Loyalty / Rewards Program ─────────────────────────────────────────────

const LOYALTY_KEY = "@tourly:loyalty";

export type LoyaltyTier = "explorer" | "adventurer" | "globetrotter";

export interface LoyaltyState {
  points: number;
  totalEarned: number;
  tier: LoyaltyTier;
  history: LoyaltyEntry[];
  referralCode: string;
  referrals: number;
}

export interface LoyaltyEntry {
  id: string;
  type: "booking" | "referral" | "review" | "daily" | "redeemed";
  points: number;
  description: string;
  createdAt: string;
}

const TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  explorer: 0,
  adventurer: 1000,
  globetrotter: 5000,
};

export const TIER_BENEFITS: Record<LoyaltyTier, string[]> = {
  explorer: ["earnPoints", "basicRewards"],
  adventurer: ["earnPoints", "basicRewards", "prioritySupport", "extraDiscount5"],
  globetrotter: ["earnPoints", "basicRewards", "prioritySupport", "extraDiscount5", "loungeAccess", "freeUpgrades"],
};

function calculateTier(totalEarned: number): LoyaltyTier {
  if (totalEarned >= TIER_THRESHOLDS.globetrotter) return "globetrotter";
  if (totalEarned >= TIER_THRESHOLDS.adventurer) return "adventurer";
  return "explorer";
}

function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "TOURLY-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const DEFAULT_STATE: LoyaltyState = {
  points: 150,
  totalEarned: 150,
  tier: "explorer",
  history: [
    {
      id: "welcome",
      type: "daily",
      points: 150,
      description: "Welcome bonus",
      createdAt: new Date().toISOString(),
    },
  ],
  referralCode: generateReferralCode(),
  referrals: 0,
};

export function useLoyalty() {
  const [state, setState] = useState<LoyaltyState>(DEFAULT_STATE);

  useEffect(() => {
    AsyncStorage.getItem(LOYALTY_KEY).then((raw) => {
      if (raw) {
        setState(JSON.parse(raw));
      } else {
        AsyncStorage.setItem(LOYALTY_KEY, JSON.stringify(DEFAULT_STATE));
      }
    });
  }, []);

  const persist = (next: LoyaltyState) => {
    setState(next);
    AsyncStorage.setItem(LOYALTY_KEY, JSON.stringify(next));
  };

  const addPoints = useCallback(
    (type: LoyaltyEntry["type"], points: number, description: string) => {
      setState((prev) => {
        const entry: LoyaltyEntry = {
          id: Date.now().toString(),
          type,
          points,
          description,
          createdAt: new Date().toISOString(),
        };
        const totalEarned = prev.totalEarned + points;
        const next: LoyaltyState = {
          ...prev,
          points: prev.points + points,
          totalEarned,
          tier: calculateTier(totalEarned),
          history: [entry, ...prev.history].slice(0, 50),
        };
        AsyncStorage.setItem(LOYALTY_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const redeemPoints = useCallback(
    (amount: number, description: string) => {
      setState((prev) => {
        if (prev.points < amount) return prev;
        const entry: LoyaltyEntry = {
          id: Date.now().toString(),
          type: "redeemed",
          points: -amount,
          description,
          createdAt: new Date().toISOString(),
        };
        const next: LoyaltyState = {
          ...prev,
          points: prev.points - amount,
          history: [entry, ...prev.history].slice(0, 50),
        };
        AsyncStorage.setItem(LOYALTY_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const addReferral = useCallback(() => {
    setState((prev) => {
      const entry: LoyaltyEntry = {
        id: Date.now().toString(),
        type: "referral",
        points: 500,
        description: "Friend referral bonus",
        createdAt: new Date().toISOString(),
      };
      const totalEarned = prev.totalEarned + 500;
      const next: LoyaltyState = {
        ...prev,
        points: prev.points + 500,
        totalEarned,
        tier: calculateTier(totalEarned),
        referrals: prev.referrals + 1,
        history: [entry, ...prev.history].slice(0, 50),
      };
      AsyncStorage.setItem(LOYALTY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const nextTier = state.tier === "globetrotter"
    ? null
    : state.tier === "adventurer"
    ? "globetrotter"
    : "adventurer";
  const nextTierThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : null;
  const progressToNextTier = nextTierThreshold
    ? Math.min(1, state.totalEarned / nextTierThreshold)
    : 1;

  return {
    ...state,
    addPoints,
    redeemPoints,
    addReferral,
    nextTier,
    nextTierThreshold,
    progressToNextTier,
  };
}
