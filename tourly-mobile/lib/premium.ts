import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";

// ─── Premium / Subscription State ──────────────────────────────────────────

const PREMIUM_KEY = "@tourly:premium";

export type PremiumTier = "free" | "pro" | "elite";

export interface PremiumState {
  tier: PremiumTier;
  planId: string | null;
  expiresAt: string | null;
  subscribedAt: string | null;
}

const DEFAULT_STATE: PremiumState = {
  tier: "free",
  planId: null,
  expiresAt: null,
  subscribedAt: null,
};

export const PREMIUM_PLANS = [
  {
    id: "pro_monthly" as const,
    tier: "pro" as PremiumTier,
    price: 4.99,
    period: "month",
    features: [
      "exclusiveDeals",
      "prioritySupport",
      "freeCancellation",
      "aiTripPlanner",
      "adFree",
    ],
  },
  {
    id: "pro_annual" as const,
    tier: "pro" as PremiumTier,
    price: 39.99,
    period: "year",
    savings: 20,
    features: [
      "exclusiveDeals",
      "prioritySupport",
      "freeCancellation",
      "aiTripPlanner",
      "adFree",
    ],
  },
  {
    id: "elite_annual" as const,
    tier: "elite" as PremiumTier,
    price: 79.99,
    period: "year",
    savings: 33,
    features: [
      "exclusiveDeals",
      "prioritySupport",
      "freeCancellation",
      "aiTripPlanner",
      "adFree",
      "conciergeService",
      "loungeAccess",
      "doublePoints",
    ],
  },
];

export function usePremium() {
  const [state, setState] = useState<PremiumState>(DEFAULT_STATE);

  useEffect(() => {
    AsyncStorage.getItem(PREMIUM_KEY).then((raw) => {
      if (raw) setState(JSON.parse(raw));
    });
  }, []);

  const subscribe = useCallback((tier: PremiumTier, planId: string) => {
    const now = new Date();
    const plan = PREMIUM_PLANS.find((p) => p.id === planId);
    const expiresAt = new Date(now);
    if (plan?.period === "year") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }
    const next: PremiumState = {
      tier,
      planId,
      subscribedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
    setState(next);
    AsyncStorage.setItem(PREMIUM_KEY, JSON.stringify(next));
  }, []);

  const cancelSubscription = useCallback(() => {
    setState(DEFAULT_STATE);
    AsyncStorage.setItem(PREMIUM_KEY, JSON.stringify(DEFAULT_STATE));
  }, []);

  const isPro = state.tier === "pro" || state.tier === "elite";
  const isElite = state.tier === "elite";

  return { ...state, isPro, isElite, subscribe, cancelSubscription };
}
