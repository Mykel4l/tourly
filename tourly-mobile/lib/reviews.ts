import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";

// ─── Reviews & Ratings System ──────────────────────────────────────────────

const REVIEWS_KEY = "@tourly:reviews";

export interface Review {
  id: string;
  targetId: string;
  targetType: "destination" | "package";
  rating: number;
  text: string;
  authorName: string;
  createdAt: string;
}

// Seed reviews for a more realistic feel
const SEED_REVIEWS: Review[] = [
  { id: "r1", targetId: "1", targetType: "destination", rating: 5, text: "Absolutely breathtaking! The views were incredible and the locals were so welcoming.", authorName: "Sarah M.", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "r2", targetId: "1", targetType: "destination", rating: 4, text: "Beautiful destination. Would recommend visiting during spring.", authorName: "James K.", createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: "r3", targetId: "2", targetType: "destination", rating: 5, text: "A must-visit! The culture and food are amazing.", authorName: "Maria L.", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "r4", targetId: "1", targetType: "package", rating: 5, text: "The package was perfectly organized. Every detail was taken care of. Highly recommend!", authorName: "David R.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "r5", targetId: "1", targetType: "package", rating: 4, text: "Great value for money. The hotel was excellent and the guided tours were informative.", authorName: "Emily W.", createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: "r6", targetId: "2", targetType: "package", rating: 5, text: "Best vacation package I've ever booked. Will definitely use Tourly again!", authorName: "Chris T.", createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "r7", targetId: "3", targetType: "destination", rating: 4, text: "Wonderful experience. The scenery was unreal.", authorName: "Aisha N.", createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: "r8", targetId: "3", targetType: "package", rating: 5, text: "Outstanding service from start to finish. Everything exceeded my expectations.", authorName: "Tom H.", createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
];

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(REVIEWS_KEY).then((raw) => {
      if (raw) {
        setReviews(JSON.parse(raw));
      } else {
        setReviews(SEED_REVIEWS);
        AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(SEED_REVIEWS));
      }
    });
  }, []);

  const addReview = useCallback(
    (review: Omit<Review, "id" | "createdAt">) => {
      const newReview: Review = {
        ...review,
        id: `r-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setReviews((prev) => {
        const next = [newReview, ...prev];
        AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(next));
        return next;
      });
      return newReview;
    },
    []
  );

  const getReviewsFor = useCallback(
    (targetId: string, targetType: "destination" | "package") =>
      reviews.filter((r) => r.targetId === targetId && r.targetType === targetType),
    [reviews]
  );

  const getAverageRating = useCallback(
    (targetId: string, targetType: "destination" | "package") => {
      const filtered = reviews.filter(
        (r) => r.targetId === targetId && r.targetType === targetType
      );
      if (filtered.length === 0) return { average: 0, count: 0 };
      const sum = filtered.reduce((acc, r) => acc + r.rating, 0);
      return {
        average: Math.round((sum / filtered.length) * 10) / 10,
        count: filtered.length,
      };
    },
    [reviews]
  );

  return { reviews, addReview, getReviewsFor, getAverageRating };
}
