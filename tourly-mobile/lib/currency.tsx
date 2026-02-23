import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useCallback, createContext, useContext } from "react";

// ─── Supported Currencies ──────────────────────────────────────────────────

export type CurrencyCode =
  | "USD" | "EUR" | "GBP" | "JPY" | "AUD"
  | "CAD" | "SGD" | "AED" | "INR" | "KRW"
  | "CNY" | "TRY" | "BRL" | "RUB" | "MXN";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  /** Exchange rate relative to 1 USD */
  rate: number;
  /** Number of decimal places to display */
  decimals: number;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$",   label: "US Dollar",          rate: 1.00,    decimals: 0 },
  { code: "EUR", symbol: "€",   label: "Euro",               rate: 0.92,    decimals: 0 },
  { code: "GBP", symbol: "£",   label: "British Pound",      rate: 0.79,    decimals: 0 },
  { code: "JPY", symbol: "¥",   label: "Japanese Yen",       rate: 149.50,  decimals: 0 },
  { code: "AUD", symbol: "A$",  label: "Australian Dollar",  rate: 1.53,    decimals: 0 },
  { code: "CAD", symbol: "C$",  label: "Canadian Dollar",    rate: 1.36,    decimals: 0 },
  { code: "SGD", symbol: "S$",  label: "Singapore Dollar",   rate: 1.34,    decimals: 0 },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham",         rate: 3.67,    decimals: 0 },
  { code: "INR", symbol: "₹",   label: "Indian Rupee",       rate: 83.50,   decimals: 0 },
  { code: "KRW", symbol: "₩",   label: "Korean Won",         rate: 1320.00, decimals: 0 },
  { code: "CNY", symbol: "¥",   label: "Chinese Yuan",       rate: 7.24,    decimals: 0 },
  { code: "TRY", symbol: "₺",   label: "Turkish Lira",       rate: 30.50,   decimals: 0 },
  { code: "BRL", symbol: "R$",  label: "Brazilian Real",     rate: 4.97,    decimals: 0 },
  { code: "RUB", symbol: "₽",   label: "Russian Ruble",      rate: 92.50,   decimals: 0 },
  { code: "MXN", symbol: "MX$", label: "Mexican Peso",       rate: 17.20,   decimals: 0 },
];

// ─── Storage Key ────────────────────────────────────────────────────────────

const CURRENCY_KEY = "@tourly:currency";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCurrencyInfo(code: CurrencyCode): CurrencyInfo {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/**
 * Convert a USD price to the target currency and format it.
 * Returns string like "$750", "€690", "¥112,125", etc.
 */
export function formatPrice(usdAmount: number, code: CurrencyCode): string {
  const info = getCurrencyInfo(code);
  const converted = Math.round(usdAmount * info.rate);
  const formatted = converted.toLocaleString("en-US");
  return `${info.symbol}${formatted}`;
}

/**
 * Convert a USD amount to the target currency (raw number).
 */
export function convertPrice(usdAmount: number, code: CurrencyCode): number {
  const info = getCurrencyInfo(code);
  return Math.round(usdAmount * info.rate);
}

// ─── Context ────────────────────────────────────────────────────────────────

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => Promise<void>;
  currencyInfo: CurrencyInfo;
  /** Format a USD price into the current currency string */
  format: (usdAmount: number) => string;
  /** Convert a USD price to current currency (raw number) */
  convert: (usdAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  setCurrency: async () => {},
  currencyInfo: CURRENCIES[0],
  format: (n) => `$${n}`,
  convert: (n) => n,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    AsyncStorage.getItem(CURRENCY_KEY).then((stored) => {
      if (stored && CURRENCIES.some((c) => c.code === stored)) {
        setCurrencyState(stored as CurrencyCode);
      }
    });
  }, []);

  const setCurrency = useCallback(async (code: CurrencyCode) => {
    setCurrencyState(code);
    await AsyncStorage.setItem(CURRENCY_KEY, code);
  }, []);

  const currencyInfo = getCurrencyInfo(currency);
  const format = useCallback((usd: number) => formatPrice(usd, currency), [currency]);
  const convert = useCallback((usd: number) => convertPrice(usd, currency), [currency]);

  return React.createElement(
    CurrencyContext.Provider,
    { value: { currency, setCurrency, currencyInfo, format, convert } },
    children
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
