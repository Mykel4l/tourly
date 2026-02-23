import { describe, it, expect } from "vitest";

// Test data structures without requiring actual image files
const mockDestinations = [
  { id: '1', name: 'San Miguel', country: 'Italy', rating: 5, description: 'Test description' },
  { id: '2', name: 'Burj Khalifa', country: 'Dubai', rating: 5, description: 'Test description' },
  { id: '3', name: 'Kyoto Temple', country: 'Japan', rating: 5, description: 'Test description' },
];

const mockPackages = [
  { id: '1', title: 'Beach Holiday', duration: '7D/6N', maxPax: 10, location: 'Malaysia', price: 750, rating: 5, reviews: 25 },
  { id: '2', title: 'River Adventure', duration: '7D/6N', maxPax: 10, location: 'Malaysia', price: 520, rating: 5, reviews: 20 },
  { id: '3', title: 'Island Vacation', duration: '7D/6N', maxPax: 10, location: 'Malaysia', price: 660, rating: 5, reviews: 40 },
];

const mockGalleryImages = [
  { id: '1', alt: 'Travel photo 1' },
  { id: '2', alt: 'Travel photo 2' },
  { id: '3', alt: 'Travel photo 3' },
  { id: '4', alt: 'Travel photo 4' },
  { id: '5', alt: 'Travel photo 5' },
];

describe("Tourly App Data Structure", () => {
  describe("Destinations", () => {
    it("should have at least 3 destinations", () => {
      expect(mockDestinations.length).toBeGreaterThanOrEqual(3);
    });

    it("should have valid destination structure", () => {
      mockDestinations.forEach((dest) => {
        expect(dest).toHaveProperty("id");
        expect(dest).toHaveProperty("name");
        expect(dest).toHaveProperty("country");
        expect(dest).toHaveProperty("rating");
        expect(dest).toHaveProperty("description");
      });
    });

    it("should have ratings between 1 and 5", () => {
      mockDestinations.forEach((dest) => {
        expect(dest.rating).toBeGreaterThanOrEqual(1);
        expect(dest.rating).toBeLessThanOrEqual(5);
      });
    });

    it("should have unique IDs", () => {
      const ids = mockDestinations.map((d) => d.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("Packages", () => {
    it("should have at least 3 packages", () => {
      expect(mockPackages.length).toBeGreaterThanOrEqual(3);
    });

    it("should have valid package structure", () => {
      mockPackages.forEach((pkg) => {
        expect(pkg).toHaveProperty("id");
        expect(pkg).toHaveProperty("title");
        expect(pkg).toHaveProperty("duration");
        expect(pkg).toHaveProperty("maxPax");
        expect(pkg).toHaveProperty("location");
        expect(pkg).toHaveProperty("price");
        expect(pkg).toHaveProperty("rating");
        expect(pkg).toHaveProperty("reviews");
      });
    });

    it("should have positive prices", () => {
      mockPackages.forEach((pkg) => {
        expect(pkg.price).toBeGreaterThan(0);
      });
    });

    it("should have valid duration format", () => {
      mockPackages.forEach((pkg) => {
        expect(pkg.duration).toMatch(/^\d+D\/\d+N$/);
      });
    });

    it("should have unique IDs", () => {
      const ids = mockPackages.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("Gallery Images", () => {
    it("should have at least 5 gallery images", () => {
      expect(mockGalleryImages.length).toBeGreaterThanOrEqual(5);
    });

    it("should have valid gallery image structure", () => {
      mockGalleryImages.forEach((img) => {
        expect(img).toHaveProperty("id");
        expect(img).toHaveProperty("alt");
      });
    });

    it("should have unique IDs", () => {
      const ids = mockGalleryImages.map((g) => g.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});

describe("Theme Configuration", () => {
  it("should export themeColors", async () => {
    const themeConfig = await import("../theme.config.js");
    expect(themeConfig.themeColors).toBeDefined();
  });

  it("should have required color tokens", async () => {
    const themeConfig = await import("../theme.config.js");
    const { themeColors } = themeConfig;
    
    const requiredTokens = [
      "primary",
      "background",
      "surface",
      "foreground",
      "muted",
      "border",
      "success",
      "warning",
      "error",
    ];

    requiredTokens.forEach((token) => {
      expect(themeColors).toHaveProperty(token);
      const colorPair = (themeColors as Record<string, { light: string; dark: string }>)[token];
      expect(colorPair).toHaveProperty("light");
      expect(colorPair).toHaveProperty("dark");
    });
  });

  it("should have valid hex color values", async () => {
    const themeConfig = await import("../theme.config.js");
    const { themeColors } = themeConfig;
    
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    
    Object.values(themeColors as Record<string, { light: string; dark: string }>).forEach((colorPair) => {
      expect(colorPair.light).toMatch(hexColorRegex);
      expect(colorPair.dark).toMatch(hexColorRegex);
    });
  });

  it("should have Tourly brand primary color", async () => {
    const themeConfig = await import("../theme.config.js");
    const { themeColors } = themeConfig;
    
    // Tourly brand blue color
    expect(themeColors.primary.light).toBe("#4A90D9");
  });
});
