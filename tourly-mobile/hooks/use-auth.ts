import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

// ─── Dummy credentials for development/testing ─────────────────────────────
export const DUMMY_CREDENTIALS = {
  email: "demo@tourly.com",
  password: "tourly123",
} as const;

const DUMMY_USER: Auth.User = {
  id: 1,
  openId: "dummy-open-id-001",
  name: "Demo User",
  email: DUMMY_CREDENTIALS.email,
  loginMethod: "email",
  lastSignedIn: new Date(),
};

// ─── Shared global auth state ──────────────────────────────────────────────
// All useAuth() instances subscribe to this so login/logout propagates everywhere.
type AuthListener = (user: Auth.User | null) => void;
const listeners = new Set<AuthListener>();
let globalUser: Auth.User | null | undefined = undefined; // undefined = not yet resolved

function setGlobalUser(user: Auth.User | null) {
  globalUser = user;
  listeners.forEach((fn) => fn(user));
}
function subscribeAuth(fn: AuthListener) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

type UseAuthOptions = {
  autoFetch?: boolean;
};

export function useAuth(options?: UseAuthOptions) {
  const { autoFetch = true } = options ?? {};
  const [user, setUser] = useState<Auth.User | null>(globalUser !== undefined ? globalUser : null);
  const [loading, setLoading] = useState(globalUser === undefined);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    console.log("[useAuth] fetchUser called");
    try {
      setLoading(true);
      setError(null);

      // Web platform: use cookie-based auth, fetch user from API
      if (Platform.OS === "web") {
        console.log("[useAuth] Web platform: fetching user from API...");
        const apiUser = await Api.getMe();
        console.log("[useAuth] API user response:", apiUser);

        if (apiUser) {
          const userInfo: Auth.User = {
            id: apiUser.id,
            openId: apiUser.openId,
            name: apiUser.name,
            email: apiUser.email,
            loginMethod: apiUser.loginMethod,
            lastSignedIn: new Date(apiUser.lastSignedIn),
          };
          setUser(userInfo);
          setGlobalUser(userInfo);
          // Cache user info in localStorage for faster subsequent loads
          await Auth.setUserInfo(userInfo);
          console.log("[useAuth] Web user set from API:", userInfo);
        } else {
          console.log("[useAuth] Web: No authenticated user from API");
          setUser(null);
          setGlobalUser(null);
          await Auth.clearUserInfo();
        }
        return;
      }

      // Native platform: use token-based auth
      console.log("[useAuth] Native platform: checking for session token...");
      const sessionToken = await Auth.getSessionToken();
      console.log(
        "[useAuth] Session token:",
        sessionToken ? `present (${sessionToken.substring(0, 20)}...)` : "missing",
      );
      if (!sessionToken) {
        console.log("[useAuth] No session token, setting user to null");
        setUser(null);
        setGlobalUser(null);
        return;
      }

      // Use cached user info for native (token validates the session)
      const cachedUser = await Auth.getUserInfo();
      console.log("[useAuth] Cached user:", cachedUser);
      if (cachedUser) {
        console.log("[useAuth] Using cached user info");
        setUser(cachedUser);
        setGlobalUser(cachedUser);
      } else {
        console.log("[useAuth] No cached user, setting user to null");
        setUser(null);
        setGlobalUser(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch user");
      console.error("[useAuth] fetchUser error:", error);
      setError(error);
      setUser(null);
      setGlobalUser(null);
    } finally {
      setLoading(false);
      console.log("[useAuth] fetchUser completed, loading:", false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await Api.logout();
    } catch (err) {
      console.error("[Auth] Logout API call failed:", err);
      // Continue with logout even if API call fails
    } finally {
      await Auth.removeSessionToken();
      await Auth.clearUserInfo();
      setUser(null);
      setGlobalUser(null);
      setError(null);
    }
  }, []);

  /** Dummy email/password login for development. Returns true on success. */
  const dummyLogin = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      if (
        email.toLowerCase().trim() === DUMMY_CREDENTIALS.email &&
        password === DUMMY_CREDENTIALS.password
      ) {
        const userInfo: Auth.User = { ...DUMMY_USER, lastSignedIn: new Date() };
        setUser(userInfo);
        setGlobalUser(userInfo);
        await Auth.setUserInfo(userInfo);
        return true;
      }
      return false;
    },
    [],
  );

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  // Subscribe to global auth changes from other useAuth instances
  useEffect(() => {
    const unsubscribe = subscribeAuth((newUser) => {
      setUser(newUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log("[useAuth] useEffect triggered, autoFetch:", autoFetch, "platform:", Platform.OS);
    if (autoFetch) {
      if (Platform.OS === "web") {
        // Web: fetch user from API directly (user will login manually if needed)
        console.log("[useAuth] Web: fetching user from API...");
        fetchUser();
      } else {
        // Native: check for cached user info first for faster initial load
        Auth.getUserInfo().then((cachedUser) => {
          console.log("[useAuth] Native cached user check:", cachedUser);
          if (cachedUser) {
            console.log("[useAuth] Native: setting cached user immediately");
            setUser(cachedUser);
            setLoading(false);
          } else {
            // No cached user, check session token
            fetchUser();
          }
        });
      }
    } else {
      console.log("[useAuth] autoFetch disabled, setting loading to false");
      setLoading(false);
    }
  }, [autoFetch, fetchUser]);

  useEffect(() => {
    console.log("[useAuth] State updated:", {
      hasUser: !!user,
      loading,
      isAuthenticated,
      error: error?.message,
    });
  }, [user, loading, isAuthenticated, error]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    refresh: fetchUser,
    logout,
    dummyLogin,
  };
}
