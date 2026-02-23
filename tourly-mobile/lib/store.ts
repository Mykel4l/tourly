import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";

// ─── Wishlist ──────────────────────────────────────────────────────────────

const WISHLIST_KEY = "@tourly:wishlist";

export interface WishlistItem {
  id: string;
  type: "destination" | "package";
  name: string;
  image: any;
  subtitle: string; // country for destinations, price string for packages
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(WISHLIST_KEY).then((raw) => {
      if (raw) setItems(JSON.parse(raw));
    });
  }, []);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id && i.type === item.type);
      const next = exists
        ? prev.filter((i) => !(i.id === item.id && i.type === item.type))
        : [...prev, item];
      AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (id: string, type: WishlistItem["type"]) =>
      items.some((i) => i.id === id && i.type === type),
    [items]
  );

  return { items, toggle, isSaved };
}

// ─── Bookings ──────────────────────────────────────────────────────────────

const BOOKINGS_KEY = "@tourly:bookings";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  packageName: string;
  fullName: string;
  email: string;
  phone: string;
  travelers: string;
  checkIn: string;
  checkOut: string;
  price?: string;
  status: BookingStatus;
  createdAt: string;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(BOOKINGS_KEY).then((raw) => {
      if (raw) setBookings(JSON.parse(raw));
    });
  }, []);

  const addBooking = useCallback(
    (booking: Omit<Booking, "id" | "createdAt" | "status">): Booking => {
      const newBooking: Booking = {
        ...booking,
        id: Date.now().toString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setBookings((prev) => {
        const next = [newBooking, ...prev];
        AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
        return next;
      });
      return newBooking;
    },
    []
  );

  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) => {
      const next = prev.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as BookingStatus } : b
      );
      AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { bookings, addBooking, cancelBooking };
}

// ─── Notifications ─────────────────────────────────────────────────────────

const NOTIFICATIONS_KEY = "@tourly:notifications";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  /** i18n key for title – resolved at render time */
  titleKey?: string;
  /** i18n key for body – resolved at render time */
  bodyKey?: string;
  type: "booking" | "offer" | "reminder";
  read: boolean;
  createdAt: string;
}

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Welcome to Tourly 🌍",
    body: "Start exploring amazing destinations and book your next adventure.",
    titleKey: "notifWelcomeTitle",
    bodyKey: "notifWelcomeBody",
    type: "offer",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: "n2",
    title: "Summer Sale — Up to 30% Off",
    body: "Limited-time offer on select packages. Book before March 31, 2026.",
    titleKey: "notifSaleTitle",
    bodyKey: "notifSaleBody",
    type: "offer",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "n3",
    title: "New Destination Added",
    body: "Bali, Indonesia is now available. Check out our exclusive packages!",
    titleKey: "notifNewDestTitle",
    bodyKey: "notifNewDestBody",
    type: "reminder",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(NOTIFICATIONS_KEY).then((raw) => {
      if (raw) {
        setNotifications(JSON.parse(raw));
      } else {
        setNotifications(SEED_NOTIFICATIONS);
        AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(SEED_NOTIFICATIONS));
      }
    });
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addNotification = useCallback(
    (notif: Omit<AppNotification, "id" | "read" | "createdAt">) => {
      const newNotif: AppNotification = {
        ...notif,
        id: Date.now().toString(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => {
        const next = [newNotif, ...prev];
        AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, markRead, markAllRead, addNotification, unreadCount };
}
