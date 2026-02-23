# Tourly Mobile App - Design Document

## Overview
A travel agency mobile app for browsing destinations, travel packages, and booking trips. The app follows Apple Human Interface Guidelines (HIG) and is designed for mobile portrait orientation (9:16) with one-handed usage in mind.

---

## Screen List

### 1. Home Screen (Tab 1)
- Hero section with welcome message and search CTA
- Quick search form (destination, dates, travelers)
- Featured destinations horizontal scroll
- Popular packages preview

### 2. Destinations Screen (Tab 2)
- Grid/list of popular destinations
- Each destination card shows: image, location, country, rating
- Filter by region (optional)

### 3. Packages Screen (Tab 3)
- List of travel packages with:
  - Package image
  - Title and description
  - Duration (e.g., 7D/6N)
  - Max travelers
  - Location
  - Price per person
  - Rating and reviews count
- "Book Now" button on each package

### 4. Gallery Screen (Tab 4)
- Photo gallery from travelers
- Full-screen image viewer on tap
- Masonry or grid layout

### 5. Contact Screen (accessible from Home)
- Contact information display
- Phone number (tappable to call)
- Email (tappable to send email)
- Address
- Newsletter subscription form

### 6. Package Detail Screen (Modal/Stack)
- Full package information
- Large hero image
- Detailed description
- Booking form/CTA

---

## Primary Content and Functionality

### Home Screen
- **Hero Banner**: Background image with overlay, title "Journey to explore world", subtitle text
- **Search Form**: Destination input, number of travelers, check-in/check-out dates, "Inquire Now" button
- **Featured Destinations**: Horizontal ScrollView with 3 destination cards (San Miguel Italy, Burj Khalifa Dubai, Kyoto Temple Japan)
- **Quick Links**: Navigation to Packages and Gallery

### Destinations Screen
- **Destination Cards**: 
  - Image (full card background)
  - 5-star rating badge
  - Country label
  - Destination name
  - Short description

### Packages Screen
- **Package Cards**:
  - Package image banner
  - Title
  - Description text
  - Meta info: Duration, Pax count, Location
  - Price display ($750/person format)
  - Rating with review count
  - "Book Now" button

### Gallery Screen
- **Gallery Grid**: 5 travel photos
- **Image Viewer**: Full-screen modal on tap

---

## Key User Flows

### Flow 1: Browse and Inquire
1. User opens app → Home Screen
2. User enters destination in search form
3. User selects dates and number of travelers
4. User taps "Inquire Now" → Shows confirmation/toast

### Flow 2: Browse Destinations
1. User taps Destinations tab
2. User scrolls through destination cards
3. User taps a destination → Shows destination details

### Flow 3: Book a Package
1. User taps Packages tab
2. User scrolls through package list
3. User taps "Book Now" on a package
4. User sees booking confirmation

### Flow 4: View Gallery
1. User taps Gallery tab
2. User sees photo grid
3. User taps a photo → Full-screen viewer
4. User swipes to close or view next

---

## Color Choices

Based on the original Tourly website branding:

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `primary` | `#4A90D9` (United Nations Blue) | `#5BA3EC` | Buttons, accents, links |
| `background` | `#FFFFFF` | `#151718` | Screen backgrounds |
| `surface` | `#F5F5F5` | `#1E2022` | Cards, elevated surfaces |
| `foreground` | `#1C3144` (Gunmetal) | `#ECEDEE` | Primary text |
| `muted` | `#536878` (Black Coral) | `#9BA1A6` | Secondary text |
| `border` | `#E5E7EB` (Gainsboro) | `#334155` | Borders, dividers |
| `success` | `#22C55E` | `#4ADE80` | Success states |
| `warning` | `#F59E0B` | `#FBBF24` | Warning states |
| `error` | `#EF4444` | `#F87171` | Error states |
| `accent` | `#0098B3` (Blue NCS) | `#00B8D9` | Secondary accent |

### Typography
- **Primary Font**: Poppins (body text)
- **Heading Font**: Montserrat (titles, headings)
- **Font Weights**: 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

---

## Component Specifications

### Destination Card
- Height: 220px
- Border radius: 25px
- Image: Full cover with gradient overlay
- Content: Positioned at bottom with white background, rounded corners
- Rating badge: Blue background, positioned top-right of content area

### Package Card
- Full width
- Border radius: 15px
- Shadow: Subtle elevation
- Sections: Image (40%), Content (40%), Price/CTA (20%)

### Button Styles
- **Primary**: Blue background (#4A90D9), white text, rounded-full
- **Secondary**: Transparent with white border, white text

---

## Navigation Structure

```
Tab Bar (Bottom Navigation)
├── Home (house.fill icon)
├── Destinations (map.fill icon)  
├── Packages (suitcase.fill icon)
└── Gallery (photo.fill icon)

Stack Navigation (from tabs)
├── Package Detail (from Packages)
└── Contact (from Home)
```

---

## Responsive Considerations

- All screens use `ScreenContainer` for safe area handling
- Content adapts to different screen sizes
- Images use `cover` fit to maintain aspect ratio
- Horizontal scrolls for featured content on smaller screens
- FlatList for all scrollable lists (performance optimization)
