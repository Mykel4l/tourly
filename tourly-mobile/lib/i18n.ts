import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useCallback, createContext, useContext } from "react";

// ─── Supported Languages ───────────────────────────────────────────────────

export type Language = "en" | "es" | "fr" | "ja" | "ar" | "de" | "it" | "pt" | "ko" | "zh";

export const LANGUAGES: { code: Language; label: string; nativeLabel: string; rtl?: boolean }[] = [
  { code: "en", label: "English",     nativeLabel: "English"    },
  { code: "es", label: "Spanish",     nativeLabel: "Español"    },
  { code: "fr", label: "French",      nativeLabel: "Français"   },
  { code: "de", label: "German",      nativeLabel: "Deutsch"    },
  { code: "it", label: "Italian",     nativeLabel: "Italiano"   },
  { code: "pt", label: "Portuguese",  nativeLabel: "Português"  },
  { code: "ja", label: "Japanese",    nativeLabel: "日本語"      },
  { code: "ko", label: "Korean",      nativeLabel: "한국어"      },
  { code: "zh", label: "Chinese",     nativeLabel: "中文"        },
  { code: "ar", label: "Arabic",      nativeLabel: "العربية",   rtl: true },
];

// ─── Translation Keys ──────────────────────────────────────────────────────

export interface Translations {
  // Tabs
  tabHome: string;
  tabExplore: string;
  tabTrips: string;
  tabSaved: string;
  tabGallery: string;
  // Home screen
  heroTitle: string;
  heroSubtitle: string;
  learnMore: string;
  bookNow: string;
  contactUs: string;
  findYourTrip: string;
  enterDestination: string;
  numberOfTravelers: string;
  inquireNow: string;
  popularDestinations: string;
  checkoutPackages: string;
  viewAll: string;
  dealsTitle: string;
  dealsSubtitle: string;
  // Common actions
  save: string;
  saved: string;
  share: string;
  back: string;
  search: string;
  searchPlaceholder: string;
  noResults: string;
  // Search filters
  filterAll: string;
  filterDestinations: string;
  filterPackages: string;
  sortBy: string;
  sortDefault: string;
  sortNameAZ: string;
  sortRelevance: string;
  sortPriceLow: string;
  sortPriceHigh: string;
  sortRating: string;
  priceRange: string;
  resultsFound: string;
  searchTourly: string;
  searchHint: string;
  tryDifferent: string;
  clearFilters: string;
  // Destination / Package detail
  bookThisDestination: string;
  aboutDestination: string;
  whatToExpect: string;
  whatsIncluded: string;
  sampleItinerary: string;
  // Booking
  bookingTitle: string;
  fullName: string;
  email: string;
  phone: string;
  travelers: string;
  checkIn: string;
  checkOut: string;
  submitBooking: string;
  bookingSuccess: string;
  // Notifications
  notificationsTitle: string;
  markAllRead: string;
  noNotifications: string;
  // Profile
  profileTitle: string;
  myBookings: string;
  settings: string;
  aboutUs: string;
  // Settings
  settingsTitle: string;
  darkMode: string;
  language: string;
  currency: string;
  pushNotifications: string;
  emailNotifications: string;
  // Saved
  myWishlist: string;
  savedPlaces: string;
  nothingSaved: string;
  nothingSavedHint: string;
  exploreDestinations: string;
  // Gallery
  photoGallery: string;
  photosFromTravellers: string;
  // Chat
  chatTitle: string;
  chatPlaceholder: string;
  chatSend: string;
  chatWelcome: string;
  chatHello: string;
  // Booking extras
  personalInfo: string;
  tripDetails: string;
  selectedPackage: string;
  destinationLabel: string;
  whereToGo: string;
  preferredCheckIn: string;
  preferredCheckOut: string;
  specialRequests: string;
  specialRequestsPlaceholder: string;
  submitBookingRequest: string;
  validationNameRequired: string;
  validationEmailRequired: string;
  validationEmailInvalid: string;
  validationPhoneRequired: string;
  // About
  aboutPageTitle: string;
  whoWeAre: string;
  trustedTravelPartner: string;
  whyChooseUs: string;
  whatMakesDifferent: string;
  ourMission: string;
  happyTravelers: string;
  tourPackages: string;
  supportUs: string;
  // Contact
  getInTouch: string;
  feelFreeContact: string;
  newsletter: string;
  newsletterSubtitle: string;
  subscribe: string;
  enterYourEmail: string;
  readyForTravel: string;
  // Deals
  limitedTime: string;
  flashDeals: string;
  flashDealsSubtitle: string;
  endsIn: string;
  bookAt: string;
  perPersonShort: string;
  // Detail screens
  packageNotFound: string;
  destinationNotFound: string;
  goBack: string;
  aboutThisPackage: string;
  maxPax: string;
  durationLabel: string;
  locationLabel: string;
  reviewsLabel: string;
  topRated: string;
  countryLabel: string;
  bestTime: string;
  allYear: string;
  groupSizeLabel: string;
  ratingLabel: string;
  // Home extras
  uncoverPlace: string;
  popularDestinationsSubtitle: string;
  popularPackages: string;
  packagesSubtitle: string;
  callToAction: string;
  ctaDescription: string;
  perPerson: string;
  // Profile
  defaultUsername: string;
  welcomeBack: string;
  countriesLabel: string;
  noBookingsHint: string;
  browsePackages: string;
  cancelBookingTitle: string;
  cancelBookingMessage: string;
  keepIt: string;
  cancelBookingAction: string;
  bookedOn: string;
  cancel: string;
  ok: string;
  customTrip: string;
  travellersCount: string;
  // Saved
  viewDetails: string;
  // About features
  featureBestPrice: string;
  featureBestPriceDesc: string;
  featureHandpicked: string;
  featureHandpickedDesc: string;
  featureExpertGuides: string;
  featureExpertGuidesDesc: string;
  featureFlexibleBooking: string;
  featureFlexibleBookingDesc: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  missionStatement: string;
  // Contact extras
  ctaContactDescription: string;
  addressLabel: string;
  footerCopyright: string;
  // Booking extras2
  datePlaceholder: string;
  // Deals tags
  tagFlashSale: string;
  tagWeekendDeal: string;
  tagLimitedOffer: string;
  // Notification times
  timeJustNow: string;
  timeMinutesAgo: string;
  timeHoursAgo: string;
  timeDaysAgo: string;
  unreadNotifications: string;
  // Notification seed content
  notifWelcomeTitle: string;
  notifWelcomeBody: string;
  notifSaleTitle: string;
  notifSaleBody: string;
  notifNewDestTitle: string;
  notifNewDestBody: string;
  // Destination detail
  destinationDetailDesc: string;
  expectGuidedTours: string;
  expectLocalCuisine: string;
  expectAccommodations: string;
  expectTransportation: string;
  expectSupport: string;
  // Package detail extras
  inclusionAirfare: string;
  inclusionTransfers: string;
  inclusionAccommodation: string;
  inclusionBreakfast: string;
  inclusionGuidedTours: string;
  inclusionInsurance: string;
  inclusionSupport: string;
  itineraryDay1Title: string; itineraryDay1Desc: string;
  itineraryDay2Title: string; itineraryDay2Desc: string;
  itineraryDay3Title: string; itineraryDay3Desc: string;
  itineraryDay4Title: string; itineraryDay4Desc: string;
  itineraryDay5Title: string; itineraryDay5Desc: string;
  itineraryDay6Title: string; itineraryDay6Desc: string;
  itineraryDay7Title: string; itineraryDay7Desc: string;
  packageDetailExtended: string;
  // Chat extras
  chatOnlineStatus: string;
  chatReply1: string;
  chatReply2: string;
  chatReply3: string;
  chatReply4: string;
  chatReply5: string;
  // Price presets
  priceAny: string;
  priceUnder500: string;
  price500to1000: string;
  priceOver1000: string;
  // Auth
  signIn: string;
  signUp: string;
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  orContinueWith: string;
  signingIn: string;
  signingUp: string;
  passwordMismatch: string;
  passwordTooShort: string;
  welcomeTo: string;
  createAccount: string;
  signInSubtitle: string;
  signUpSubtitle: string;
  continueWithGoogle: string;
  continueWithApple: string;
  agreeToTerms: string;
  termsOfService: string;
  privacyPolicy: string;
  andText: string;
  signOut: string;
  signOutConfirm: string;
  // Onboarding
  onboardingTitle1: string;
  onboardingDesc1: string;
  onboardingTitle2: string;
  onboardingDesc2: string;
  onboardingTitle3: string;
  onboardingDesc3: string;
  getStarted: string;
  next: string;
  skip: string;
  // Premium / Subscription
  premiumTitle: string;
  premiumSubtitle: string;
  premiumProTitle: string;
  premiumEliteTitle: string;
  premiumPerMonth: string;
  premiumPerYear: string;
  premiumSavePercent: string;
  premiumSubscribe: string;
  premiumRestore: string;
  premiumCurrentPlan: string;
  premiumFreePlan: string;
  premiumFeatureDeals: string;
  premiumFeatureSupport: string;
  premiumFeatureCancellation: string;
  premiumFeatureAI: string;
  premiumFeatureAdFree: string;
  premiumFeatureConcierge: string;
  premiumFeatureLounge: string;
  premiumFeatureDoublePoints: string;
  premiumMostPopular: string;
  premiumBestValue: string;
  // Loyalty & Rewards
  loyaltyTitle: string;
  loyaltyPoints: string;
  loyaltyTier: string;
  loyaltyExplorer: string;
  loyaltyAdventurer: string;
  loyaltyGlobetrotter: string;
  loyaltyEarnPoints: string;
  loyaltyRedeemPoints: string;
  loyaltyHistory: string;
  loyaltyNextTier: string;
  loyaltyPointsToNext: string;
  loyaltyReferralBonus: string;
  loyaltyBookingPoints: string;
  loyaltyReviewPoints: string;
  // Referral
  referralTitle: string;
  referralSubtitle: string;
  referralCode: string;
  referralCopyCode: string;
  referralCopied: string;
  referralShareText: string;
  referralFriendsJoined: string;
  referralHowItWorks: string;
  referralStep1: string;
  referralStep2: string;
  referralStep3: string;
  // Reviews & Ratings
  reviewsTitle: string;
  writeReview: string;
  submitReview: string;
  reviewPlaceholder: string;
  noReviewsYet: string;
  beFirstReview: string;
  ratingRequired: string;
  reviewSubmitted: string;
  averageRating: string;
  // AI Assistant
  aiAssistantTitle: string;
  aiAssistantSubtitle: string;
  aiPlaceholder: string;
  aiWelcomeMessage: string;
  aiSuggestion1: string;
  aiSuggestion2: string;
  aiSuggestion3: string;
  aiProFeature: string;
  // Travel Extras / Upsells
  extrasTitle: string;
  extrasSubtitle: string;
  extrasTransfer: string;
  extrasTransferDesc: string;
  extrasInsurance: string;
  extrasInsuranceDesc: string;
  extrasSim: string;
  extrasSimDesc: string;
  extrasLounge: string;
  extrasLoungeDesc: string;
  addToBooking: string;
  skipExtras: string;
  // Featured
  featuredBadge: string;
  sponsoredBadge: string;
  trendingBadge: string;
  // Landing page
  landingBrand: string;
  landingHeroBadge: string;
  landingHeroTitle: string;
  landingHeroSubtitle: string;
  landingCTA: string;
  landingStatTrips: string;
  landingStatTripsLabel: string;
  landingStatDest: string;
  landingStatDestLabel: string;
  landingStatRating: string;
  landingStatRatingLabel: string;
  landingWhyEyebrow: string;
  landingWhyTitle: string;
  landingWhySubtitle: string;
  landingFeatureAI: string;
  landingFeatureAIDesc: string;
  landingFeatureDest: string;
  landingFeatureDestDesc: string;
  landingFeatureSecure: string;
  landingFeatureSecureDesc: string;
  landingFeatureConcierge: string;
  landingFeatureConciergeDesc: string;
  landingTrendingEyebrow: string;
  landingTrendingTitle: string;
  landingCuratedEyebrow: string;
  landingCuratedTitle: string;
  landingTestimonialsEyebrow: string;
  landingTestimonialsTitle: string;
  landingTestimonial1Name: string;
  landingTestimonial1Location: string;
  landingTestimonial1Quote: string;
  landingTestimonial2Name: string;
  landingTestimonial2Location: string;
  landingTestimonial2Quote: string;
  landingTestimonial3Name: string;
  landingTestimonial3Location: string;
  landingTestimonial3Quote: string;
  landingReadyCTA: string;
  landingReadyDesc: string;
  landingCreateAccount: string;
  landingFooterTagline: string;
  landingFooterAbout: string;
  landingFooterContact: string;
  landingFooterDeals: string;
  landingFooterCopyright: string;
  landingExplore: string;
  // Download page
  downloadTitle: string;
  downloadHeroSubtitle: string;
  downloadOnThe: string;
  downloadGetItOn: string;
  downloadAppStore: string;
  downloadGooglePlay: string;
  downloadStatRating: string;
  downloadStatRatingLabel: string;
  downloadStatDownloads: string;
  downloadStatDownloadsLabel: string;
  downloadStatDest: string;
  downloadStatDestLabel: string;
  downloadStatSupport: string;
  downloadStatSupportLabel: string;
  downloadExclusiveEyebrow: string;
  downloadWhyTitle: string;
  downloadWhySubtitle: string;
  downloadFeatureFast: string;
  downloadFeatureFastDesc: string;
  downloadFeatureNotif: string;
  downloadFeatureNotifDesc: string;
  downloadFeatureOffline: string;
  downloadFeatureOfflineDesc: string;
  downloadFeatureOneTap: string;
  downloadFeatureOneTapDesc: string;
  downloadFeatureAI: string;
  downloadFeatureAIDesc: string;
  downloadFeatureSecure: string;
  downloadFeatureSecureDesc: string;
  downloadReviewsEyebrow: string;
  downloadReviewsTitle: string;
  downloadReview1Name: string;
  downloadReview1Text: string;
  downloadReview2Name: string;
  downloadReview2Text: string;
  downloadReview3Name: string;
  downloadReview3Text: string;
  downloadCompareTitle: string;
  downloadCompareApp: string;
  downloadCompareWeb: string;
  downloadComparePush: string;
  downloadCompareOffline: string;
  downloadCompareBiometric: string;
  downloadCompareOneTap: string;
  downloadCompareAI: string;
  downloadCompareBrowse: string;
  downloadBottomCTATitle: string;
  downloadBottomCTADesc: string;
  downloadPlatformIOS: string;
  downloadPlatformAndroid: string;
  // Auth extras
  authError: string;
  authInvalidCredentials: string;
  authSignInFailed: string;
  authSignUpFailed: string;
  authOAuthFailed: string;
  authGoogle: string;
  authApple: string;
  // Profile extras
  getTheApp: string;
  adminPanel: string;
  adminPanelDesc: string;
  tierElite: string;
  tierPro: string;
  aiLabel: string;
  // Premium extras
  premiumNoPurchases: string;
  // Missing keys
  thankYou: string;
  shareDestination: string;
  sharePackage: string;
  // Social share sheet
  shareVia: string;
  shareWhatsApp: string;
  shareTwitter: string;
  shareFacebook: string;
  shareTelegram: string;
  shareEmail: string;
  shareSMS: string;
  shareCopyLink: string;
  shareLinkCopied: string;
  shareMoreOptions: string;
  // AI assistant responses
  aiResponseBali: string;
  aiResponseFamily: string;
  aiResponseBudget: string;
  aiResponseEurope: string;
  aiResponseDefault: string;
  // Smart app banner
  bannerGetApp: string;
  bannerFasterOn: string;
  bannerOpen: string;
  // Live chat extras
  chatWelcomeBack: string;
  chatNewConvo: string;
  chatFreshConvo: string;
  chatLiveAgent: string;
  chatConnectedTeam: string;
  chatEnd: string;
  chatConvoClosed: string;
  chatStartNew: string;
  chatHereToHelp: string;
  chatReturnLive: string;
  chatActiveConvo: string;
  chatConnectAgent: string;
  chatConnectAgentDesc: string;
  chatConnectedLive: string;
  chatAgentRespondSoon: string;
  chatEnded: string;
  chatArchivedChat: string;
  chatHistory: string;
  chatClearAll: string;
  chatDelete: string;
  chatNoArchives: string;
  chatLiveAgentChat: string;
  chatBotConvo: string;
  chatBackToArchives: string;
  chatConversations: string;
  chatMessages: string;
  // Chat translation
  chatTranslate: string;
  chatShowOriginal: string;
  chatTranslating: string;
  chatTranslateAll: string;
  chatAutoTranslate: string;
  chatTranslatedFrom: string;
  chatTranslationFailed: string;
  // Admin panel
  adminTitle: string;
  adminDashboardTitle: string;
  adminDashboardSubtitle: string;
  adminTabDashboard: string;
  adminTabBookings: string;
  adminTabChat: string;
  adminTabDestinations: string;
  adminTabPackages: string;
  adminTabUsers: string;
  adminCancel: string;
  adminSave: string;
  adminEdit: string;
  adminDelete: string;
  adminSearch: string;
  adminValidation: string;
  adminTapUpload: string;
  adminChange: string;
  adminRemove: string;
  adminPermissionNeeded: string;
  adminGrantCameraAccess: string;
  // Admin dashboard
  adminTotalBookings: string;
  adminTotalBookingsTrend: string;
  adminRevenue: string;
  adminRevenueTrend: string;
  adminTotalUsers: string;
  adminTotalUsersTrend: string;
  adminDestinations: string;
  adminQuickActions: string;
  adminAddDestination: string;
  adminCreatePackage: string;
  adminSendNotification: string;
  adminViewReports: string;
  adminRecentBookings: string;
  adminNoBookingsYet: string;
  // Admin reports
  adminReports: string;
  adminDone: string;
  adminBookingStatus: string;
  adminConfirmed: string;
  adminPending: string;
  adminCancelled: string;
  adminMonthlyBookings: string;
  adminTotalPeriod: string;
  adminRevenueLabel: string;
  adminRevenueByPackage: string;
  adminNoRevenueYet: string;
  adminLatestBookings: string;
  adminCustomTrip: string;
  adminAvgBooking: string;
  // Admin notifications
  adminSendTo: string;
  adminAllUsers: string;
  adminSelectUsers: string;
  adminNotifTitle: string;
  adminNotifTitlePlaceholder: string;
  adminNotifMessage: string;
  adminNotifMessagePlaceholder: string;
  adminNotifType: string;
  adminTitleMessageRequired: string;
  adminSelectAtLeastOne: string;
  adminSent: string;
  adminNotifSentTo: string;
  adminUsersSelected: string;
  adminClear: string;
  // Admin bookings
  adminBookingDetails: string;
  adminFullName: string;
  adminEmail: string;
  adminPhone: string;
  adminTravelers: string;
  adminCheckIn: string;
  adminCheckOut: string;
  adminDatePlaceholder: string;
  adminUpdated: string;
  adminBookingUpdated: string;
  adminAll: string;
  adminNoBookingsFound: string;
  adminConfirm: string;
  adminPax: string;
  adminNA: string;
  // Admin destinations
  adminEditDestination: string;
  adminAddDestinationTitle: string;
  adminCoverImage: string;
  adminName: string;
  adminNamePlaceholder: string;
  adminCountry: string;
  adminCountryPlaceholder: string;
  adminRating: string;
  adminDescription: string;
  adminDescPlaceholder: string;
  adminSearchDestinations: string;
  adminAddNewDestination: string;
  adminDeleteDestination: string;
  adminDeleteConfirm: string;
  adminNameCountryRequired: string;
  // Admin packages
  adminEditPackage: string;
  adminAddPackageTitle: string;
  adminPackageImage: string;
  adminPackageTitle: string;
  adminTitlePlaceholder: string;
  adminLocation: string;
  adminLocationPlaceholder: string;
  adminDuration: string;
  adminDurationPlaceholder: string;
  adminMaxPax: string;
  adminPrice: string;
  adminPricePlaceholder: string;
  adminPackageDescPlaceholder: string;
  adminSearchPackages: string;
  adminAddNewPackage: string;
  adminDeletePackage: string;
  adminTitleLocationPriceRequired: string;
  adminReviews: string;
  // Admin users
  adminEditUser: string;
  adminAvatar: string;
  adminRole: string;
  adminSearchUsers: string;
  adminActive: string;
  adminSuspended: string;
  adminAdmins: string;
  adminJoined: string;
  adminBookingsCount: string;
  adminPromote: string;
  adminDemote: string;
  adminSuspend: string;
  adminActivate: string;
  adminNameEmailRequired: string;
  // Admin chat
  adminConversations: string;
  adminLive: string;
  adminNoConvoYet: string;
  adminNoConvoDesc: string;
  adminNoMessages: string;
  adminReopen: string;
  adminClose: string;
  adminConvoClosed: string;
  adminTypeReply: string;
  adminYou: string;
  adminClosed: string;
  adminUnread: string;
}

// ─── All Language Packs ────────────────────────────────────────────────────

const translations: Record<Language, Translations> = {
  en: {
    tabHome: "Home", tabExplore: "Explore", tabTrips: "Trips", tabSaved: "Saved", tabGallery: "Gallery",
    heroTitle: "Journey to\nExplore World", heroSubtitle: "Discover amazing destinations and create unforgettable memories with Tourly",
    learnMore: "Learn More", bookNow: "Book Now", contactUs: "Contact Us",
    findYourTrip: "Find Your Trip", enterDestination: "Enter Destination", numberOfTravelers: "Number of Travelers",
    inquireNow: "Inquire Now", popularDestinations: "Popular Destinations", checkoutPackages: "Checkout Our Packages",
    viewAll: "View All →", dealsTitle: "Deals & Flash Sales 🔥", dealsSubtitle: "Up to 30% off — see all offers",
    save: "Save", saved: "Saved", share: "Share", back: "Back", search: "Search",
    searchPlaceholder: "Search destinations, packages...", noResults: "No results found",
    filterAll: "All", filterDestinations: "Destinations", filterPackages: "Packages",
    sortBy: "Sort", sortDefault: "Default", sortNameAZ: "Name: A–Z", sortRelevance: "Relevance", sortPriceLow: "Price: Low → High", sortPriceHigh: "Price: High → Low", sortRating: "Top Rated",
    priceRange: "Price", resultsFound: "results found", searchTourly: "Search Tourly",
    searchHint: "Find your perfect destination or travel package", tryDifferent: "Try a different search term or adjust filters",
    clearFilters: "Clear Filters",
    bookThisDestination: "Book This Destination", aboutDestination: "About This Destination",
    whatToExpect: "What to Expect", whatsIncluded: "What's Included", sampleItinerary: "Sample Itinerary",
    bookingTitle: "Book Your Trip", fullName: "Full Name", email: "Email", phone: "Phone",
    travelers: "Travelers", checkIn: "Check-in Date", checkOut: "Check-out Date",
    submitBooking: "Submit Booking", bookingSuccess: "Booking submitted successfully!",
    notificationsTitle: "Notifications", markAllRead: "Mark all read", noNotifications: "No notifications yet",
    profileTitle: "My Profile", myBookings: "My Bookings", settings: "Settings", aboutUs: "About Us",
    settingsTitle: "Settings", darkMode: "Dark Mode", language: "Language", currency: "Currency",
    pushNotifications: "Push Notifications", emailNotifications: "Email Notifications",
    myWishlist: "My Wishlist", savedPlaces: "Saved Places", nothingSaved: "Nothing saved yet",
    nothingSavedHint: "Tap the heart icon on any destination or package to save it here.",
    exploreDestinations: "Explore Destinations", photoGallery: "Photo Gallery", photosFromTravellers: "Photos From Travellers",
    chatTitle: "Live Support", chatPlaceholder: "Type a message...", chatSend: "Send",
    chatWelcome: "👋 Hi! Welcome to Tourly. How can we help you today?",
    chatHello: "Hello! I'm your Tourly travel assistant. Ask me anything about destinations, packages, or bookings!",
    personalInfo: "Personal Information", tripDetails: "Trip Details",
    selectedPackage: "Selected Package", destinationLabel: "Destination",
    whereToGo: "Where do you want to go?", preferredCheckIn: "Preferred Check-in Date",
    preferredCheckOut: "Preferred Check-out Date", specialRequests: "Special Requests",
    specialRequestsPlaceholder: "Any special requirements?", submitBookingRequest: "Submit Booking Request",
    validationNameRequired: "Full name is required", validationEmailRequired: "Email address is required",
    validationEmailInvalid: "Please enter a valid email address", validationPhoneRequired: "Phone number is required",
    aboutPageTitle: "About Us", whoWeAre: "Who We Are", trustedTravelPartner: "Your Trusted Travel Partner",
    whyChooseUs: "Why Choose Us", whatMakesDifferent: "What Makes Us Different",
    ourMission: "Our Mission", happyTravelers: "Happy Travelers", tourPackages: "Tour Packages", supportUs: "Support",
    getInTouch: "Get In Touch", feelFreeContact: "Feel free to contact and reach us!",
    newsletter: "Newsletter", newsletterSubtitle: "Subscribe to get the latest deals and travel inspiration.",
    subscribe: "Subscribe", enterYourEmail: "Enter your email", readyForTravel: "Ready For Unforgettable Travel?",
    limitedTime: "Limited Time", flashDeals: "Flash Deals 🔥", flashDealsSubtitle: "Save up to 30% on our top packages",
    endsIn: "Ends in", bookAt: "Book at", perPersonShort: "/person",
    packageNotFound: "Package not found", destinationNotFound: "Destination not found",
    goBack: "Go Back", aboutThisPackage: "About This Package",
    maxPax: "Max Pax", durationLabel: "Duration", locationLabel: "Location",
    reviewsLabel: "reviews", topRated: "Top Rated", countryLabel: "Country",
    bestTime: "Best Time", allYear: "All Year", groupSizeLabel: "Group Size",
    ratingLabel: "Rating",
    uncoverPlace: "Uncover Place", popularDestinationsSubtitle: "Explore our most visited destinations around the world",
    popularPackages: "Popular Packages", packagesSubtitle: "Find the perfect travel package for your next adventure",
    callToAction: "Call To Action", ctaDescription: "Contact us today and let us help you plan your dream vacation!",
    perPerson: "per person",
    defaultUsername: "Traveller", welcomeBack: "Welcome back!",
    countriesLabel: "Countries", noBookingsHint: "No bookings yet. Book a package or destination to see it here.",
    browsePackages: "Browse Packages", cancelBookingTitle: "Cancel Booking",
    cancelBookingMessage: "Cancel your booking for this trip?", keepIt: "Keep It",
    cancelBookingAction: "Cancel Booking", bookedOn: "Booked", cancel: "Cancel", ok: "OK",
    customTrip: "Custom Trip", travellersCount: "travellers",
    viewDetails: "View Details",
    featureBestPrice: "Best Price Guarantee",
    featureBestPriceDesc: "We offer the best prices for all our travel packages with no hidden fees.",
    featureHandpicked: "Handpicked Destinations",
    featureHandpickedDesc: "Our experts carefully select the most beautiful and unique destinations.",
    featureExpertGuides: "Expert Guides",
    featureExpertGuidesDesc: "Professional local guides who know every corner of the destination.",
    featureFlexibleBooking: "Flexible Booking",
    featureFlexibleBookingDesc: "Easy booking process with flexible cancellation policies.",
    aboutParagraph1: "Tourly is a premier travel agency dedicated to creating unforgettable travel experiences. With years of expertise, we connect travelers with the world's most stunning destinations.",
    aboutParagraph2: "Our team of passionate travel experts works tirelessly to curate unique experiences that go beyond ordinary tourism, ensuring every journey is remarkable.",
    missionStatement: "To inspire and enable people to explore the world by providing exceptional, sustainable, and affordable travel experiences that create lasting memories.",
    ctaContactDescription: "Contact us today and let us help you plan your dream vacation. Our team is ready to assist you 24/7.",
    addressLabel: "Address", footerCopyright: "© 2024 Tourly. All rights reserved",
    datePlaceholder: "YYYY-MM-DD",
    tagFlashSale: "Flash Sale", tagWeekendDeal: "Weekend Deal", tagLimitedOffer: "Limited Offer",
    timeJustNow: "Just now", timeMinutesAgo: "m ago", timeHoursAgo: "h ago", timeDaysAgo: "d ago",
    unreadNotifications: "unread notifications",
    notifWelcomeTitle: "Welcome to Tourly \ud83c\udf0d", notifWelcomeBody: "Start exploring amazing destinations and book your next adventure.",
    notifSaleTitle: "Summer Sale \u2014 Up to 30% Off", notifSaleBody: "Limited-time offer on select packages. Book before March 31, 2026.",
    notifNewDestTitle: "New Destination Added", notifNewDestBody: "Bali, Indonesia is now available. Check out our exclusive packages!",
    destinationDetailDesc: "Experience the beauty and culture of this amazing destination. From breathtaking landscapes to rich local traditions, every moment will be unforgettable.",
    expectGuidedTours: "Guided tours with local experts", expectLocalCuisine: "Authentic local cuisine experiences",
    expectAccommodations: "Comfortable accommodations", expectTransportation: "Transportation included", expectSupport: "24/7 travel support",
    inclusionAirfare: "Round-trip airfare", inclusionTransfers: "Airport transfers",
    inclusionAccommodation: "Accommodation (4-star hotel)", inclusionBreakfast: "Daily breakfast",
    inclusionGuidedTours: "Guided tours", inclusionInsurance: "Travel insurance", inclusionSupport: "24/7 support",
    itineraryDay1Title: "Arrival & Welcome", itineraryDay1Desc: "Airport pickup, hotel check-in, welcome dinner",
    itineraryDay2Title: "City Exploration", itineraryDay2Desc: "Guided city tour, local markets, cultural sites",
    itineraryDay3Title: "Adventure Day", itineraryDay3Desc: "Outdoor activities, nature excursions",
    itineraryDay4Title: "Cultural Experience", itineraryDay4Desc: "Traditional workshops, local cuisine",
    itineraryDay5Title: "Free Day", itineraryDay5Desc: "Optional activities or relaxation",
    itineraryDay6Title: "Scenic Tour", itineraryDay6Desc: "Day trip to nearby attractions",
    itineraryDay7Title: "Departure", itineraryDay7Desc: "Breakfast, checkout, airport transfer",
    packageDetailExtended: "Experience an unforgettable journey with our carefully curated travel package. Every detail has been planned to ensure you have the trip of a lifetime.",
    chatOnlineStatus: "Online · Tourly Support",
    chatReply1: "Thanks for reaching out! A travel expert will be with you shortly.",
    chatReply2: "Great question! Our team is reviewing your message now.",
    chatReply3: "We'd love to help you plan your perfect trip! Could you share more details?",
    chatReply4: "Our packages are fully customizable. Let me connect you with a specialist.",
    chatReply5: "For immediate assistance you can also call us at +01 (123) 4567 90.",
    priceAny: "Any", priceUnder500: "< 500", price500to1000: "500 – 700", priceOver1000: "> 700",
    signIn: "Sign In", signUp: "Sign Up", password: "Password", confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?", dontHaveAccount: "Don't have an account?", alreadyHaveAccount: "Already have an account?",
    orContinueWith: "or continue with", signingIn: "Signing in...", signingUp: "Creating account...",
    passwordMismatch: "Passwords do not match", passwordTooShort: "Password must be at least 8 characters",
    welcomeTo: "Welcome to", createAccount: "Create Account", signInSubtitle: "Sign in to access your bookings and saved trips",
    signUpSubtitle: "Join Tourly and start planning your dream vacation",
    continueWithGoogle: "Continue with Google", continueWithApple: "Continue with Apple",
    agreeToTerms: "By signing up, you agree to our", termsOfService: "Terms of Service", privacyPolicy: "Privacy Policy", andText: "and",
    signOut: "Sign Out", signOutConfirm: "Are you sure you want to sign out?",
    // Onboarding
    onboardingTitle1: "Discover Amazing Destinations", onboardingDesc1: "Explore breathtaking places around the world curated just for you.",
    onboardingTitle2: "Book With Confidence", onboardingDesc2: "Flexible booking, best price guarantee, and 24/7 support.",
    onboardingTitle3: "Earn Rewards As You Travel", onboardingDesc3: "Collect points on every trip and unlock exclusive perks.",
    getStarted: "Get Started", next: "Next", skip: "Skip",
    // Premium
    premiumTitle: "Tourly Pro", premiumSubtitle: "Unlock the ultimate travel experience",
    premiumProTitle: "Pro", premiumEliteTitle: "Elite",
    premiumPerMonth: "/month", premiumPerYear: "/year", premiumSavePercent: "Save",
    premiumSubscribe: "Subscribe Now", premiumRestore: "Restore Purchase", premiumCurrentPlan: "Current Plan", premiumFreePlan: "Free",
    premiumFeatureDeals: "Exclusive deals & early access", premiumFeatureSupport: "Priority customer support",
    premiumFeatureCancellation: "Free cancellation on all bookings", premiumFeatureAI: "AI-powered trip planner",
    premiumFeatureAdFree: "Ad-free experience", premiumFeatureConcierge: "Personal concierge service",
    premiumFeatureLounge: "Airport lounge access", premiumFeatureDoublePoints: "2× loyalty points",
    premiumMostPopular: "Most Popular", premiumBestValue: "Best Value",
    // Loyalty
    loyaltyTitle: "Rewards", loyaltyPoints: "Points", loyaltyTier: "Tier",
    loyaltyExplorer: "Explorer", loyaltyAdventurer: "Adventurer", loyaltyGlobetrotter: "Globetrotter",
    loyaltyEarnPoints: "Earn Points", loyaltyRedeemPoints: "Redeem Points", loyaltyHistory: "History",
    loyaltyNextTier: "Next Tier", loyaltyPointsToNext: "points to next tier",
    loyaltyReferralBonus: "Referral Bonus", loyaltyBookingPoints: "Booking Points", loyaltyReviewPoints: "Review Points",
    // Referral
    referralTitle: "Refer a Friend", referralSubtitle: "Share Tourly and earn 500 points per referral",
    referralCode: "Your Referral Code", referralCopyCode: "Copy Code", referralCopied: "Copied!",
    referralShareText: "Join me on Tourly! Use my code for a bonus: ",
    referralFriendsJoined: "Friends Joined", referralHowItWorks: "How It Works",
    referralStep1: "Share your unique code with friends",
    referralStep2: "They sign up and book their first trip",
    referralStep3: "You both earn 500 bonus points!",
    // Reviews
    reviewsTitle: "Reviews", writeReview: "Write a Review", submitReview: "Submit Review",
    reviewPlaceholder: "Share your experience...", noReviewsYet: "No reviews yet",
    beFirstReview: "Be the first to leave a review!", ratingRequired: "Please select a rating",
    reviewSubmitted: "Review submitted!", averageRating: "Average Rating",
    // AI Assistant
    aiAssistantTitle: "AI Travel Planner", aiAssistantSubtitle: "Plan your perfect trip with AI",
    aiPlaceholder: "Ask me anything about travel...",
    aiWelcomeMessage: "Hi! I'm your AI travel assistant. I can help you plan trips, suggest destinations, create itineraries, and more. What would you like to explore?",
    aiSuggestion1: "Plan a 5-day trip to Bali", aiSuggestion2: "Best destinations for families", aiSuggestion3: "Budget travel tips for Europe",
    aiProFeature: "Upgrade to Pro for unlimited AI planning",
    // Travel Extras
    extrasTitle: "Enhance Your Trip", extrasSubtitle: "Add extras to make your journey even better",
    extrasTransfer: "Airport Transfer", extrasTransferDesc: "Private car pickup and drop-off",
    extrasInsurance: "Travel Insurance", extrasInsuranceDesc: "Comprehensive coverage for your trip",
    extrasSim: "eSIM Data Plan", extrasSimDesc: "Stay connected with unlimited data",
    extrasLounge: "Airport Lounge", extrasLoungeDesc: "Relax before your flight in comfort",
    addToBooking: "Add to Booking", skipExtras: "Skip, Continue to Confirmation",
    // Featured
    featuredBadge: "Featured", sponsoredBadge: "Sponsored", trendingBadge: "Trending",
    // Landing page
    landingBrand: "Tourly", landingHeroBadge: "#1 AI-Powered Travel App",
    landingHeroTitle: "Explore The\nWorld With\nTourly", landingHeroSubtitle: "Discover breathtaking destinations, curated packages, and AI-powered travel planning — all in one app.",
    landingCTA: "Get Started",
    landingStatTrips: "50K+", landingStatTripsLabel: "Trips Booked", landingStatDest: "120+", landingStatDestLabel: "Destinations", landingStatRating: "4.9", landingStatRatingLabel: "App Rating",
    landingWhyEyebrow: "Why Tourly", landingWhyTitle: "Travel Smarter,\nNot Harder", landingWhySubtitle: "Everything you need for the perfect trip, powered by modern technology and local insights.",
    landingFeatureAI: "AI Trip Planner", landingFeatureAIDesc: "Get personalized itineraries crafted by advanced AI based on your preferences and budget.",
    landingFeatureDest: "50+ Destinations", landingFeatureDestDesc: "Explore curated destinations across 6 continents, from hidden gems to iconic landmarks.",
    landingFeatureSecure: "Secure Booking", landingFeatureSecureDesc: "End-to-end encrypted payments with flexible cancellation and full refund protection.",
    landingFeatureConcierge: "24/7 Concierge", landingFeatureConciergeDesc: "Real-time support from local experts who know every corner of your destination.",
    landingTrendingEyebrow: "Trending Now", landingTrendingTitle: "Popular Destinations",
    landingCuratedEyebrow: "Curated For You", landingCuratedTitle: "Travel Packages",
    landingTestimonialsEyebrow: "Testimonials", landingTestimonialsTitle: "Loved by Travelers",
    landingTestimonial1Name: "Sarah Mitchell", landingTestimonial1Location: "New York, USA",
    landingTestimonial1Quote: "Tourly made planning our honeymoon effortless. The AI suggested places we never would have found!",
    landingTestimonial2Name: "Kenji Tanaka", landingTestimonial2Location: "Tokyo, Japan",
    landingTestimonial2Quote: "The concierge service was incredible. Felt like having a local friend in every city we visited.",
    landingTestimonial3Name: "Amara Osei", landingTestimonial3Location: "Accra, Ghana",
    landingTestimonial3Quote: "Best travel app I've used. The deals are real and the booking process is seamless.",
    landingReadyCTA: "Ready for Your Next Adventure?", landingReadyDesc: "Join 50,000+ travelers who plan and book with Tourly. Start your free account today.",
    landingCreateAccount: "Create Free Account",
    landingFooterTagline: "Making travel accessible, personalized, and unforgettable since 2024.",
    landingFooterAbout: "About", landingFooterContact: "Contact", landingFooterDeals: "Deals",
    landingFooterCopyright: "© 2024–2026 Tourly. All rights reserved.",
    landingExplore: "Explore",
    // Download page
    downloadTitle: "Get the App",
    downloadHeroSubtitle: "Your pocket travel companion.\nExplore, book, and go — all from one app.",
    downloadOnThe: "Download on the", downloadGetItOn: "Get it on", downloadAppStore: "App Store", downloadGooglePlay: "Google Play",
    downloadStatRating: "4.9", downloadStatRatingLabel: "App Rating", downloadStatDownloads: "500K+", downloadStatDownloadsLabel: "Downloads",
    downloadStatDest: "100+", downloadStatDestLabel: "Destinations", downloadStatSupport: "24/7", downloadStatSupportLabel: "Support",
    downloadExclusiveEyebrow: "App Exclusive", downloadWhyTitle: "Why Download Tourly?", downloadWhySubtitle: "The app unlocks features you can't get in the browser.",
    downloadFeatureFast: "Lightning Fast", downloadFeatureFastDesc: "Native performance that's smoother than any browser experience.",
    downloadFeatureNotif: "Push Notifications", downloadFeatureNotifDesc: "Never miss a deal — get instant alerts on flash sales and price drops.",
    downloadFeatureOffline: "Offline Access", downloadFeatureOfflineDesc: "Save itineraries and maps for when you're off the grid.",
    downloadFeatureOneTap: "One-Tap Booking", downloadFeatureOneTapDesc: "Book trips in seconds with saved payment and traveler info.",
    downloadFeatureAI: "AI Trip Planner", downloadFeatureAIDesc: "Get personalized trip suggestions powered by AI, built right in.",
    downloadFeatureSecure: "Secure & Private", downloadFeatureSecureDesc: "Biometric login and encrypted data keep your info safe.",
    downloadReviewsEyebrow: "Loved by Travelers", downloadReviewsTitle: "What Users Say",
    downloadReview1Name: "Sarah M.", downloadReview1Text: "Best travel app I've ever used! Booked my Bali trip in under 2 minutes.",
    downloadReview2Name: "James K.", downloadReview2Text: "The offline maps saved me in rural Japan. Absolute game changer.",
    downloadReview3Name: "Aisha R.", downloadReview3Text: "Push notifications caught a 40% flash sale. Saved $300 on my trip!",
    downloadCompareTitle: "App vs. Browser", downloadCompareApp: "App", downloadCompareWeb: "Web",
    downloadComparePush: "Push Notifications", downloadCompareOffline: "Offline Access", downloadCompareBiometric: "Biometric Login",
    downloadCompareOneTap: "One-Tap Booking", downloadCompareAI: "AI Trip Planner", downloadCompareBrowse: "Browse Destinations",
    downloadBottomCTATitle: "Ready to Travel Smarter?", downloadBottomCTADesc: "Download Tourly free on iOS and Android.",
    downloadPlatformIOS: "iOS", downloadPlatformAndroid: "Android",
    // Auth extras
    authError: "Error", authInvalidCredentials: "Invalid credentials",
    authSignInFailed: "Sign in failed. Please try again.", authSignUpFailed: "Sign up failed. Please try again.",
    authOAuthFailed: "OAuth login failed. Please try again.", authGoogle: "Google", authApple: "Apple",
    // Profile extras
    getTheApp: "Get the App", adminPanel: "Admin Panel", adminPanelDesc: "Manage bookings, users & destinations",
    tierElite: "Elite", tierPro: "Pro", aiLabel: "AI",
    // Premium extras
    premiumNoPurchases: "No previous purchases found.",
    // Missing keys
    thankYou: "Thank You!", shareDestination: "Check out this destination on Tourly!", sharePackage: "Check out this package on Tourly!",
    shareVia: "Share via", shareWhatsApp: "WhatsApp", shareTwitter: "X (Twitter)", shareFacebook: "Facebook", shareTelegram: "Telegram", shareEmail: "Email", shareSMS: "SMS", shareCopyLink: "Copy Link", shareLinkCopied: "Link copied to clipboard!", shareMoreOptions: "More options",
    // AI assistant responses
    aiResponseBali: "Bali is a fantastic choice! Here's a suggested 5-day itinerary:\n\n📍 Day 1: Arrive, explore Seminyak Beach\n📍 Day 2: Ubud Rice Terraces & Monkey Forest\n📍 Day 3: Uluwatu Temple & Kecak Dance\n📍 Day 4: Nusa Penida day trip\n📍 Day 5: Spa day & departure\n\nBest time to visit: April-October (dry season). Budget: ~$50-150/day depending on comfort level.",
    aiResponseFamily: "Great family destinations:\n\n🏖️ Maldives - overwater villas, snorkeling\n🏰 Japan - Tokyo Disneyland, cultural experiences\n🌴 Thailand - beaches, elephant sanctuaries\n🏔️ Switzerland - scenic trains, hiking\n🦁 Kenya - family-friendly safaris\n\nWould you like more details on any of these?",
    aiResponseBudget: "Top budget travel tips:\n\n💡 Travel during shoulder season (spring/fall)\n💡 Book flights on Tuesdays for best deals\n💡 Use local transport instead of taxis\n💡 Stay in guesthouses or hostels\n💡 Eat at local markets & street food\n💡 Get city passes for attractions\n\nBudget-friendly destinations: Vietnam, Portugal, Mexico, Thailand, Morocco.",
    aiResponseEurope: "Europe trip planning:\n\n🇫🇷 Paris - 3 days minimum\n🇮🇹 Rome/Florence - 4 days\n🇪🇸 Barcelona - 2-3 days\n🇬🇷 Santorini - 2-3 days\n\n✈️ Pro tip: Use budget airlines like Ryanair/EasyJet between cities. Get a Eurail pass for longer trips. Budget: €60-150/day.",
    aiResponseDefault: "That's a great question! I'd recommend exploring our curated packages for the best deals. You can also check out our destinations page for inspiration.\n\nWant me to help you plan a specific trip? Just tell me:\n• Where you'd like to go\n• How many days\n• Your budget range\n• Travel style (adventure, relaxation, culture)",
    // Smart app banner
    bannerGetApp: "Get the Tourly App", bannerFasterOn: "Faster experience on", bannerOpen: "Open",
    // Live chat extras
    chatWelcomeBack: "Welcome back! 👋 Great to see you again. How can I help you today?",
    chatNewConvo: "New conversation started! ✨ Previous chat has been archived. How can I help?",
    chatFreshConvo: "Starting a fresh conversation! ✨ What can I help you with?",
    chatLiveAgent: "Live Agent", chatConnectedTeam: "Connected to support team", chatEnd: "End",
    chatConvoClosed: "This conversation has been closed", chatStartNew: "Start a new conversation",
    chatHereToHelp: "We're here to help — ask us anything",
    chatReturnLive: "Return to Live Chat", chatActiveConvo: "You have an active conversation with support",
    chatConnectAgent: "Chat with Live Agent", chatConnectAgentDesc: "Connect to our support team for real-time help",
    chatConnectedLive: "Connected to Live Support", chatAgentRespondSoon: "A support agent will respond shortly.\nType a message to get started.",
    chatEnded: "Chat ended",
    chatArchivedChat: "Archived Chat", chatHistory: "Chat History", chatClearAll: "Clear All", chatDelete: "Delete",
    chatNoArchives: "No archived chats", chatLiveAgentChat: "Live Agent Chat", chatBotConvo: "Bot Conversation",
    chatBackToArchives: "Back to all archives", chatConversations: "conversations", chatMessages: "messages",
    // Chat translation
    chatTranslate: "Translate", chatShowOriginal: "Show original", chatTranslating: "Translating…",
    chatTranslateAll: "Translate all", chatAutoTranslate: "Auto-translate",
    chatTranslatedFrom: "Translated from", chatTranslationFailed: "Translation failed",
    // Admin panel
    adminTitle: "Admin Panel", adminDashboardTitle: "Admin Dashboard", adminDashboardSubtitle: "Manage your travel platform",
    adminTabDashboard: "Dashboard", adminTabBookings: "Bookings", adminTabChat: "Chat",
    adminTabDestinations: "Destinations", adminTabPackages: "Packages", adminTabUsers: "Users",
    adminCancel: "Cancel", adminSave: "Save", adminEdit: "Edit", adminDelete: "Delete", adminSearch: "Search",
    adminValidation: "Validation", adminTapUpload: "Tap to upload", adminChange: "Change", adminRemove: "Remove",
    adminPermissionNeeded: "Permission needed", adminGrantCameraAccess: "Please grant camera roll access to upload images.",
    // Admin dashboard
    adminTotalBookings: "Total Bookings", adminTotalBookingsTrend: "+12% this month",
    adminRevenue: "Revenue", adminRevenueTrend: "+8% this month",
    adminTotalUsers: "Total Users", adminTotalUsersTrend: "+3 this week",
    adminDestinations: "Destinations",
    adminQuickActions: "Quick Actions", adminAddDestination: "Add Destination", adminCreatePackage: "Create Package",
    adminSendNotification: "Send Notification", adminViewReports: "View Reports",
    adminRecentBookings: "Recent Bookings", adminNoBookingsYet: "No bookings yet",
    // Admin reports
    adminReports: "Reports", adminDone: "Done",
    adminBookingStatus: "Booking Status", adminConfirmed: "Confirmed", adminPending: "Pending", adminCancelled: "Cancelled",
    adminMonthlyBookings: "Monthly Bookings (Last 6 Months)", adminTotalPeriod: "Total this period",
    adminRevenueLabel: "revenue", adminRevenueByPackage: "Revenue by Package", adminNoRevenueYet: "No revenue data yet",
    adminLatestBookings: "Latest Bookings", adminCustomTrip: "Custom Trip", adminAvgBooking: "Avg / Booking",
    // Admin notifications
    adminSendTo: "Send To", adminAllUsers: "All Users", adminSelectUsers: "Select Users",
    adminNotifTitle: "Title", adminNotifTitlePlaceholder: "e.g. Summer Sale — 30% Off",
    adminNotifMessage: "Message", adminNotifMessagePlaceholder: "Notification message...", adminNotifType: "Type",
    adminTitleMessageRequired: "Title and message are required.", adminSelectAtLeastOne: "Please select at least one user.",
    adminSent: "Sent", adminNotifSentTo: "Notification sent to", adminUsersSelected: "selected", adminClear: "Clear",
    // Admin bookings
    adminBookingDetails: "Booking Details", adminFullName: "Full Name", adminEmail: "Email", adminPhone: "Phone",
    adminTravelers: "Travelers", adminCheckIn: "Check-in", adminCheckOut: "Check-out", adminDatePlaceholder: "YYYY-MM-DD",
    adminUpdated: "Updated", adminBookingUpdated: "Booking details updated (local demo).",
    adminAll: "All", adminNoBookingsFound: "No bookings found", adminConfirm: "Confirm", adminPax: "pax", adminNA: "N/A",
    // Admin destinations
    adminEditDestination: "Edit Destination", adminAddDestinationTitle: "Add Destination",
    adminCoverImage: "Cover Image", adminName: "Name", adminNamePlaceholder: "e.g. Santorini",
    adminCountry: "Country", adminCountryPlaceholder: "e.g. Greece", adminRating: "Rating (1-5)",
    adminDescription: "Description", adminDescPlaceholder: "Short description...",
    adminSearchDestinations: "Search destinations...", adminAddNewDestination: "Add New Destination",
    adminDeleteDestination: "Delete Destination", adminDeleteConfirm: "Are you sure you want to delete",
    adminNameCountryRequired: "Name and country are required.",
    // Admin packages
    adminEditPackage: "Edit Package", adminAddPackageTitle: "Add Package",
    adminPackageImage: "Package Image", adminPackageTitle: "Title", adminTitlePlaceholder: "e.g. Beach Holiday",
    adminLocation: "Location", adminLocationPlaceholder: "e.g. Malaysia",
    adminDuration: "Duration", adminDurationPlaceholder: "e.g. 7D/6N", adminMaxPax: "Max Pax",
    adminPrice: "Price ($)", adminPricePlaceholder: "e.g. 750",
    adminPackageDescPlaceholder: "Package description...", adminSearchPackages: "Search packages...",
    adminAddNewPackage: "Add New Package", adminDeletePackage: "Delete Package",
    adminTitleLocationPriceRequired: "Title, location, and price are required.", adminReviews: "reviews",
    // Admin users
    adminEditUser: "Edit User", adminAvatar: "Avatar", adminRole: "Role",
    adminSearchUsers: "Search users...", adminActive: "Active", adminSuspended: "Suspended", adminAdmins: "Admins",
    adminJoined: "Joined", adminBookingsCount: "bookings",
    adminPromote: "Promote", adminDemote: "Demote", adminSuspend: "Suspend", adminActivate: "Activate",
    adminNameEmailRequired: "Name and email are required.",
    // Admin chat
    adminConversations: "Conversations", adminLive: "Live", adminNoConvoYet: "No conversations yet",
    adminNoConvoDesc: "When users start chatting via the live chat,\ntheir conversations will appear here.",
    adminNoMessages: "No messages yet", adminReopen: "Reopen", adminClose: "Close",
    adminConvoClosed: "Conversation closed", adminTypeReply: "Type a reply...",
    adminYou: "You: ", adminClosed: "Closed", adminUnread: "unread",
  },
  es: {
    tabHome: "Inicio", tabExplore: "Explorar", tabTrips: "Viajes", tabSaved: "Guardado", tabGallery: "Galería",
    heroTitle: "Viaje para\nExplorar el Mundo", heroSubtitle: "Descubre destinos increíbles y crea recuerdos inolvidables con Tourly",
    learnMore: "Saber Más", bookNow: "Reservar", contactUs: "Contáctanos",
    findYourTrip: "Encuentra tu Viaje", enterDestination: "Ingresa Destino", numberOfTravelers: "Número de Viajeros",
    inquireNow: "Consultar Ahora", popularDestinations: "Destinos Populares", checkoutPackages: "Nuestros Paquetes",
    viewAll: "Ver Todo →", dealsTitle: "Ofertas y Descuentos 🔥", dealsSubtitle: "Hasta 30% de descuento",
    save: "Guardar", saved: "Guardado", share: "Compartir", back: "Volver", search: "Buscar",
    searchPlaceholder: "Buscar destinos, paquetes...", noResults: "Sin resultados",
    filterAll: "Todo", filterDestinations: "Destinos", filterPackages: "Paquetes",
    sortBy: "Ordenar", sortDefault: "Predeterminado", sortNameAZ: "Nombre: A–Z", sortRelevance: "Relevancia", sortPriceLow: "Precio: Menor → Mayor", sortPriceHigh: "Precio: Mayor → Menor", sortRating: "Mejor Valorado",
    priceRange: "Precio", resultsFound: "resultados", searchTourly: "Buscar en Tourly",
    searchHint: "Encuentra tu destino o paquete de viaje perfecto", tryDifferent: "Intenta otro término o ajusta los filtros",
    clearFilters: "Limpiar Filtros",
    bookThisDestination: "Reservar este Destino", aboutDestination: "Sobre este Destino",
    whatToExpect: "Qué Esperar", whatsIncluded: "Qué Incluye", sampleItinerary: "Itinerario de Muestra",
    bookingTitle: "Reserva tu Viaje", fullName: "Nombre Completo", email: "Correo", phone: "Teléfono",
    travelers: "Viajeros", checkIn: "Fecha de Entrada", checkOut: "Fecha de Salida",
    submitBooking: "Enviar Reserva", bookingSuccess: "¡Reserva enviada con éxito!",
    notificationsTitle: "Notificaciones", markAllRead: "Marcar todo leído", noNotifications: "Sin notificaciones",
    profileTitle: "Mi Perfil", myBookings: "Mis Reservas", settings: "Configuración", aboutUs: "Sobre Nosotros",
    settingsTitle: "Configuración", darkMode: "Modo Oscuro", language: "Idioma", currency: "Moneda",
    pushNotifications: "Notificaciones Push", emailNotifications: "Notificaciones por Email",
    myWishlist: "Mi Lista de Deseos", savedPlaces: "Lugares Guardados", nothingSaved: "Nada guardado aún",
    nothingSavedHint: "Toca el corazón en cualquier destino o paquete para guardarlo aquí.",
    exploreDestinations: "Explorar Destinos", photoGallery: "Galería de Fotos", photosFromTravellers: "Fotos de Viajeros",
    chatTitle: "Soporte en Vivo", chatPlaceholder: "Escribe un mensaje...", chatSend: "Enviar",
    chatWelcome: "👋 ¡Hola! Bienvenido a Tourly. ¿Cómo podemos ayudarte?",
    chatHello: "¡Hola! Soy tu asistente de viajes Tourly. ¡Pregúntame sobre destinos, paquetes o reservas!",
    personalInfo: "Información Personal", tripDetails: "Detalles del Viaje",
    selectedPackage: "Paquete Seleccionado", destinationLabel: "Destino",
    whereToGo: "¿A dónde quieres ir?", preferredCheckIn: "Fecha de Entrada Preferida",
    preferredCheckOut: "Fecha de Salida Preferida", specialRequests: "Solicitudes Especiales",
    specialRequestsPlaceholder: "¿Algún requisito especial?", submitBookingRequest: "Enviar Solicitud de Reserva",
    validationNameRequired: "El nombre completo es requerido", validationEmailRequired: "El correo es requerido",
    validationEmailInvalid: "Por favor ingresa un correo válido", validationPhoneRequired: "El teléfono es requerido",
    aboutPageTitle: "Sobre Nosotros", whoWeAre: "Quiénes Somos", trustedTravelPartner: "Tu Socio de Viajes de Confianza",
    whyChooseUs: "Por Qué Elegirnos", whatMakesDifferent: "Qué Nos Hace Diferentes",
    ourMission: "Nuestra Misión", happyTravelers: "Viajeros Felices", tourPackages: "Paquetes de Tour", supportUs: "Soporte",
    getInTouch: "Ponerse en Contacto", feelFreeContact: "¡Siéntete libre de contactarnos!",
    newsletter: "Boletín", newsletterSubtitle: "Suscríbete para recibir las últimas ofertas.",
    subscribe: "Suscribirse", enterYourEmail: "Ingresa tu correo", readyForTravel: "¿Listo para un Viaje Inolvidable?",
    limitedTime: "Tiempo Limitado", flashDeals: "Ofertas Relámpago 🔥", flashDealsSubtitle: "Ahorra hasta un 30% en nuestros mejores paquetes",
    endsIn: "Termina en", bookAt: "Reservar a", perPersonShort: "/persona",
    packageNotFound: "Paquete no encontrado", destinationNotFound: "Destino no encontrado",
    goBack: "Volver", aboutThisPackage: "Sobre este Paquete",
    maxPax: "Máx. Personas", durationLabel: "Duración", locationLabel: "Ubicación",
    reviewsLabel: "reseñas", topRated: "Más Valorado", countryLabel: "País",
    bestTime: "Mejor Época", allYear: "Todo el Año", groupSizeLabel: "Tamaño del Grupo",
    ratingLabel: "Valoración",
    uncoverPlace: "Descubre Lugares", popularDestinationsSubtitle: "Explora nuestros destinos más visitados del mundo",
    popularPackages: "Paquetes Populares", packagesSubtitle: "Encuentra el paquete de viaje perfecto para tu próxima aventura",
    callToAction: "Llamada a la Acción", ctaDescription: "¡Contáctanos hoy y te ayudaremos a planificar las vacaciones de tus sueños!",
    perPerson: "por persona",
    defaultUsername: "Viajero", welcomeBack: "¡Bienvenido de nuevo!",
    countriesLabel: "Países", noBookingsHint: "Aún no hay reservas. Reserva un paquete o destino para verlo aquí.",
    browsePackages: "Explorar Paquetes", cancelBookingTitle: "Cancelar Reserva",
    cancelBookingMessage: "¿Cancelar tu reserva para este viaje?", keepIt: "Mantener",
    cancelBookingAction: "Cancelar Reserva", bookedOn: "Reservado", cancel: "Cancelar", ok: "OK",
    customTrip: "Viaje Personalizado", travellersCount: "viajeros",
    viewDetails: "Ver Detalles",
    featureBestPrice: "Garantía de Mejor Precio",
    featureBestPriceDesc: "Ofrecemos los mejores precios para todos nuestros paquetes de viaje sin cargos ocultos.",
    featureHandpicked: "Destinos Seleccionados",
    featureHandpickedDesc: "Nuestros expertos seleccionan cuidadosamente los destinos más bellos y únicos.",
    featureExpertGuides: "Guías Expertos",
    featureExpertGuidesDesc: "Guías locales profesionales que conocen cada rincón del destino.",
    featureFlexibleBooking: "Reserva Flexible",
    featureFlexibleBookingDesc: "Proceso de reserva fácil con políticas de cancelación flexibles.",
    aboutParagraph1: "Tourly es una agencia de viajes de primera dedicada a crear experiencias de viaje inolvidables. Con años de experiencia, conectamos a los viajeros con los destinos más impresionantes del mundo.",
    aboutParagraph2: "Nuestro equipo de apasionados expertos en viajes trabaja incansablemente para crear experiencias únicas que van más allá del turismo ordinario.",
    missionStatement: "Inspirar y permitir que las personas exploren el mundo proporcionando experiencias de viaje excepcionales, sostenibles y asequibles.",
    ctaContactDescription: "Contáctanos hoy y te ayudaremos a planificar tus vacaciones soñadas. Nuestro equipo está listo para asistirte 24/7.",
    addressLabel: "Dirección", footerCopyright: "© 2024 Tourly. Todos los derechos reservados",
    datePlaceholder: "AAAA-MM-DD",
    tagFlashSale: "Oferta Relámpago", tagWeekendDeal: "Oferta de Fin de Semana", tagLimitedOffer: "Oferta Limitada",
    timeJustNow: "Ahora", timeMinutesAgo: "m", timeHoursAgo: "h", timeDaysAgo: "d",
    unreadNotifications: "notificaciones sin leer",
    notifWelcomeTitle: "Bienvenido a Tourly \ud83c\udf0d", notifWelcomeBody: "Comienza a explorar destinos incre\u00edbles y reserva tu pr\u00f3xima aventura.",
    notifSaleTitle: "Oferta de Verano \u2014 Hasta 30% Off", notifSaleBody: "Oferta por tiempo limitado en paquetes seleccionados. Reserva antes del 31 de marzo de 2026.",
    notifNewDestTitle: "Nuevo Destino A\u00f1adido", notifNewDestBody: "Bali, Indonesia ya est\u00e1 disponible. \u00a1Descubre nuestros paquetes exclusivos!",
    destinationDetailDesc: "Experimenta la belleza y cultura de este increíble destino. Desde paisajes impresionantes hasta ricas tradiciones locales, cada momento será inolvidable.",
    expectGuidedTours: "Tours guiados con expertos locales", expectLocalCuisine: "Experiencias de cocina local auténtica",
    expectAccommodations: "Alojamientos confortables", expectTransportation: "Transporte incluido", expectSupport: "Soporte de viaje 24/7",
    inclusionAirfare: "Vuelo de ida y vuelta", inclusionTransfers: "Traslados al aeropuerto",
    inclusionAccommodation: "Alojamiento (hotel 4 estrellas)", inclusionBreakfast: "Desayuno diario",
    inclusionGuidedTours: "Tours guiados", inclusionInsurance: "Seguro de viaje", inclusionSupport: "Soporte 24/7",
    itineraryDay1Title: "Llegada y Bienvenida", itineraryDay1Desc: "Recogida en aeropuerto, check-in, cena de bienvenida",
    itineraryDay2Title: "Exploración de la Ciudad", itineraryDay2Desc: "Tour guiado, mercados locales, sitios culturales",
    itineraryDay3Title: "Día de Aventura", itineraryDay3Desc: "Actividades al aire libre, excursiones por la naturaleza",
    itineraryDay4Title: "Experiencia Cultural", itineraryDay4Desc: "Talleres tradicionales, cocina local",
    itineraryDay5Title: "Día Libre", itineraryDay5Desc: "Actividades opcionales o relajación",
    itineraryDay6Title: "Tour Panorámico", itineraryDay6Desc: "Excursión a atracciones cercanas",
    itineraryDay7Title: "Partida", itineraryDay7Desc: "Desayuno, checkout, traslado al aeropuerto",
    packageDetailExtended: "Experimenta un viaje inolvidable con nuestro paquete de viaje cuidadosamente diseñado. Cada detalle ha sido planificado para el viaje de tu vida.",
    chatOnlineStatus: "En línea · Soporte Tourly",
    chatReply1: "¡Gracias por contactarnos! Un experto en viajes estará contigo pronto.",
    chatReply2: "¡Gran pregunta! Nuestro equipo está revisando tu mensaje.",
    chatReply3: "¡Nos encantaría ayudarte a planificar tu viaje perfecto! ¿Podrías compartir más detalles?",
    chatReply4: "Nuestros paquetes son totalmente personalizables. Te conectaré con un especialista.",
    chatReply5: "Para asistencia inmediata también puedes llamarnos al +01 (123) 4567 90.",
    priceAny: "Cualquiera", priceUnder500: "< 500", price500to1000: "500 – 700", priceOver1000: "> 700",
    signIn: "Iniciar Sesión", signUp: "Registrarse", password: "Contraseña", confirmPassword: "Confirmar Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?", dontHaveAccount: "¿No tienes cuenta?", alreadyHaveAccount: "¿Ya tienes cuenta?",
    orContinueWith: "o continuar con", signingIn: "Iniciando sesión...", signingUp: "Creando cuenta...",
    passwordMismatch: "Las contraseñas no coinciden", passwordTooShort: "La contraseña debe tener al menos 8 caracteres",
    welcomeTo: "Bienvenido a", createAccount: "Crear Cuenta", signInSubtitle: "Inicia sesión para acceder a tus reservas y viajes guardados",
    signUpSubtitle: "Únete a Tourly y comienza a planificar tus vacaciones soñadas",
    continueWithGoogle: "Continuar con Google", continueWithApple: "Continuar con Apple",
    agreeToTerms: "Al registrarte, aceptas nuestros", termsOfService: "Términos de Servicio", privacyPolicy: "Política de Privacidad", andText: "y",
    signOut: "Cerrar Sesión", signOutConfirm: "¿Estás seguro de que deseas cerrar sesión?",
    // Onboarding
    onboardingTitle1: "Descubre Destinos Increíbles", onboardingDesc1: "Explora lugares impresionantes de todo el mundo seleccionados para ti.",
    onboardingTitle2: "Reserva con Confianza", onboardingDesc2: "Reservas flexibles, mejor precio garantizado y soporte 24/7.",
    onboardingTitle3: "Gana Recompensas al Viajar", onboardingDesc3: "Acumula puntos en cada viaje y desbloquea beneficios exclusivos.",
    getStarted: "Comenzar", next: "Siguiente", skip: "Omitir",
    // Premium
    premiumTitle: "Tourly Pro", premiumSubtitle: "Desbloquea la experiencia de viaje definitiva",
    premiumProTitle: "Pro", premiumEliteTitle: "Elite",
    premiumPerMonth: "/mes", premiumPerYear: "/año", premiumSavePercent: "Ahorra",
    premiumSubscribe: "Suscribirse Ahora", premiumRestore: "Restaurar Compra", premiumCurrentPlan: "Plan Actual", premiumFreePlan: "Gratis",
    premiumFeatureDeals: "Ofertas exclusivas y acceso anticipado", premiumFeatureSupport: "Soporte prioritario al cliente",
    premiumFeatureCancellation: "Cancelación gratuita en todas las reservas", premiumFeatureAI: "Planificador de viajes con IA",
    premiumFeatureAdFree: "Experiencia sin anuncios", premiumFeatureConcierge: "Servicio de conserjería personal",
    premiumFeatureLounge: "Acceso a salas VIP del aeropuerto", premiumFeatureDoublePoints: "2× puntos de fidelidad",
    premiumMostPopular: "Más Popular", premiumBestValue: "Mejor Valor",
    // Loyalty
    loyaltyTitle: "Recompensas", loyaltyPoints: "Puntos", loyaltyTier: "Nivel",
    loyaltyExplorer: "Explorador", loyaltyAdventurer: "Aventurero", loyaltyGlobetrotter: "Trotamundos",
    loyaltyEarnPoints: "Ganar Puntos", loyaltyRedeemPoints: "Canjear Puntos", loyaltyHistory: "Historial",
    loyaltyNextTier: "Siguiente Nivel", loyaltyPointsToNext: "puntos para el siguiente nivel",
    loyaltyReferralBonus: "Bono por Referido", loyaltyBookingPoints: "Puntos por Reserva", loyaltyReviewPoints: "Puntos por Reseña",
    // Referral
    referralTitle: "Invita a un Amigo", referralSubtitle: "Comparte Tourly y gana 500 puntos por referido",
    referralCode: "Tu Código de Referido", referralCopyCode: "Copiar Código", referralCopied: "¡Copiado!",
    referralShareText: "¡Únete a Tourly! Usa mi código para un bono: ",
    referralFriendsJoined: "Amigos que se Unieron", referralHowItWorks: "Cómo Funciona",
    referralStep1: "Comparte tu código único con amigos",
    referralStep2: "Ellos se registran y reservan su primer viaje",
    referralStep3: "¡Ambos ganan 500 puntos de bonificación!",
    // Reviews
    reviewsTitle: "Reseñas", writeReview: "Escribir Reseña", submitReview: "Enviar Reseña",
    reviewPlaceholder: "Comparte tu experiencia...", noReviewsYet: "Sin reseñas aún",
    beFirstReview: "¡Sé el primero en dejar una reseña!", ratingRequired: "Por favor selecciona una calificación",
    reviewSubmitted: "¡Reseña enviada!", averageRating: "Calificación Promedio",
    // AI Assistant
    aiAssistantTitle: "Planificador IA", aiAssistantSubtitle: "Planifica tu viaje perfecto con IA",
    aiPlaceholder: "Pregúntame lo que quieras sobre viajes...",
    aiWelcomeMessage: "¡Hola! Soy tu asistente de viajes con IA. Puedo ayudarte a planificar viajes, sugerir destinos, crear itinerarios y más. ¿Qué te gustaría explorar?",
    aiSuggestion1: "Planifica un viaje de 5 días a Bali", aiSuggestion2: "Mejores destinos para familias", aiSuggestion3: "Consejos de viaje económico por Europa",
    aiProFeature: "Mejora a Pro para planificación IA ilimitada",
    // Travel Extras
    extrasTitle: "Mejora tu Viaje", extrasSubtitle: "Agrega extras para hacer tu viaje aún mejor",
    extrasTransfer: "Traslado al Aeropuerto", extrasTransferDesc: "Recogida y entrega en auto privado",
    extrasInsurance: "Seguro de Viaje", extrasInsuranceDesc: "Cobertura completa para tu viaje",
    extrasSim: "Plan de Datos eSIM", extrasSimDesc: "Mantente conectado con datos ilimitados",
    extrasLounge: "Sala VIP del Aeropuerto", extrasLoungeDesc: "Relájate antes de tu vuelo con comodidad",
    addToBooking: "Agregar a la Reserva", skipExtras: "Omitir, Continuar a Confirmación",
    // Featured
    featuredBadge: "Destacado", sponsoredBadge: "Patrocinado", trendingBadge: "Tendencia",
    // Landing page
    landingBrand: "Tourly", landingHeroBadge: "#1 App de Viajes con IA",
    landingHeroTitle: "Explora El\nMundo Con\nTourly", landingHeroSubtitle: "Descubre destinos impresionantes, paquetes seleccionados y planificación de viajes con IA — todo en una app.",
    landingCTA: "Comenzar",
    landingStatTrips: "50K+", landingStatTripsLabel: "Viajes Reservados", landingStatDest: "120+", landingStatDestLabel: "Destinos", landingStatRating: "4.9", landingStatRatingLabel: "Calificación",
    landingWhyEyebrow: "Por Qué Tourly", landingWhyTitle: "Viaja Inteligente,\nNo Difícil", landingWhySubtitle: "Todo lo que necesitas para el viaje perfecto, impulsado por tecnología moderna y conocimiento local.",
    landingFeatureAI: "Planificador IA", landingFeatureAIDesc: "Obtén itinerarios personalizados creados por IA avanzada según tus preferencias y presupuesto.",
    landingFeatureDest: "50+ Destinos", landingFeatureDestDesc: "Explora destinos seleccionados en 6 continentes, desde joyas ocultas hasta monumentos icónicos.",
    landingFeatureSecure: "Reserva Segura", landingFeatureSecureDesc: "Pagos cifrados de extremo a extremo con cancelación flexible y protección de reembolso completa.",
    landingFeatureConcierge: "Conserje 24/7", landingFeatureConciergeDesc: "Soporte en tiempo real de expertos locales que conocen cada rincón de tu destino.",
    landingTrendingEyebrow: "Tendencias", landingTrendingTitle: "Destinos Populares",
    landingCuratedEyebrow: "Seleccionado Para Ti", landingCuratedTitle: "Paquetes de Viaje",
    landingTestimonialsEyebrow: "Testimonios", landingTestimonialsTitle: "Amado por Viajeros",
    landingTestimonial1Name: "Sarah Mitchell", landingTestimonial1Location: "Nueva York, EE.UU.",
    landingTestimonial1Quote: "Tourly hizo que planificar nuestra luna de miel fuera sencillo. ¡La IA sugirió lugares que nunca habríamos encontrado!",
    landingTestimonial2Name: "Kenji Tanaka", landingTestimonial2Location: "Tokio, Japón",
    landingTestimonial2Quote: "El servicio de conserje fue increíble. Se sentía como tener un amigo local en cada ciudad que visitamos.",
    landingTestimonial3Name: "Amara Osei", landingTestimonial3Location: "Acra, Ghana",
    landingTestimonial3Quote: "La mejor app de viajes que he usado. Las ofertas son reales y el proceso de reserva es impecable.",
    landingReadyCTA: "¿Listo para tu Próxima Aventura?", landingReadyDesc: "Únete a más de 50,000 viajeros que planifican y reservan con Tourly. Crea tu cuenta gratis hoy.",
    landingCreateAccount: "Crear Cuenta Gratis",
    landingFooterTagline: "Haciendo los viajes accesibles, personalizados e inolvidables desde 2024.",
    landingFooterAbout: "Acerca de", landingFooterContact: "Contacto", landingFooterDeals: "Ofertas",
    landingFooterCopyright: "© 2024–2026 Tourly. Todos los derechos reservados.",
    landingExplore: "Explorar",
    // Download page
    downloadTitle: "Obtener la App",
    downloadHeroSubtitle: "Tu compañero de viaje de bolsillo.\nExplora, reserva y viaja — todo desde una app.",
    downloadOnThe: "Descargar en", downloadGetItOn: "Disponible en", downloadAppStore: "App Store", downloadGooglePlay: "Google Play",
    downloadStatRating: "4.9", downloadStatRatingLabel: "Calificación", downloadStatDownloads: "500K+", downloadStatDownloadsLabel: "Descargas",
    downloadStatDest: "100+", downloadStatDestLabel: "Destinos", downloadStatSupport: "24/7", downloadStatSupportLabel: "Soporte",
    downloadExclusiveEyebrow: "Exclusivo de la App", downloadWhyTitle: "¿Por Qué Descargar Tourly?", downloadWhySubtitle: "La app desbloquea funciones que no puedes obtener en el navegador.",
    downloadFeatureFast: "Ultra Rápido", downloadFeatureFastDesc: "Rendimiento nativo más fluido que cualquier experiencia en navegador.",
    downloadFeatureNotif: "Notificaciones Push", downloadFeatureNotifDesc: "No te pierdas ninguna oferta — recibe alertas instantáneas de ventas flash y bajadas de precio.",
    downloadFeatureOffline: "Acceso Sin Conexión", downloadFeatureOfflineDesc: "Guarda itinerarios y mapas para cuando estés sin internet.",
    downloadFeatureOneTap: "Reserva con Un Toque", downloadFeatureOneTapDesc: "Reserva viajes en segundos con pago e información guardados.",
    downloadFeatureAI: "Planificador IA", downloadFeatureAIDesc: "Obtén sugerencias de viaje personalizadas con IA, integradas directamente.",
    downloadFeatureSecure: "Seguro y Privado", downloadFeatureSecureDesc: "Inicio de sesión biométrico y datos cifrados mantienen tu información segura.",
    downloadReviewsEyebrow: "Amado por Viajeros", downloadReviewsTitle: "Lo Que Dicen los Usuarios",
    downloadReview1Name: "Sarah M.", downloadReview1Text: "¡La mejor app de viajes que he usado! Reservé mi viaje a Bali en menos de 2 minutos.",
    downloadReview2Name: "James K.", downloadReview2Text: "Los mapas sin conexión me salvaron en el Japón rural. Un cambio total de juego.",
    downloadReview3Name: "Aisha R.", downloadReview3Text: "Las notificaciones push captaron una venta flash del 40%. ¡Ahorré $300 en mi viaje!",
    downloadCompareTitle: "App vs. Navegador", downloadCompareApp: "App", downloadCompareWeb: "Web",
    downloadComparePush: "Notificaciones Push", downloadCompareOffline: "Acceso Sin Conexión", downloadCompareBiometric: "Inicio Biométrico",
    downloadCompareOneTap: "Reserva con Un Toque", downloadCompareAI: "Planificador IA", downloadCompareBrowse: "Explorar Destinos",
    downloadBottomCTATitle: "¿Listo para Viajar Más Inteligente?", downloadBottomCTADesc: "Descarga Tourly gratis en iOS y Android.",
    downloadPlatformIOS: "iOS", downloadPlatformAndroid: "Android",
    // Auth extras
    authError: "Error", authInvalidCredentials: "Credenciales inválidas",
    authSignInFailed: "Error al iniciar sesión. Inténtalo de nuevo.", authSignUpFailed: "Error al registrarse. Inténtalo de nuevo.",
    authOAuthFailed: "Error de OAuth. Inténtalo de nuevo.", authGoogle: "Google", authApple: "Apple",
    // Profile extras
    getTheApp: "Obtener la App", adminPanel: "Panel de Admin", adminPanelDesc: "Gestionar reservas, usuarios y destinos",
    tierElite: "Élite", tierPro: "Pro", aiLabel: "IA",
    // Premium extras
    premiumNoPurchases: "No se encontraron compras anteriores.",
    // Missing keys
    thankYou: "¡Gracias!", shareDestination: "¡Mira este destino en Tourly!", sharePackage: "¡Mira este paquete en Tourly!",
    shareVia: "Compartir vía", shareWhatsApp: "WhatsApp", shareTwitter: "X (Twitter)", shareFacebook: "Facebook", shareTelegram: "Telegram", shareEmail: "Correo electrónico", shareSMS: "SMS", shareCopyLink: "Copiar enlace", shareLinkCopied: "¡Enlace copiado al portapapeles!", shareMoreOptions: "Más opciones",
    // AI assistant responses
    aiResponseBali: "¡Bali es una elección fantástica! Aquí tienes un itinerario sugerido de 5 días:\n\n📍 Día 1: Llegar, explorar playa Seminyak\n📍 Día 2: Terrazas de arroz de Ubud y Bosque de Monos\n📍 Día 3: Templo Uluwatu y Danza Kecak\n📍 Día 4: Excursión a Nusa Penida\n📍 Día 5: Día de spa y partida\n\nMejor época: Abril-Octubre (temporada seca). Presupuesto: ~$50-150/día según el nivel de confort.",
    aiResponseFamily: "Grandes destinos familiares:\n\n🏖️ Maldivas - villas sobre el agua, snorkel\n🏰 Japón - Tokyo Disneyland, experiencias culturales\n🌴 Tailandia - playas, santuarios de elefantes\n🏔️ Suiza - trenes panorámicos, senderismo\n🦁 Kenia - safaris familiares\n\n¿Te gustaría más detalles sobre alguno?",
    aiResponseBudget: "Mejores consejos de viaje económico:\n\n💡 Viaja en temporada media (primavera/otoño)\n💡 Reserva vuelos los martes para mejores precios\n💡 Usa transporte local en vez de taxis\n💡 Alójate en pensiones u hostales\n💡 Come en mercados locales y comida callejera\n💡 Consigue pases de ciudad para atracciones\n\nDestinos económicos: Vietnam, Portugal, México, Tailandia, Marruecos.",
    aiResponseEurope: "Planificación de viaje por Europa:\n\n🇫🇷 París - mínimo 3 días\n🇮🇹 Roma/Florencia - 4 días\n🇪🇸 Barcelona - 2-3 días\n🇬🇷 Santorini - 2-3 días\n\n✈️ Consejo pro: Usa aerolíneas económicas como Ryanair/EasyJet entre ciudades. Obtén un pase Eurail para viajes largos. Presupuesto: €60-150/día.",
    aiResponseDefault: "¡Gran pregunta! Te recomiendo explorar nuestros paquetes seleccionados para las mejores ofertas. También puedes ver nuestra página de destinos para inspiración.\n\n¿Quieres que te ayude a planificar un viaje específico? Solo dime:\n• A dónde te gustaría ir\n• Cuántos días\n• Tu rango de presupuesto\n• Estilo de viaje (aventura, relax, cultura)",
    // Smart app banner
    bannerGetApp: "Obtén la App Tourly", bannerFasterOn: "Experiencia más rápida en", bannerOpen: "Abrir",
    // Live chat extras
    chatWelcomeBack: "¡Bienvenido de nuevo! 👋 Qué bueno verte. ¿Cómo puedo ayudarte hoy?",
    chatNewConvo: "¡Nueva conversación iniciada! ✨ El chat anterior fue archivado. ¿Cómo puedo ayudar?",
    chatFreshConvo: "¡Iniciando conversación nueva! ✨ ¿En qué puedo ayudarte?",
    chatLiveAgent: "Agente en Vivo", chatConnectedTeam: "Conectado al equipo de soporte", chatEnd: "Terminar",
    chatConvoClosed: "Esta conversación ha sido cerrada", chatStartNew: "Iniciar nueva conversación",
    chatHereToHelp: "Estamos aquí para ayudar — pregúntanos lo que sea",
    chatReturnLive: "Volver al Chat en Vivo", chatActiveConvo: "Tienes una conversación activa con soporte",
    chatConnectAgent: "Chatear con Agente", chatConnectAgentDesc: "Conéctate con nuestro equipo de soporte para ayuda en tiempo real",
    chatConnectedLive: "Conectado a Soporte en Vivo", chatAgentRespondSoon: "Un agente de soporte responderá pronto.\nEscribe un mensaje para comenzar.",
    chatEnded: "Chat terminado",
    chatArchivedChat: "Chat Archivado", chatHistory: "Historial de Chat", chatClearAll: "Borrar Todo", chatDelete: "Eliminar",
    chatNoArchives: "No hay chats archivados", chatLiveAgentChat: "Chat con Agente", chatBotConvo: "Conversación con Bot",
    chatBackToArchives: "Volver a archivos", chatConversations: "conversaciones", chatMessages: "mensajes",
    chatTranslate: "Traducir", chatShowOriginal: "Mostrar original", chatTranslating: "Traduciendo…",
    chatTranslateAll: "Traducir todo", chatAutoTranslate: "Traducción automática",
    chatTranslatedFrom: "Traducido de", chatTranslationFailed: "Error de traducción",
    // Admin panel
    adminTitle: "Panel de Admin", adminDashboardTitle: "Panel de Administración", adminDashboardSubtitle: "Gestiona tu plataforma de viajes",
    adminTabDashboard: "Panel", adminTabBookings: "Reservas", adminTabChat: "Chat",
    adminTabDestinations: "Destinos", adminTabPackages: "Paquetes", adminTabUsers: "Usuarios",
    adminCancel: "Cancelar", adminSave: "Guardar", adminEdit: "Editar", adminDelete: "Eliminar", adminSearch: "Buscar",
    adminValidation: "Validación", adminTapUpload: "Toca para subir", adminChange: "Cambiar", adminRemove: "Quitar",
    adminPermissionNeeded: "Permiso necesario", adminGrantCameraAccess: "Por favor concede acceso al carrete para subir imágenes.",
    adminTotalBookings: "Total de Reservas", adminTotalBookingsTrend: "+12% este mes",
    adminRevenue: "Ingresos", adminRevenueTrend: "+8% este mes",
    adminTotalUsers: "Total de Usuarios", adminTotalUsersTrend: "+3 esta semana",
    adminDestinations: "Destinos",
    adminQuickActions: "Acciones Rápidas", adminAddDestination: "Agregar Destino", adminCreatePackage: "Crear Paquete",
    adminSendNotification: "Enviar Notificación", adminViewReports: "Ver Informes",
    adminRecentBookings: "Reservas Recientes", adminNoBookingsYet: "Aún no hay reservas",
    adminReports: "Informes", adminDone: "Listo",
    adminBookingStatus: "Estado de Reserva", adminConfirmed: "Confirmado", adminPending: "Pendiente", adminCancelled: "Cancelado",
    adminMonthlyBookings: "Reservas Mensuales (Últimos 6 Meses)", adminTotalPeriod: "Total este período",
    adminRevenueLabel: "ingresos", adminRevenueByPackage: "Ingresos por Paquete", adminNoRevenueYet: "Sin datos de ingresos aún",
    adminLatestBookings: "Últimas Reservas", adminCustomTrip: "Viaje Personalizado", adminAvgBooking: "Prom / Reserva",
    adminSendTo: "Enviar A", adminAllUsers: "Todos los Usuarios", adminSelectUsers: "Seleccionar Usuarios",
    adminNotifTitle: "Título", adminNotifTitlePlaceholder: "ej. Venta de Verano — 30% Desc",
    adminNotifMessage: "Mensaje", adminNotifMessagePlaceholder: "Mensaje de notificación...", adminNotifType: "Tipo",
    adminTitleMessageRequired: "Título y mensaje son requeridos.", adminSelectAtLeastOne: "Selecciona al menos un usuario.",
    adminSent: "Enviado", adminNotifSentTo: "Notificación enviada a", adminUsersSelected: "seleccionados", adminClear: "Limpiar",
    adminBookingDetails: "Detalles de Reserva", adminFullName: "Nombre Completo", adminEmail: "Correo", adminPhone: "Teléfono",
    adminTravelers: "Viajeros", adminCheckIn: "Entrada", adminCheckOut: "Salida", adminDatePlaceholder: "AAAA-MM-DD",
    adminUpdated: "Actualizado", adminBookingUpdated: "Detalles de reserva actualizados (demo local).",
    adminAll: "Todos", adminNoBookingsFound: "No se encontraron reservas", adminConfirm: "Confirmar", adminPax: "pax", adminNA: "N/D",
    adminEditDestination: "Editar Destino", adminAddDestinationTitle: "Agregar Destino",
    adminCoverImage: "Imagen de Portada", adminName: "Nombre", adminNamePlaceholder: "ej. Santorini",
    adminCountry: "País", adminCountryPlaceholder: "ej. Grecia", adminRating: "Calificación (1-5)",
    adminDescription: "Descripción", adminDescPlaceholder: "Descripción breve...",
    adminSearchDestinations: "Buscar destinos...", adminAddNewDestination: "Agregar Nuevo Destino",
    adminDeleteDestination: "Eliminar Destino", adminDeleteConfirm: "¿Estás seguro de que quieres eliminar",
    adminNameCountryRequired: "Nombre y país son requeridos.",
    adminEditPackage: "Editar Paquete", adminAddPackageTitle: "Agregar Paquete",
    adminPackageImage: "Imagen del Paquete", adminPackageTitle: "Título", adminTitlePlaceholder: "ej. Vacaciones en la Playa",
    adminLocation: "Ubicación", adminLocationPlaceholder: "ej. Malasia",
    adminDuration: "Duración", adminDurationPlaceholder: "ej. 7D/6N", adminMaxPax: "Máx. Personas",
    adminPrice: "Precio ($)", adminPricePlaceholder: "ej. 750",
    adminPackageDescPlaceholder: "Descripción del paquete...", adminSearchPackages: "Buscar paquetes...",
    adminAddNewPackage: "Agregar Nuevo Paquete", adminDeletePackage: "Eliminar Paquete",
    adminTitleLocationPriceRequired: "Título, ubicación y precio son requeridos.", adminReviews: "reseñas",
    adminEditUser: "Editar Usuario", adminAvatar: "Avatar", adminRole: "Rol",
    adminSearchUsers: "Buscar usuarios...", adminActive: "Activo", adminSuspended: "Suspendido", adminAdmins: "Admins",
    adminJoined: "Registrado", adminBookingsCount: "reservas",
    adminPromote: "Promover", adminDemote: "Degradar", adminSuspend: "Suspender", adminActivate: "Activar",
    adminNameEmailRequired: "Nombre y correo son requeridos.",
    adminConversations: "Conversaciones", adminLive: "En Vivo", adminNoConvoYet: "Aún no hay conversaciones",
    adminNoConvoDesc: "Cuando los usuarios inicien chat en vivo,\nsus conversaciones aparecerán aquí.",
    adminNoMessages: "Aún no hay mensajes", adminReopen: "Reabrir", adminClose: "Cerrar",
    adminConvoClosed: "Conversación cerrada", adminTypeReply: "Escribe una respuesta...",
    adminYou: "Tú: ", adminClosed: "Cerrado", adminUnread: "no leídos",
  },
  fr: {
    tabHome: "Accueil", tabExplore: "Explorer", tabTrips: "Voyages", tabSaved: "Sauvegardé", tabGallery: "Galerie",
    heroTitle: "Voyager pour\nExplorer le Monde", heroSubtitle: "Découvrez des destinations incroyables et créez des souvenirs inoubliables avec Tourly",
    learnMore: "En Savoir Plus", bookNow: "Réserver", contactUs: "Contactez-nous",
    findYourTrip: "Trouvez votre Voyage", enterDestination: "Entrez la Destination", numberOfTravelers: "Nombre de Voyageurs",
    inquireNow: "Demander Maintenant", popularDestinations: "Destinations Populaires", checkoutPackages: "Nos Forfaits",
    viewAll: "Voir Tout →", dealsTitle: "Offres et Ventes Flash 🔥", dealsSubtitle: "Jusqu'à 30% de réduction",
    save: "Sauvegarder", saved: "Sauvegardé", share: "Partager", back: "Retour", search: "Rechercher",
    searchPlaceholder: "Rechercher destinations, forfaits...", noResults: "Aucun résultat",
    filterAll: "Tout", filterDestinations: "Destinations", filterPackages: "Forfaits",
    sortBy: "Trier", sortDefault: "Par défaut", sortNameAZ: "Nom: A–Z", sortRelevance: "Pertinence", sortPriceLow: "Prix: Croissant", sortPriceHigh: "Prix: Décroissant", sortRating: "Mieux Noté",
    priceRange: "Prix", resultsFound: "résultats", searchTourly: "Rechercher sur Tourly",
    searchHint: "Trouvez votre destination ou forfait de voyage parfait", tryDifferent: "Essayez un autre terme ou ajustez les filtres",
    clearFilters: "Effacer les Filtres",
    bookThisDestination: "Réserver cette Destination", aboutDestination: "À propos de cette Destination",
    whatToExpect: "À Quoi S'Attendre", whatsIncluded: "Ce qui est Inclus", sampleItinerary: "Exemple d'Itinéraire",
    bookingTitle: "Réserver votre Voyage", fullName: "Nom Complet", email: "Email", phone: "Téléphone",
    travelers: "Voyageurs", checkIn: "Date d'Arrivée", checkOut: "Date de Départ",
    submitBooking: "Soumettre la Réservation", bookingSuccess: "Réservation soumise avec succès!",
    notificationsTitle: "Notifications", markAllRead: "Tout marquer comme lu", noNotifications: "Pas de notifications",
    profileTitle: "Mon Profil", myBookings: "Mes Réservations", settings: "Paramètres", aboutUs: "À Propos",
    settingsTitle: "Paramètres", darkMode: "Mode Sombre", language: "Langue", currency: "Devise",
    pushNotifications: "Notifications Push", emailNotifications: "Notifications Email",
    myWishlist: "Ma Liste de Souhaits", savedPlaces: "Lieux Sauvegardés", nothingSaved: "Rien de sauvegardé",
    nothingSavedHint: "Appuyez sur le cœur sur n'importe quelle destination ou forfait pour le sauvegarder ici.",
    exploreDestinations: "Explorer les Destinations", photoGallery: "Galerie Photo", photosFromTravellers: "Photos des Voyageurs",
    chatTitle: "Support en Direct", chatPlaceholder: "Tapez un message...", chatSend: "Envoyer",
    chatWelcome: "👋 Bonjour! Bienvenue sur Tourly. Comment pouvons-nous vous aider?",
    chatHello: "Bonjour! Je suis votre assistant de voyage Tourly. Posez-moi des questions sur les destinations, forfaits ou réservations!",
    personalInfo: "Informations Personnelles", tripDetails: "Détails du Voyage",
    selectedPackage: "Forfait Sélectionné", destinationLabel: "Destination",
    whereToGo: "Où voulez-vous aller?", preferredCheckIn: "Date d'Arrivée Préférée",
    preferredCheckOut: "Date de Départ Préférée", specialRequests: "Demandes Spéciales",
    specialRequestsPlaceholder: "Des exigences particulières?", submitBookingRequest: "Soumettre la Demande de Réservation",
    validationNameRequired: "Le nom complet est requis", validationEmailRequired: "L'e-mail est requis",
    validationEmailInvalid: "Veuillez entrer un e-mail valide", validationPhoneRequired: "Le téléphone est requis",
    aboutPageTitle: "À Propos de Nous", whoWeAre: "Qui Sommes-Nous", trustedTravelPartner: "Votre Partenaire de Voyage de Confiance",
    whyChooseUs: "Pourquoi Nous Choisir", whatMakesDifferent: "Ce Qui Nous Distingue",
    ourMission: "Notre Mission", happyTravelers: "Voyageurs Heureux", tourPackages: "Forfaits de Voyage", supportUs: "Support",
    getInTouch: "Prendre Contact", feelFreeContact: "N'hésitez pas à nous contacter!",
    newsletter: "Newsletter", newsletterSubtitle: "Abonnez-vous pour les dernières offres.",
    subscribe: "S'abonner", enterYourEmail: "Entrez votre email", readyForTravel: "Prêt pour un Voyage Inoubliable?",
    limitedTime: "Temps Limité", flashDeals: "Offres Flash 🔥", flashDealsSubtitle: "Économisez jusqu'à 30% sur nos meilleurs forfaits",
    endsIn: "Se termine dans", bookAt: "Réserver à", perPersonShort: "/pers",
    packageNotFound: "Forfait introuvable", destinationNotFound: "Destination introuvable",
    goBack: "Retour", aboutThisPackage: "À Propos de ce Forfait",
    maxPax: "Pax Max", durationLabel: "Durée", locationLabel: "Lieu",
    reviewsLabel: "avis", topRated: "Mieux Noté", countryLabel: "Pays",
    bestTime: "Meilleure Période", allYear: "Toute l'Année", groupSizeLabel: "Taille du Groupe",    ratingLabel: "Note",
    uncoverPlace: "Découvrir des Lieux", popularDestinationsSubtitle: "Explorez nos destinations les plus visitées à travers le monde",
    popularPackages: "Forfaits Populaires", packagesSubtitle: "Trouvez le forfait de voyage parfait pour votre prochaine aventure",
    callToAction: "Appel à l'Action", ctaDescription: "Contactez-nous aujourd'hui et nous vous aiderons à planifier les vacances de vos rêves !",
    perPerson: "par personne",
    defaultUsername: "Voyageur", welcomeBack: "Content de vous revoir !",
    countriesLabel: "Pays", noBookingsHint: "Pas encore de réservations. Réservez un forfait ou une destination pour le voir ici.",
    browsePackages: "Parcourir les Forfaits", cancelBookingTitle: "Annuler la Réservation",
    cancelBookingMessage: "Annuler votre réservation pour ce voyage ?", keepIt: "Garder",
    cancelBookingAction: "Annuler la Réservation", bookedOn: "Réservé le", cancel: "Annuler", ok: "OK",
    customTrip: "Voyage Personnalisé", travellersCount: "voyageurs",
    viewDetails: "Voir les Détails",
    featureBestPrice: "Garantie du Meilleur Prix",
    featureBestPriceDesc: "Nous offrons les meilleurs prix pour tous nos forfaits de voyage sans frais cachés.",
    featureHandpicked: "Destinations Triées sur le Volet",
    featureHandpickedDesc: "Nos experts sélectionnent soigneusement les destinations les plus belles et uniques.",
    featureExpertGuides: "Guides Experts",
    featureExpertGuidesDesc: "Des guides locaux professionnels qui connaissent chaque recoin de la destination.",
    featureFlexibleBooking: "Réservation Flexible",
    featureFlexibleBookingDesc: "Processus de réservation facile avec des politiques d'annulation flexibles.",
    aboutParagraph1: "Tourly est une agence de voyage premium dédiée à créer des expériences de voyage inoubliables. Avec des années d'expérience, nous connectons les voyageurs aux destinations les plus impressionnantes du monde.",
    aboutParagraph2: "Notre équipe d'experts en voyages passionnés travaille sans relâche pour créer des expériences uniques qui vont au-delà du tourisme ordinaire.",
    missionStatement: "Inspirer et permettre aux gens d'explorer le monde en fournissant des expériences de voyage exceptionnelles, durables et abordables.",
    ctaContactDescription: "Contactez-nous aujourd'hui et nous vous aiderons à planifier vos vacances de rêve. Notre équipe est prête à vous assister 24h/24.",
    addressLabel: "Adresse", footerCopyright: "© 2024 Tourly. Tous droits réservés",
    datePlaceholder: "AAAA-MM-JJ",
    tagFlashSale: "Vente Flash", tagWeekendDeal: "Offre Weekend", tagLimitedOffer: "Offre Limitée",
    timeJustNow: "Maintenant", timeMinutesAgo: "m", timeHoursAgo: "h", timeDaysAgo: "j",
    unreadNotifications: "notifications non lues",
    notifWelcomeTitle: "Bienvenue sur Tourly \ud83c\udf0d", notifWelcomeBody: "D\u00e9couvrez des destinations incroyables et r\u00e9servez votre prochaine aventure.",
    notifSaleTitle: "Soldes d\u2019\u00e9t\u00e9 \u2014 Jusqu\u2019\u00e0 -30%", notifSaleBody: "Offre limit\u00e9e sur des forfaits s\u00e9lectionn\u00e9s. R\u00e9servez avant le 31 mars 2026.",
    notifNewDestTitle: "Nouvelle Destination Ajout\u00e9e", notifNewDestBody: "Bali, Indon\u00e9sie est d\u00e9sormais disponible. D\u00e9couvrez nos forfaits exclusifs !",
    destinationDetailDesc: "Vivez la beauté et la culture de cette destination incroyable. Des paysages époustouflants aux riches traditions locales, chaque moment sera inoubliable.",
    expectGuidedTours: "Visites guidées avec des experts locaux", expectLocalCuisine: "Expériences culinaires locales authentiques",
    expectAccommodations: "Hébergements confortables", expectTransportation: "Transport inclus", expectSupport: "Assistance voyage 24/7",
    inclusionAirfare: "Billet d'avion aller-retour", inclusionTransfers: "Transferts aéroport",
    inclusionAccommodation: "Hébergement (hôtel 4 étoiles)", inclusionBreakfast: "Petit-déjeuner quotidien",
    inclusionGuidedTours: "Visites guidées", inclusionInsurance: "Assurance voyage", inclusionSupport: "Assistance 24/7",
    itineraryDay1Title: "Arrivée et Bienvenue", itineraryDay1Desc: "Prise en charge aéroport, enregistrement, dîner de bienvenue",
    itineraryDay2Title: "Exploration de la Ville", itineraryDay2Desc: "Visite guidée, marchés locaux, sites culturels",
    itineraryDay3Title: "Journée Aventure", itineraryDay3Desc: "Activités de plein air, randonnées nature",
    itineraryDay4Title: "Expérience Culturelle", itineraryDay4Desc: "Ateliers traditionnels, cuisine locale",
    itineraryDay5Title: "Journée Libre", itineraryDay5Desc: "Activités optionnelles ou détente",
    itineraryDay6Title: "Tour Panoramique", itineraryDay6Desc: "Excursion aux attractions voisines",
    itineraryDay7Title: "Départ", itineraryDay7Desc: "Petit-déjeuner, checkout, transfert aéroport",
    packageDetailExtended: "Vivez un voyage inoubliable avec notre forfait de voyage soigneusement conçu. Chaque détail a été planifié pour le voyage d'une vie.",
    chatOnlineStatus: "En ligne · Support Tourly",
    chatReply1: "Merci de nous contacter ! Un expert voyage sera avec vous bientôt.",
    chatReply2: "Excellente question ! Notre équipe examine votre message.",
    chatReply3: "Nous serions ravis de vous aider à planifier votre voyage parfait ! Pourriez-vous partager plus de détails ?",
    chatReply4: "Nos forfaits sont entièrement personnalisables. Je vais vous connecter avec un spécialiste.",
    chatReply5: "Pour une assistance immédiate, vous pouvez aussi nous appeler au +01 (123) 4567 90.",
    priceAny: "Tous", priceUnder500: "< 500", price500to1000: "500 – 700", priceOver1000: "> 700",
    signIn: "Se Connecter", signUp: "S'inscrire", password: "Mot de passe", confirmPassword: "Confirmer le mot de passe",
    forgotPassword: "Mot de passe oublié ?", dontHaveAccount: "Pas encore de compte ?", alreadyHaveAccount: "Déjà un compte ?",
    orContinueWith: "ou continuer avec", signingIn: "Connexion en cours...", signingUp: "Création du compte...",
    passwordMismatch: "Les mots de passe ne correspondent pas", passwordTooShort: "Le mot de passe doit comporter au moins 8 caractères",
    welcomeTo: "Bienvenue sur", createAccount: "Créer un Compte", signInSubtitle: "Connectez-vous pour accéder à vos réservations et voyages sauvegardés",
    signUpSubtitle: "Rejoignez Tourly et commencez à planifier vos vacances de rêve",
    continueWithGoogle: "Continuer avec Google", continueWithApple: "Continuer avec Apple",
    agreeToTerms: "En vous inscrivant, vous acceptez nos", termsOfService: "Conditions d'Utilisation", privacyPolicy: "Politique de Confidentialité", andText: "et",
    signOut: "Se Déconnecter", signOutConfirm: "Êtes-vous sûr de vouloir vous déconnecter ?",
    // Onboarding
    onboardingTitle1: "Découvrez des Destinations Incroyables", onboardingDesc1: "Explorez des lieux à couper le souffle à travers le monde, sélectionnés pour vous.",
    onboardingTitle2: "Réservez en Toute Confiance", onboardingDesc2: "Réservation flexible, meilleur prix garanti et support 24/7.",
    onboardingTitle3: "Gagnez des Récompenses en Voyageant", onboardingDesc3: "Accumulez des points à chaque voyage et débloquez des avantages exclusifs.",
    getStarted: "Commencer", next: "Suivant", skip: "Passer",
    // Premium
    premiumTitle: "Tourly Pro", premiumSubtitle: "Débloquez l'expérience de voyage ultime",
    premiumProTitle: "Pro", premiumEliteTitle: "Élite",
    premiumPerMonth: "/mois", premiumPerYear: "/an", premiumSavePercent: "Économisez",
    premiumSubscribe: "S'abonner", premiumRestore: "Restaurer l'Achat", premiumCurrentPlan: "Plan Actuel", premiumFreePlan: "Gratuit",
    premiumFeatureDeals: "Offres exclusives et accès anticipé", premiumFeatureSupport: "Support client prioritaire",
    premiumFeatureCancellation: "Annulation gratuite sur toutes les réservations", premiumFeatureAI: "Planificateur de voyage IA",
    premiumFeatureAdFree: "Expérience sans publicité", premiumFeatureConcierge: "Service de conciergerie personnel",
    premiumFeatureLounge: "Accès aux salons d'aéroport", premiumFeatureDoublePoints: "2× points de fidélité",
    premiumMostPopular: "Le Plus Populaire", premiumBestValue: "Meilleur Rapport",
    // Loyalty
    loyaltyTitle: "Récompenses", loyaltyPoints: "Points", loyaltyTier: "Niveau",
    loyaltyExplorer: "Explorateur", loyaltyAdventurer: "Aventurier", loyaltyGlobetrotter: "Globe-trotter",
    loyaltyEarnPoints: "Gagner des Points", loyaltyRedeemPoints: "Échanger des Points", loyaltyHistory: "Historique",
    loyaltyNextTier: "Niveau Suivant", loyaltyPointsToNext: "points pour le niveau suivant",
    loyaltyReferralBonus: "Bonus de Parrainage", loyaltyBookingPoints: "Points de Réservation", loyaltyReviewPoints: "Points d'Avis",
    // Referral
    referralTitle: "Parrainez un Ami", referralSubtitle: "Partagez Tourly et gagnez 500 points par parrainage",
    referralCode: "Votre Code de Parrainage", referralCopyCode: "Copier le Code", referralCopied: "Copié !",
    referralShareText: "Rejoignez-moi sur Tourly ! Utilisez mon code pour un bonus : ",
    referralFriendsJoined: "Amis Inscrits", referralHowItWorks: "Comment Ça Marche",
    referralStep1: "Partagez votre code unique avec des amis",
    referralStep2: "Ils s'inscrivent et réservent leur premier voyage",
    referralStep3: "Vous gagnez tous les deux 500 points bonus !",
    // Reviews
    reviewsTitle: "Avis", writeReview: "Écrire un Avis", submitReview: "Soumettre l'Avis",
    reviewPlaceholder: "Partagez votre expérience...", noReviewsYet: "Pas encore d'avis",
    beFirstReview: "Soyez le premier à laisser un avis !", ratingRequired: "Veuillez sélectionner une note",
    reviewSubmitted: "Avis soumis !", averageRating: "Note Moyenne",
    // AI Assistant
    aiAssistantTitle: "Planificateur IA", aiAssistantSubtitle: "Planifiez votre voyage parfait avec l'IA",
    aiPlaceholder: "Posez-moi vos questions sur les voyages...",
    aiWelcomeMessage: "Bonjour ! Je suis votre assistant de voyage IA. Je peux vous aider à planifier des voyages, suggérer des destinations, créer des itinéraires et plus encore. Que souhaitez-vous explorer ?",
    aiSuggestion1: "Planifier un voyage de 5 jours à Bali", aiSuggestion2: "Meilleures destinations pour les familles", aiSuggestion3: "Conseils voyage petit budget en Europe",
    aiProFeature: "Passez à Pro pour une planification IA illimitée",
    // Travel Extras
    extrasTitle: "Améliorez Votre Voyage", extrasSubtitle: "Ajoutez des extras pour rendre votre voyage encore meilleur",
    extrasTransfer: "Transfert Aéroport", extrasTransferDesc: "Prise en charge et dépose en voiture privée",
    extrasInsurance: "Assurance Voyage", extrasInsuranceDesc: "Couverture complète pour votre voyage",
    extrasSim: "Forfait eSIM", extrasSimDesc: "Restez connecté avec des données illimitées",
    extrasLounge: "Salon d'Aéroport", extrasLoungeDesc: "Détendez-vous avant votre vol dans le confort",
    addToBooking: "Ajouter à la Réservation", skipExtras: "Passer, Continuer à la Confirmation",
    // Featured
    featuredBadge: "En Vedette", sponsoredBadge: "Sponsorisé", trendingBadge: "Tendance",
    // Landing page
    landingBrand: "Tourly", landingHeroBadge: "App de Voyage #1 avec IA",
    landingHeroTitle: "Explorez Le\nMonde Avec\nTourly", landingHeroSubtitle: "Découvrez des destinations à couper le souffle, des forfaits sélectionnés et la planification de voyage par IA — le tout dans une seule app.",
    landingCTA: "Commencer",
    landingStatTrips: "50K+", landingStatTripsLabel: "Voyages Réservés", landingStatDest: "120+", landingStatDestLabel: "Destinations", landingStatRating: "4.9", landingStatRatingLabel: "Note",
    landingWhyEyebrow: "Pourquoi Tourly", landingWhyTitle: "Voyagez Malin,\nPas Difficile", landingWhySubtitle: "Tout ce dont vous avez besoin pour le voyage parfait, propulsé par la technologie moderne et l'expertise locale.",
    landingFeatureAI: "Planificateur IA", landingFeatureAIDesc: "Obtenez des itinéraires personnalisés créés par une IA avancée selon vos préférences et budget.",
    landingFeatureDest: "50+ Destinations", landingFeatureDestDesc: "Explorez des destinations sélectionnées sur 6 continents, des joyaux cachés aux monuments emblématiques.",
    landingFeatureSecure: "Réservation Sécurisée", landingFeatureSecureDesc: "Paiements chiffrés de bout en bout avec annulation flexible et protection de remboursement complète.",
    landingFeatureConcierge: "Concierge 24/7", landingFeatureConciergeDesc: "Support en temps réel d'experts locaux qui connaissent chaque recoin de votre destination.",
    landingTrendingEyebrow: "Tendances", landingTrendingTitle: "Destinations Populaires",
    landingCuratedEyebrow: "Sélectionné Pour Vous", landingCuratedTitle: "Forfaits Voyage",
    landingTestimonialsEyebrow: "Témoignages", landingTestimonialsTitle: "Adoré par les Voyageurs",
    landingTestimonial1Name: "Sarah Mitchell", landingTestimonial1Location: "New York, États-Unis",
    landingTestimonial1Quote: "Tourly a rendu la planification de notre lune de miel si facile. L'IA a suggéré des endroits que nous n'aurions jamais trouvés!",
    landingTestimonial2Name: "Kenji Tanaka", landingTestimonial2Location: "Tokyo, Japon",
    landingTestimonial2Quote: "Le service concierge était incroyable. C'était comme avoir un ami local dans chaque ville visitée.",
    landingTestimonial3Name: "Amara Osei", landingTestimonial3Location: "Accra, Ghana",
    landingTestimonial3Quote: "La meilleure app de voyage que j'ai utilisée. Les offres sont réelles et la réservation est fluide.",
    landingReadyCTA: "Prêt pour Votre Prochaine Aventure?", landingReadyDesc: "Rejoignez plus de 50 000 voyageurs qui planifient et réservent avec Tourly. Créez votre compte gratuit aujourd'hui.",
    landingCreateAccount: "Créer un Compte Gratuit",
    landingFooterTagline: "Rendre le voyage accessible, personnalisé et inoubliable depuis 2024.",
    landingFooterAbout: "À Propos", landingFooterContact: "Contact", landingFooterDeals: "Offres",
    landingFooterCopyright: "© 2024–2026 Tourly. Tous droits réservés.",
    landingExplore: "Explorer",
    // Download page
    downloadTitle: "Obtenir l'App",
    downloadHeroSubtitle: "Votre compagnon de voyage de poche.\nExplorez, réservez et partez — tout depuis une app.",
    downloadOnThe: "Télécharger sur", downloadGetItOn: "Disponible sur", downloadAppStore: "App Store", downloadGooglePlay: "Google Play",
    downloadStatRating: "4.9", downloadStatRatingLabel: "Note", downloadStatDownloads: "500K+", downloadStatDownloadsLabel: "Téléchargements",
    downloadStatDest: "100+", downloadStatDestLabel: "Destinations", downloadStatSupport: "24/7", downloadStatSupportLabel: "Support",
    downloadExclusiveEyebrow: "Exclusif App", downloadWhyTitle: "Pourquoi Télécharger Tourly?", downloadWhySubtitle: "L'app débloque des fonctionnalités indisponibles dans le navigateur.",
    downloadFeatureFast: "Ultra Rapide", downloadFeatureFastDesc: "Performance native plus fluide que toute expérience navigateur.",
    downloadFeatureNotif: "Notifications Push", downloadFeatureNotifDesc: "Ne manquez aucune offre — recevez des alertes instantanées sur les ventes flash.",
    downloadFeatureOffline: "Accès Hors Ligne", downloadFeatureOfflineDesc: "Sauvegardez itinéraires et cartes quand vous êtes hors réseau.",
    downloadFeatureOneTap: "Réservation en Un Clic", downloadFeatureOneTapDesc: "Réservez en secondes avec paiement et infos sauvegardés.",
    downloadFeatureAI: "Planificateur IA", downloadFeatureAIDesc: "Obtenez des suggestions de voyage personnalisées par IA, intégrées directement.",
    downloadFeatureSecure: "Sécurisé et Privé", downloadFeatureSecureDesc: "Connexion biométrique et données chiffrées protègent vos informations.",
    downloadReviewsEyebrow: "Adoré par les Voyageurs", downloadReviewsTitle: "Ce Que Disent les Utilisateurs",
    downloadReview1Name: "Sarah M.", downloadReview1Text: "La meilleure app de voyage! J'ai réservé mon voyage à Bali en moins de 2 minutes.",
    downloadReview2Name: "James K.", downloadReview2Text: "Les cartes hors ligne m'ont sauvé au Japon rural. Un vrai changement de jeu.",
    downloadReview3Name: "Aisha R.", downloadReview3Text: "Les notifications ont capté une vente flash de 40%. J'ai économisé 300$ sur mon voyage!",
    downloadCompareTitle: "App vs. Navigateur", downloadCompareApp: "App", downloadCompareWeb: "Web",
    downloadComparePush: "Notifications Push", downloadCompareOffline: "Accès Hors Ligne", downloadCompareBiometric: "Connexion Biométrique",
    downloadCompareOneTap: "Réservation en Un Clic", downloadCompareAI: "Planificateur IA", downloadCompareBrowse: "Explorer Destinations",
    downloadBottomCTATitle: "Prêt à Voyager Plus Malin?", downloadBottomCTADesc: "Téléchargez Tourly gratuitement sur iOS et Android.",
    downloadPlatformIOS: "iOS", downloadPlatformAndroid: "Android",
    // Auth extras
    authError: "Erreur", authInvalidCredentials: "Identifiants invalides",
    authSignInFailed: "Échec de connexion. Veuillez réessayer.", authSignUpFailed: "Échec d'inscription. Veuillez réessayer.",
    authOAuthFailed: "Échec OAuth. Veuillez réessayer.", authGoogle: "Google", authApple: "Apple",
    // Profile extras
    getTheApp: "Obtenir l'App", adminPanel: "Panneau Admin", adminPanelDesc: "Gérer réservations, utilisateurs et destinations",
    tierElite: "Élite", tierPro: "Pro", aiLabel: "IA",
    premiumNoPurchases: "Aucun achat précédent trouvé.",
    thankYou: "Merci!", shareDestination: "Découvrez cette destination sur Tourly!", sharePackage: "Découvrez ce forfait sur Tourly!",
    shareVia: "Partager via", shareWhatsApp: "WhatsApp", shareTwitter: "X (Twitter)", shareFacebook: "Facebook", shareTelegram: "Telegram", shareEmail: "E-mail", shareSMS: "SMS", shareCopyLink: "Copier le lien", shareLinkCopied: "Lien copié dans le presse-papiers !", shareMoreOptions: "Plus d'options",
    aiResponseBali: "Bali est un choix fantastique! Voici un itinéraire suggéré de 5 jours:\n\n📍 Jour 1: Arrivée, explorer la plage de Seminyak\n📍 Jour 2: Rizières d'Ubud et Forêt des Singes\n📍 Jour 3: Temple d'Uluwatu et Danse Kecak\n📍 Jour 4: Excursion à Nusa Penida\n📍 Jour 5: Journée spa et départ\n\nMeilleure période: Avril-Octobre (saison sèche). Budget: ~50-150$/jour selon le confort.",
    aiResponseFamily: "Superbes destinations familiales:\n\n🏖️ Maldives - villas sur l'eau, snorkeling\n🏰 Japon - Tokyo Disneyland, expériences culturelles\n🌴 Thaïlande - plages, sanctuaires d'éléphants\n🏔️ Suisse - trains panoramiques, randonnée\n🦁 Kenya - safaris familiaux\n\nVoulez-vous plus de détails?",
    aiResponseBudget: "Meilleurs conseils voyage économique:\n\n💡 Voyagez en mi-saison (printemps/automne)\n💡 Réservez les vols le mardi\n💡 Utilisez les transports locaux\n💡 Séjournez en auberges\n💡 Mangez aux marchés locaux\n💡 Prenez des pass touristiques\n\nDestinations abordables: Vietnam, Portugal, Mexique, Thaïlande, Maroc.",
    aiResponseEurope: "Planification voyage Europe:\n\n🇫🇷 Paris - 3 jours minimum\n🇮🇹 Rome/Florence - 4 jours\n🇪🇸 Barcelone - 2-3 jours\n🇬🇷 Santorin - 2-3 jours\n\n✈️ Astuce: Utilisez des compagnies low-cost entre les villes. Prenez un pass Eurail. Budget: 60-150€/jour.",
    aiResponseDefault: "Excellente question! Je recommande d'explorer nos forfaits pour les meilleures offres. Consultez aussi notre page destinations.\n\nVoulez-vous que je planifie un voyage? Dites-moi:\n• Où aller\n• Combien de jours\n• Votre budget\n• Style de voyage (aventure, détente, culture)",
    bannerGetApp: "Obtenez l'App Tourly", bannerFasterOn: "Expérience plus rapide sur", bannerOpen: "Ouvrir",
    chatWelcomeBack: "Bon retour! 👋 Ravi de vous revoir. Comment puis-je vous aider?",
    chatNewConvo: "Nouvelle conversation! ✨ Le chat précédent a été archivé. Comment puis-je aider?",
    chatFreshConvo: "Nouvelle conversation! ✨ En quoi puis-je vous aider?",
    chatLiveAgent: "Agent en Direct", chatConnectedTeam: "Connecté à l'équipe support", chatEnd: "Terminer",
    chatConvoClosed: "Cette conversation a été fermée", chatStartNew: "Démarrer une nouvelle conversation",
    chatHereToHelp: "Nous sommes là pour aider — posez-nous vos questions",
    chatReturnLive: "Retour au Chat en Direct", chatActiveConvo: "Vous avez une conversation active avec le support",
    chatConnectAgent: "Chatter avec un Agent", chatConnectAgentDesc: "Connectez-vous à notre équipe support pour une aide en temps réel",
    chatConnectedLive: "Connecté au Support en Direct", chatAgentRespondSoon: "Un agent répondra sous peu.\nÉcrivez un message pour commencer.",
    chatEnded: "Chat terminé",
    chatArchivedChat: "Chat Archivé", chatHistory: "Historique de Chat", chatClearAll: "Tout Effacer", chatDelete: "Supprimer",
    chatNoArchives: "Pas de chats archivés", chatLiveAgentChat: "Chat Agent en Direct", chatBotConvo: "Conversation Bot",
    chatBackToArchives: "Retour aux archives", chatConversations: "conversations", chatMessages: "messages",
    chatTranslate: "Traduire", chatShowOriginal: "Afficher l'original", chatTranslating: "Traduction…",
    chatTranslateAll: "Tout traduire", chatAutoTranslate: "Traduction automatique",
    chatTranslatedFrom: "Traduit de", chatTranslationFailed: "Échec de la traduction",
    adminTitle: "Panneau Admin", adminDashboardTitle: "Tableau de Bord Admin", adminDashboardSubtitle: "Gérez votre plateforme de voyage",
    adminTabDashboard: "Tableau", adminTabBookings: "Réservations", adminTabChat: "Chat",
    adminTabDestinations: "Destinations", adminTabPackages: "Forfaits", adminTabUsers: "Utilisateurs",
    adminCancel: "Annuler", adminSave: "Enregistrer", adminEdit: "Modifier", adminDelete: "Supprimer", adminSearch: "Rechercher",
    adminValidation: "Validation", adminTapUpload: "Appuyez pour télécharger", adminChange: "Changer", adminRemove: "Retirer",
    adminPermissionNeeded: "Permission nécessaire", adminGrantCameraAccess: "Veuillez accorder l'accès à la pellicule pour télécharger des images.",
    adminTotalBookings: "Total Réservations", adminTotalBookingsTrend: "+12% ce mois",
    adminRevenue: "Revenus", adminRevenueTrend: "+8% ce mois",
    adminTotalUsers: "Total Utilisateurs", adminTotalUsersTrend: "+3 cette semaine",
    adminDestinations: "Destinations",
    adminQuickActions: "Actions Rapides", adminAddDestination: "Ajouter Destination", adminCreatePackage: "Créer Forfait",
    adminSendNotification: "Envoyer Notification", adminViewReports: "Voir Rapports",
    adminRecentBookings: "Réservations Récentes", adminNoBookingsYet: "Aucune réservation",
    adminReports: "Rapports", adminDone: "Terminé",
    adminBookingStatus: "Statut Réservation", adminConfirmed: "Confirmé", adminPending: "En Attente", adminCancelled: "Annulé",
    adminMonthlyBookings: "Réservations Mensuelles (6 Derniers Mois)", adminTotalPeriod: "Total cette période",
    adminRevenueLabel: "revenus", adminRevenueByPackage: "Revenus par Forfait", adminNoRevenueYet: "Pas de données de revenus",
    adminLatestBookings: "Dernières Réservations", adminCustomTrip: "Voyage Sur Mesure", adminAvgBooking: "Moy / Réservation",
    adminSendTo: "Envoyer À", adminAllUsers: "Tous les Utilisateurs", adminSelectUsers: "Sélectionner Utilisateurs",
    adminNotifTitle: "Titre", adminNotifTitlePlaceholder: "ex. Soldes d'Été — 30% de Réduction",
    adminNotifMessage: "Message", adminNotifMessagePlaceholder: "Message de notification...", adminNotifType: "Type",
    adminTitleMessageRequired: "Titre et message requis.", adminSelectAtLeastOne: "Sélectionnez au moins un utilisateur.",
    adminSent: "Envoyé", adminNotifSentTo: "Notification envoyée à", adminUsersSelected: "sélectionnés", adminClear: "Effacer",
    adminBookingDetails: "Détails Réservation", adminFullName: "Nom Complet", adminEmail: "Email", adminPhone: "Téléphone",
    adminTravelers: "Voyageurs", adminCheckIn: "Arrivée", adminCheckOut: "Départ", adminDatePlaceholder: "AAAA-MM-JJ",
    adminUpdated: "Mis à jour", adminBookingUpdated: "Détails de réservation mis à jour (démo locale).",
    adminAll: "Tous", adminNoBookingsFound: "Aucune réservation trouvée", adminConfirm: "Confirmer", adminPax: "pax", adminNA: "N/D",
    adminEditDestination: "Modifier Destination", adminAddDestinationTitle: "Ajouter Destination",
    adminCoverImage: "Image de Couverture", adminName: "Nom", adminNamePlaceholder: "ex. Santorin",
    adminCountry: "Pays", adminCountryPlaceholder: "ex. Grèce", adminRating: "Note (1-5)",
    adminDescription: "Description", adminDescPlaceholder: "Courte description...",
    adminSearchDestinations: "Rechercher destinations...", adminAddNewDestination: "Ajouter Nouvelle Destination",
    adminDeleteDestination: "Supprimer Destination", adminDeleteConfirm: "Êtes-vous sûr de vouloir supprimer",
    adminNameCountryRequired: "Nom et pays requis.",
    adminEditPackage: "Modifier Forfait", adminAddPackageTitle: "Ajouter Forfait",
    adminPackageImage: "Image Forfait", adminPackageTitle: "Titre", adminTitlePlaceholder: "ex. Vacances Plage",
    adminLocation: "Lieu", adminLocationPlaceholder: "ex. Malaisie",
    adminDuration: "Durée", adminDurationPlaceholder: "ex. 7J/6N", adminMaxPax: "Max Personnes",
    adminPrice: "Prix ($)", adminPricePlaceholder: "ex. 750",
    adminPackageDescPlaceholder: "Description du forfait...", adminSearchPackages: "Rechercher forfaits...",
    adminAddNewPackage: "Ajouter Nouveau Forfait", adminDeletePackage: "Supprimer Forfait",
    adminTitleLocationPriceRequired: "Titre, lieu et prix requis.", adminReviews: "avis",
    adminEditUser: "Modifier Utilisateur", adminAvatar: "Avatar", adminRole: "Rôle",
    adminSearchUsers: "Rechercher utilisateurs...", adminActive: "Actif", adminSuspended: "Suspendu", adminAdmins: "Admins",
    adminJoined: "Inscrit", adminBookingsCount: "réservations",
    adminPromote: "Promouvoir", adminDemote: "Rétrograder", adminSuspend: "Suspendre", adminActivate: "Activer",
    adminNameEmailRequired: "Nom et email requis.",
    adminConversations: "Conversations", adminLive: "En Direct", adminNoConvoYet: "Aucune conversation",
    adminNoConvoDesc: "Quand les utilisateurs démarrent un chat en direct,\nleurs conversations apparaîtront ici.",
    adminNoMessages: "Aucun message", adminReopen: "Rouvrir", adminClose: "Fermer",
    adminConvoClosed: "Conversation fermée", adminTypeReply: "Tapez une réponse...",
    adminYou: "Vous: ", adminClosed: "Fermé", adminUnread: "non lus",
  },
  ja: {
    tabHome: "ホーム", tabExplore: "探索", tabTrips: "旅行", tabSaved: "保存済み", tabGallery: "ギャラリー",
    heroTitle: "世界を\n探索する旅へ", heroSubtitle: "Tourlyで素晴らしい目的地を発見し、忘れられない思い出を作りましょう",
    learnMore: "詳細を見る", bookNow: "今すぐ予約", contactUs: "お問い合わせ",
    findYourTrip: "旅行を探す", enterDestination: "目的地を入力", numberOfTravelers: "旅行者数",
    inquireNow: "今すぐ問い合わせ", popularDestinations: "人気の目的地", checkoutPackages: "旅行パッケージ",
    viewAll: "すべて見る →", dealsTitle: "セール＆フラッシュセール 🔥", dealsSubtitle: "最大30%オフ",
    save: "保存", saved: "保存済み", share: "シェア", back: "戻る", search: "検索",
    searchPlaceholder: "目的地、パッケージを検索...", noResults: "結果がありません",
    filterAll: "すべて", filterDestinations: "目的地", filterPackages: "パッケージ",
    sortBy: "並び替え", sortDefault: "デフォルト", sortNameAZ: "名前: A–Z", sortRelevance: "関連性", sortPriceLow: "価格: 安い順", sortPriceHigh: "価格: 高い順", sortRating: "高評価順",
    priceRange: "価格帯", resultsFound: "件の結果", searchTourly: "Tourlyで検索",
    searchHint: "理想の目的地や旅行パッケージを見つけよう", tryDifferent: "別のキーワードやフィルターをお試しください",
    clearFilters: "フィルターをクリア",
    bookThisDestination: "この目的地を予約", aboutDestination: "この目的地について",
    whatToExpect: "期待すること", whatsIncluded: "含まれるもの", sampleItinerary: "サンプル旅程",
    bookingTitle: "旅行を予約", fullName: "氏名", email: "メール", phone: "電話",
    travelers: "旅行者", checkIn: "チェックイン日", checkOut: "チェックアウト日",
    submitBooking: "予約を送信", bookingSuccess: "予約が正常に送信されました！",
    notificationsTitle: "通知", markAllRead: "すべて既読にする", noNotifications: "通知はありません",
    profileTitle: "マイプロフィール", myBookings: "マイ予約", settings: "設定", aboutUs: "会社概要",
    settingsTitle: "設定", darkMode: "ダークモード", language: "言語", currency: "通貨",
    pushNotifications: "プッシュ通知", emailNotifications: "メール通知",
    myWishlist: "ウィッシュリスト", savedPlaces: "保存した場所", nothingSaved: "まだ保存されていません",
    nothingSavedHint: "目的地やパッケージのハートアイコンをタップして保存してください。",
    exploreDestinations: "目的地を探索", photoGallery: "フォトギャラリー", photosFromTravellers: "旅行者の写真",
    chatTitle: "ライブサポート", chatPlaceholder: "メッセージを入力...", chatSend: "送信",
    chatWelcome: "👋 こんにちは！Tourlyへようこそ。何かお手伝いできることはありますか？",
    chatHello: "こんにちは！Tourlyのトラベルアシスタントです。目的地、パッケージ、予約について何でもお聞きください！",
    personalInfo: "個人情報", tripDetails: "旅行詳細",
    selectedPackage: "選択したパッケージ", destinationLabel: "目的地",
    whereToGo: "どこへ行きたいですか？", preferredCheckIn: "チェックイン希望日",
    preferredCheckOut: "チェックアウト希望日", specialRequests: "特別リクエスト",
    specialRequestsPlaceholder: "特別な要件はありますか？", submitBookingRequest: "予約リクエストを送信",
    validationNameRequired: "氏名は必須です", validationEmailRequired: "メールは必須です",
    validationEmailInvalid: "有効なメールを入力してください", validationPhoneRequired: "電話番号は必須です",
    aboutPageTitle: "私たちについて", whoWeAre: "私たちは誰か", trustedTravelPartner: "あなたの信頼できる旅行パートナー",
    whyChooseUs: "なぜ私たちを選ぶか", whatMakesDifferent: "私たちの違い",
    ourMission: "私たちの使命", happyTravelers: "満足した旅行者", tourPackages: "ツアーパッケージ", supportUs: "サポート",
    getInTouch: "連絡する", feelFreeContact: "お気軽にご連絡ください！",
    newsletter: "ニュースレター", newsletterSubtitle: "最新のお得情報を受け取るために購読してください。",
    subscribe: "購読する", enterYourEmail: "メールを入力", readyForTravel: "忘れられない旅行の準備はできていますか？",
    limitedTime: "期間限定", flashDeals: "フラッシュセール 🔥", flashDealsSubtitle: "トップパッケージが最大30%オフ",
    endsIn: "終了まで", bookAt: "予約価格", perPersonShort: "/人",
    packageNotFound: "パッケージが見つかりません", destinationNotFound: "目的地が見つかりません",
    goBack: "戻る", aboutThisPackage: "このパッケージについて",
    maxPax: "最大人数", durationLabel: "期間", locationLabel: "場所",
    reviewsLabel: "レビュー", topRated: "高評価", countryLabel: "国",
    bestTime: "ベストシーズン", allYear: "通年", groupSizeLabel: "グループサイズ",    ratingLabel: "評価",
    uncoverPlace: "場所を発見", popularDestinationsSubtitle: "世界中で最も訪問された目的地を探索しましょう",
    popularPackages: "人気パッケージ", packagesSubtitle: "次の冒険にぴったりの旅行パッケージを見つけましょう",
    callToAction: "お問い合わせ", ctaDescription: "今日ご連絡ください。夢の休暇の計画をお手伝いします！",
    perPerson: "一人あたり",
    defaultUsername: "旅行者", welcomeBack: "おかえりなさい！",
    countriesLabel: "国", noBookingsHint: "まだ予約がありません。パッケージや目的地を予約するとここに表示されます。",
    browsePackages: "パッケージを見る", cancelBookingTitle: "予約キャンセル",
    cancelBookingMessage: "この旅行の予約をキャンセルしますか？", keepIt: "そのまま",
    cancelBookingAction: "予約をキャンセル", bookedOn: "予約日", cancel: "キャンセル", ok: "OK",
    customTrip: "カスタム旅行", travellersCount: "名の旅行者",
    viewDetails: "詳細を見る",
    featureBestPrice: "最低価格保証",
    featureBestPriceDesc: "隠れた費用なしで、すべての旅行パッケージに最高の価格を提供します。",
    featureHandpicked: "厳選された目的地",
    featureHandpickedDesc: "専門家が最も美しくユニークな目的地を厳選しています。",
    featureExpertGuides: "エキスパートガイド",
    featureExpertGuidesDesc: "目的地の隅々を知り尽くしたプロの現地ガイド。",
    featureFlexibleBooking: "フレキシブル予約",
    featureFlexibleBookingDesc: "柔軟なキャンセルポリシーで簡単に予約できます。",
    aboutParagraph1: "Tourlyは忘れられない旅行体験の創造に専念するプレミアム旅行会社です。長年の経験を持ち、世界で最も素晴らしい目的地と旅行者をつなぎます。",
    aboutParagraph2: "情熱的な旅行専門家チームが、通常の観光を超えたユニークな体験を作り出すために日々努力しています。",
    missionStatement: "卓越した持続可能で手頃な旅行体験を提供することで、人々が世界を探索することをインスパイアし可能にすること。",
    ctaContactDescription: "今日お問い合わせください。夢の休暇の計画をお手伝いします。チームは24時間対応可能です。",
    addressLabel: "住所", footerCopyright: "© 2024 Tourly. 全著作権所有",
    datePlaceholder: "YYYY-MM-DD",
    tagFlashSale: "フラッシュセール", tagWeekendDeal: "週末セール", tagLimitedOffer: "期間限定",
    timeJustNow: "たった今", timeMinutesAgo: "分前", timeHoursAgo: "時間前", timeDaysAgo: "日前",
    unreadNotifications: "件の未読通知",
    notifWelcomeTitle: "Tourlyへようこそ 🌍", notifWelcomeBody: "素晴らしい目的地を探索して、次の冒険を予約しましょう。",
    notifSaleTitle: "夏のセール — 最大30%オフ", notifSaleBody: "選りすぐりパッケージの期間限定オファー。2026年3月31日までにご予約ください。",
    notifNewDestTitle: "新しい目的地が追加されました", notifNewDestBody: "バリ島（インドネシア）が利用可能になりました。限定パッケージをチェック！",
    destinationDetailDesc: "この素晴らしい目的地の美しさと文化を体験してください。息をのむ景色から豊かな地元の伝統まで、すべての瞬間が忘れられないものになるでしょう。",
    expectGuidedTours: "地元の専門家によるガイドツアー", expectLocalCuisine: "本格的な地元料理体験",
    expectAccommodations: "快適な宿泊施設", expectTransportation: "交通手段込み", expectSupport: "24時間旅行サポート",
    inclusionAirfare: "往復航空券", inclusionTransfers: "空港送迎",
    inclusionAccommodation: "宿泊施設（4つ星ホテル）", inclusionBreakfast: "毎日の朝食",
    inclusionGuidedTours: "ガイドツアー", inclusionInsurance: "旅行保険", inclusionSupport: "24時間サポート",
    itineraryDay1Title: "到着と歓迎", itineraryDay1Desc: "空港出迎え、チェックイン、ウェルカムディナー",
    itineraryDay2Title: "市内散策", itineraryDay2Desc: "ガイドツアー、地元市場、文化的名所",
    itineraryDay3Title: "アドベンチャーデー", itineraryDay3Desc: "アウトドアアクティビティ、自然散策",
    itineraryDay4Title: "文化体験", itineraryDay4Desc: "伝統的なワークショップ、地元料理",
    itineraryDay5Title: "自由行動日", itineraryDay5Desc: "オプション活動またはリラクゼーション",
    itineraryDay6Title: "パノラマツアー", itineraryDay6Desc: "近くのアトラクションへの遠足",
    itineraryDay7Title: "出発", itineraryDay7Desc: "朝食、チェックアウト、空港送迎",
    packageDetailExtended: "丁寧に設計された旅行パッケージで忘れられない旅を体験してください。すべての詳細が一生に一度の旅のために計画されています。",
    chatOnlineStatus: "オンライン · Tourlyサポート",
    chatReply1: "お問い合わせありがとうございます！旅行専門家がすぐに対応いたします。",
    chatReply2: "素晴らしいご質問ですね！チームがメッセージを確認しています。",
    chatReply3: "完璧な旅行の計画をお手伝いします！詳細を教えていただけますか？",
    chatReply4: "パッケージは完全にカスタマイズ可能です。専門家におつなぎします。",
    chatReply5: "すぐのサポートが必要な場合は、+01 (123) 4567 90 にお電話ください。",
    priceAny: "すべて", priceUnder500: "< 500", price500to1000: "500 – 700", priceOver1000: "> 700",
    signIn: "ログイン", signUp: "新規登録", password: "パスワード", confirmPassword: "パスワード確認",
    forgotPassword: "パスワードをお忘れですか？", dontHaveAccount: "アカウントをお持ちでないですか？", alreadyHaveAccount: "すでにアカウントをお持ちですか？",
    orContinueWith: "または以下で続行", signingIn: "ログイン中...", signingUp: "アカウント作成中...",
    passwordMismatch: "パスワードが一致しません", passwordTooShort: "パスワードは8文字以上必要です",
    welcomeTo: "ようこそ", createAccount: "アカウント作成", signInSubtitle: "予約や保存した旅行にアクセスするにはログインしてください",
    signUpSubtitle: "Tourlyに参加して夢の旅行を計画しましょう",
    continueWithGoogle: "Googleで続行", continueWithApple: "Appleで続行",
    agreeToTerms: "登録することで、以下に同意します", termsOfService: "利用規約", privacyPolicy: "プライバシーポリシー", andText: "と",
    signOut: "サインアウト", signOutConfirm: "サインアウトしてもよろしいですか？",
    // Onboarding
    onboardingTitle1: "素晴らしい目的地を発見", onboardingDesc1: "あなたのために厳選された世界中の息をのむような場所を探索しましょう。",
    onboardingTitle2: "安心して予約", onboardingDesc2: "柔軟な予約、最低価格保証、24時間サポート。",
    onboardingTitle3: "旅行でリワードを獲得", onboardingDesc3: "旅行のたびにポイントを貯めて、限定特典をアンロック。",
    getStarted: "始める", next: "次へ", skip: "スキップ",
    // Premium
    premiumTitle: "Tourly Pro", premiumSubtitle: "究極の旅行体験をアンロック",
    premiumProTitle: "プロ", premiumEliteTitle: "エリート",
    premiumPerMonth: "/月", premiumPerYear: "/年", premiumSavePercent: "割引",
    premiumSubscribe: "今すぐ登録", premiumRestore: "購入を復元", premiumCurrentPlan: "現在のプラン", premiumFreePlan: "無料",
    premiumFeatureDeals: "限定セールと先行アクセス", premiumFeatureSupport: "優先カスタマーサポート",
    premiumFeatureCancellation: "全予約無料キャンセル", premiumFeatureAI: "AI旅行プランナー",
    premiumFeatureAdFree: "広告なし体験", premiumFeatureConcierge: "パーソナルコンシェルジュ",
    premiumFeatureLounge: "空港ラウンジアクセス", premiumFeatureDoublePoints: "2×ロイヤリティポイント",
    premiumMostPopular: "一番人気", premiumBestValue: "最もお得",
    // Loyalty
    loyaltyTitle: "リワード", loyaltyPoints: "ポイント", loyaltyTier: "ティア",
    loyaltyExplorer: "エクスプローラー", loyaltyAdventurer: "アドベンチャラー", loyaltyGlobetrotter: "グローブトロッター",
    loyaltyEarnPoints: "ポイントを貯める", loyaltyRedeemPoints: "ポイントを使う", loyaltyHistory: "履歴",
    loyaltyNextTier: "次のティア", loyaltyPointsToNext: "次のティアまでのポイント",
    loyaltyReferralBonus: "紹介ボーナス", loyaltyBookingPoints: "予約ポイント", loyaltyReviewPoints: "レビューポイント",
    // Referral
    referralTitle: "友達を紹介", referralSubtitle: "Tourlyを共有して紹介ごとに500ポイント獲得",
    referralCode: "あなたの紹介コード", referralCopyCode: "コードをコピー", referralCopied: "コピー済み！",
    referralShareText: "Tourlyに参加しよう！ボーナスコード：",
    referralFriendsJoined: "参加した友達", referralHowItWorks: "仕組み",
    referralStep1: "友達にユニークコードを共有",
    referralStep2: "友達が登録して最初の旅行を予約",
    referralStep3: "お互いに500ボーナスポイント獲得！",
    // Reviews
    reviewsTitle: "レビュー", writeReview: "レビューを書く", submitReview: "レビューを送信",
    reviewPlaceholder: "体験を共有してください...", noReviewsYet: "まだレビューはありません",
    beFirstReview: "最初のレビューを残しましょう！", ratingRequired: "評価を選択してください",
    reviewSubmitted: "レビューが送信されました！", averageRating: "平均評価",
    // AI Assistant
    aiAssistantTitle: "AI旅行プランナー", aiAssistantSubtitle: "AIで完璧な旅行を計画",
    aiPlaceholder: "旅行について何でも聞いてください...",
    aiWelcomeMessage: "こんにちは！AI旅行アシスタントです。旅行の計画、目的地の提案、旅程の作成などをお手伝いします。何を探索しますか？",
    aiSuggestion1: "バリ5日間の旅行を計画", aiSuggestion2: "家族向けベストデスティネーション", aiSuggestion3: "ヨーロッパの格安旅行のコツ",
    aiProFeature: "Proにアップグレードで無制限AI計画",
    // Travel Extras
    extrasTitle: "旅をグレードアップ", extrasSubtitle: "エクストラを追加してさらに素晴らしい旅に",
    extrasTransfer: "空港送迎", extrasTransferDesc: "プライベートカーでの送迎サービス",
    extrasInsurance: "旅行保険", extrasInsuranceDesc: "旅行の包括的な補償",
    extrasSim: "eSIMデータプラン", extrasSimDesc: "無制限データで常に接続",
    extrasLounge: "空港ラウンジ", extrasLoungeDesc: "フライト前に快適にリラックス",
    addToBooking: "予約に追加", skipExtras: "スキップして確認へ",
    // Featured
    featuredBadge: "注目", sponsoredBadge: "スポンサー", trendingBadge: "トレンド",
    // Landing page
    landingBrand: "Tourly", landingHeroBadge: "#1 AI搭載トラベルアプリ",
    landingHeroTitle: "Tourlyで\n世界を\n探索しよう", landingHeroSubtitle: "息をのむような目的地、厳選パッケージ、AI旅行プランニング — すべてひとつのアプリで。",
    landingCTA: "始めましょう",
    landingStatTrips: "50K+", landingStatTripsLabel: "予約済み旅行", landingStatDest: "120+", landingStatDestLabel: "目的地", landingStatRating: "4.9", landingStatRatingLabel: "アプリ評価",
    landingWhyEyebrow: "なぜTourly", landingWhyTitle: "賢く旅しよう、\n大変にならずに", landingWhySubtitle: "最新技術と地元の知恵で、完璧な旅に必要なすべてを。",
    landingFeatureAI: "AI旅行プランナー", landingFeatureAIDesc: "あなたの好みと予算に基づいてAIが作成するパーソナライズされた旅程。",
    landingFeatureDest: "50以上の目的地", landingFeatureDestDesc: "6大陸の隠れた名所から象徴的なランドマークまで、厳選された目的地を探索。",
    landingFeatureSecure: "安全な予約", landingFeatureSecureDesc: "エンドツーエンド暗号化決済、柔軟なキャンセルと全額返金保証。",
    landingFeatureConcierge: "24/7コンシェルジュ", landingFeatureConciergeDesc: "目的地の隅々を知る地元エキスパートからのリアルタイムサポート。",
    landingTrendingEyebrow: "トレンド", landingTrendingTitle: "人気の目的地",
    landingCuratedEyebrow: "あなたのために厳選", landingCuratedTitle: "トラベルパッケージ",
    landingTestimonialsEyebrow: "お客様の声", landingTestimonialsTitle: "旅行者に愛されています",
    landingTestimonial1Name: "Sarah Mitchell", landingTestimonial1Location: "ニューヨーク、アメリカ",
    landingTestimonial1Quote: "Tourlyのおかげでハネムーンの計画が楽になりました。AIが見つけられなかった場所を提案してくれました！",
    landingTestimonial2Name: "田中健二", landingTestimonial2Location: "東京、日本",
    landingTestimonial2Quote: "コンシェルジュサービスは素晴らしかった。訪れた各都市に地元の友人がいるような感覚でした。",
    landingTestimonial3Name: "Amara Osei", landingTestimonial3Location: "アクラ、ガーナ",
    landingTestimonial3Quote: "今まで使った中で最高の旅行アプリ。お得な情報は本物で、予約プロセスもスムーズです。",
    landingReadyCTA: "次の冒険の準備はできましたか？", landingReadyDesc: "Tourlyで計画・予約する5万人以上の旅行者に加わりましょう。今すぐ無料アカウントを作成。",
    landingCreateAccount: "無料アカウント作成",
    landingFooterTagline: "2024年から旅行をアクセシブル、パーソナル、忘れられないものに。",
    landingFooterAbout: "概要", landingFooterContact: "お問い合わせ", landingFooterDeals: "お得情報",
    landingFooterCopyright: "© 2024–2026 Tourly. 全著作権所有。",
    landingExplore: "探索",
    // Download page
    downloadTitle: "アプリを入手",
    downloadHeroSubtitle: "ポケットの旅行コンパニオン。\n探索、予約、出発 — すべてひとつのアプリで。",
    downloadOnThe: "でダウンロード", downloadGetItOn: "で入手", downloadAppStore: "App Store", downloadGooglePlay: "Google Play",
    downloadStatRating: "4.9", downloadStatRatingLabel: "アプリ評価", downloadStatDownloads: "500K+", downloadStatDownloadsLabel: "ダウンロード",
    downloadStatDest: "100+", downloadStatDestLabel: "目的地", downloadStatSupport: "24/7", downloadStatSupportLabel: "サポート",
    downloadExclusiveEyebrow: "アプリ限定", downloadWhyTitle: "なぜTourlyをダウンロード？", downloadWhySubtitle: "アプリはブラウザでは使えない機能を解放します。",
    downloadFeatureFast: "超高速", downloadFeatureFastDesc: "ブラウザより滑らかなネイティブパフォーマンス。",
    downloadFeatureNotif: "プッシュ通知", downloadFeatureNotifDesc: "フラッシュセールや値下げの即時アラートで見逃しなし。",
    downloadFeatureOffline: "オフラインアクセス", downloadFeatureOfflineDesc: "圏外でも使えるように旅程と地図を保存。",
    downloadFeatureOneTap: "ワンタップ予約", downloadFeatureOneTapDesc: "保存済みの支払い・旅行者情報で数秒で予約。",
    downloadFeatureAI: "AI旅行プランナー", downloadFeatureAIDesc: "AI搭載のパーソナライズされた旅行提案を直接アプリ内で。",
    downloadFeatureSecure: "安全＆プライベート", downloadFeatureSecureDesc: "生体認証ログインと暗号化データで情報を安全に。",
    downloadReviewsEyebrow: "旅行者に愛されています", downloadReviewsTitle: "ユーザーの声",
    downloadReview1Name: "Sarah M.", downloadReview1Text: "今まで使った中で最高の旅行アプリ！バリ旅行を2分以内で予約しました。",
    downloadReview2Name: "James K.", downloadReview2Text: "オフラインマップが日本の田舎で助けてくれました。まさにゲームチェンジャー。",
    downloadReview3Name: "Aisha R.", downloadReview3Text: "プッシュ通知で40%フラッシュセールをキャッチ。旅行で$300節約！",
    downloadCompareTitle: "アプリ vs. ブラウザ", downloadCompareApp: "アプリ", downloadCompareWeb: "Web",
    downloadComparePush: "プッシュ通知", downloadCompareOffline: "オフラインアクセス", downloadCompareBiometric: "生体認証ログイン",
    downloadCompareOneTap: "ワンタップ予約", downloadCompareAI: "AI旅行プランナー", downloadCompareBrowse: "目的地を閲覧",
    downloadBottomCTATitle: "もっと賢く旅する準備はできましたか？", downloadBottomCTADesc: "TourlyをiOSとAndroidで無料ダウンロード。",
    downloadPlatformIOS: "iOS", downloadPlatformAndroid: "Android",
    // Auth extras
    authError: "エラー", authInvalidCredentials: "無効な資格情報",
    authSignInFailed: "サインインに失敗しました。もう一度お試しください。", authSignUpFailed: "サインアップに失敗しました。もう一度お試しください。",
    authOAuthFailed: "OAuthログインに失敗しました。もう一度お試しください。", authGoogle: "Google", authApple: "Apple",
    getTheApp: "アプリを入手", adminPanel: "管理パネル", adminPanelDesc: "予約、ユーザー、目的地を管理",
    tierElite: "エリート", tierPro: "プロ", aiLabel: "AI",
    premiumNoPurchases: "以前の購入は見つかりませんでした。",
    thankYou: "ありがとうございます！", shareDestination: "Tourlyでこの目的地をチェック！", sharePackage: "Tourlyでこのパッケージをチェック！",
    shareVia: "共有方法", shareWhatsApp: "WhatsApp", shareTwitter: "X (Twitter)", shareFacebook: "Facebook", shareTelegram: "Telegram", shareEmail: "メール", shareSMS: "SMS", shareCopyLink: "リンクをコピー", shareLinkCopied: "リンクをクリップボードにコピーしました！", shareMoreOptions: "その他のオプション",
    aiResponseBali: "バリは素晴らしい選択です！5日間のおすすめ旅程です:\n\n📍 1日目: 到着、スミニャックビーチを散策\n📍 2日目: ウブドの棚田とモンキーフォレスト\n📍 3日目: ウルワツ寺院とケチャックダンス\n📍 4日目: ヌサペニダ日帰り旅行\n📍 5日目: スパデーと出発\n\nベストシーズン: 4月-10月（乾季）。予算: 快適さに応じて〜$50-150/日。",
    aiResponseFamily: "素晴らしい家族旅行先:\n\n🏖️ モルディブ - 水上ヴィラ、シュノーケリング\n🏰 日本 - 東京ディズニーランド、文化体験\n🌴 タイ - ビーチ、象の保護施設\n🏔️ スイス - 絶景列車、ハイキング\n🦁 ケニア - ファミリーサファリ\n\n詳しく知りたいものはありますか？",
    aiResponseBudget: "予算旅行のベストヒント:\n\n💡 ショルダーシーズン（春/秋）に旅行\n💡 火曜日にフライト予約でお得に\n💡 タクシーの代わりに地元の交通機関を利用\n💡 ゲストハウスやホステルに宿泊\n💡 地元の市場や屋台で食事\n💡 観光パスを取得\n\n格安旅行先: ベトナム、ポルトガル、メキシコ、タイ、モロッコ。",
    aiResponseEurope: "ヨーロッパ旅行計画:\n\n🇫🇷 パリ - 最低3日\n🇮🇹 ローマ/フィレンツェ - 4日\n🇪🇸 バルセロナ - 2-3日\n🇬🇷 サントリーニ - 2-3日\n\n✈️ プロヒント: 都市間はLCCを利用。長距離にはユーレイルパス。予算: €60-150/日。",
    aiResponseDefault: "素晴らしい質問です！最高のお得情報については厳選パッケージをご覧ください。目的地ページもインスピレーションに。\n\n特定の旅行を計画しましょうか？教えてください:\n• 行き先\n• 日数\n• 予算範囲\n• 旅のスタイル（冒険、リラックス、文化）",
    bannerGetApp: "Tourlyアプリを入手", bannerFasterOn: "より速い体験", bannerOpen: "開く",
    chatWelcomeBack: "おかえりなさい！👋 またお会いできて嬉しいです。今日はどうされましたか？",
    chatNewConvo: "新しい会話を開始！✨ 前のチャットはアーカイブされました。どうお手伝いしましょうか？",
    chatFreshConvo: "新しい会話を開始！✨ 何かお手伝いできますか？",
    chatLiveAgent: "ライブエージェント", chatConnectedTeam: "サポートチームに接続中", chatEnd: "終了",
    chatConvoClosed: "この会話は閉じられました", chatStartNew: "新しい会話を開始",
    chatHereToHelp: "お気軽にお問い合わせください",
    chatReturnLive: "ライブチャットに戻る", chatActiveConvo: "サポートとの会話が進行中です",
    chatConnectAgent: "エージェントとチャット", chatConnectAgentDesc: "リアルタイムヘルプのためサポートチームに接続",
    chatConnectedLive: "ライブサポートに接続", chatAgentRespondSoon: "サポートエージェントがまもなく応答します。\nメッセージを入力して開始してください。",
    chatEnded: "チャット終了",
    chatArchivedChat: "アーカイブされたチャット", chatHistory: "チャット履歴", chatClearAll: "すべてクリア", chatDelete: "削除",
    chatNoArchives: "アーカイブされたチャットはありません", chatLiveAgentChat: "ライブエージェントチャット", chatBotConvo: "ボット会話",
    chatBackToArchives: "アーカイブに戻る", chatConversations: "会話", chatMessages: "メッセージ",
    chatTranslate: "翻訳", chatShowOriginal: "原文を表示", chatTranslating: "翻訳中…",
    chatTranslateAll: "すべて翻訳", chatAutoTranslate: "自動翻訳",
    chatTranslatedFrom: "翻訳元", chatTranslationFailed: "翻訳に失敗しました",
    adminTitle: "管理パネル", adminDashboardTitle: "管理ダッシュボード", adminDashboardSubtitle: "旅行プラットフォームを管理",
    adminTabDashboard: "ダッシュボード", adminTabBookings: "予約", adminTabChat: "チャット",
    adminTabDestinations: "目的地", adminTabPackages: "パッケージ", adminTabUsers: "ユーザー",
    adminCancel: "キャンセル", adminSave: "保存", adminEdit: "編集", adminDelete: "削除", adminSearch: "検索",
    adminValidation: "バリデーション", adminTapUpload: "タップしてアップロード", adminChange: "変更", adminRemove: "削除",
    adminPermissionNeeded: "許可が必要", adminGrantCameraAccess: "画像をアップロードするにはカメラロールへのアクセスを許可してください。",
    adminTotalBookings: "予約総数", adminTotalBookingsTrend: "今月+12%",
    adminRevenue: "収益", adminRevenueTrend: "今月+8%",
    adminTotalUsers: "ユーザー総数", adminTotalUsersTrend: "今週+3",
    adminDestinations: "目的地",
    adminQuickActions: "クイックアクション", adminAddDestination: "目的地追加", adminCreatePackage: "パッケージ作成",
    adminSendNotification: "通知送信", adminViewReports: "レポート表示",
    adminRecentBookings: "最近の予約", adminNoBookingsYet: "まだ予約はありません",
    adminReports: "レポート", adminDone: "完了",
    adminBookingStatus: "予約状況", adminConfirmed: "確認済み", adminPending: "保留中", adminCancelled: "キャンセル済み",
    adminMonthlyBookings: "月間予約（過去6ヶ月）", adminTotalPeriod: "この期間の合計",
    adminRevenueLabel: "収益", adminRevenueByPackage: "パッケージ別収益", adminNoRevenueYet: "収益データなし",
    adminLatestBookings: "最新の予約", adminCustomTrip: "カスタム旅行", adminAvgBooking: "平均/予約",
    adminSendTo: "送信先", adminAllUsers: "全ユーザー", adminSelectUsers: "ユーザー選択",
    adminNotifTitle: "タイトル", adminNotifTitlePlaceholder: "例：夏のセール — 30%オフ",
    adminNotifMessage: "メッセージ", adminNotifMessagePlaceholder: "通知メッセージ...", adminNotifType: "タイプ",
    adminTitleMessageRequired: "タイトルとメッセージが必要です。", adminSelectAtLeastOne: "少なくとも1人のユーザーを選択してください。",
    adminSent: "送信済み", adminNotifSentTo: "通知送信先", adminUsersSelected: "選択済み", adminClear: "クリア",
    adminBookingDetails: "予約詳細", adminFullName: "氏名", adminEmail: "メール", adminPhone: "電話",
    adminTravelers: "旅行者", adminCheckIn: "チェックイン", adminCheckOut: "チェックアウト", adminDatePlaceholder: "YYYY-MM-DD",
    adminUpdated: "更新済み", adminBookingUpdated: "予約詳細が更新されました（ローカルデモ）。",
    adminAll: "すべて", adminNoBookingsFound: "予約が見つかりません", adminConfirm: "確認", adminPax: "名", adminNA: "N/A",
    adminEditDestination: "目的地編集", adminAddDestinationTitle: "目的地追加",
    adminCoverImage: "カバー画像", adminName: "名前", adminNamePlaceholder: "例：サントリーニ",
    adminCountry: "国", adminCountryPlaceholder: "例：ギリシャ", adminRating: "評価 (1-5)",
    adminDescription: "説明", adminDescPlaceholder: "簡単な説明...",
    adminSearchDestinations: "目的地を検索...", adminAddNewDestination: "新しい目的地追加",
    adminDeleteDestination: "目的地削除", adminDeleteConfirm: "本当に削除しますか",
    adminNameCountryRequired: "名前と国が必要です。",
    adminEditPackage: "パッケージ編集", adminAddPackageTitle: "パッケージ追加",
    adminPackageImage: "パッケージ画像", adminPackageTitle: "タイトル", adminTitlePlaceholder: "例：ビーチホリデー",
    adminLocation: "場所", adminLocationPlaceholder: "例：マレーシア",
    adminDuration: "期間", adminDurationPlaceholder: "例：7日/6泊", adminMaxPax: "最大人数",
    adminPrice: "価格 ($)", adminPricePlaceholder: "例：750",
    adminPackageDescPlaceholder: "パッケージの説明...", adminSearchPackages: "パッケージを検索...",
    adminAddNewPackage: "新しいパッケージ追加", adminDeletePackage: "パッケージ削除",
    adminTitleLocationPriceRequired: "タイトル、場所、価格が必要です。", adminReviews: "レビュー",
    adminEditUser: "ユーザー編集", adminAvatar: "アバター", adminRole: "ロール",
    adminSearchUsers: "ユーザーを検索...", adminActive: "アクティブ", adminSuspended: "停止中", adminAdmins: "管理者",
    adminJoined: "参加日", adminBookingsCount: "予約",
    adminPromote: "昇格", adminDemote: "降格", adminSuspend: "停止", adminActivate: "有効化",
    adminNameEmailRequired: "名前とメールが必要です。",
    adminConversations: "会話", adminLive: "ライブ", adminNoConvoYet: "まだ会話はありません",
    adminNoConvoDesc: "ユーザーがライブチャットを開始すると、\nここに会話が表示されます。",
    adminNoMessages: "メッセージなし", adminReopen: "再開", adminClose: "閉じる",
    adminConvoClosed: "会話が閉じられました", adminTypeReply: "返信を入力...",
    adminYou: "あなた: ", adminClosed: "クローズ", adminUnread: "未読",
  },
  ar: {
    tabHome: "الرئيسية", tabExplore: "استكشف", tabTrips: "الرحلات", tabSaved: "المحفوظة", tabGallery: "المعرض",
    heroTitle: "رحلة لاستكشاف\nالعالم", heroSubtitle: "اكتشف وجهات رائعة وأنشئ ذكريات لا تُنسى مع Tourly",
    learnMore: "اعرف المزيد", bookNow: "احجز الآن", contactUs: "تواصل معنا",
    findYourTrip: "ابحث عن رحلتك", enterDestination: "أدخل الوجهة", numberOfTravelers: "عدد المسافرين",
    inquireNow: "استفسر الآن", popularDestinations: "الوجهات الشائعة", checkoutPackages: "تصفح باقاتنا",
    viewAll: "← عرض الكل", dealsTitle: "عروض وتخفيضات 🔥", dealsSubtitle: "خصم يصل إلى 30%",
    save: "حفظ", saved: "محفوظ", share: "مشاركة", back: "رجوع", search: "بحث",
    searchPlaceholder: "ابحث عن وجهات وباقات...", noResults: "لا توجد نتائج",
    filterAll: "الكل", filterDestinations: "الوجهات", filterPackages: "الباقات",
    sortBy: "ترتيب", sortDefault: "افتراضي", sortNameAZ: "الاسم: أ–ي", sortRelevance: "الأكثر صلة", sortPriceLow: "السعر: الأقل → الأعلى", sortPriceHigh: "السعر: الأعلى → الأقل", sortRating: "الأعلى تقييماً",
    priceRange: "السعر", resultsFound: "نتائج", searchTourly: "البحث في Tourly",
    searchHint: "ابحث عن وجهتك أو باقة سفرك المثالية", tryDifferent: "جرّب كلمة بحث مختلفة أو عدّل الفلاتر",
    clearFilters: "مسح الفلاتر",
    bookThisDestination: "احجز هذه الوجهة", aboutDestination: "عن هذه الوجهة",
    whatToExpect: "ماذا تتوقع", whatsIncluded: "ما يشمله", sampleItinerary: "مثال على الجدول",
    bookingTitle: "احجز رحلتك", fullName: "الاسم الكامل", email: "البريد الإلكتروني", phone: "الهاتف",
    travelers: "المسافرون", checkIn: "تاريخ الوصول", checkOut: "تاريخ المغادرة",
    submitBooking: "إرسال الحجز", bookingSuccess: "تم إرسال الحجز بنجاح!",
    notificationsTitle: "الإشعارات", markAllRead: "تعليم الكل كمقروء", noNotifications: "لا توجد إشعارات",
    profileTitle: "ملفي الشخصي", myBookings: "حجوزاتي", settings: "الإعدادات", aboutUs: "من نحن",
    settingsTitle: "الإعدادات", darkMode: "الوضع الداكن", language: "اللغة", currency: "العملة",
    pushNotifications: "إشعارات الدفع", emailNotifications: "إشعارات البريد",
    myWishlist: "قائمة رغباتي", savedPlaces: "الأماكن المحفوظة", nothingSaved: "لا يوجد محفوظات بعد",
    nothingSavedHint: "اضغط على أيقونة القلب في أي وجهة أو باقة لحفظها هنا.",
    exploreDestinations: "استكشف الوجهات", photoGallery: "معرض الصور", photosFromTravellers: "صور من المسافرين",
    chatTitle: "الدعم المباشر", chatPlaceholder: "اكتب رسالة...", chatSend: "إرسال",
    chatWelcome: "👋 مرحباً! أهلاً بك في Tourly. كيف يمكننا مساعدتك اليوم؟",
    chatHello: "مرحباً! أنا مساعد سفرك في Tourly. اسألني عن الوجهات والباقات والحجوزات!",
    personalInfo: "المعلومات الشخصية", tripDetails: "تفاصيل الرحلة",
    selectedPackage: "الباقة المختارة", destinationLabel: "الوجهة",
    whereToGo: "إلى أين تريد الذهاب؟", preferredCheckIn: "تاريخ الوصول المفضل",
    preferredCheckOut: "تاريخ المغادرة المفضل", specialRequests: "طلبات خاصة",
    specialRequestsPlaceholder: "أي متطلبات خاصة؟", submitBookingRequest: "إرسال طلب الحجز",
    validationNameRequired: "الاسم الكامل مطلوب", validationEmailRequired: "البريد الإلكتروني مطلوب",
    validationEmailInvalid: "الرجاء إدخال بريد إلكتروني صحيح", validationPhoneRequired: "رقم الهاتف مطلوب",
    aboutPageTitle: "من نحن", whoWeAre: "من نحن", trustedTravelPartner: "شريكك الموثوق في السفر",
    whyChooseUs: "لماذا تختارنا", whatMakesDifferent: "ما الذي يميزنا",
    ourMission: "مهمتنا", happyTravelers: "مسافرون سعداء", tourPackages: "باقات السياحة", supportUs: "الدعم",
    getInTouch: "تواصل معنا", feelFreeContact: "لا تتردد في التواصل معنا!",
    newsletter: "النشرة الإخبارية", newsletterSubtitle: "اشترك للحصول على أحدث العروض.",
    subscribe: "اشترك", enterYourEmail: "أدخل بريدك الإلكتروني", readyForTravel: "مستعد لرحلة لا تُنسى؟",
    limitedTime: "وقت محدود", flashDeals: "عروض سريعة 🔥", flashDealsSubtitle: "وفر حتى 30% على أفضل باقاتنا",
    endsIn: "تنتهي في", bookAt: "احجز بـ", perPersonShort: "/شخص",
    packageNotFound: "الباقة غير موجودة", destinationNotFound: "الوجهة غير موجودة",
    goBack: "العودة", aboutThisPackage: "عن هذه الباقة",
    maxPax: "أقصى عدد", durationLabel: "المدة", locationLabel: "الموقع",
    reviewsLabel: "تقييم", topRated: "الأعلى تقييماً", countryLabel: "البلد",
    bestTime: "أفضل وقت", allYear: "طوال العام", groupSizeLabel: "حجم المجموعة",    ratingLabel: "التقييم",
    uncoverPlace: "اكتشف الأماكن", popularDestinationsSubtitle: "استكشف وجهاتنا الأكثر زيارة حول العالم",
    popularPackages: "الباقات الشائعة", packagesSubtitle: "اعثر على باقة السفر المثالية لمغامرتك القادمة",
    callToAction: "تواصل معنا", ctaDescription: "تواصل معنا اليوم وسنساعدك في التخطيط لعطلة أحلامك!",
    perPerson: "للشخص",
    defaultUsername: "مسافر", welcomeBack: "!مرحباً بعودتك",
    countriesLabel: "دول", noBookingsHint: "لا توجد حجوزات بعد. احجز باقة أو وجهة لرؤيتها هنا.",
    browsePackages: "تصفح الباقات", cancelBookingTitle: "إلغاء الحجز",
    cancelBookingMessage: "هل تريد إلغاء حجزك لهذه الرحلة؟", keepIt: "الإبقاء",
    cancelBookingAction: "إلغاء الحجز", bookedOn: "تم الحجز في", cancel: "إلغاء", ok: "حسناً",
    customTrip: "رحلة مخصصة", travellersCount: "مسافرين",
    viewDetails: "عرض التفاصيل",
    featureBestPrice: "ضمان أفضل سعر",
    featureBestPriceDesc: "نقدم أفضل الأسعار لجميع باقات السفر بدون رسوم خفية.",
    featureHandpicked: "وجهات مختارة بعناية",
    featureHandpickedDesc: "يختار خبراؤنا بعناية أجمل الوجهات وأكثرها تميزاً.",
    featureExpertGuides: "مرشدون خبراء",
    featureExpertGuidesDesc: "مرشدون محليون محترفون يعرفون كل زاوية من الوجهة.",
    featureFlexibleBooking: "حجز مرن",
    featureFlexibleBookingDesc: "عملية حجز سهلة مع سياسات إلغاء مرنة.",
    aboutParagraph1: "تورلي هي وكالة سفر متميزة مكرسة لخلق تجارب سفر لا تُنسى. مع سنوات من الخبرة، نربط المسافرين بأروع الوجهات حول العالم.",
    aboutParagraph2: "يعمل فريقنا من خبراء السفر المتحمسين بلا كلل لخلق تجارب فريدة تتجاوز السياحة العادية.",
    missionStatement: "إلهام وتمكين الناس من استكشاف العالم من خلال توفير تجارب سفر استثنائية ومستدامة وبأسعار معقولة.",
    ctaContactDescription: "تواصل معنا اليوم وسنساعدك في التخطيط لعطلة أحلامك. فريقنا جاهز لمساعدتك على مدار الساعة.",
    addressLabel: "العنوان", footerCopyright: "© 2024 تورلي. جميع الحقوق محفوظة",
    datePlaceholder: "سنة-شهر-يوم",
    tagFlashSale: "تخفيض سريع", tagWeekendDeal: "عرض نهاية الأسبوع", tagLimitedOffer: "عرض محدود",
    timeJustNow: "الآن", timeMinutesAgo: "د", timeHoursAgo: "س", timeDaysAgo: "ي",
    unreadNotifications: "إشعارات غير مقروءة",
    notifWelcomeTitle: "مرحبًا بك في Tourly 🌍", notifWelcomeBody: "ابدأ باستكشاف وجهات مذهلة واحجز مغامرتك القادمة.",
    notifSaleTitle: "تخفيضات الصيف — خصم حتى 30%", notifSaleBody: "عرض محدود على باقات مختارة. احجز قبل 31 مارس 2026.",
    notifNewDestTitle: "وجهة جديدة مضافة", notifNewDestBody: "بالي، إندونيسيا متاحة الآن. تصفح باقاتنا الحصرية!",
    destinationDetailDesc: "عش جمال وثقافة هذه الوجهة المذهلة. من المناظر الخلابة إلى التقاليد المحلية الغنية، كل لحظة ستكون لا تُنسى.",
    expectGuidedTours: "جولات إرشادية مع خبراء محليين", expectLocalCuisine: "تجارب مطبخ محلي أصيل",
    expectAccommodations: "إقامة مريحة", expectTransportation: "النقل مشمول", expectSupport: "دعم سفر على مدار الساعة",
    inclusionAirfare: "تذكرة طيران ذهاب وعودة", inclusionTransfers: "نقل من وإلى المطار",
    inclusionAccommodation: "إقامة (فندق 4 نجوم)", inclusionBreakfast: "فطور يومي",
    inclusionGuidedTours: "جولات إرشادية", inclusionInsurance: "تأمين سفر", inclusionSupport: "دعم على مدار الساعة",
    itineraryDay1Title: "الوصول والترحيب", itineraryDay1Desc: "استقبال المطار، تسجيل الوصول، عشاء ترحيبي",
    itineraryDay2Title: "استكشاف المدينة", itineraryDay2Desc: "جولة إرشادية، أسواق محلية، مواقع ثقافية",
    itineraryDay3Title: "يوم المغامرة", itineraryDay3Desc: "أنشطة خارجية، مشي في الطبيعة",
    itineraryDay4Title: "تجربة ثقافية", itineraryDay4Desc: "ورش عمل تقليدية، مطبخ محلي",
    itineraryDay5Title: "يوم حر", itineraryDay5Desc: "أنشطة اختيارية أو استرخاء",
    itineraryDay6Title: "جولة بانورامية", itineraryDay6Desc: "رحلة إلى المعالم القريبة",
    itineraryDay7Title: "المغادرة", itineraryDay7Desc: "فطور، تسجيل المغادرة، نقل إلى المطار",
    packageDetailExtended: "عش رحلة لا تُنسى مع باقة السفر المصممة بعناية. تم التخطيط لكل تفصيلة لتجعل رحلتك تجربة العمر.",
    chatOnlineStatus: "متصل · دعم تورلي",
    chatReply1: "شكراً لتواصلك معنا! خبير سفر سيكون معك قريباً.",
    chatReply2: "سؤال رائع! فريقنا يراجع رسالتك.",
    chatReply3: "يسعدنا مساعدتك في التخطيط لرحلتك المثالية! هل يمكنك مشاركة المزيد من التفاصيل؟",
    chatReply4: "باقاتنا قابلة للتخصيص بالكامل. سأوصلك بمتخصص.",
    chatReply5: "للمساعدة الفورية يمكنك أيضاً الاتصال بنا على +01 (123) 4567 90.",
    priceAny: "الكل", priceUnder500: "< 500", price500to1000: "500 – 700", priceOver1000: "> 700",
    signIn: "تسجيل الدخول", signUp: "إنشاء حساب", password: "كلمة المرور", confirmPassword: "تأكيد كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟", dontHaveAccount: "ليس لديك حساب؟", alreadyHaveAccount: "لديك حساب بالفعل؟",
    orContinueWith: "أو المتابعة عبر", signingIn: "جارٍ تسجيل الدخول...", signingUp: "جارٍ إنشاء الحساب...",
    passwordMismatch: "كلمات المرور غير متطابقة", passwordTooShort: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
    welcomeTo: "مرحباً بك في", createAccount: "إنشاء حساب", signInSubtitle: "سجّل الدخول للوصول إلى حجوزاتك ورحلاتك المحفوظة",
    signUpSubtitle: "انضم إلى Tourly وابدأ بالتخطيط لعطلة أحلامك",
    continueWithGoogle: "المتابعة عبر Google", continueWithApple: "المتابعة عبر Apple",
    agreeToTerms: "بالتسجيل، أنت توافق على", termsOfService: "شروط الخدمة", privacyPolicy: "سياسة الخصوصية", andText: "و",
    signOut: "تسجيل الخروج", signOutConfirm: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
    // Onboarding
    onboardingTitle1: "اكتشف وجهات مذهلة", onboardingDesc1: "استكشف أماكن خلابة حول العالم مختارة خصيصاً لك.",
    onboardingTitle2: "احجز بثقة", onboardingDesc2: "حجز مرن، ضمان أفضل سعر، ودعم على مدار الساعة.",
    onboardingTitle3: "اكسب مكافآت أثناء السفر", onboardingDesc3: "اجمع نقاطاً في كل رحلة واحصل على مزايا حصرية.",
    getStarted: "ابدأ الآن", next: "التالي", skip: "تخطي",
    // Premium
    premiumTitle: "Tourly Pro", premiumSubtitle: "افتح تجربة السفر المثالية",
    premiumProTitle: "برو", premiumEliteTitle: "إيليت",
    premiumPerMonth: "/شهر", premiumPerYear: "/سنة", premiumSavePercent: "وفّر",
    premiumSubscribe: "اشترك الآن", premiumRestore: "استعادة الشراء", premiumCurrentPlan: "الخطة الحالية", premiumFreePlan: "مجاني",
    premiumFeatureDeals: "عروض حصرية ووصول مبكر", premiumFeatureSupport: "دعم عملاء ذو أولوية",
    premiumFeatureCancellation: "إلغاء مجاني لجميع الحجوزات", premiumFeatureAI: "مخطط رحلات بالذكاء الاصطناعي",
    premiumFeatureAdFree: "تجربة بدون إعلانات", premiumFeatureConcierge: "خدمة كونسيرج شخصية",
    premiumFeatureLounge: "الوصول إلى صالات المطار", premiumFeatureDoublePoints: "2× نقاط ولاء",
    premiumMostPopular: "الأكثر شعبية", premiumBestValue: "أفضل قيمة",
    // Loyalty
    loyaltyTitle: "المكافآت", loyaltyPoints: "النقاط", loyaltyTier: "المستوى",
    loyaltyExplorer: "مستكشف", loyaltyAdventurer: "مغامر", loyaltyGlobetrotter: "رحّالة",
    loyaltyEarnPoints: "اكسب النقاط", loyaltyRedeemPoints: "استبدل النقاط", loyaltyHistory: "السجل",
    loyaltyNextTier: "المستوى التالي", loyaltyPointsToNext: "نقاط للمستوى التالي",
    loyaltyReferralBonus: "مكافأة الإحالة", loyaltyBookingPoints: "نقاط الحجز", loyaltyReviewPoints: "نقاط التقييم",
    // Referral
    referralTitle: "أحل صديقاً", referralSubtitle: "شارك Tourly واكسب 500 نقطة لكل إحالة",
    referralCode: "رمز الإحالة الخاص بك", referralCopyCode: "نسخ الرمز", referralCopied: "تم النسخ!",
    referralShareText: "انضم إلي على Tourly! استخدم رمزي للحصول على مكافأة: ",
    referralFriendsJoined: "أصدقاء انضموا", referralHowItWorks: "كيف يعمل",
    referralStep1: "شارك رمزك الفريد مع الأصدقاء",
    referralStep2: "يسجلون ويحجزون رحلتهم الأولى",
    referralStep3: "كلاكما يكسب 500 نقطة مكافأة!",
    // Reviews
    reviewsTitle: "التقييمات", writeReview: "اكتب تقييماً", submitReview: "إرسال التقييم",
    reviewPlaceholder: "شارك تجربتك...", noReviewsYet: "لا توجد تقييمات بعد",
    beFirstReview: "كن أول من يترك تقييماً!", ratingRequired: "يرجى اختيار تقييم",
    reviewSubmitted: "تم إرسال التقييم!", averageRating: "متوسط التقييم",
    // AI Assistant
    aiAssistantTitle: "مخطط السفر بالذكاء الاصطناعي", aiAssistantSubtitle: "خطط لرحلتك المثالية مع الذكاء الاصطناعي",
    aiPlaceholder: "اسألني أي شيء عن السفر...",
    aiWelcomeMessage: "مرحباً! أنا مساعد السفر بالذكاء الاصطناعي. يمكنني مساعدتك في تخطيط الرحلات واقتراح الوجهات وإنشاء الجداول والمزيد. ماذا تريد استكشافه؟",
    aiSuggestion1: "خطط لرحلة 5 أيام إلى بالي", aiSuggestion2: "أفضل الوجهات للعائلات", aiSuggestion3: "نصائح السفر الاقتصادي في أوروبا",
    aiProFeature: "ترقية إلى Pro للتخطيط غير المحدود بالذكاء الاصطناعي",
    // Travel Extras
    extrasTitle: "حسّن رحلتك", extrasSubtitle: "أضف إضافات لجعل رحلتك أفضل",
    extrasTransfer: "نقل المطار", extrasTransferDesc: "استقبال وتوصيل بسيارة خاصة",
    extrasInsurance: "تأمين السفر", extrasInsuranceDesc: "تغطية شاملة لرحلتك",
    extrasSim: "خطة بيانات eSIM", extrasSimDesc: "ابق متصلاً ببيانات غير محدودة",
    extrasLounge: "صالة المطار", extrasLoungeDesc: "استرخ قبل رحلتك بكل راحة",
    addToBooking: "إضافة إلى الحجز", skipExtras: "تخطي والمتابعة للتأكيد",
    // Featured
    featuredBadge: "مميز", sponsoredBadge: "مُموَّل", trendingBadge: "رائج",
    // Landing page
    landingBrand: "Tourly", landingHeroBadge: "تطبيق السفر #1 بالذكاء الاصطناعي",
    landingHeroTitle: "استكشف\nالعالم مع\nTourly", landingHeroSubtitle: "اكتشف وجهات خلابة وباقات مختارة وتخطيط سفر بالذكاء الاصطناعي — كل ذلك في تطبيق واحد.",
    landingCTA: "ابدأ الآن",
    landingStatTrips: "+50 ألف", landingStatTripsLabel: "رحلات محجوزة", landingStatDest: "+120", landingStatDestLabel: "وجهات", landingStatRating: "4.9", landingStatRatingLabel: "تقييم التطبيق",
    landingWhyEyebrow: "لماذا Tourly", landingWhyTitle: "سافر بذكاء،\nليس بصعوبة", landingWhySubtitle: "كل ما تحتاجه للرحلة المثالية، مدعوم بالتكنولوجيا الحديثة والخبرة المحلية.",
    landingFeatureAI: "مخطط رحلات ذكي", landingFeatureAIDesc: "احصل على برامج رحلات مخصصة من الذكاء الاصطناعي بناءً على تفضيلاتك وميزانيتك.",
    landingFeatureDest: "+50 وجهة", landingFeatureDestDesc: "استكشف وجهات مختارة عبر 6 قارات، من الجواهر الخفية إلى المعالم الشهيرة.",
    landingFeatureSecure: "حجز آمن", landingFeatureSecureDesc: "مدفوعات مشفرة من طرف لطرف مع إلغاء مرن وحماية كاملة للاسترداد.",
    landingFeatureConcierge: "كونسيرج 24/7", landingFeatureConciergeDesc: "دعم فوري من خبراء محليين يعرفون كل زاوية في وجهتك.",
    landingTrendingEyebrow: "رائج الآن", landingTrendingTitle: "الوجهات الشائعة",
    landingCuratedEyebrow: "مختار لك", landingCuratedTitle: "باقات السفر",
    landingTestimonialsEyebrow: "آراء العملاء", landingTestimonialsTitle: "محبوب من المسافرين",
    landingTestimonial1Name: "سارة ميتشل", landingTestimonial1Location: "نيويورك، الولايات المتحدة",
    landingTestimonial1Quote: "Tourly جعل تخطيط شهر العسل سهلاً جداً. اقترح الذكاء الاصطناعي أماكن لم نكن لنجدها أبداً!",
    landingTestimonial2Name: "كينجي تاناكا", landingTestimonial2Location: "طوكيو، اليابان",
    landingTestimonial2Quote: "خدمة الكونسيرج كانت رائعة. شعرت وكأن لدي صديقاً محلياً في كل مدينة زرناها.",
    landingTestimonial3Name: "أمارا أوسي", landingTestimonial3Location: "أكرا، غانا",
    landingTestimonial3Quote: "أفضل تطبيق سفر استخدمته. العروض حقيقية وعملية الحجز سلسة.",
    landingReadyCTA: "مستعد لمغامرتك القادمة؟", landingReadyDesc: "انضم إلى أكثر من 50,000 مسافر يخططون ويحجزون مع Tourly. أنشئ حسابك المجاني اليوم.",
    landingCreateAccount: "إنشاء حساب مجاني",
    landingFooterTagline: "نجعل السفر متاحاً وشخصياً ولا يُنسى منذ 2024.",
    landingFooterAbout: "عنا", landingFooterContact: "اتصل", landingFooterDeals: "عروض",
    landingFooterCopyright: "© 2024–2026 Tourly. جميع الحقوق محفوظة.",
    landingExplore: "استكشف",
    // Download page
    downloadTitle: "حمّل التطبيق",
    downloadHeroSubtitle: "رفيق سفرك في جيبك.\nاستكشف واحجز وانطلق — كل شيء من تطبيق واحد.",
    downloadOnThe: "حمّل من", downloadGetItOn: "متوفر على", downloadAppStore: "App Store", downloadGooglePlay: "Google Play",
    downloadStatRating: "4.9", downloadStatRatingLabel: "تقييم التطبيق", downloadStatDownloads: "+500 ألف", downloadStatDownloadsLabel: "تحميل",
    downloadStatDest: "+100", downloadStatDestLabel: "وجهات", downloadStatSupport: "24/7", downloadStatSupportLabel: "دعم",
    downloadExclusiveEyebrow: "حصري للتطبيق", downloadWhyTitle: "لماذا تحمّل Tourly؟", downloadWhySubtitle: "التطبيق يفتح ميزات لا تتوفر في المتصفح.",
    downloadFeatureFast: "سريع جداً", downloadFeatureFastDesc: "أداء أصلي أكثر سلاسة من أي متصفح.",
    downloadFeatureNotif: "إشعارات فورية", downloadFeatureNotifDesc: "لا تفوت أي عرض — احصل على تنبيهات فورية لعروض الفلاش.",
    downloadFeatureOffline: "وصول بدون إنترنت", downloadFeatureOfflineDesc: "احفظ البرامج والخرائط لاستخدامها بدون إنترنت.",
    downloadFeatureOneTap: "حجز بلمسة واحدة", downloadFeatureOneTapDesc: "احجز في ثوانٍ مع بيانات الدفع المحفوظة.",
    downloadFeatureAI: "مخطط رحلات ذكي", downloadFeatureAIDesc: "اقتراحات سفر مخصصة بالذكاء الاصطناعي مدمجة مباشرة.",
    downloadFeatureSecure: "آمن وخاص", downloadFeatureSecureDesc: "تسجيل دخول بيومتري وبيانات مشفرة تحمي معلوماتك.",
    downloadReviewsEyebrow: "محبوب من المسافرين", downloadReviewsTitle: "ماذا يقول المستخدمون",
    downloadReview1Name: "سارة م.", downloadReview1Text: "أفضل تطبيق سفر استخدمته! حجزت رحلتي لبالي في أقل من دقيقتين.",
    downloadReview2Name: "جيمس ك.", downloadReview2Text: "الخرائط بدون إنترنت أنقذتني في ريف اليابان. تغيير حقيقي للعبة.",
    downloadReview3Name: "عائشة ر.", downloadReview3Text: "الإشعارات التقطت عرض فلاش 40%. وفّرت 300$ في رحلتي!",
    downloadCompareTitle: "التطبيق مقابل المتصفح", downloadCompareApp: "التطبيق", downloadCompareWeb: "ويب",
    downloadComparePush: "إشعارات فورية", downloadCompareOffline: "وصول بدون إنترنت", downloadCompareBiometric: "تسجيل بيومتري",
    downloadCompareOneTap: "حجز بلمسة واحدة", downloadCompareAI: "مخطط رحلات ذكي", downloadCompareBrowse: "تصفح الوجهات",
    downloadBottomCTATitle: "مستعد للسفر بذكاء؟", downloadBottomCTADesc: "حمّل Tourly مجاناً على iOS و Android.",
    downloadPlatformIOS: "iOS", downloadPlatformAndroid: "Android",
    authError: "خطأ", authInvalidCredentials: "بيانات غير صحيحة",
    authSignInFailed: "فشل تسجيل الدخول. حاول مرة أخرى.", authSignUpFailed: "فشل التسجيل. حاول مرة أخرى.",
    authOAuthFailed: "فشل تسجيل OAuth. حاول مرة أخرى.", authGoogle: "جوجل", authApple: "آبل",
    getTheApp: "حمّل التطبيق", adminPanel: "لوحة الإدارة", adminPanelDesc: "إدارة الحجوزات والمستخدمين والوجهات",
    tierElite: "نخبة", tierPro: "برو", aiLabel: "ذكاء اصطناعي",
    premiumNoPurchases: "لم يتم العثور على مشتريات سابقة.",
    thankYou: "شكراً لك!", shareDestination: "تحقق من هذه الوجهة على Tourly!", sharePackage: "تحقق من هذه الباقة على Tourly!",
    shareVia: "مشاركة عبر", shareWhatsApp: "WhatsApp", shareTwitter: "X (Twitter)", shareFacebook: "Facebook", shareTelegram: "Telegram", shareEmail: "البريد الإلكتروني", shareSMS: "SMS", shareCopyLink: "نسخ الرابط", shareLinkCopied: "تم نسخ الرابط إلى الحافظة!", shareMoreOptions: "خيارات أخرى",
    aiResponseBali: "بالي خيار رائع! إليك برنامج مقترح لـ 5 أيام:\n\n📍 اليوم 1: الوصول واستكشاف شاطئ سيمينياك\n📍 اليوم 2: مدرجات أرز أوبود وغابة القرود\n📍 اليوم 3: معبد أولواتو ورقصة كيتشاك\n📍 اليوم 4: رحلة يومية لنوسا بينيدا\n📍 اليوم 5: يوم سبا والمغادرة\n\nأفضل وقت: أبريل-أكتوبر (الموسم الجاف). الميزانية: ~50-150$/يوم.",
    aiResponseFamily: "وجهات عائلية رائعة:\n\n🏖️ المالديف - فيلات فوق الماء، غطس\n🏰 اليابان - طوكيو ديزني لاند، تجارب ثقافية\n🌴 تايلاند - شواطئ، محميات أفيال\n🏔️ سويسرا - قطارات بانورامية، مشي لمسافات\n🦁 كينيا - سفاري عائلي\n\nهل تريد المزيد من التفاصيل؟",
    aiResponseBudget: "أفضل نصائح السفر الاقتصادي:\n\n💡 سافر في الموسم المتوسط (ربيع/خريف)\n💡 احجز الرحلات يوم الثلاثاء\n💡 استخدم النقل المحلي\n💡 أقم في بيوت ضيافة\n💡 كل في الأسواق المحلية\n💡 احصل على بطاقات المدن\n\nوجهات اقتصادية: فيتنام، البرتغال، المكسيك، تايلاند، المغرب.",
    aiResponseEurope: "تخطيط رحلة أوروبا:\n\n🇫🇷 باريس - 3 أيام كحد أدنى\n🇮🇹 روما/فلورنسا - 4 أيام\n🇪🇸 برشلونة - 2-3 أيام\n🇬🇷 سانتوريني - 2-3 أيام\n\n✈️ نصيحة: استخدم شركات طيران اقتصادية بين المدن. احصل على تذكرة يوريل. الميزانية: 60-150€/يوم.",
    aiResponseDefault: "سؤال رائع! أنصح باستكشاف باقاتنا المختارة لأفضل العروض. يمكنك أيضاً زيارة صفحة الوجهات للإلهام.\n\nهل تريد مساعدة في تخطيط رحلة؟ أخبرني:\n• إلى أين تريد الذهاب\n• عدد الأيام\n• ميزانيتك\n• نمط السفر (مغامرة، استرخاء، ثقافة)",
    bannerGetApp: "حمّل تطبيق Tourly", bannerFasterOn: "تجربة أسرع على", bannerOpen: "فتح",
    chatWelcomeBack: "مرحباً بعودتك! 👋 سعيد برؤيتك مجدداً. كيف يمكنني مساعدتك اليوم؟",
    chatNewConvo: "محادثة جديدة! ✨ تم أرشفة المحادثة السابقة. كيف يمكنني المساعدة؟",
    chatFreshConvo: "بدء محادثة جديدة! ✨ بماذا يمكنني مساعدتك؟",
    chatLiveAgent: "وكيل مباشر", chatConnectedTeam: "متصل بفريق الدعم", chatEnd: "إنهاء",
    chatConvoClosed: "تم إغلاق هذه المحادثة", chatStartNew: "بدء محادثة جديدة",
    chatHereToHelp: "نحن هنا للمساعدة — اسألنا أي شيء",
    chatReturnLive: "العودة للدردشة المباشرة", chatActiveConvo: "لديك محادثة نشطة مع الدعم",
    chatConnectAgent: "الدردشة مع وكيل", chatConnectAgentDesc: "تواصل مع فريق الدعم للمساعدة الفورية",
    chatConnectedLive: "متصل بالدعم المباشر", chatAgentRespondSoon: "سيرد وكيل الدعم قريباً.\nاكتب رسالة للبدء.",
    chatEnded: "انتهت الدردشة",
    chatArchivedChat: "دردشة مؤرشفة", chatHistory: "سجل الدردشة", chatClearAll: "مسح الكل", chatDelete: "حذف",
    chatNoArchives: "لا توجد دردشات مؤرشفة", chatLiveAgentChat: "دردشة مع وكيل", chatBotConvo: "محادثة مع البوت",
    chatBackToArchives: "العودة للأرشيف", chatConversations: "محادثات", chatMessages: "رسائل",
    chatTranslate: "ترجمة", chatShowOriginal: "عرض الأصل", chatTranslating: "جاري الترجمة…",
    chatTranslateAll: "ترجمة الكل", chatAutoTranslate: "ترجمة تلقائية",
    chatTranslatedFrom: "مترجم من", chatTranslationFailed: "فشلت الترجمة",
    adminTitle: "لوحة الإدارة", adminDashboardTitle: "لوحة التحكم", adminDashboardSubtitle: "إدارة منصة السفر",
    adminTabDashboard: "لوحة التحكم", adminTabBookings: "الحجوزات", adminTabChat: "الدردشة",
    adminTabDestinations: "الوجهات", adminTabPackages: "الباقات", adminTabUsers: "المستخدمون",
    adminCancel: "إلغاء", adminSave: "حفظ", adminEdit: "تعديل", adminDelete: "حذف", adminSearch: "بحث",
    adminValidation: "التحقق", adminTapUpload: "انقر للتحميل", adminChange: "تغيير", adminRemove: "إزالة",
    adminPermissionNeeded: "إذن مطلوب", adminGrantCameraAccess: "يرجى منح الوصول إلى ألبوم الصور لتحميل الصور.",
    adminTotalBookings: "إجمالي الحجوزات", adminTotalBookingsTrend: "+12% هذا الشهر",
    adminRevenue: "الإيرادات", adminRevenueTrend: "+8% هذا الشهر",
    adminTotalUsers: "إجمالي المستخدمين", adminTotalUsersTrend: "+3 هذا الأسبوع",
    adminDestinations: "الوجهات",
    adminQuickActions: "إجراءات سريعة", adminAddDestination: "إضافة وجهة", adminCreatePackage: "إنشاء باقة",
    adminSendNotification: "إرسال إشعار", adminViewReports: "عرض التقارير",
    adminRecentBookings: "الحجوزات الأخيرة", adminNoBookingsYet: "لا توجد حجوزات بعد",
    adminReports: "التقارير", adminDone: "تم",
    adminBookingStatus: "حالة الحجز", adminConfirmed: "مؤكد", adminPending: "قيد الانتظار", adminCancelled: "ملغي",
    adminMonthlyBookings: "الحجوزات الشهرية (آخر 6 أشهر)", adminTotalPeriod: "إجمالي هذه الفترة",
    adminRevenueLabel: "إيرادات", adminRevenueByPackage: "الإيرادات حسب الباقة", adminNoRevenueYet: "لا توجد بيانات إيرادات",
    adminLatestBookings: "أحدث الحجوزات", adminCustomTrip: "رحلة مخصصة", adminAvgBooking: "متوسط / حجز",
    adminSendTo: "إرسال إلى", adminAllUsers: "جميع المستخدمين", adminSelectUsers: "اختيار مستخدمين",
    adminNotifTitle: "العنوان", adminNotifTitlePlaceholder: "مثال: تخفيضات الصيف — 30% خصم",
    adminNotifMessage: "الرسالة", adminNotifMessagePlaceholder: "رسالة الإشعار...", adminNotifType: "النوع",
    adminTitleMessageRequired: "العنوان والرسالة مطلوبان.", adminSelectAtLeastOne: "يرجى اختيار مستخدم واحد على الأقل.",
    adminSent: "مُرسل", adminNotifSentTo: "تم إرسال الإشعار إلى", adminUsersSelected: "مختارون", adminClear: "مسح",
    adminBookingDetails: "تفاصيل الحجز", adminFullName: "الاسم الكامل", adminEmail: "البريد", adminPhone: "الهاتف",
    adminTravelers: "المسافرون", adminCheckIn: "الوصول", adminCheckOut: "المغادرة", adminDatePlaceholder: "YYYY-MM-DD",
    adminUpdated: "تم التحديث", adminBookingUpdated: "تم تحديث تفاصيل الحجز (عرض محلي).",
    adminAll: "الكل", adminNoBookingsFound: "لم يتم العثور على حجوزات", adminConfirm: "تأكيد", adminPax: "شخص", adminNA: "غ/م",
    adminEditDestination: "تعديل الوجهة", adminAddDestinationTitle: "إضافة وجهة",
    adminCoverImage: "صورة الغلاف", adminName: "الاسم", adminNamePlaceholder: "مثال: سانتوريني",
    adminCountry: "البلد", adminCountryPlaceholder: "مثال: اليونان", adminRating: "التقييم (1-5)",
    adminDescription: "الوصف", adminDescPlaceholder: "وصف قصير...",
    adminSearchDestinations: "بحث في الوجهات...", adminAddNewDestination: "إضافة وجهة جديدة",
    adminDeleteDestination: "حذف الوجهة", adminDeleteConfirm: "هل أنت متأكد من حذف",
    adminNameCountryRequired: "الاسم والبلد مطلوبان.",
    adminEditPackage: "تعديل الباقة", adminAddPackageTitle: "إضافة باقة",
    adminPackageImage: "صورة الباقة", adminPackageTitle: "العنوان", adminTitlePlaceholder: "مثال: عطلة شاطئية",
    adminLocation: "الموقع", adminLocationPlaceholder: "مثال: ماليزيا",
    adminDuration: "المدة", adminDurationPlaceholder: "مثال: 7 أيام/6 ليالٍ", adminMaxPax: "الحد الأقصى",
    adminPrice: "السعر ($)", adminPricePlaceholder: "مثال: 750",
    adminPackageDescPlaceholder: "وصف الباقة...", adminSearchPackages: "بحث في الباقات...",
    adminAddNewPackage: "إضافة باقة جديدة", adminDeletePackage: "حذف الباقة",
    adminTitleLocationPriceRequired: "العنوان والموقع والسعر مطلوبة.", adminReviews: "تقييمات",
    adminEditUser: "تعديل المستخدم", adminAvatar: "الصورة الرمزية", adminRole: "الدور",
    adminSearchUsers: "بحث في المستخدمين...", adminActive: "نشط", adminSuspended: "موقوف", adminAdmins: "مديرون",
    adminJoined: "انضم", adminBookingsCount: "حجوزات",
    adminPromote: "ترقية", adminDemote: "تخفيض", adminSuspend: "إيقاف", adminActivate: "تفعيل",
    adminNameEmailRequired: "الاسم والبريد مطلوبان.",
    adminConversations: "المحادثات", adminLive: "مباشر", adminNoConvoYet: "لا توجد محادثات بعد",
    adminNoConvoDesc: "عندما يبدأ المستخدمون الدردشة المباشرة،\nستظهر محادثاتهم هنا.",
    adminNoMessages: "لا توجد رسائل", adminReopen: "إعادة فتح", adminClose: "إغلاق",
    adminConvoClosed: "تم إغلاق المحادثة", adminTypeReply: "اكتب رداً...",
    adminYou: "أنت: ", adminClosed: "مغلق", adminUnread: "غير مقروءة",
  },

  // ─────────────────────────── German ───────────────────────────
  de: {
    tabHome: "Startseite", tabExplore: "Entdecken", tabTrips: "Reisen", tabSaved: "Gespeichert", tabGallery: "Galerie",
    heroTitle: "Reise zum\nEntdecken der Welt", heroSubtitle: "Entdecken Sie erstaunliche Reiseziele und schaffen Sie unvergessliche Erinnerungen mit Tourly",
    learnMore: "Mehr Erfahren", bookNow: "Jetzt Buchen", contactUs: "Kontakt",
    findYourTrip: "Finden Sie Ihre Reise", enterDestination: "Reiseziel Eingeben", numberOfTravelers: "Anzahl der Reisenden",
    inquireNow: "Jetzt Anfragen", popularDestinations: "Beliebte Reiseziele", checkoutPackages: "Unsere Pakete",
    viewAll: "Alle Anzeigen →", dealsTitle: "Angebote & Flash Sales 🔥", dealsSubtitle: "Bis zu 30% Rabatt",
    save: "Speichern", saved: "Gespeichert", share: "Teilen", back: "Zurück", search: "Suche",
    searchPlaceholder: "Reiseziele, Pakete suchen...", noResults: "Keine Ergebnisse",
    filterAll: "Alle", filterDestinations: "Reiseziele", filterPackages: "Pakete",
    sortBy: "Sortieren", sortDefault: "Standard", sortNameAZ: "Name: A–Z", sortRelevance: "Relevanz", sortPriceLow: "Preis: Niedrig → Hoch", sortPriceHigh: "Preis: Hoch → Niedrig", sortRating: "Bestbewertet",
    priceRange: "Preis", resultsFound: "Ergebnisse", searchTourly: "Tourly durchsuchen",
    searchHint: "Finden Sie Ihr perfektes Reiseziel oder Reisepaket", tryDifferent: "Versuchen Sie andere Suchbegriffe oder passen Sie die Filter an",
    clearFilters: "Filter Löschen",
    bookThisDestination: "Dieses Reiseziel Buchen", aboutDestination: "Über dieses Reiseziel",
    whatToExpect: "Was Sie Erwartet", whatsIncluded: "Was Enthalten Ist", sampleItinerary: "Beispiel-Reiseplan",
    bookingTitle: "Reise Buchen", fullName: "Vollständiger Name", email: "E-Mail", phone: "Telefon",
    travelers: "Reisende", checkIn: "Check-in Datum", checkOut: "Check-out Datum",
    submitBooking: "Buchung Absenden", bookingSuccess: "Buchung erfolgreich eingereicht!",
    notificationsTitle: "Benachrichtigungen", markAllRead: "Alle als gelesen markieren", noNotifications: "Keine Benachrichtigungen",
    profileTitle: "Mein Profil", myBookings: "Meine Buchungen", settings: "Einstellungen", aboutUs: "Über Uns",
    settingsTitle: "Einstellungen", darkMode: "Dunkelmodus", language: "Sprache", currency: "Währung",
    pushNotifications: "Push-Benachrichtigungen", emailNotifications: "E-Mail-Benachrichtigungen",
    myWishlist: "Meine Wunschliste", savedPlaces: "Gespeicherte Orte", nothingSaved: "Noch nichts gespeichert",
    nothingSavedHint: "Tippen Sie auf das Herz bei einem Reiseziel oder Paket, um es hier zu speichern.",
    exploreDestinations: "Reiseziele Entdecken", photoGallery: "Fotogalerie", photosFromTravellers: "Fotos von Reisenden",
    chatTitle: "Live-Support", chatPlaceholder: "Nachricht eingeben...", chatSend: "Senden",
    chatWelcome: "👋 Hallo! Willkommen bei Tourly. Wie können wir Ihnen helfen?",
    chatHello: "Hallo! Ich bin Ihr Tourly-Reiseassistent. Fragen Sie mich alles über Reiseziele, Pakete oder Buchungen!",
    personalInfo: "Persönliche Daten", tripDetails: "Reisedetails",
    selectedPackage: "Ausgewähltes Paket", destinationLabel: "Reiseziel",
    whereToGo: "Wohin möchten Sie reisen?", preferredCheckIn: "Bevorzugtes Check-in Datum",
    preferredCheckOut: "Bevorzugtes Check-out Datum", specialRequests: "Sonderwünsche",
    specialRequestsPlaceholder: "Besondere Anforderungen?", submitBookingRequest: "Buchungsanfrage Absenden",
    validationNameRequired: "Name ist erforderlich", validationEmailRequired: "E-Mail ist erforderlich",
    validationEmailInvalid: "Bitte geben Sie eine gültige E-Mail ein", validationPhoneRequired: "Telefonnummer ist erforderlich",
    aboutPageTitle: "Über Uns", whoWeAre: "Wer Wir Sind", trustedTravelPartner: "Ihr Vertrauenswürdiger Reisepartner",
    whyChooseUs: "Warum Uns Wählen", whatMakesDifferent: "Was Uns Unterscheidet",
    ourMission: "Unsere Mission", happyTravelers: "Zufriedene Reisende", tourPackages: "Reisepakete", supportUs: "Support",
    getInTouch: "Kontakt Aufnehmen", feelFreeContact: "Kontaktieren Sie uns gerne!",
    newsletter: "Newsletter", newsletterSubtitle: "Abonnieren Sie die neuesten Angebote.",
    subscribe: "Abonnieren", enterYourEmail: "E-Mail eingeben", readyForTravel: "Bereit für unvergessliches Reisen?",
    limitedTime: "Zeitlich Begrenzt", flashDeals: "Flash-Angebote 🔥", flashDealsSubtitle: "Sparen Sie bis zu 30% auf unsere Top-Pakete",
    endsIn: "Endet in", bookAt: "Buchen ab", perPersonShort: "/Person",
    packageNotFound: "Paket nicht gefunden", destinationNotFound: "Reiseziel nicht gefunden",
    goBack: "Zurück", aboutThisPackage: "Über dieses Paket",
    maxPax: "Max. Personen", durationLabel: "Dauer", locationLabel: "Standort",
    reviewsLabel: "Bewertungen", topRated: "Bestbewertet", countryLabel: "Land",
    bestTime: "Beste Reisezeit", allYear: "Ganzjährig", groupSizeLabel: "Gruppengröße",
    ratingLabel: "Bewertung",
    uncoverPlace: "Orte Entdecken", popularDestinationsSubtitle: "Entdecken Sie unsere meistbesuchten Reiseziele weltweit",
    popularPackages: "Beliebte Pakete", packagesSubtitle: "Finden Sie das perfekte Reisepaket für Ihr nächstes Abenteuer",
    callToAction: "Kontaktieren Sie Uns", ctaDescription: "Kontaktieren Sie uns noch heute und wir helfen Ihnen, Ihren Traumurlaub zu planen!",
    perPerson: "pro Person",
    defaultUsername: "Reisender", welcomeBack: "Willkommen zurück!",
    countriesLabel: "Länder", noBookingsHint: "Noch keine Buchungen. Buchen Sie ein Paket oder Reiseziel, um es hier zu sehen.",
    browsePackages: "Pakete Durchsuchen", cancelBookingTitle: "Buchung Stornieren",
    cancelBookingMessage: "Ihre Buchung für diese Reise stornieren?", keepIt: "Behalten",
    cancelBookingAction: "Buchung Stornieren", bookedOn: "Gebucht am", cancel: "Abbrechen", ok: "OK",
    customTrip: "Individuelle Reise", travellersCount: "Reisende",
    viewDetails: "Details Anzeigen",
    featureBestPrice: "Bestpreisgarantie",
    featureBestPriceDesc: "Wir bieten die besten Preise für alle unsere Reisepakete ohne versteckte Gebühren.",
    featureHandpicked: "Handverlesene Reiseziele",
    featureHandpickedDesc: "Unsere Experten wählen sorgfältig die schönsten und einzigartigsten Reiseziele aus.",
    featureExpertGuides: "Erfahrene Reiseführer",
    featureExpertGuidesDesc: "Professionelle lokale Reiseführer, die jeden Winkel des Reiseziels kennen.",
    featureFlexibleBooking: "Flexible Buchung",
    featureFlexibleBookingDesc: "Einfacher Buchungsprozess mit flexiblen Stornierungsbedingungen.",
    aboutParagraph1: "Tourly ist ein Premium-Reisebüro, das sich der Schaffung unvergesslicher Reiseerlebnisse widmet. Mit jahrelanger Erfahrung verbinden wir Reisende mit den beeindruckendsten Reisezielen der Welt.",
    aboutParagraph2: "Unser Team von leidenschaftlichen Reiseexperten arbeitet unermüdlich daran, einzigartige Erlebnisse zu schaffen, die über gewöhnlichen Tourismus hinausgehen.",
    missionStatement: "Menschen zu inspirieren und zu befähigen, die Welt zu erkunden, indem wir außergewöhnliche, nachhaltige und erschwingliche Reiseerlebnisse bieten.",
    ctaContactDescription: "Kontaktieren Sie uns heute und wir helfen Ihnen bei der Planung Ihres Traumurlaubs. Unser Team ist rund um die Uhr für Sie da.",
    addressLabel: "Adresse", footerCopyright: "© 2024 Tourly. Alle Rechte vorbehalten",
    datePlaceholder: "JJJJ-MM-TT",
    tagFlashSale: "Blitzangebot", tagWeekendDeal: "Wochenendangebot", tagLimitedOffer: "Begrenztes Angebot",
    timeJustNow: "Gerade", timeMinutesAgo: "Min", timeHoursAgo: "Std", timeDaysAgo: "T",
    unreadNotifications: "ungelesene Benachrichtigungen",
    notifWelcomeTitle: "Willkommen bei Tourly \ud83c\udf0d", notifWelcomeBody: "Entdecken Sie erstaunliche Reiseziele und buchen Sie Ihr n\u00e4chstes Abenteuer.",
    notifSaleTitle: "Sommerangebot \u2014 Bis zu 30% Rabatt", notifSaleBody: "Zeitlich begrenztes Angebot f\u00fcr ausgew\u00e4hlte Pakete. Buchen Sie vor dem 31. M\u00e4rz 2026.",
    notifNewDestTitle: "Neues Reiseziel hinzugef\u00fcgt", notifNewDestBody: "Bali, Indonesien ist jetzt verf\u00fcgbar. Entdecken Sie unsere exklusiven Pakete!",
    destinationDetailDesc: "Erleben Sie die Schönheit und Kultur dieses unglaublichen Reiseziels. Von atemberaubenden Landschaften bis zu reichen lokalen Traditionen wird jeder Moment unvergesslich sein.",
    expectGuidedTours: "Geführte Touren mit lokalen Experten", expectLocalCuisine: "Authentische lokale Küche",
    expectAccommodations: "Komfortable Unterkünfte", expectTransportation: "Transport inklusive", expectSupport: "24/7 Reiseunterstützung",
    inclusionAirfare: "Hin- und Rückflug", inclusionTransfers: "Flughafentransfers",
    inclusionAccommodation: "Unterkunft (4-Sterne-Hotel)", inclusionBreakfast: "Tägliches Frühstück",
    inclusionGuidedTours: "Geführte Touren", inclusionInsurance: "Reiseversicherung", inclusionSupport: "24/7 Support",
    itineraryDay1Title: "Ankunft und Begrüßung", itineraryDay1Desc: "Flughafentransfer, Check-in, Willkommensdinner",
    itineraryDay2Title: "Stadterkundung", itineraryDay2Desc: "Geführte Tour, lokale Märkte, kulturelle Stätten",
    itineraryDay3Title: "Abenteuertag", itineraryDay3Desc: "Outdoor-Aktivitäten, Naturwanderungen",
    itineraryDay4Title: "Kulturerlebnis", itineraryDay4Desc: "Traditionelle Workshops, lokale Küche",
    itineraryDay5Title: "Freier Tag", itineraryDay5Desc: "Optionale Aktivitäten oder Entspannung",
    itineraryDay6Title: "Panorama-Tour", itineraryDay6Desc: "Ausflug zu nahegelegenen Sehenswürdigkeiten",
    itineraryDay7Title: "Abreise", itineraryDay7Desc: "Frühstück, Checkout, Flughafentransfer",
    packageDetailExtended: "Erleben Sie eine unvergessliche Reise mit unserem sorgfältig gestalteten Reisepaket. Jedes Detail wurde für die Reise Ihres Lebens geplant.",
    chatOnlineStatus: "Online · Tourly Support",
    chatReply1: "Vielen Dank für Ihre Kontaktaufnahme! Ein Reiseexperte wird sich bald bei Ihnen melden.",
    chatReply2: "Tolle Frage! Unser Team prüft Ihre Nachricht.",
    chatReply3: "Wir helfen Ihnen gerne bei der Planung Ihrer perfekten Reise! Können Sie uns mehr Details mitteilen?",
    chatReply4: "Unsere Pakete sind vollständig anpassbar. Ich verbinde Sie mit einem Spezialisten.",
    chatReply5: "Für sofortige Hilfe können Sie uns auch unter +01 (123) 4567 90 anrufen.",
    priceAny: "Beliebig", priceUnder500: "< 500", price500to1000: "500 – 700", priceOver1000: "> 700",
    signIn: "Anmelden", signUp: "Registrieren", password: "Passwort", confirmPassword: "Passwort bestätigen",
    forgotPassword: "Passwort vergessen?", dontHaveAccount: "Noch kein Konto?", alreadyHaveAccount: "Bereits ein Konto?",
    orContinueWith: "oder weiter mit", signingIn: "Anmeldung läuft...", signingUp: "Konto wird erstellt...",
    passwordMismatch: "Passwörter stimmen nicht überein", passwordTooShort: "Passwort muss mindestens 8 Zeichen lang sein",
    welcomeTo: "Willkommen bei", createAccount: "Konto Erstellen", signInSubtitle: "Melden Sie sich an, um auf Ihre Buchungen und gespeicherten Reisen zuzugreifen",
    signUpSubtitle: "Treten Sie Tourly bei und planen Sie Ihren Traumurlaub",
    continueWithGoogle: "Weiter mit Google", continueWithApple: "Weiter mit Apple",
    agreeToTerms: "Mit der Registrierung stimmen Sie unseren", termsOfService: "Nutzungsbedingungen", privacyPolicy: "Datenschutzrichtlinie", andText: "und",
    signOut: "Abmelden", signOutConfirm: "Möchten Sie sich wirklich abmelden?",
    // Onboarding
    onboardingTitle1: "Erstaunliche Reiseziele Entdecken", onboardingDesc1: "Erkunden Sie atemberaubende Orte auf der ganzen Welt, ausgewählt für Sie.",
    onboardingTitle2: "Mit Vertrauen Buchen", onboardingDesc2: "Flexible Buchung, Bestpreisgarantie und 24/7-Support.",
    onboardingTitle3: "Belohnungen beim Reisen Verdienen", onboardingDesc3: "Sammeln Sie Punkte bei jeder Reise und schalten Sie exklusive Vorteile frei.",
    getStarted: "Loslegen", next: "Weiter", skip: "Überspringen",
    // Premium
    premiumTitle: "Tourly Pro", premiumSubtitle: "Das ultimative Reiseerlebnis freischalten",
    premiumProTitle: "Pro", premiumEliteTitle: "Elite",
    premiumPerMonth: "/Monat", premiumPerYear: "/Jahr", premiumSavePercent: "Sparen",
    premiumSubscribe: "Jetzt Abonnieren", premiumRestore: "Kauf Wiederherstellen", premiumCurrentPlan: "Aktueller Plan", premiumFreePlan: "Kostenlos",
    premiumFeatureDeals: "Exklusive Angebote und Frühzugang", premiumFeatureSupport: "Prioritäts-Kundensupport",
    premiumFeatureCancellation: "Kostenlose Stornierung aller Buchungen", premiumFeatureAI: "KI-gestützter Reiseplaner",
    premiumFeatureAdFree: "Werbefreies Erlebnis", premiumFeatureConcierge: "Persönlicher Concierge-Service",
    premiumFeatureLounge: "Zugang zu Flughafen-Lounges", premiumFeatureDoublePoints: "2× Treuepunkte",
    premiumMostPopular: "Am Beliebtesten", premiumBestValue: "Bestes Preis-Leistung",
    // Loyalty
    loyaltyTitle: "Belohnungen", loyaltyPoints: "Punkte", loyaltyTier: "Stufe",
    loyaltyExplorer: "Entdecker", loyaltyAdventurer: "Abenteurer", loyaltyGlobetrotter: "Globetrotter",
    loyaltyEarnPoints: "Punkte Sammeln", loyaltyRedeemPoints: "Punkte Einlösen", loyaltyHistory: "Verlauf",
    loyaltyNextTier: "Nächste Stufe", loyaltyPointsToNext: "Punkte bis zur nächsten Stufe",
    loyaltyReferralBonus: "Empfehlungsbonus", loyaltyBookingPoints: "Buchungspunkte", loyaltyReviewPoints: "Bewertungspunkte",
    // Referral
    referralTitle: "Freund Empfehlen", referralSubtitle: "Teile Tourly und verdiene 500 Punkte pro Empfehlung",
    referralCode: "Dein Empfehlungscode", referralCopyCode: "Code Kopieren", referralCopied: "Kopiert!",
    referralShareText: "Komm zu Tourly! Nutze meinen Code für einen Bonus: ",
    referralFriendsJoined: "Beigetretene Freunde", referralHowItWorks: "So Funktioniert's",
    referralStep1: "Teile deinen einzigartigen Code mit Freunden",
    referralStep2: "Sie melden sich an und buchen ihre erste Reise",
    referralStep3: "Ihr beide verdient 500 Bonuspunkte!",
    // Reviews
    reviewsTitle: "Bewertungen", writeReview: "Bewertung Schreiben", submitReview: "Bewertung Senden",
    reviewPlaceholder: "Teile deine Erfahrung...", noReviewsYet: "Noch keine Bewertungen",
    beFirstReview: "Sei der Erste mit einer Bewertung!", ratingRequired: "Bitte wähle eine Bewertung",
    reviewSubmitted: "Bewertung gesendet!", averageRating: "Durchschnittsbewertung",
    // AI Assistant
    aiAssistantTitle: "KI-Reiseplaner", aiAssistantSubtitle: "Plane deine perfekte Reise mit KI",
    aiPlaceholder: "Frag mich alles über Reisen...",
    aiWelcomeMessage: "Hallo! Ich bin dein KI-Reiseassistent. Ich kann dir bei der Reiseplanung helfen, Reiseziele vorschlagen, Reisepläne erstellen und mehr. Was möchtest du erkunden?",
    aiSuggestion1: "5-tägige Reise nach Bali planen", aiSuggestion2: "Beste Reiseziele für Familien", aiSuggestion3: "Budget-Reisetipps für Europa",
    aiProFeature: "Upgrade auf Pro für unbegrenzte KI-Planung",
    // Travel Extras
    extrasTitle: "Reise Aufwerten", extrasSubtitle: "Extras hinzufügen für eine noch bessere Reise",
    extrasTransfer: "Flughafentransfer", extrasTransferDesc: "Privater Abholungs- und Bringservice",
    extrasInsurance: "Reiseversicherung", extrasInsuranceDesc: "Umfassender Schutz für Ihre Reise",
    extrasSim: "eSIM-Datenplan", extrasSimDesc: "Bleiben Sie mit unbegrenzten Daten verbunden",
    extrasLounge: "Flughafen-Lounge", extrasLoungeDesc: "Entspannen Sie sich vor Ihrem Flug",
    addToBooking: "Zur Buchung Hinzufügen", skipExtras: "Überspringen, Weiter zur Bestätigung",
    // Featured
    featuredBadge: "Empfohlen", sponsoredBadge: "Gesponsert", trendingBadge: "Im Trend",
    // Landing page
    landingBrand: "Tourly", landingHeroBadge: "#1 KI-gestützte Reise-App",
    landingHeroTitle: "Entdecke Die\nWelt Mit\nTourly", landingHeroSubtitle: "Entdecken Sie atemberaubende Reiseziele, kuratierte Pakete und KI-gestützte Reiseplanung — alles in einer App.",
    landingCTA: "Jetzt Starten",
    landingStatTrips: "50K+", landingStatTripsLabel: "Gebuchte Reisen", landingStatDest: "120+", landingStatDestLabel: "Reiseziele", landingStatRating: "4.9", landingStatRatingLabel: "App-Bewertung",
    landingWhyEyebrow: "Warum Tourly", landingWhyTitle: "Reise Smarter,\nNicht Schwerer", landingWhySubtitle: "Alles was Sie für die perfekte Reise brauchen, angetrieben von moderner Technologie und lokaler Expertise.",
    landingFeatureAI: "KI-Reiseplaner", landingFeatureAIDesc: "Erhalten Sie personalisierte Reisepläne von fortschrittlicher KI basierend auf Ihren Vorlieben und Budget.",
    landingFeatureDest: "50+ Reiseziele", landingFeatureDestDesc: "Erkunden Sie kuratierte Reiseziele auf 6 Kontinenten, von versteckten Juwelen bis zu ikonischen Wahrzeichen.",
    landingFeatureSecure: "Sichere Buchung", landingFeatureSecureDesc: "Ende-zu-Ende-verschlüsselte Zahlungen mit flexibler Stornierung und vollständigem Rückerstattungsschutz.",
    landingFeatureConcierge: "24/7 Concierge", landingFeatureConciergeDesc: "Echtzeit-Support von lokalen Experten, die jeden Winkel Ihres Reiseziels kennen.",
    landingTrendingEyebrow: "Im Trend", landingTrendingTitle: "Beliebte Reiseziele",
    landingCuratedEyebrow: "Für Sie Kuratiert", landingCuratedTitle: "Reisepakete",
    landingTestimonialsEyebrow: "Bewertungen", landingTestimonialsTitle: "Von Reisenden Geliebt",
    landingTestimonial1Name: "Sarah Mitchell", landingTestimonial1Location: "New York, USA",
    landingTestimonial1Quote: "Tourly hat die Planung unserer Flitterwochen mühelos gemacht. Die KI schlug Orte vor, die wir nie gefunden hätten!",
    landingTestimonial2Name: "Kenji Tanaka", landingTestimonial2Location: "Tokio, Japan",
    landingTestimonial2Quote: "Der Concierge-Service war unglaublich. Es fühlte sich an, als hätte man in jeder Stadt einen einheimischen Freund.",
    landingTestimonial3Name: "Amara Osei", landingTestimonial3Location: "Accra, Ghana",
    landingTestimonial3Quote: "Beste Reise-App die ich je benutzt habe. Die Angebote sind echt und der Buchungsprozess ist nahtlos.",
    landingReadyCTA: "Bereit für Ihr Nächstes Abenteuer?", landingReadyDesc: "Schließen Sie sich über 50.000 Reisenden an, die mit Tourly planen und buchen. Erstellen Sie heute Ihr kostenloses Konto.",
    landingCreateAccount: "Kostenloses Konto Erstellen",
    landingFooterTagline: "Reisen seit 2024 zugänglich, personalisiert und unvergesslich machen.",
    landingFooterAbout: "Über Uns", landingFooterContact: "Kontakt", landingFooterDeals: "Angebote",
    landingFooterCopyright: "© 2024–2026 Tourly. Alle Rechte vorbehalten.",
    landingExplore: "Entdecken",
    // Download page
    downloadTitle: "App Herunterladen",
    downloadHeroSubtitle: "Ihr Reisebegleiter für die Tasche.\nEntdecken, buchen und los — alles aus einer App.",
    downloadOnThe: "Laden im", downloadGetItOn: "Jetzt bei", downloadAppStore: "App Store", downloadGooglePlay: "Google Play",
    downloadStatRating: "4.9", downloadStatRatingLabel: "App-Bewertung", downloadStatDownloads: "500K+", downloadStatDownloadsLabel: "Downloads",
    downloadStatDest: "100+", downloadStatDestLabel: "Reiseziele", downloadStatSupport: "24/7", downloadStatSupportLabel: "Support",
    downloadExclusiveEyebrow: "App Exklusiv", downloadWhyTitle: "Warum Tourly Herunterladen?", downloadWhySubtitle: "Die App schaltet Funktionen frei, die im Browser nicht verfügbar sind.",
    downloadFeatureFast: "Blitzschnell", downloadFeatureFastDesc: "Native Leistung, die flüssiger ist als jede Browser-Erfahrung.",
    downloadFeatureNotif: "Push-Benachrichtigungen", downloadFeatureNotifDesc: "Verpassen Sie kein Angebot — erhalten Sie sofortige Benachrichtigungen über Flash-Sales.",
    downloadFeatureOffline: "Offline-Zugang", downloadFeatureOfflineDesc: "Speichern Sie Reisepläne und Karten für unterwegs ohne Internet.",
    downloadFeatureOneTap: "Ein-Tipp-Buchung", downloadFeatureOneTapDesc: "Buchen Sie in Sekunden mit gespeicherten Zahlungs- und Reisedaten.",
    downloadFeatureAI: "KI-Reiseplaner", downloadFeatureAIDesc: "Personalisierte Reisevorschläge powered by KI, direkt integriert.",
    downloadFeatureSecure: "Sicher & Privat", downloadFeatureSecureDesc: "Biometrische Anmeldung und verschlüsselte Daten schützen Ihre Informationen.",
    downloadReviewsEyebrow: "Von Reisenden Geliebt", downloadReviewsTitle: "Was Nutzer Sagen",
    downloadReview1Name: "Sarah M.", downloadReview1Text: "Beste Reise-App! Habe meine Bali-Reise in unter 2 Minuten gebucht.",
    downloadReview2Name: "James K.", downloadReview2Text: "Die Offline-Karten haben mich im ländlichen Japan gerettet. Ein absoluter Gamechanger.",
    downloadReview3Name: "Aisha R.", downloadReview3Text: "Push-Benachrichtigungen fingen einen 40% Flash-Sale ab. 300$ bei meiner Reise gespart!",
    downloadCompareTitle: "App vs. Browser", downloadCompareApp: "App", downloadCompareWeb: "Web",
    downloadComparePush: "Push-Benachrichtigungen", downloadCompareOffline: "Offline-Zugang", downloadCompareBiometric: "Biometrische Anmeldung",
    downloadCompareOneTap: "Ein-Tipp-Buchung", downloadCompareAI: "KI-Reiseplaner", downloadCompareBrowse: "Reiseziele Durchsuchen",
    downloadBottomCTATitle: "Bereit Smarter zu Reisen?", downloadBottomCTADesc: "Laden Sie Tourly kostenlos auf iOS und Android herunter.",
    downloadPlatformIOS: "iOS", downloadPlatformAndroid: "Android",
    authError: "Fehler", authInvalidCredentials: "Ungültige Anmeldedaten",
    authSignInFailed: "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.", authSignUpFailed: "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    authOAuthFailed: "OAuth-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.", authGoogle: "Google", authApple: "Apple",
    getTheApp: "App Herunterladen", adminPanel: "Admin-Panel", adminPanelDesc: "Buchungen, Benutzer und Reiseziele verwalten",
    tierElite: "Elite", tierPro: "Pro", aiLabel: "KI",
    premiumNoPurchases: "Keine früheren Käufe gefunden.",
    thankYou: "Danke!", shareDestination: "Entdecken Sie dieses Reiseziel auf Tourly!", sharePackage: "Entdecken Sie dieses Paket auf Tourly!",
    shareVia: "Teilen über", shareWhatsApp: "WhatsApp", shareTwitter: "X (Twitter)", shareFacebook: "Facebook", shareTelegram: "Telegram", shareEmail: "E-Mail", shareSMS: "SMS", shareCopyLink: "Link kopieren", shareLinkCopied: "Link in die Zwischenablage kopiert!", shareMoreOptions: "Weitere Optionen",
    aiResponseBali: "Bali ist eine fantastische Wahl! Hier ist ein 5-Tage-Reiseplan:\n\n📍 Tag 1: Ankunft, Seminyak Beach erkunden\n📍 Tag 2: Ubud-Reisterrassen & Affenwald\n📍 Tag 3: Uluwatu-Tempel & Kecak-Tanz\n📍 Tag 4: Nusa Penida Tagesausflug\n📍 Tag 5: Spa-Tag & Abreise\n\nBeste Reisezeit: April-Oktober (Trockenzeit). Budget: ~50-150$/Tag je nach Komfort.",
    aiResponseFamily: "Tolle Familienziele:\n\n🏖️ Malediven - Überwasservillen, Schnorcheln\n🏰 Japan - Tokyo Disneyland, Kulturerlebnisse\n🌴 Thailand - Strände, Elefantenschutzgebiete\n🏔️ Schweiz - Panoramazüge, Wandern\n🦁 Kenia - Familiensafaris\n\nMöchten Sie mehr Details?",
    aiResponseBudget: "Top Budget-Reisetipps:\n\n💡 In der Nebensaison reisen\n💡 Flüge dienstags buchen\n💡 Lokale Verkehrsmittel nutzen\n💡 In Gästehäusern übernachten\n💡 Auf lokalen Märkten essen\n💡 City-Pässe kaufen\n\nGünstige Ziele: Vietnam, Portugal, Mexiko, Thailand, Marokko.",
    aiResponseEurope: "Europa-Reiseplanung:\n\n🇫🇷 Paris - mindestens 3 Tage\n🇮🇹 Rom/Florenz - 4 Tage\n🇪🇸 Barcelona - 2-3 Tage\n🇬🇷 Santorini - 2-3 Tage\n\n✈️ Tipp: Budget-Airlines zwischen Städten nutzen. Eurail-Pass für längere Reisen. Budget: 60-150€/Tag.",
    aiResponseDefault: "Tolle Frage! Ich empfehle unsere kuratierten Pakete für die besten Angebote. Schauen Sie auch auf unserer Reiseziele-Seite vorbei.\n\nSoll ich eine Reise planen? Sagen Sie mir:\n• Wohin Sie möchten\n• Wie viele Tage\n• Ihr Budget\n• Reisestil (Abenteuer, Entspannung, Kultur)",
    bannerGetApp: "Tourly App Holen", bannerFasterOn: "Schnellere Erfahrung auf", bannerOpen: "Öffnen",
    chatWelcomeBack: "Willkommen zurück! 👋 Schön Sie wiederzusehen. Wie kann ich Ihnen helfen?",
    chatNewConvo: "Neue Unterhaltung! ✨ Vorheriger Chat wurde archiviert. Wie kann ich helfen?",
    chatFreshConvo: "Frische Unterhaltung! ✨ Wie kann ich Ihnen helfen?",
    chatLiveAgent: "Live-Agent", chatConnectedTeam: "Mit Support-Team verbunden", chatEnd: "Beenden",
    chatConvoClosed: "Diese Unterhaltung wurde geschlossen", chatStartNew: "Neue Unterhaltung starten",
    chatHereToHelp: "Wir sind hier um zu helfen — fragen Sie uns alles",
    chatReturnLive: "Zurück zum Live-Chat", chatActiveConvo: "Sie haben eine aktive Unterhaltung mit dem Support",
    chatConnectAgent: "Mit Agent Chatten", chatConnectAgentDesc: "Verbinden Sie sich mit unserem Support-Team für Echtzeit-Hilfe",
    chatConnectedLive: "Mit Live-Support Verbunden", chatAgentRespondSoon: "Ein Support-Agent wird in Kürze antworten.\nSchreiben Sie eine Nachricht um zu beginnen.",
    chatEnded: "Chat beendet",
    chatArchivedChat: "Archivierter Chat", chatHistory: "Chat-Verlauf", chatClearAll: "Alle Löschen", chatDelete: "Löschen",
    chatNoArchives: "Keine archivierten Chats", chatLiveAgentChat: "Live-Agent-Chat", chatBotConvo: "Bot-Unterhaltung",
    chatBackToArchives: "Zurück zu Archiven", chatConversations: "Unterhaltungen", chatMessages: "Nachrichten",
    chatTranslate: "Übersetzen", chatShowOriginal: "Original anzeigen", chatTranslating: "Übersetze…",
    chatTranslateAll: "Alle übersetzen", chatAutoTranslate: "Auto-Übersetzen",
    chatTranslatedFrom: "Übersetzt aus", chatTranslationFailed: "Übersetzung fehlgeschlagen",
    adminTitle: "Admin-Panel", adminDashboardTitle: "Admin-Dashboard", adminDashboardSubtitle: "Verwalten Sie Ihre Reiseplattform",
    adminTabDashboard: "Dashboard", adminTabBookings: "Buchungen", adminTabChat: "Chat",
    adminTabDestinations: "Reiseziele", adminTabPackages: "Pakete", adminTabUsers: "Benutzer",
    adminCancel: "Abbrechen", adminSave: "Speichern", adminEdit: "Bearbeiten", adminDelete: "Löschen", adminSearch: "Suchen",
    adminValidation: "Validierung", adminTapUpload: "Tippen zum Hochladen", adminChange: "Ändern", adminRemove: "Entfernen",
    adminPermissionNeeded: "Berechtigung erforderlich", adminGrantCameraAccess: "Bitte gewähren Sie Zugriff auf die Kamerarolle zum Hochladen von Bildern.",
    adminTotalBookings: "Gesamtbuchungen", adminTotalBookingsTrend: "+12% diesen Monat",
    adminRevenue: "Umsatz", adminRevenueTrend: "+8% diesen Monat",
    adminTotalUsers: "Gesamtbenutzer", adminTotalUsersTrend: "+3 diese Woche",
    adminDestinations: "Reiseziele",
    adminQuickActions: "Schnellaktionen", adminAddDestination: "Reiseziel Hinzufügen", adminCreatePackage: "Paket Erstellen",
    adminSendNotification: "Benachrichtigung Senden", adminViewReports: "Berichte Anzeigen",
    adminRecentBookings: "Neueste Buchungen", adminNoBookingsYet: "Noch keine Buchungen",
    adminReports: "Berichte", adminDone: "Fertig",
    adminBookingStatus: "Buchungsstatus", adminConfirmed: "Bestätigt", adminPending: "Ausstehend", adminCancelled: "Storniert",
    adminMonthlyBookings: "Monatliche Buchungen (Letzte 6 Monate)", adminTotalPeriod: "Gesamt diesen Zeitraum",
    adminRevenueLabel: "Umsatz", adminRevenueByPackage: "Umsatz nach Paket", adminNoRevenueYet: "Noch keine Umsatzdaten",
    adminLatestBookings: "Neueste Buchungen", adminCustomTrip: "Individuelle Reise", adminAvgBooking: "Durchschn. / Buchung",
    adminSendTo: "Senden An", adminAllUsers: "Alle Benutzer", adminSelectUsers: "Benutzer Auswählen",
    adminNotifTitle: "Titel", adminNotifTitlePlaceholder: "z.B. Sommerschlussverkauf — 30% Rabatt",
    adminNotifMessage: "Nachricht", adminNotifMessagePlaceholder: "Benachrichtigungsnachricht...", adminNotifType: "Typ",
    adminTitleMessageRequired: "Titel und Nachricht sind erforderlich.", adminSelectAtLeastOne: "Bitte wählen Sie mindestens einen Benutzer.",
    adminSent: "Gesendet", adminNotifSentTo: "Benachrichtigung gesendet an", adminUsersSelected: "ausgewählt", adminClear: "Löschen",
    adminBookingDetails: "Buchungsdetails", adminFullName: "Vollständiger Name", adminEmail: "E-Mail", adminPhone: "Telefon",
    adminTravelers: "Reisende", adminCheckIn: "Check-in", adminCheckOut: "Check-out", adminDatePlaceholder: "JJJJ-MM-TT",
    adminUpdated: "Aktualisiert", adminBookingUpdated: "Buchungsdetails aktualisiert (lokale Demo).",
    adminAll: "Alle", adminNoBookingsFound: "Keine Buchungen gefunden", adminConfirm: "Bestätigen", adminPax: "Pers.", adminNA: "k.A.",
    adminEditDestination: "Reiseziel Bearbeiten", adminAddDestinationTitle: "Reiseziel Hinzufügen",
    adminCoverImage: "Titelbild", adminName: "Name", adminNamePlaceholder: "z.B. Santorini",
    adminCountry: "Land", adminCountryPlaceholder: "z.B. Griechenland", adminRating: "Bewertung (1-5)",
    adminDescription: "Beschreibung", adminDescPlaceholder: "Kurze Beschreibung...",
    adminSearchDestinations: "Reiseziele suchen...", adminAddNewDestination: "Neues Reiseziel Hinzufügen",
    adminDeleteDestination: "Reiseziel Löschen", adminDeleteConfirm: "Möchten Sie wirklich löschen",
    adminNameCountryRequired: "Name und Land sind erforderlich.",
    adminEditPackage: "Paket Bearbeiten", adminAddPackageTitle: "Paket Hinzufügen",
    adminPackageImage: "Paketbild", adminPackageTitle: "Titel", adminTitlePlaceholder: "z.B. Strandurlaub",
    adminLocation: "Ort", adminLocationPlaceholder: "z.B. Malaysia",
    adminDuration: "Dauer", adminDurationPlaceholder: "z.B. 7T/6N", adminMaxPax: "Max. Pers.",
    adminPrice: "Preis ($)", adminPricePlaceholder: "z.B. 750",
    adminPackageDescPlaceholder: "Paketbeschreibung...", adminSearchPackages: "Pakete suchen...",
    adminAddNewPackage: "Neues Paket Hinzufügen", adminDeletePackage: "Paket Löschen",
    adminTitleLocationPriceRequired: "Titel, Ort und Preis sind erforderlich.", adminReviews: "Bewertungen",
    adminEditUser: "Benutzer Bearbeiten", adminAvatar: "Avatar", adminRole: "Rolle",
    adminSearchUsers: "Benutzer suchen...", adminActive: "Aktiv", adminSuspended: "Gesperrt", adminAdmins: "Admins",
    adminJoined: "Beigetreten", adminBookingsCount: "Buchungen",
    adminPromote: "Befördern", adminDemote: "Herabstufen", adminSuspend: "Sperren", adminActivate: "Aktivieren",
    adminNameEmailRequired: "Name und E-Mail sind erforderlich.",
    adminConversations: "Unterhaltungen", adminLive: "Live", adminNoConvoYet: "Noch keine Unterhaltungen",
    adminNoConvoDesc: "Wenn Benutzer den Live-Chat starten,\nerscheinen ihre Unterhaltungen hier.",
    adminNoMessages: "Keine Nachrichten", adminReopen: "Wiedereröffnen", adminClose: "Schließen",
    adminConvoClosed: "Unterhaltung geschlossen", adminTypeReply: "Antwort eingeben...",
    adminYou: "Sie: ", adminClosed: "Geschlossen", adminUnread: "ungelesen",
  },

  // ─────────────────────────── Italian ───────────────────────────
  it: {
    tabHome: "Home", tabExplore: "Esplora", tabTrips: "Viaggi", tabSaved: "Salvati", tabGallery: "Galleria",
    heroTitle: "Viaggia per\nEsplorare il Mondo", heroSubtitle: "Scopri destinazioni incredibili e crea ricordi indimenticabili con Tourly",
    learnMore: "Scopri di Più", bookNow: "Prenota Ora", contactUs: "Contattaci",
    findYourTrip: "Trova il Tuo Viaggio", enterDestination: "Inserisci Destinazione", numberOfTravelers: "Numero di Viaggiatori",
    inquireNow: "Richiedi Ora", popularDestinations: "Destinazioni Popolari", checkoutPackages: "I Nostri Pacchetti",
    viewAll: "Vedi Tutto →", dealsTitle: "Offerte e Flash Sales 🔥", dealsSubtitle: "Fino al 30% di sconto",
    save: "Salva", saved: "Salvato", share: "Condividi", back: "Indietro", search: "Cerca",
    searchPlaceholder: "Cerca destinazioni, pacchetti...", noResults: "Nessun risultato",
    filterAll: "Tutti", filterDestinations: "Destinazioni", filterPackages: "Pacchetti",
    sortBy: "Ordina", sortDefault: "Predefinito", sortNameAZ: "Nome: A–Z", sortRelevance: "Rilevanza", sortPriceLow: "Prezzo: Basso → Alto", sortPriceHigh: "Prezzo: Alto → Basso", sortRating: "Più Votati",
    priceRange: "Prezzo", resultsFound: "risultati", searchTourly: "Cerca su Tourly",
    searchHint: "Trova la tua destinazione o pacchetto viaggio perfetto", tryDifferent: "Prova un termine diverso o regola i filtri",
    clearFilters: "Cancella Filtri",
    bookThisDestination: "Prenota questa Destinazione", aboutDestination: "Su questa Destinazione",
    whatToExpect: "Cosa Aspettarsi", whatsIncluded: "Cosa è Incluso", sampleItinerary: "Itinerario di Esempio",
    bookingTitle: "Prenota il Viaggio", fullName: "Nome Completo", email: "Email", phone: "Telefono",
    travelers: "Viaggiatori", checkIn: "Data di Arrivo", checkOut: "Data di Partenza",
    submitBooking: "Invia Prenotazione", bookingSuccess: "Prenotazione inviata con successo!",
    notificationsTitle: "Notifiche", markAllRead: "Segna tutto come letto", noNotifications: "Nessuna notifica",
    profileTitle: "Il Mio Profilo", myBookings: "Le Mie Prenotazioni", settings: "Impostazioni", aboutUs: "Chi Siamo",
    settingsTitle: "Impostazioni", darkMode: "Modalità Scura", language: "Lingua", currency: "Valuta",
    pushNotifications: "Notifiche Push", emailNotifications: "Notifiche Email",
    myWishlist: "La Mia Lista Desideri", savedPlaces: "Luoghi Salvati", nothingSaved: "Niente salvato ancora",
    nothingSavedHint: "Tocca il cuore su qualsiasi destinazione o pacchetto per salvarlo qui.",
    exploreDestinations: "Esplora Destinazioni", photoGallery: "Galleria Foto", photosFromTravellers: "Foto dei Viaggiatori",
    chatTitle: "Supporto Live", chatPlaceholder: "Scrivi un messaggio...", chatSend: "Invia",
    chatWelcome: "👋 Ciao! Benvenuto su Tourly. Come possiamo aiutarti?",
    chatHello: "Ciao! Sono il tuo assistente di viaggio Tourly. Chiedimi tutto su destinazioni, pacchetti o prenotazioni!",
    personalInfo: "Informazioni Personali", tripDetails: "Dettagli del Viaggio",
    selectedPackage: "Pacchetto Selezionato", destinationLabel: "Destinazione",
    whereToGo: "Dove vuoi andare?", preferredCheckIn: "Data di Arrivo Preferita",
    preferredCheckOut: "Data di Partenza Preferita", specialRequests: "Richieste Speciali",
    specialRequestsPlaceholder: "Requisiti particolari?", submitBookingRequest: "Invia Richiesta di Prenotazione",
    validationNameRequired: "Il nome completo è richiesto", validationEmailRequired: "L'email è richiesta",
    validationEmailInvalid: "Inserisci un'email valida", validationPhoneRequired: "Il telefono è richiesto",
    aboutPageTitle: "Chi Siamo", whoWeAre: "Chi Siamo", trustedTravelPartner: "Il Tuo Partner di Viaggio Fidato",
    whyChooseUs: "Perché Sceglierci", whatMakesDifferent: "Cosa Ci Rende Diversi",
    ourMission: "La Nostra Missione", happyTravelers: "Viaggiatori Felici", tourPackages: "Pacchetti Tour", supportUs: "Supporto",
    getInTouch: "Contattaci", feelFreeContact: "Non esitare a contattarci!",
    newsletter: "Newsletter", newsletterSubtitle: "Iscriviti per le ultime offerte.",
    subscribe: "Iscriviti", enterYourEmail: "Inserisci la tua email", readyForTravel: "Pronto per un Viaggio Indimenticabile?",
    limitedTime: "Tempo Limitato", flashDeals: "Offerte Flash 🔥", flashDealsSubtitle: "Risparmia fino al 30% sui nostri migliori pacchetti",
    endsIn: "Termina tra", bookAt: "Prenota a", perPersonShort: "/persona",
    packageNotFound: "Pacchetto non trovato", destinationNotFound: "Destinazione non trovata",
    goBack: "Indietro", aboutThisPackage: "Su Questo Pacchetto",
    maxPax: "Max Persone", durationLabel: "Durata", locationLabel: "Posizione",
    reviewsLabel: "recensioni", topRated: "Più Votati", countryLabel: "Paese",
    bestTime: "Periodo Migliore", allYear: "Tutto l'Anno", groupSizeLabel: "Dimensione Gruppo",
    ratingLabel: "Valutazione",
    uncoverPlace: "Scopri Luoghi", popularDestinationsSubtitle: "Esplora le nostre destinazioni più visitate nel mondo",
    popularPackages: "Pacchetti Popolari", packagesSubtitle: "Trova il pacchetto viaggio perfetto per la tua prossima avventura",
    callToAction: "Contattaci Ora", ctaDescription: "Contattaci oggi e ti aiuteremo a pianificare la vacanza dei tuoi sogni!",
    perPerson: "a persona",
    defaultUsername: "Viaggiatore", welcomeBack: "Bentornato!",
    countriesLabel: "Paesi", noBookingsHint: "Ancora nessuna prenotazione. Prenota un pacchetto o una destinazione per vederlo qui.",
    browsePackages: "Sfoglia Pacchetti", cancelBookingTitle: "Cancella Prenotazione",
    cancelBookingMessage: "Cancellare la prenotazione per questo viaggio?", keepIt: "Mantieni",
    cancelBookingAction: "Cancella Prenotazione", bookedOn: "Prenotato il", cancel: "Annulla", ok: "OK",
    customTrip: "Viaggio Personalizzato", travellersCount: "viaggiatori",
    viewDetails: "Vedi Dettagli",
    featureBestPrice: "Garanzia Miglior Prezzo",
    featureBestPriceDesc: "Offriamo i migliori prezzi per tutti i nostri pacchetti viaggio senza costi nascosti.",
    featureHandpicked: "Destinazioni Selezionate",
    featureHandpickedDesc: "I nostri esperti selezionano attentamente le destinazioni più belle e uniche.",
    featureExpertGuides: "Guide Esperte",
    featureExpertGuidesDesc: "Guide locali professionali che conoscono ogni angolo della destinazione.",
    featureFlexibleBooking: "Prenotazione Flessibile",
    featureFlexibleBookingDesc: "Processo di prenotazione facile con politiche di cancellazione flessibili.",
    aboutParagraph1: "Tourly è un'agenzia di viaggi premium dedicata alla creazione di esperienze di viaggio indimenticabili. Con anni di esperienza, colleghiamo i viaggiatori alle destinazioni più impressionanti del mondo.",
    aboutParagraph2: "Il nostro team di appassionati esperti di viaggio lavora instancabilmente per creare esperienze uniche che vanno oltre il turismo ordinario.",
    missionStatement: "Ispirare e consentire alle persone di esplorare il mondo fornendo esperienze di viaggio eccezionali, sostenibili e accessibili.",
    ctaContactDescription: "Contattaci oggi e ti aiuteremo a pianificare la tua vacanza da sogno. Il nostro team è pronto ad assisterti 24/7.",
    addressLabel: "Indirizzo", footerCopyright: "© 2024 Tourly. Tutti i diritti riservati",
    datePlaceholder: "AAAA-MM-GG",
    tagFlashSale: "Vendita Flash", tagWeekendDeal: "Offerta Weekend", tagLimitedOffer: "Offerta Limitata",
    timeJustNow: "Ora", timeMinutesAgo: "m", timeHoursAgo: "h", timeDaysAgo: "g",
    unreadNotifications: "notifiche non lette",
    notifWelcomeTitle: "Benvenuto su Tourly \ud83c\udf0d", notifWelcomeBody: "Inizia a esplorare destinazioni incredibili e prenota la tua prossima avventura.",
    notifSaleTitle: "Saldi Estivi \u2014 Fino al 30% di Sconto", notifSaleBody: "Offerta a tempo limitato su pacchetti selezionati. Prenota entro il 31 marzo 2026.",
    notifNewDestTitle: "Nuova Destinazione Aggiunta", notifNewDestBody: "Bali, Indonesia \u00e8 ora disponibile. Scopri i nostri pacchetti esclusivi!",
    destinationDetailDesc: "Vivi la bellezza e la cultura di questa incredibile destinazione. Dai paesaggi mozzafiato alle ricche tradizioni locali, ogni momento sarà indimenticabile.",
    expectGuidedTours: "Tour guidati con esperti locali", expectLocalCuisine: "Esperienze culinarie locali autentiche",
    expectAccommodations: "Alloggi confortevoli", expectTransportation: "Trasporto incluso", expectSupport: "Supporto viaggio 24/7",
    inclusionAirfare: "Volo andata e ritorno", inclusionTransfers: "Trasferimenti aeroporto",
    inclusionAccommodation: "Alloggio (hotel 4 stelle)", inclusionBreakfast: "Colazione giornaliera",
    inclusionGuidedTours: "Tour guidati", inclusionInsurance: "Assicurazione viaggio", inclusionSupport: "Supporto 24/7",
    itineraryDay1Title: "Arrivo e Benvenuto", itineraryDay1Desc: "Trasferimento aeroporto, check-in, cena di benvenuto",
    itineraryDay2Title: "Esplorazione della Città", itineraryDay2Desc: "Tour guidato, mercati locali, siti culturali",
    itineraryDay3Title: "Giornata Avventura", itineraryDay3Desc: "Attività all'aperto, escursioni nella natura",
    itineraryDay4Title: "Esperienza Culturale", itineraryDay4Desc: "Workshop tradizionali, cucina locale",
    itineraryDay5Title: "Giornata Libera", itineraryDay5Desc: "Attività opzionali o relax",
    itineraryDay6Title: "Tour Panoramico", itineraryDay6Desc: "Escursione alle attrazioni vicine",
    itineraryDay7Title: "Partenza", itineraryDay7Desc: "Colazione, checkout, trasferimento aeroporto",
    packageDetailExtended: "Vivi un viaggio indimenticabile con il nostro pacchetto viaggio accuratamente progettato. Ogni dettaglio è stato pianificato per il viaggio della tua vita.",
    chatOnlineStatus: "Online · Supporto Tourly",
    chatReply1: "Grazie per averci contattato! Un esperto di viaggi sarà con te a breve.",
    chatReply2: "Ottima domanda! Il nostro team sta esaminando il tuo messaggio.",
    chatReply3: "Ci piacerebbe aiutarti a pianificare il tuo viaggio perfetto! Puoi condividere maggiori dettagli?",
    chatReply4: "I nostri pacchetti sono completamente personalizzabili. Ti metterò in contatto con uno specialista.",
    chatReply5: "Per assistenza immediata puoi anche chiamarci al +01 (123) 4567 90.",
    priceAny: "Qualsiasi", priceUnder500: "< 500", price500to1000: "500 – 700", priceOver1000: "> 700",
    signIn: "Accedi", signUp: "Registrati", password: "Password", confirmPassword: "Conferma Password",
    forgotPassword: "Password dimenticata?", dontHaveAccount: "Non hai un account?", alreadyHaveAccount: "Hai già un account?",
    orContinueWith: "o continua con", signingIn: "Accesso in corso...", signingUp: "Creazione account...",
    passwordMismatch: "Le password non corrispondono", passwordTooShort: "La password deve avere almeno 8 caratteri",
    welcomeTo: "Benvenuto su", createAccount: "Crea Account", signInSubtitle: "Accedi per visualizzare le tue prenotazioni e i viaggi salvati",
    signUpSubtitle: "Unisciti a Tourly e inizia a pianificare la tua vacanza da sogno",
    continueWithGoogle: "Continua con Google", continueWithApple: "Continua con Apple",
    agreeToTerms: "Registrandoti, accetti i nostri", termsOfService: "Termini di Servizio", privacyPolicy: "Informativa sulla Privacy", andText: "e",
    signOut: "Esci", signOutConfirm: "Sei sicuro di voler uscire?",
    // Onboarding
    onboardingTitle1: "Scopri Destinazioni Incredibili", onboardingDesc1: "Esplora luoghi mozzafiato in tutto il mondo selezionati per te.",
    onboardingTitle2: "Prenota con Fiducia", onboardingDesc2: "Prenotazione flessibile, miglior prezzo garantito e supporto 24/7.",
    onboardingTitle3: "Guadagna Premi Viaggiando", onboardingDesc3: "Accumula punti ad ogni viaggio e sblocca vantaggi esclusivi.",
    getStarted: "Inizia", next: "Avanti", skip: "Salta",
    // Premium
    premiumTitle: "Tourly Pro", premiumSubtitle: "Sblocca l'esperienza di viaggio definitiva",
    premiumProTitle: "Pro", premiumEliteTitle: "Elite",
    premiumPerMonth: "/mese", premiumPerYear: "/anno", premiumSavePercent: "Risparmia",
    premiumSubscribe: "Abbonati Ora", premiumRestore: "Ripristina Acquisto", premiumCurrentPlan: "Piano Attuale", premiumFreePlan: "Gratuito",
    premiumFeatureDeals: "Offerte esclusive e accesso anticipato", premiumFeatureSupport: "Supporto clienti prioritario",
    premiumFeatureCancellation: "Cancellazione gratuita su tutte le prenotazioni", premiumFeatureAI: "Pianificatore di viaggio IA",
    premiumFeatureAdFree: "Esperienza senza pubblicità", premiumFeatureConcierge: "Servizio concierge personale",
    premiumFeatureLounge: "Accesso alle lounge aeroportuali", premiumFeatureDoublePoints: "2× punti fedeltà",
    premiumMostPopular: "Più Popolare", premiumBestValue: "Miglior Valore",
    // Loyalty
    loyaltyTitle: "Premi", loyaltyPoints: "Punti", loyaltyTier: "Livello",
    loyaltyExplorer: "Esploratore", loyaltyAdventurer: "Avventuriero", loyaltyGlobetrotter: "Giramondo",
    loyaltyEarnPoints: "Guadagna Punti", loyaltyRedeemPoints: "Riscatta Punti", loyaltyHistory: "Cronologia",
    loyaltyNextTier: "Livello Successivo", loyaltyPointsToNext: "punti per il livello successivo",
    loyaltyReferralBonus: "Bonus Referral", loyaltyBookingPoints: "Punti Prenotazione", loyaltyReviewPoints: "Punti Recensione",
    // Referral
    referralTitle: "Invita un Amico", referralSubtitle: "Condividi Tourly e guadagna 500 punti per ogni invito",
    referralCode: "Il Tuo Codice Invito", referralCopyCode: "Copia Codice", referralCopied: "Copiato!",
    referralShareText: "Unisciti a me su Tourly! Usa il mio codice per un bonus: ",
    referralFriendsJoined: "Amici Iscritti", referralHowItWorks: "Come Funziona",
    referralStep1: "Condividi il tuo codice unico con gli amici",
    referralStep2: "Si iscrivono e prenotano il primo viaggio",
    referralStep3: "Entrambi guadagnate 500 punti bonus!",
    // Reviews
    reviewsTitle: "Recensioni", writeReview: "Scrivi Recensione", submitReview: "Invia Recensione",
    reviewPlaceholder: "Condividi la tua esperienza...", noReviewsYet: "Nessuna recensione ancora",
    beFirstReview: "Sii il primo a lasciare una recensione!", ratingRequired: "Seleziona una valutazione",
    reviewSubmitted: "Recensione inviata!", averageRating: "Valutazione Media",
    // AI Assistant
    aiAssistantTitle: "Pianificatore IA", aiAssistantSubtitle: "Pianifica il viaggio perfetto con l'IA",
    aiPlaceholder: "Chiedimi qualsiasi cosa sui viaggi...",
    aiWelcomeMessage: "Ciao! Sono il tuo assistente di viaggio IA. Posso aiutarti a pianificare viaggi, suggerire destinazioni, creare itinerari e altro. Cosa vorresti esplorare?",
    aiSuggestion1: "Pianifica un viaggio di 5 giorni a Bali", aiSuggestion2: "Migliori destinazioni per famiglie", aiSuggestion3: "Consigli di viaggio economico in Europa",
    aiProFeature: "Passa a Pro per pianificazione IA illimitata",
    // Travel Extras
    extrasTitle: "Migliora il Tuo Viaggio", extrasSubtitle: "Aggiungi extra per rendere il viaggio ancora migliore",
    extrasTransfer: "Transfer Aeroporto", extrasTransferDesc: "Prelievo e consegna con auto privata",
    extrasInsurance: "Assicurazione Viaggio", extrasInsuranceDesc: "Copertura completa per il tuo viaggio",
    extrasSim: "Piano Dati eSIM", extrasSimDesc: "Resta connesso con dati illimitati",
    extrasLounge: "Lounge Aeroporto", extrasLoungeDesc: "Rilassati prima del volo in comodità",
    addToBooking: "Aggiungi alla Prenotazione", skipExtras: "Salta, Continua alla Conferma",
    // Featured
    featuredBadge: "In Evidenza", sponsoredBadge: "Sponsorizzato", trendingBadge: "Di Tendenza",
    // Landing page
    landingBrand: "Tourly", landingHeroBadge: "App di Viaggio #1 con IA",
    landingHeroTitle: "Esplora Il\nMondo Con\nTourly", landingHeroSubtitle: "Scopri destinazioni mozzafiato, pacchetti curati e pianificazione viaggi con IA — tutto in un'app.",
    landingCTA: "Inizia Ora",
    landingStatTrips: "50K+", landingStatTripsLabel: "Viaggi Prenotati", landingStatDest: "120+", landingStatDestLabel: "Destinazioni", landingStatRating: "4.9", landingStatRatingLabel: "Valutazione App",
    landingWhyEyebrow: "Perché Tourly", landingWhyTitle: "Viaggia Intelligente,\nNon Difficile", landingWhySubtitle: "Tutto ciò che serve per il viaggio perfetto, alimentato da tecnologia moderna e competenza locale.",
    landingFeatureAI: "Pianificatore IA", landingFeatureAIDesc: "Ottieni itinerari personalizzati creati dall'IA avanzata in base alle tue preferenze e budget.",
    landingFeatureDest: "50+ Destinazioni", landingFeatureDestDesc: "Esplora destinazioni curate in 6 continenti, da gemme nascoste a monumenti iconici.",
    landingFeatureSecure: "Prenotazione Sicura", landingFeatureSecureDesc: "Pagamenti crittografati end-to-end con cancellazione flessibile e protezione rimborso completa.",
    landingFeatureConcierge: "Concierge 24/7", landingFeatureConciergeDesc: "Supporto in tempo reale da esperti locali che conoscono ogni angolo della tua destinazione.",
    landingTrendingEyebrow: "Di Tendenza", landingTrendingTitle: "Destinazioni Popolari",
    landingCuratedEyebrow: "Curato Per Te", landingCuratedTitle: "Pacchetti Viaggio",
    landingTestimonialsEyebrow: "Testimonianze", landingTestimonialsTitle: "Amato dai Viaggiatori",
    landingTestimonial1Name: "Sarah Mitchell", landingTestimonial1Location: "New York, USA",
    landingTestimonial1Quote: "Tourly ha reso la pianificazione della luna di miele semplicissima. L'IA ha suggerito posti che non avremmo mai trovato!",
    landingTestimonial2Name: "Kenji Tanaka", landingTestimonial2Location: "Tokyo, Giappone",
    landingTestimonial2Quote: "Il servizio concierge era incredibile. Sembrava avere un amico locale in ogni città visitata.",
    landingTestimonial3Name: "Amara Osei", landingTestimonial3Location: "Accra, Ghana",
    landingTestimonial3Quote: "La migliore app di viaggio che abbia usato. Le offerte sono vere e il processo di prenotazione è fluido.",
    landingReadyCTA: "Pronto per la Prossima Avventura?", landingReadyDesc: "Unisciti a oltre 50.000 viaggiatori che pianificano e prenotano con Tourly. Crea il tuo account gratuito oggi.",
    landingCreateAccount: "Crea Account Gratuito",
    landingFooterTagline: "Rendere i viaggi accessibili, personalizzati e indimenticabili dal 2024.",
    landingFooterAbout: "Chi Siamo", landingFooterContact: "Contatti", landingFooterDeals: "Offerte",
    landingFooterCopyright: "© 2024–2026 Tourly. Tutti i diritti riservati.",
    landingExplore: "Esplora",
    // Download page
    downloadTitle: "Scarica l'App",
    downloadHeroSubtitle: "Il tuo compagno di viaggio tascabile.\nEsplora, prenota e parti — tutto da un'app.",
    downloadOnThe: "Scarica su", downloadGetItOn: "Disponibile su", downloadAppStore: "App Store", downloadGooglePlay: "Google Play",
    downloadStatRating: "4.9", downloadStatRatingLabel: "Valutazione", downloadStatDownloads: "500K+", downloadStatDownloadsLabel: "Download",
    downloadStatDest: "100+", downloadStatDestLabel: "Destinazioni", downloadStatSupport: "24/7", downloadStatSupportLabel: "Supporto",
    downloadExclusiveEyebrow: "Esclusivo App", downloadWhyTitle: "Perché Scaricare Tourly?", downloadWhySubtitle: "L'app sblocca funzionalità non disponibili nel browser.",
    downloadFeatureFast: "Ultra Veloce", downloadFeatureFastDesc: "Prestazioni native più fluide di qualsiasi esperienza browser.",
    downloadFeatureNotif: "Notifiche Push", downloadFeatureNotifDesc: "Non perdere offerte — ricevi avvisi istantanei su vendite flash.",
    downloadFeatureOffline: "Accesso Offline", downloadFeatureOfflineDesc: "Salva itinerari e mappe per quando sei senza rete.",
    downloadFeatureOneTap: "Prenotazione con Un Tocco", downloadFeatureOneTapDesc: "Prenota in secondi con pagamento e dati salvati.",
    downloadFeatureAI: "Pianificatore IA", downloadFeatureAIDesc: "Suggerimenti di viaggio personalizzati con IA, integrati direttamente.",
    downloadFeatureSecure: "Sicuro e Privato", downloadFeatureSecureDesc: "Login biometrico e dati crittografati proteggono le tue informazioni.",
    downloadReviewsEyebrow: "Amato dai Viaggiatori", downloadReviewsTitle: "Cosa Dicono gli Utenti",
    downloadReview1Name: "Sarah M.", downloadReview1Text: "La migliore app di viaggio! Ho prenotato il viaggio a Bali in meno di 2 minuti.",
    downloadReview2Name: "James K.", downloadReview2Text: "Le mappe offline mi hanno salvato nel Giappone rurale. Un vero game changer.",
    downloadReview3Name: "Aisha R.", downloadReview3Text: "Le notifiche push hanno catturato una vendita flash del 40%. Risparmiato 300$ sul viaggio!",
    downloadCompareTitle: "App vs. Browser", downloadCompareApp: "App", downloadCompareWeb: "Web",
    downloadComparePush: "Notifiche Push", downloadCompareOffline: "Accesso Offline", downloadCompareBiometric: "Login Biometrico",
    downloadCompareOneTap: "Prenotazione con Un Tocco", downloadCompareAI: "Pianificatore IA", downloadCompareBrowse: "Sfoglia Destinazioni",
    downloadBottomCTATitle: "Pronto a Viaggiare Più Intelligente?", downloadBottomCTADesc: "Scarica Tourly gratis su iOS e Android.",
    downloadPlatformIOS: "iOS", downloadPlatformAndroid: "Android",
    authError: "Errore", authInvalidCredentials: "Credenziali non valide",
    authSignInFailed: "Accesso non riuscito. Riprova.", authSignUpFailed: "Registrazione non riuscita. Riprova.",
    authOAuthFailed: "Accesso OAuth non riuscito. Riprova.", authGoogle: "Google", authApple: "Apple",
    getTheApp: "Scarica l'App", adminPanel: "Pannello Admin", adminPanelDesc: "Gestisci prenotazioni, utenti e destinazioni",
    tierElite: "Elite", tierPro: "Pro", aiLabel: "IA",
    premiumNoPurchases: "Nessun acquisto precedente trovato.",
    thankYou: "Grazie!", shareDestination: "Scopri questa destinazione su Tourly!", sharePackage: "Scopri questo pacchetto su Tourly!",
    shareVia: "Condividi tramite", shareWhatsApp: "WhatsApp", shareTwitter: "X (Twitter)", shareFacebook: "Facebook", shareTelegram: "Telegram", shareEmail: "Email", shareSMS: "SMS", shareCopyLink: "Copia link", shareLinkCopied: "Link copiato negli appunti!", shareMoreOptions: "Altre opzioni",
    aiResponseBali: "Bali è una scelta fantastica! Ecco un itinerario di 5 giorni:\n\n📍 Giorno 1: Arrivo, esplorare Seminyak Beach\n📍 Giorno 2: Terrazze di riso di Ubud e Foresta delle Scimmie\n📍 Giorno 3: Tempio di Uluwatu e Danza Kecak\n📍 Giorno 4: Gita a Nusa Penida\n📍 Giorno 5: Giornata spa e partenza\n\nPeriodo migliore: Aprile-Ottobre (stagione secca). Budget: ~50-150$/giorno.",
    aiResponseFamily: "Ottime destinazioni familiari:\n\n🏖️ Maldive - ville sull'acqua, snorkeling\n🏰 Giappone - Tokyo Disneyland, esperienze culturali\n🌴 Thailandia - spiagge, santuari elefanti\n🏔️ Svizzera - treni panoramici, escursioni\n🦁 Kenya - safari familiari\n\nVuoi più dettagli?",
    aiResponseBudget: "Migliori consigli di viaggio economico:\n\n💡 Viaggia in bassa stagione\n💡 Prenota voli il martedì\n💡 Usa trasporti locali\n💡 Alloggia in ostelli\n💡 Mangia ai mercati locali\n💡 Prendi pass turistici\n\nDestinazioni economiche: Vietnam, Portogallo, Messico, Thailandia, Marocco.",
    aiResponseEurope: "Pianificazione viaggio Europa:\n\n🇫🇷 Parigi - minimo 3 giorni\n🇮🇹 Roma/Firenze - 4 giorni\n🇪🇸 Barcellona - 2-3 giorni\n🇬🇷 Santorini - 2-3 giorni\n\n✈️ Consiglio: Usa compagnie low-cost tra le città. Prendi un pass Eurail. Budget: 60-150€/giorno.",
    aiResponseDefault: "Ottima domanda! Consiglio di esplorare i nostri pacchetti curati per le migliori offerte. Visita anche la pagina destinazioni.\n\nVuoi che pianifichi un viaggio? Dimmi:\n• Dove vuoi andare\n• Quanti giorni\n• Il tuo budget\n• Stile di viaggio (avventura, relax, cultura)",
    bannerGetApp: "Scarica l'App Tourly", bannerFasterOn: "Esperienza più veloce su", bannerOpen: "Apri",
    chatWelcomeBack: "Bentornato! 👋 Bello rivederti. Come posso aiutarti?",
    chatNewConvo: "Nuova conversazione! ✨ La chat precedente è stata archiviata. Come posso aiutare?",
    chatFreshConvo: "Nuova conversazione! ✨ In cosa posso aiutarti?",
    chatLiveAgent: "Agente Live", chatConnectedTeam: "Connesso al team supporto", chatEnd: "Termina",
    chatConvoClosed: "Questa conversazione è stata chiusa", chatStartNew: "Inizia nuova conversazione",
    chatHereToHelp: "Siamo qui per aiutare — chiedi pure",
    chatReturnLive: "Torna alla Chat Live", chatActiveConvo: "Hai una conversazione attiva con il supporto",
    chatConnectAgent: "Chatta con un Agente", chatConnectAgentDesc: "Connettiti al nostro team per aiuto in tempo reale",
    chatConnectedLive: "Connesso al Supporto Live", chatAgentRespondSoon: "Un agente risponderà a breve.\nScrivi un messaggio per iniziare.",
    chatEnded: "Chat terminata",
    chatArchivedChat: "Chat Archiviata", chatHistory: "Cronologia Chat", chatClearAll: "Cancella Tutto", chatDelete: "Elimina",
    chatNoArchives: "Nessuna chat archiviata", chatLiveAgentChat: "Chat Agente Live", chatBotConvo: "Conversazione Bot",
    chatBackToArchives: "Torna agli archivi", chatConversations: "conversazioni", chatMessages: "messaggi",
    chatTranslate: "Traduci", chatShowOriginal: "Mostra originale", chatTranslating: "Traduzione…",
    chatTranslateAll: "Traduci tutto", chatAutoTranslate: "Traduzione automatica",
    chatTranslatedFrom: "Tradotto da", chatTranslationFailed: "Traduzione non riuscita",
    adminTitle: "Pannello Admin", adminDashboardTitle: "Dashboard Admin", adminDashboardSubtitle: "Gestisci la tua piattaforma di viaggio",
    adminTabDashboard: "Dashboard", adminTabBookings: "Prenotazioni", adminTabChat: "Chat",
    adminTabDestinations: "Destinazioni", adminTabPackages: "Pacchetti", adminTabUsers: "Utenti",
    adminCancel: "Annulla", adminSave: "Salva", adminEdit: "Modifica", adminDelete: "Elimina", adminSearch: "Cerca",
    adminValidation: "Validazione", adminTapUpload: "Tocca per caricare", adminChange: "Cambia", adminRemove: "Rimuovi",
    adminPermissionNeeded: "Permesso necessario", adminGrantCameraAccess: "Concedi l'accesso al rullino per caricare immagini.",
    adminTotalBookings: "Prenotazioni Totali", adminTotalBookingsTrend: "+12% questo mese",
    adminRevenue: "Fatturato", adminRevenueTrend: "+8% questo mese",
    adminTotalUsers: "Utenti Totali", adminTotalUsersTrend: "+3 questa settimana",
    adminDestinations: "Destinazioni",
    adminQuickActions: "Azioni Rapide", adminAddDestination: "Aggiungi Destinazione", adminCreatePackage: "Crea Pacchetto",
    adminSendNotification: "Invia Notifica", adminViewReports: "Visualizza Report",
    adminRecentBookings: "Prenotazioni Recenti", adminNoBookingsYet: "Nessuna prenotazione",
    adminReports: "Report", adminDone: "Fatto",
    adminBookingStatus: "Stato Prenotazione", adminConfirmed: "Confermato", adminPending: "In Attesa", adminCancelled: "Cancellato",
    adminMonthlyBookings: "Prenotazioni Mensili (Ultimi 6 Mesi)", adminTotalPeriod: "Totale questo periodo",
    adminRevenueLabel: "fatturato", adminRevenueByPackage: "Fatturato per Pacchetto", adminNoRevenueYet: "Nessun dato fatturato",
    adminLatestBookings: "Ultime Prenotazioni", adminCustomTrip: "Viaggio Personalizzato", adminAvgBooking: "Media / Prenotazione",
    adminSendTo: "Invia A", adminAllUsers: "Tutti gli Utenti", adminSelectUsers: "Seleziona Utenti",
    adminNotifTitle: "Titolo", adminNotifTitlePlaceholder: "es. Saldi Estivi — 30% Sconto",
    adminNotifMessage: "Messaggio", adminNotifMessagePlaceholder: "Messaggio notifica...", adminNotifType: "Tipo",
    adminTitleMessageRequired: "Titolo e messaggio richiesti.", adminSelectAtLeastOne: "Seleziona almeno un utente.",
    adminSent: "Inviato", adminNotifSentTo: "Notifica inviata a", adminUsersSelected: "selezionati", adminClear: "Cancella",
    adminBookingDetails: "Dettagli Prenotazione", adminFullName: "Nome Completo", adminEmail: "Email", adminPhone: "Telefono",
    adminTravelers: "Viaggiatori", adminCheckIn: "Check-in", adminCheckOut: "Check-out", adminDatePlaceholder: "AAAA-MM-GG",
    adminUpdated: "Aggiornato", adminBookingUpdated: "Dettagli prenotazione aggiornati (demo locale).",
    adminAll: "Tutti", adminNoBookingsFound: "Nessuna prenotazione trovata", adminConfirm: "Conferma", adminPax: "pers.", adminNA: "N/D",
    adminEditDestination: "Modifica Destinazione", adminAddDestinationTitle: "Aggiungi Destinazione",
    adminCoverImage: "Immagine Copertina", adminName: "Nome", adminNamePlaceholder: "es. Santorini",
    adminCountry: "Paese", adminCountryPlaceholder: "es. Grecia", adminRating: "Valutazione (1-5)",
    adminDescription: "Descrizione", adminDescPlaceholder: "Breve descrizione...",
    adminSearchDestinations: "Cerca destinazioni...", adminAddNewDestination: "Aggiungi Nuova Destinazione",
    adminDeleteDestination: "Elimina Destinazione", adminDeleteConfirm: "Sei sicuro di voler eliminare",
    adminNameCountryRequired: "Nome e paese richiesti.",
    adminEditPackage: "Modifica Pacchetto", adminAddPackageTitle: "Aggiungi Pacchetto",
    adminPackageImage: "Immagine Pacchetto", adminPackageTitle: "Titolo", adminTitlePlaceholder: "es. Vacanza al Mare",
    adminLocation: "Luogo", adminLocationPlaceholder: "es. Malesia",
    adminDuration: "Durata", adminDurationPlaceholder: "es. 7G/6N", adminMaxPax: "Max Pers.",
    adminPrice: "Prezzo ($)", adminPricePlaceholder: "es. 750",
    adminPackageDescPlaceholder: "Descrizione pacchetto...", adminSearchPackages: "Cerca pacchetti...",
    adminAddNewPackage: "Aggiungi Nuovo Pacchetto", adminDeletePackage: "Elimina Pacchetto",
    adminTitleLocationPriceRequired: "Titolo, luogo e prezzo richiesti.", adminReviews: "recensioni",
    adminEditUser: "Modifica Utente", adminAvatar: "Avatar", adminRole: "Ruolo",
    adminSearchUsers: "Cerca utenti...", adminActive: "Attivo", adminSuspended: "Sospeso", adminAdmins: "Admin",
    adminJoined: "Iscritto", adminBookingsCount: "prenotazioni",
    adminPromote: "Promuovi", adminDemote: "Retrocedi", adminSuspend: "Sospendi", adminActivate: "Attiva",
    adminNameEmailRequired: "Nome e email richiesti.",
    adminConversations: "Conversazioni", adminLive: "Live", adminNoConvoYet: "Nessuna conversazione",
    adminNoConvoDesc: "Quando gli utenti avviano la chat live,\nle conversazioni appariranno qui.",
    adminNoMessages: "Nessun messaggio", adminReopen: "Riapri", adminClose: "Chiudi",
    adminConvoClosed: "Conversazione chiusa", adminTypeReply: "Scrivi una risposta...",
    adminYou: "Tu: ", adminClosed: "Chiuso", adminUnread: "non letti",
  },

  // ─────────────────────────── Portuguese ───────────────────────────
  pt: {
    tabHome: "Início", tabExplore: "Explorar", tabTrips: "Viagens", tabSaved: "Salvos", tabGallery: "Galeria",
    heroTitle: "Viaje para\nExplorar o Mundo", heroSubtitle: "Descubra destinos incríveis e crie memórias inesquecíveis com Tourly",
    learnMore: "Saiba Mais", bookNow: "Reservar Agora", contactUs: "Contato",
    findYourTrip: "Encontre sua Viagem", enterDestination: "Insira o Destino", numberOfTravelers: "Número de Viajantes",
    inquireNow: "Consultar Agora", popularDestinations: "Destinos Populares", checkoutPackages: "Nossos Pacotes",
    viewAll: "Ver Tudo →", dealsTitle: "Ofertas e Flash Sales 🔥", dealsSubtitle: "Até 30% de desconto",
    save: "Salvar", saved: "Salvo", share: "Compartilhar", back: "Voltar", search: "Buscar",
    searchPlaceholder: "Buscar destinos, pacotes...", noResults: "Nenhum resultado",
    filterAll: "Todos", filterDestinations: "Destinos", filterPackages: "Pacotes",
    sortBy: "Ordenar", sortDefault: "Padrão", sortNameAZ: "Nome: A–Z", sortRelevance: "Relevância", sortPriceLow: "Preço: Menor → Maior", sortPriceHigh: "Preço: Maior → Menor", sortRating: "Mais Avaliados",
    priceRange: "Preço", resultsFound: "resultados", searchTourly: "Buscar no Tourly",
    searchHint: "Encontre seu destino ou pacote de viagem perfeito", tryDifferent: "Tente outro termo ou ajuste os filtros",
    clearFilters: "Limpar Filtros",
    bookThisDestination: "Reservar este Destino", aboutDestination: "Sobre este Destino",
    whatToExpect: "O Que Esperar", whatsIncluded: "O Que Está Incluído", sampleItinerary: "Itinerário de Exemplo",
    bookingTitle: "Reserve sua Viagem", fullName: "Nome Completo", email: "E-mail", phone: "Telefone",
    travelers: "Viajantes", checkIn: "Data de Entrada", checkOut: "Data de Saída",
    submitBooking: "Enviar Reserva", bookingSuccess: "Reserva enviada com sucesso!",
    notificationsTitle: "Notificações", markAllRead: "Marcar tudo como lido", noNotifications: "Sem notificações",
    profileTitle: "Meu Perfil", myBookings: "Minhas Reservas", settings: "Configurações", aboutUs: "Sobre Nós",
    settingsTitle: "Configurações", darkMode: "Modo Escuro", language: "Idioma", currency: "Moeda",
    pushNotifications: "Notificações Push", emailNotifications: "Notificações por Email",
    myWishlist: "Minha Lista de Desejos", savedPlaces: "Lugares Salvos", nothingSaved: "Nada salvo ainda",
    nothingSavedHint: "Toque no coração em qualquer destino ou pacote para salvá-lo aqui.",
    exploreDestinations: "Explorar Destinos", photoGallery: "Galeria de Fotos", photosFromTravellers: "Fotos dos Viajantes",
    chatTitle: "Suporte ao Vivo", chatPlaceholder: "Digite uma mensagem...", chatSend: "Enviar",
    chatWelcome: "👋 Olá! Bem-vindo ao Tourly. Como podemos ajudá-lo?",
    chatHello: "Olá! Sou seu assistente de viagem Tourly. Pergunte-me sobre destinos, pacotes ou reservas!",
    personalInfo: "Informações Pessoais", tripDetails: "Detalhes da Viagem",
    selectedPackage: "Pacote Selecionado", destinationLabel: "Destino",
    whereToGo: "Para onde você quer ir?", preferredCheckIn: "Data de Entrada Preferida",
    preferredCheckOut: "Data de Saída Preferida", specialRequests: "Pedidos Especiais",
    specialRequestsPlaceholder: "Algum requisito especial?", submitBookingRequest: "Enviar Pedido de Reserva",
    validationNameRequired: "Nome completo é obrigatório", validationEmailRequired: "E-mail é obrigatório",
    validationEmailInvalid: "Por favor insira um e-mail válido", validationPhoneRequired: "Telefone é obrigatório",
    aboutPageTitle: "Sobre Nós", whoWeAre: "Quem Somos", trustedTravelPartner: "Seu Parceiro de Viagem de Confiança",
    whyChooseUs: "Por Que Nos Escolher", whatMakesDifferent: "O Que Nos Diferencia",
    ourMission: "Nossa Missão", happyTravelers: "Viajantes Felizes", tourPackages: "Pacotes de Viagem", supportUs: "Suporte",
    getInTouch: "Entre em Contato", feelFreeContact: "Sinta-se à vontade para nos contatar!",
    newsletter: "Newsletter", newsletterSubtitle: "Inscreva-se para receber as últimas ofertas.",
    subscribe: "Inscrever-se", enterYourEmail: "Insira seu e-mail", readyForTravel: "Pronto para uma Viagem Inesquecível?",
    limitedTime: "Tempo Limitado", flashDeals: "Ofertas Relâmpago 🔥", flashDealsSubtitle: "Economize até 30% nos nossos melhores pacotes",
    endsIn: "Termina em", bookAt: "Reservar por", perPersonShort: "/pessoa",
    packageNotFound: "Pacote não encontrado", destinationNotFound: "Destino não encontrado",
    goBack: "Voltar", aboutThisPackage: "Sobre Este Pacote",
    maxPax: "Máx. Pessoas", durationLabel: "Duração", locationLabel: "Localização",
    reviewsLabel: "avaliações", topRated: "Mais Avaliados", countryLabel: "País",
    bestTime: "Melhor Época", allYear: "O Ano Todo", groupSizeLabel: "Tamanho do Grupo",
    ratingLabel: "Avaliação",
    uncoverPlace: "Descubra Lugares", popularDestinationsSubtitle: "Explore nossos destinos mais visitados ao redor do mundo",
    popularPackages: "Pacotes Populares", packagesSubtitle: "Encontre o pacote de viagem perfeito para sua próxima aventura",
    callToAction: "Entre em Contato", ctaDescription: "Entre em contato hoje e ajudaremos você a planejar as férias dos seus sonhos!",
    perPerson: "por pessoa",
    defaultUsername: "Viajante", welcomeBack: "Bem-vindo de volta!",
    countriesLabel: "Países", noBookingsHint: "Ainda sem reservas. Reserve um pacote ou destino para ver aqui.",
    browsePackages: "Explorar Pacotes", cancelBookingTitle: "Cancelar Reserva",
    cancelBookingMessage: "Cancelar sua reserva para esta viagem?", keepIt: "Manter",
    cancelBookingAction: "Cancelar Reserva", bookedOn: "Reservado em", cancel: "Cancelar", ok: "OK",
    customTrip: "Viagem Personalizada", travellersCount: "viajantes",
    viewDetails: "Ver Detalhes",
    featureBestPrice: "Garantia de Melhor Preço",
    featureBestPriceDesc: "Oferecemos os melhores preços para todos os nossos pacotes de viagem sem taxas ocultas.",
    featureHandpicked: "Destinos Selecionados",
    featureHandpickedDesc: "Nossos especialistas selecionam cuidadosamente os destinos mais bonitos e únicos.",
    featureExpertGuides: "Guias Especialistas",
    featureExpertGuidesDesc: "Guias locais profissionais que conhecem cada canto do destino.",
    featureFlexibleBooking: "Reserva Flexível",
    featureFlexibleBookingDesc: "Processo de reserva fácil com políticas de cancelamento flexíveis.",
    aboutParagraph1: "Tourly é uma agência de viagens premium dedicada a criar experiências de viagem inesquecíveis. Com anos de experiência, conectamos viajantes aos destinos mais impressionantes do mundo.",
    aboutParagraph2: "Nossa equipe de apaixonados especialistas em viagens trabalha incansavelmente para criar experiências únicas que vão além do turismo comum.",
    missionStatement: "Inspirar e capacitar pessoas a explorar o mundo fornecendo experiências de viagem excepcionais, sustentáveis e acessíveis.",
    ctaContactDescription: "Entre em contato hoje e ajudaremos a planejar suas férias dos sonhos. Nossa equipe está pronta para ajudá-lo 24/7.",
    addressLabel: "Endereço", footerCopyright: "© 2024 Tourly. Todos os direitos reservados",
    datePlaceholder: "AAAA-MM-DD",
    tagFlashSale: "Venda Relâmpago", tagWeekendDeal: "Oferta de Fim de Semana", tagLimitedOffer: "Oferta Limitada",
    timeJustNow: "Agora", timeMinutesAgo: "m", timeHoursAgo: "h", timeDaysAgo: "d",
    unreadNotifications: "notificações não lidas",
    notifWelcomeTitle: "Bem-vindo ao Tourly 🌍", notifWelcomeBody: "Comece a explorar destinos incríveis e reserve sua próxima aventura.",
    notifSaleTitle: "Promoção de Verão — Até 30% Off", notifSaleBody: "Oferta por tempo limitado em pacotes selecionados. Reserve até 31 de março de 2026.",
    notifNewDestTitle: "Novo Destino Adicionado", notifNewDestBody: "Bali, Indonésia já está disponível. Confira nossos pacotes exclusivos!",
    destinationDetailDesc: "Viva a beleza e cultura deste destino incrível. De paisagens deslumbrantes a ricas tradições locais, cada momento será inesquecível.",
    expectGuidedTours: "Passeios guiados com especialistas locais", expectLocalCuisine: "Experiências autênticas da culinária local",
    expectAccommodations: "Acomodações confortáveis", expectTransportation: "Transporte incluído", expectSupport: "Suporte de viagem 24/7",
    inclusionAirfare: "Passagem aérea ida e volta", inclusionTransfers: "Transfers aeroporto",
    inclusionAccommodation: "Hospedagem (hotel 4 estrelas)", inclusionBreakfast: "Café da manhã diário",
    inclusionGuidedTours: "Passeios guiados", inclusionInsurance: "Seguro viagem", inclusionSupport: "Suporte 24/7",
    itineraryDay1Title: "Chegada e Boas-vindas", itineraryDay1Desc: "Transfer aeroporto, check-in, jantar de boas-vindas",
    itineraryDay2Title: "Exploração da Cidade", itineraryDay2Desc: "Tour guiado, mercados locais, pontos culturais",
    itineraryDay3Title: "Dia de Aventura", itineraryDay3Desc: "Atividades ao ar livre, trilhas na natureza",
    itineraryDay4Title: "Experiência Cultural", itineraryDay4Desc: "Oficinas tradicionais, culinária local",
    itineraryDay5Title: "Dia Livre", itineraryDay5Desc: "Atividades opcionais ou relaxamento",
    itineraryDay6Title: "Tour Panorâmico", itineraryDay6Desc: "Excursão a atrações próximas",
    itineraryDay7Title: "Partida", itineraryDay7Desc: "Café da manhã, checkout, transfer aeroporto",
    packageDetailExtended: "Viva uma viagem inesquecível com nosso pacote de viagem cuidadosamente projetado. Cada detalhe foi planejado para a viagem da sua vida.",
    chatOnlineStatus: "Online · Suporte Tourly",
    chatReply1: "Obrigado por entrar em contato! Um especialista em viagens estará com você em breve.",
    chatReply2: "Ótima pergunta! Nossa equipe está analisando sua mensagem.",
    chatReply3: "Adoraríamos ajudá-lo a planejar sua viagem perfeita! Poderia compartilhar mais detalhes?",
    chatReply4: "Nossos pacotes são totalmente personalizáveis. Vou conectá-lo com um especialista.",
    chatReply5: "Para assistência imediata, você também pode nos ligar no +01 (123) 4567 90.",
    priceAny: "Qualquer", priceUnder500: "< 500", price500to1000: "500 – 700", priceOver1000: "> 700",
    signIn: "Entrar", signUp: "Cadastrar", password: "Senha", confirmPassword: "Confirmar Senha",
    forgotPassword: "Esqueceu a senha?", dontHaveAccount: "Não tem conta?", alreadyHaveAccount: "Já tem conta?",
    orContinueWith: "ou continue com", signingIn: "Entrando...", signingUp: "Criando conta...",
    passwordMismatch: "As senhas não coincidem", passwordTooShort: "A senha deve ter pelo menos 8 caracteres",
    welcomeTo: "Bem-vindo ao", createAccount: "Criar Conta", signInSubtitle: "Entre para acessar suas reservas e viagens salvas",
    signUpSubtitle: "Junte-se ao Tourly e comece a planejar suas férias dos sonhos",
    continueWithGoogle: "Continuar com Google", continueWithApple: "Continuar com Apple",
    agreeToTerms: "Ao se cadastrar, você concorda com nossos", termsOfService: "Termos de Serviço", privacyPolicy: "Política de Privacidade", andText: "e",
    signOut: "Sair", signOutConfirm: "Tem certeza de que deseja sair?",
    // Onboarding
    onboardingTitle1: "Descubra Destinos Incríveis", onboardingDesc1: "Explore lugares deslumbrantes pelo mundo selecionados para você.",
    onboardingTitle2: "Reserve com Confiança", onboardingDesc2: "Reserva flexível, melhor preço garantido e suporte 24/7.",
    onboardingTitle3: "Ganhe Recompensas ao Viajar", onboardingDesc3: "Acumule pontos em cada viagem e desbloqueie vantagens exclusivas.",
    getStarted: "Começar", next: "Próximo", skip: "Pular",
    // Premium
    premiumTitle: "Tourly Pro", premiumSubtitle: "Desbloqueie a experiência de viagem definitiva",
    premiumProTitle: "Pro", premiumEliteTitle: "Elite",
    premiumPerMonth: "/mês", premiumPerYear: "/ano", premiumSavePercent: "Economize",
    premiumSubscribe: "Assinar Agora", premiumRestore: "Restaurar Compra", premiumCurrentPlan: "Plano Atual", premiumFreePlan: "Grátis",
    premiumFeatureDeals: "Ofertas exclusivas e acesso antecipado", premiumFeatureSupport: "Suporte prioritário ao cliente",
    premiumFeatureCancellation: "Cancelamento grátis em todas as reservas", premiumFeatureAI: "Planejador de viagem com IA",
    premiumFeatureAdFree: "Experiência sem anúncios", premiumFeatureConcierge: "Serviço de concierge pessoal",
    premiumFeatureLounge: "Acesso a lounges do aeroporto", premiumFeatureDoublePoints: "2× pontos de fidelidade",
    premiumMostPopular: "Mais Popular", premiumBestValue: "Melhor Custo-Benefício",
    // Loyalty
    loyaltyTitle: "Recompensas", loyaltyPoints: "Pontos", loyaltyTier: "Nível",
    loyaltyExplorer: "Explorador", loyaltyAdventurer: "Aventureiro", loyaltyGlobetrotter: "Viajante Global",
    loyaltyEarnPoints: "Ganhar Pontos", loyaltyRedeemPoints: "Resgatar Pontos", loyaltyHistory: "Histórico",
    loyaltyNextTier: "Próximo Nível", loyaltyPointsToNext: "pontos para o próximo nível",
    loyaltyReferralBonus: "Bônus de Indicação", loyaltyBookingPoints: "Pontos de Reserva", loyaltyReviewPoints: "Pontos de Avaliação",
    // Referral
    referralTitle: "Indique um Amigo", referralSubtitle: "Compartilhe Tourly e ganhe 500 pontos por indicação",
    referralCode: "Seu Código de Indicação", referralCopyCode: "Copiar Código", referralCopied: "Copiado!",
    referralShareText: "Junte-se a mim no Tourly! Use meu código para um bônus: ",
    referralFriendsJoined: "Amigos que Entraram", referralHowItWorks: "Como Funciona",
    referralStep1: "Compartilhe seu código único com amigos",
    referralStep2: "Eles se cadastram e reservam a primeira viagem",
    referralStep3: "Vocês dois ganham 500 pontos bônus!",
    // Reviews
    reviewsTitle: "Avaliações", writeReview: "Escrever Avaliação", submitReview: "Enviar Avaliação",
    reviewPlaceholder: "Compartilhe sua experiência...", noReviewsYet: "Nenhuma avaliação ainda",
    beFirstReview: "Seja o primeiro a avaliar!", ratingRequired: "Selecione uma avaliação",
    reviewSubmitted: "Avaliação enviada!", averageRating: "Avaliação Média",
    // AI Assistant
    aiAssistantTitle: "Planejador IA", aiAssistantSubtitle: "Planeje sua viagem perfeita com IA",
    aiPlaceholder: "Pergunte-me qualquer coisa sobre viagens...",
    aiWelcomeMessage: "Olá! Sou seu assistente de viagem com IA. Posso ajudar a planejar viagens, sugerir destinos, criar roteiros e mais. O que gostaria de explorar?",
    aiSuggestion1: "Planejar viagem de 5 dias a Bali", aiSuggestion2: "Melhores destinos para famílias", aiSuggestion3: "Dicas de viagem econômica pela Europa",
    aiProFeature: "Upgrade para Pro para planejamento IA ilimitado",
    // Travel Extras
    extrasTitle: "Melhore Sua Viagem", extrasSubtitle: "Adicione extras para tornar sua viagem ainda melhor",
    extrasTransfer: "Transfer Aeroporto", extrasTransferDesc: "Busca e entrega com carro privativo",
    extrasInsurance: "Seguro Viagem", extrasInsuranceDesc: "Cobertura completa para sua viagem",
    extrasSim: "Plano de Dados eSIM", extrasSimDesc: "Fique conectado com dados ilimitados",
    extrasLounge: "Lounge do Aeroporto", extrasLoungeDesc: "Relaxe antes do voo com conforto",
    addToBooking: "Adicionar à Reserva", skipExtras: "Pular, Continuar para Confirmação",
    // Featured
    featuredBadge: "Destaque", sponsoredBadge: "Patrocinado", trendingBadge: "Em Alta",
    // Landing page
    landingBrand: "Tourly", landingHeroBadge: "App de Viagem #1 com IA",
    landingHeroTitle: "Explore O\nMundo Com\nTourly", landingHeroSubtitle: "Descubra destinos deslumbrantes, pacotes selecionados e planejamento de viagem com IA — tudo num app.",
    landingCTA: "Começar",
    landingStatTrips: "50K+", landingStatTripsLabel: "Viagens Reservadas", landingStatDest: "120+", landingStatDestLabel: "Destinos", landingStatRating: "4.9", landingStatRatingLabel: "Avaliação",
    landingWhyEyebrow: "Por Que Tourly", landingWhyTitle: "Viaje Inteligente,\nNão Difícil", landingWhySubtitle: "Tudo que você precisa para a viagem perfeita, impulsionado por tecnologia moderna e expertise local.",
    landingFeatureAI: "Planejador IA", landingFeatureAIDesc: "Obtenha itinerários personalizados criados por IA avançada com base nas suas preferências e orçamento.",
    landingFeatureDest: "50+ Destinos", landingFeatureDestDesc: "Explore destinos selecionados em 6 continentes, de joias ocultas a marcos icônicos.",
    landingFeatureSecure: "Reserva Segura", landingFeatureSecureDesc: "Pagamentos criptografados ponta a ponta com cancelamento flexível e proteção total de reembolso.",
    landingFeatureConcierge: "Concierge 24/7", landingFeatureConciergeDesc: "Suporte em tempo real de especialistas locais que conhecem cada canto do seu destino.",
    landingTrendingEyebrow: "Em Alta", landingTrendingTitle: "Destinos Populares",
    landingCuratedEyebrow: "Selecionado Para Você", landingCuratedTitle: "Pacotes de Viagem",
    landingTestimonialsEyebrow: "Depoimentos", landingTestimonialsTitle: "Amado por Viajantes",
    landingTestimonial1Name: "Sarah Mitchell", landingTestimonial1Location: "Nova York, EUA",
    landingTestimonial1Quote: "Tourly tornou o planejamento da lua de mel muito fácil. A IA sugeriu lugares que nunca teríamos encontrado!",
    landingTestimonial2Name: "Kenji Tanaka", landingTestimonial2Location: "Tóquio, Japão",
    landingTestimonial2Quote: "O serviço de concierge foi incrível. Parecia ter um amigo local em cada cidade visitada.",
    landingTestimonial3Name: "Amara Osei", landingTestimonial3Location: "Acra, Gana",
    landingTestimonial3Quote: "Melhor app de viagem que já usei. As ofertas são reais e o processo de reserva é perfeito.",
    landingReadyCTA: "Pronto para Sua Próxima Aventura?", landingReadyDesc: "Junte-se a mais de 50.000 viajantes que planejam e reservam com Tourly. Crie sua conta gratuita hoje.",
    landingCreateAccount: "Criar Conta Gratuita",
    landingFooterTagline: "Tornando viagens acessíveis, personalizadas e inesquecíveis desde 2024.",
    landingFooterAbout: "Sobre", landingFooterContact: "Contato", landingFooterDeals: "Ofertas",
    landingFooterCopyright: "© 2024–2026 Tourly. Todos os direitos reservados.",
    landingExplore: "Explorar",
    // Download page
    downloadTitle: "Baixar o App",
    downloadHeroSubtitle: "Seu companheiro de viagem de bolso.\nExplore, reserve e vá — tudo num app.",
    downloadOnThe: "Baixar na", downloadGetItOn: "Disponível no", downloadAppStore: "App Store", downloadGooglePlay: "Google Play",
    downloadStatRating: "4.9", downloadStatRatingLabel: "Avaliação", downloadStatDownloads: "500K+", downloadStatDownloadsLabel: "Downloads",
    downloadStatDest: "100+", downloadStatDestLabel: "Destinos", downloadStatSupport: "24/7", downloadStatSupportLabel: "Suporte",
    downloadExclusiveEyebrow: "Exclusivo do App", downloadWhyTitle: "Por Que Baixar o Tourly?", downloadWhySubtitle: "O app desbloqueia recursos indisponíveis no navegador.",
    downloadFeatureFast: "Ultra Rápido", downloadFeatureFastDesc: "Performance nativa mais fluida que qualquer experiência no navegador.",
    downloadFeatureNotif: "Notificações Push", downloadFeatureNotifDesc: "Não perca ofertas — receba alertas instantâneos de vendas relâmpago.",
    downloadFeatureOffline: "Acesso Offline", downloadFeatureOfflineDesc: "Salve itinerários e mapas para quando estiver sem internet.",
    downloadFeatureOneTap: "Reserva com Um Toque", downloadFeatureOneTapDesc: "Reserve em segundos com pagamento e dados salvos.",
    downloadFeatureAI: "Planejador IA", downloadFeatureAIDesc: "Sugestões de viagem personalizadas com IA, integradas diretamente.",
    downloadFeatureSecure: "Seguro e Privado", downloadFeatureSecureDesc: "Login biométrico e dados criptografados mantêm suas informações seguras.",
    downloadReviewsEyebrow: "Amado por Viajantes", downloadReviewsTitle: "O Que Dizem os Usuários",
    downloadReview1Name: "Sarah M.", downloadReview1Text: "Melhor app de viagem! Reservei minha viagem a Bali em menos de 2 minutos.",
    downloadReview2Name: "James K.", downloadReview2Text: "Os mapas offline me salvaram no Japão rural. Mudou completamente o jogo.",
    downloadReview3Name: "Aisha R.", downloadReview3Text: "As notificações push pegaram uma venda relâmpago de 40%. Economizei $300 na viagem!",
    downloadCompareTitle: "App vs. Navegador", downloadCompareApp: "App", downloadCompareWeb: "Web",
    downloadComparePush: "Notificações Push", downloadCompareOffline: "Acesso Offline", downloadCompareBiometric: "Login Biométrico",
    downloadCompareOneTap: "Reserva com Um Toque", downloadCompareAI: "Planejador IA", downloadCompareBrowse: "Explorar Destinos",
    downloadBottomCTATitle: "Pronto para Viajar Mais Inteligente?", downloadBottomCTADesc: "Baixe o Tourly grátis no iOS e Android.",
    downloadPlatformIOS: "iOS", downloadPlatformAndroid: "Android",
    authError: "Erro", authInvalidCredentials: "Credenciais inválidas",
    authSignInFailed: "Falha ao entrar. Tente novamente.", authSignUpFailed: "Falha ao cadastrar. Tente novamente.",
    authOAuthFailed: "Falha no OAuth. Tente novamente.", authGoogle: "Google", authApple: "Apple",
    getTheApp: "Baixar o App", adminPanel: "Painel Admin", adminPanelDesc: "Gerenciar reservas, usuários e destinos",
    tierElite: "Elite", tierPro: "Pro", aiLabel: "IA",
    premiumNoPurchases: "Nenhuma compra anterior encontrada.",
    thankYou: "Obrigado!", shareDestination: "Confira este destino no Tourly!", sharePackage: "Confira este pacote no Tourly!",
    shareVia: "Compartilhar via", shareWhatsApp: "WhatsApp", shareTwitter: "X (Twitter)", shareFacebook: "Facebook", shareTelegram: "Telegram", shareEmail: "Email", shareSMS: "SMS", shareCopyLink: "Copiar link", shareLinkCopied: "Link copiado para a área de transferência!", shareMoreOptions: "Mais opções",
    aiResponseBali: "Bali é uma escolha fantástica! Aqui está um roteiro de 5 dias:\n\n📍 Dia 1: Chegada, explorar Praia Seminyak\n📍 Dia 2: Terraços de Arroz de Ubud e Floresta dos Macacos\n📍 Dia 3: Templo Uluwatu e Dança Kecak\n📍 Dia 4: Passeio a Nusa Penida\n📍 Dia 5: Dia de spa e partida\n\nMelhor época: Abril-Outubro (estação seca). Orçamento: ~$50-150/dia.",
    aiResponseFamily: "Ótimos destinos familiares:\n\n🏖️ Maldivas - villas sobre a água, snorkeling\n🏰 Japão - Tokyo Disneyland, experiências culturais\n🌴 Tailândia - praias, santuários de elefantes\n🏔️ Suíça - trens panorâmicos, trilhas\n🦁 Quênia - safáris familiares\n\nQuer mais detalhes?",
    aiResponseBudget: "Melhores dicas de viagem econômica:\n\n💡 Viaje na baixa temporada\n💡 Reserve voos às terças\n💡 Use transporte local\n💡 Fique em pousadas\n💡 Coma em mercados locais\n💡 Pegue passes turísticos\n\nDestinos econômicos: Vietnã, Portugal, México, Tailândia, Marrocos.",
    aiResponseEurope: "Planejamento Europa:\n\n🇫🇷 Paris - mínimo 3 dias\n🇮🇹 Roma/Florença - 4 dias\n🇪🇸 Barcelona - 2-3 dias\n🇬🇷 Santorini - 2-3 dias\n\n✈️ Dica: Use aéreas econômicas entre cidades. Pegue um passe Eurail. Orçamento: €60-150/dia.",
    aiResponseDefault: "Ótima pergunta! Recomendo explorar nossos pacotes selecionados para as melhores ofertas. Visite também a página de destinos.\n\nQuer que eu planeje uma viagem? Me diga:\n• Para onde quer ir\n• Quantos dias\n• Seu orçamento\n• Estilo de viagem (aventura, relaxamento, cultura)",
    bannerGetApp: "Baixe o App Tourly", bannerFasterOn: "Experiência mais rápida no", bannerOpen: "Abrir",
    chatWelcomeBack: "Bem-vindo de volta! 👋 Bom te ver novamente. Como posso ajudar?",
    chatNewConvo: "Nova conversa! ✨ O chat anterior foi arquivado. Como posso ajudar?",
    chatFreshConvo: "Conversa nova! ✨ Em que posso ajudar?",
    chatLiveAgent: "Agente ao Vivo", chatConnectedTeam: "Conectado à equipe de suporte", chatEnd: "Encerrar",
    chatConvoClosed: "Esta conversa foi encerrada", chatStartNew: "Iniciar nova conversa",
    chatHereToHelp: "Estamos aqui para ajudar — pergunte qualquer coisa",
    chatReturnLive: "Voltar ao Chat ao Vivo", chatActiveConvo: "Você tem uma conversa ativa com o suporte",
    chatConnectAgent: "Falar com Agente", chatConnectAgentDesc: "Conecte-se à nossa equipe para ajuda em tempo real",
    chatConnectedLive: "Conectado ao Suporte ao Vivo", chatAgentRespondSoon: "Um agente responderá em breve.\nDigite uma mensagem para começar.",
    chatEnded: "Chat encerrado",
    chatArchivedChat: "Chat Arquivado", chatHistory: "Histórico de Chat", chatClearAll: "Limpar Tudo", chatDelete: "Excluir",
    chatNoArchives: "Nenhum chat arquivado", chatLiveAgentChat: "Chat com Agente", chatBotConvo: "Conversa com Bot",
    chatBackToArchives: "Voltar aos arquivos", chatConversations: "conversas", chatMessages: "mensagens",
    chatTranslate: "Traduzir", chatShowOriginal: "Mostrar original", chatTranslating: "Traduzindo…",
    chatTranslateAll: "Traduzir tudo", chatAutoTranslate: "Tradução automática",
    chatTranslatedFrom: "Traduzido de", chatTranslationFailed: "Falha na tradução",
    adminTitle: "Painel Admin", adminDashboardTitle: "Dashboard Admin", adminDashboardSubtitle: "Gerencie sua plataforma de viagem",
    adminTabDashboard: "Dashboard", adminTabBookings: "Reservas", adminTabChat: "Chat",
    adminTabDestinations: "Destinos", adminTabPackages: "Pacotes", adminTabUsers: "Usuários",
    adminCancel: "Cancelar", adminSave: "Salvar", adminEdit: "Editar", adminDelete: "Excluir", adminSearch: "Buscar",
    adminValidation: "Validação", adminTapUpload: "Toque para enviar", adminChange: "Alterar", adminRemove: "Remover",
    adminPermissionNeeded: "Permissão necessária", adminGrantCameraAccess: "Conceda acesso ao rolo da câmera para enviar imagens.",
    adminTotalBookings: "Total de Reservas", adminTotalBookingsTrend: "+12% este mês",
    adminRevenue: "Receita", adminRevenueTrend: "+8% este mês",
    adminTotalUsers: "Total de Usuários", adminTotalUsersTrend: "+3 esta semana",
    adminDestinations: "Destinos",
    adminQuickActions: "Ações Rápidas", adminAddDestination: "Adicionar Destino", adminCreatePackage: "Criar Pacote",
    adminSendNotification: "Enviar Notificação", adminViewReports: "Ver Relatórios",
    adminRecentBookings: "Reservas Recentes", adminNoBookingsYet: "Nenhuma reserva ainda",
    adminReports: "Relatórios", adminDone: "Pronto",
    adminBookingStatus: "Status da Reserva", adminConfirmed: "Confirmado", adminPending: "Pendente", adminCancelled: "Cancelado",
    adminMonthlyBookings: "Reservas Mensais (Últimos 6 Meses)", adminTotalPeriod: "Total neste período",
    adminRevenueLabel: "receita", adminRevenueByPackage: "Receita por Pacote", adminNoRevenueYet: "Sem dados de receita",
    adminLatestBookings: "Últimas Reservas", adminCustomTrip: "Viagem Personalizada", adminAvgBooking: "Média / Reserva",
    adminSendTo: "Enviar Para", adminAllUsers: "Todos os Usuários", adminSelectUsers: "Selecionar Usuários",
    adminNotifTitle: "Título", adminNotifTitlePlaceholder: "ex. Promoção de Verão — 30% Desc",
    adminNotifMessage: "Mensagem", adminNotifMessagePlaceholder: "Mensagem da notificação...", adminNotifType: "Tipo",
    adminTitleMessageRequired: "Título e mensagem são obrigatórios.", adminSelectAtLeastOne: "Selecione pelo menos um usuário.",
    adminSent: "Enviado", adminNotifSentTo: "Notificação enviada para", adminUsersSelected: "selecionados", adminClear: "Limpar",
    adminBookingDetails: "Detalhes da Reserva", adminFullName: "Nome Completo", adminEmail: "Email", adminPhone: "Telefone",
    adminTravelers: "Viajantes", adminCheckIn: "Check-in", adminCheckOut: "Check-out", adminDatePlaceholder: "AAAA-MM-DD",
    adminUpdated: "Atualizado", adminBookingUpdated: "Detalhes da reserva atualizados (demo local).",
    adminAll: "Todos", adminNoBookingsFound: "Nenhuma reserva encontrada", adminConfirm: "Confirmar", adminPax: "pax", adminNA: "N/D",
    adminEditDestination: "Editar Destino", adminAddDestinationTitle: "Adicionar Destino",
    adminCoverImage: "Imagem de Capa", adminName: "Nome", adminNamePlaceholder: "ex. Santorini",
    adminCountry: "País", adminCountryPlaceholder: "ex. Grécia", adminRating: "Avaliação (1-5)",
    adminDescription: "Descrição", adminDescPlaceholder: "Descrição breve...",
    adminSearchDestinations: "Buscar destinos...", adminAddNewDestination: "Adicionar Novo Destino",
    adminDeleteDestination: "Excluir Destino", adminDeleteConfirm: "Tem certeza que deseja excluir",
    adminNameCountryRequired: "Nome e país são obrigatórios.",
    adminEditPackage: "Editar Pacote", adminAddPackageTitle: "Adicionar Pacote",
    adminPackageImage: "Imagem do Pacote", adminPackageTitle: "Título", adminTitlePlaceholder: "ex. Férias na Praia",
    adminLocation: "Local", adminLocationPlaceholder: "ex. Malásia",
    adminDuration: "Duração", adminDurationPlaceholder: "ex. 7D/6N", adminMaxPax: "Máx. Pessoas",
    adminPrice: "Preço ($)", adminPricePlaceholder: "ex. 750",
    adminPackageDescPlaceholder: "Descrição do pacote...", adminSearchPackages: "Buscar pacotes...",
    adminAddNewPackage: "Adicionar Novo Pacote", adminDeletePackage: "Excluir Pacote",
    adminTitleLocationPriceRequired: "Título, local e preço são obrigatórios.", adminReviews: "avaliações",
    adminEditUser: "Editar Usuário", adminAvatar: "Avatar", adminRole: "Função",
    adminSearchUsers: "Buscar usuários...", adminActive: "Ativo", adminSuspended: "Suspenso", adminAdmins: "Admins",
    adminJoined: "Entrou", adminBookingsCount: "reservas",
    adminPromote: "Promover", adminDemote: "Rebaixar", adminSuspend: "Suspender", adminActivate: "Ativar",
    adminNameEmailRequired: "Nome e email são obrigatórios.",
    adminConversations: "Conversas", adminLive: "Ao Vivo", adminNoConvoYet: "Nenhuma conversa ainda",
    adminNoConvoDesc: "Quando usuários iniciarem o chat ao vivo,\nsuas conversas aparecerão aqui.",
    adminNoMessages: "Nenhuma mensagem", adminReopen: "Reabrir", adminClose: "Fechar",
    adminConvoClosed: "Conversa encerrada", adminTypeReply: "Digite uma resposta...",
    adminYou: "Você: ", adminClosed: "Fechado", adminUnread: "não lidas",
  },

  // ─────────────────────────── Korean ───────────────────────────
  ko: {
    tabHome: "홈", tabExplore: "탐색", tabTrips: "여행", tabSaved: "저장됨", tabGallery: "갤러리",
    heroTitle: "세계를\n탐험하는 여행", heroSubtitle: "Tourly와 함께 놀라운 여행지를 발견하고 잊을 수 없는 추억을 만드세요",
    learnMore: "자세히 보기", bookNow: "지금 예약", contactUs: "문의하기",
    findYourTrip: "여행 찾기", enterDestination: "여행지 입력", numberOfTravelers: "여행자 수",
    inquireNow: "지금 문의", popularDestinations: "인기 여행지", checkoutPackages: "패키지 보기",
    viewAll: "모두 보기 →", dealsTitle: "특가 & 플래시 세일 🔥", dealsSubtitle: "최대 30% 할인",
    save: "저장", saved: "저장됨", share: "공유", back: "뒤로", search: "검색",
    searchPlaceholder: "여행지, 패키지 검색...", noResults: "결과 없음",
    filterAll: "전체", filterDestinations: "여행지", filterPackages: "패키지",
    sortBy: "정렬", sortDefault: "기본", sortNameAZ: "이름: A–Z", sortRelevance: "관련성", sortPriceLow: "가격: 낮은순", sortPriceHigh: "가격: 높은순", sortRating: "최고 평점",
    priceRange: "가격", resultsFound: "개 결과", searchTourly: "Tourly 검색",
    searchHint: "완벽한 여행지나 패키지를 찾아보세요", tryDifferent: "다른 검색어를 시도하거나 필터를 조정하세요",
    clearFilters: "필터 초기화",
    bookThisDestination: "이 여행지 예약", aboutDestination: "이 여행지 소개",
    whatToExpect: "기대할 수 있는 것", whatsIncluded: "포함 사항", sampleItinerary: "샘플 일정",
    bookingTitle: "여행 예약", fullName: "성명", email: "이메일", phone: "전화번호",
    travelers: "여행자", checkIn: "체크인 날짜", checkOut: "체크아웃 날짜",
    submitBooking: "예약 제출", bookingSuccess: "예약이 성공적으로 제출되었습니다!",
    notificationsTitle: "알림", markAllRead: "모두 읽음 표시", noNotifications: "알림 없음",
    profileTitle: "내 프로필", myBookings: "내 예약", settings: "설정", aboutUs: "소개",
    settingsTitle: "설정", darkMode: "다크 모드", language: "언어", currency: "통화",
    pushNotifications: "푸시 알림", emailNotifications: "이메일 알림",
    myWishlist: "위시리스트", savedPlaces: "저장된 장소", nothingSaved: "아직 저장된 것이 없습니다",
    nothingSavedHint: "여행지나 패키지의 하트 아이콘을 탭하여 여기에 저장하세요.",
    exploreDestinations: "여행지 탐색", photoGallery: "포토 갤러리", photosFromTravellers: "여행자 사진",
    chatTitle: "실시간 지원", chatPlaceholder: "메시지 입력...", chatSend: "보내기",
    chatWelcome: "👋 안녕하세요! Tourly에 오신 것을 환영합니다. 어떻게 도와드릴까요?",
    chatHello: "안녕하세요! Tourly 여행 도우미입니다. 여행지, 패키지, 예약에 대해 뭐든 물어보세요!",
    personalInfo: "개인 정보", tripDetails: "여행 상세",
    selectedPackage: "선택된 패키지", destinationLabel: "여행지",
    whereToGo: "어디로 가고 싶으세요?", preferredCheckIn: "선호 체크인 날짜",
    preferredCheckOut: "선호 체크아웃 날짜", specialRequests: "특별 요청",
    specialRequestsPlaceholder: "특별한 요구사항이 있으신가요?", submitBookingRequest: "예약 요청 제출",
    validationNameRequired: "성명은 필수입니다", validationEmailRequired: "이메일은 필수입니다",
    validationEmailInvalid: "유효한 이메일을 입력하세요", validationPhoneRequired: "전화번호는 필수입니다",
    aboutPageTitle: "소개", whoWeAre: "우리는 누구인가", trustedTravelPartner: "믿을 수 있는 여행 파트너",
    whyChooseUs: "왜 우리를 선택하나요", whatMakesDifferent: "우리의 차별점",
    ourMission: "우리의 미션", happyTravelers: "만족한 여행자", tourPackages: "투어 패키지", supportUs: "지원",
    getInTouch: "연락하기", feelFreeContact: "편하게 연락주세요!",
    newsletter: "뉴스레터", newsletterSubtitle: "최신 할인 정보를 받아보세요.",
    subscribe: "구독", enterYourEmail: "이메일 입력", readyForTravel: "잊을 수 없는 여행 준비 되셨나요?",
    limitedTime: "기간 한정", flashDeals: "플래시 세일 🔥", flashDealsSubtitle: "인기 패키지 최대 30% 할인",
    endsIn: "종료까지", bookAt: "예약가", perPersonShort: "/인",
    packageNotFound: "패키지를 찾을 수 없습니다", destinationNotFound: "여행지를 찾을 수 없습니다",
    goBack: "돌아가기", aboutThisPackage: "이 패키지 소개",
    maxPax: "최대 인원", durationLabel: "기간", locationLabel: "위치",
    reviewsLabel: "리뷰", topRated: "최고 평점", countryLabel: "국가",
    bestTime: "최적 시기", allYear: "연중", groupSizeLabel: "그룹 크기",
    ratingLabel: "평점",
    uncoverPlace: "장소 발견", popularDestinationsSubtitle: "전 세계에서 가장 많이 방문한 여행지를 탐색하세요",
    popularPackages: "인기 패키지", packagesSubtitle: "다음 모험에 완벽한 여행 패키지를 찾아보세요",
    callToAction: "문의하기", ctaDescription: "오늘 연락주시면 꿈의 휴가 계획을 도와드리겠습니다!",
    perPerson: "1인당",
    defaultUsername: "여행자", welcomeBack: "돌아오신 것을 환영합니다!",
    countriesLabel: "국가", noBookingsHint: "아직 예약이 없습니다. 패키지나 여행지를 예약하면 여기에 표시됩니다.",
    browsePackages: "패키지 둘러보기", cancelBookingTitle: "예약 취소",
    cancelBookingMessage: "이 여행 예약을 취소하시겠습니까?", keepIt: "유지",
    cancelBookingAction: "예약 취소", bookedOn: "예약일", cancel: "취소", ok: "확인",
    customTrip: "맞춤 여행", travellersCount: "명의 여행자",
    viewDetails: "상세 보기",
    featureBestPrice: "최저가 보장",
    featureBestPriceDesc: "숨겨진 비용 없이 모든 여행 패키지에 최고의 가격을 제공합니다.",
    featureHandpicked: "엄선된 여행지",
    featureHandpickedDesc: "전문가들이 가장 아름답고 독특한 여행지를 엄선합니다.",
    featureExpertGuides: "전문 가이드",
    featureExpertGuidesDesc: "여행지의 구석구석을 아는 전문 현지 가이드.",
    featureFlexibleBooking: "유연한 예약",
    featureFlexibleBookingDesc: "유연한 취소 정책으로 쉽게 예약할 수 있습니다.",
    aboutParagraph1: "Tourly는 잊을 수 없는 여행 경험을 만드는 데 전념하는 프리미엄 여행사입니다. 수년간의 경험으로 세계에서 가장 인상적인 여행지와 여행자를 연결합니다.",
    aboutParagraph2: "열정적인 여행 전문가 팀이 일반 관광을 뛰어넘는 독특한 경험을 만들기 위해 끊임없이 노력합니다.",
    missionStatement: "탁월하고 지속 가능하며 합리적인 여행 경험을 제공하여 사람들이 세계를 탐험할 수 있도록 영감을 주고 지원합니다.",
    ctaContactDescription: "오늘 연락주시면 꿈의 휴가 계획을 도와드리겠습니다. 저희 팀은 24시간 대기하고 있습니다.",
    addressLabel: "주소", footerCopyright: "© 2024 Tourly. 모든 권리 보유",
    datePlaceholder: "YYYY-MM-DD",
    tagFlashSale: "플래시 세일", tagWeekendDeal: "주말 특가", tagLimitedOffer: "한정 혜택",
    timeJustNow: "방금", timeMinutesAgo: "분 전", timeHoursAgo: "시간 전", timeDaysAgo: "일 전",
    unreadNotifications: "개의 읽지 않은 알림",
    notifWelcomeTitle: "Tourly에 오신 것을 환영합니다 🌍", notifWelcomeBody: "멋진 여행지를 탐색하고 다음 모험을 예약하세요.",
    notifSaleTitle: "여름 세일 — 최대 30% 할인", notifSaleBody: "선택된 패키지 한정 할인. 2026년 3월 31일까지 예약하세요.",
    notifNewDestTitle: "새로운 여행지 추가", notifNewDestBody: "발리, 인도네시아가 이용 가능합니다. 단독 패키지를 확인하세요!",
    destinationDetailDesc: "이 놀라운 여행지의 아름다움과 문화를 경험하세요. 숨 막히는 풍경부터 풍부한 현지 전통까지, 모든 순간이 잊을 수 없을 것입니다.",
    expectGuidedTours: "현지 전문가와 함께하는 가이드 투어", expectLocalCuisine: "정통 현지 음식 체험",
    expectAccommodations: "편안한 숙박시설", expectTransportation: "교통편 포함", expectSupport: "24시간 여행 지원",
    inclusionAirfare: "왕복 항공권", inclusionTransfers: "공항 픽업",
    inclusionAccommodation: "숙박 (4성급 호텔)", inclusionBreakfast: "매일 조식",
    inclusionGuidedTours: "가이드 투어", inclusionInsurance: "여행자 보험", inclusionSupport: "24시간 지원",
    itineraryDay1Title: "도착 및 환영", itineraryDay1Desc: "공항 픽업, 체크인, 환영 만찬",
    itineraryDay2Title: "도시 탐방", itineraryDay2Desc: "가이드 투어, 현지 시장, 문화 명소",
    itineraryDay3Title: "어드벤처 데이", itineraryDay3Desc: "야외 활동, 자연 탐방",
    itineraryDay4Title: "문화 체험", itineraryDay4Desc: "전통 워크숍, 현지 요리",
    itineraryDay5Title: "자유 시간", itineraryDay5Desc: "선택 활동 또는 휴식",
    itineraryDay6Title: "파노라마 투어", itineraryDay6Desc: "인근 명소 견학",
    itineraryDay7Title: "출발", itineraryDay7Desc: "조식, 체크아웃, 공항 이동",
    packageDetailExtended: "세심하게 설계된 여행 패키지로 잊을 수 없는 여행을 경험하세요. 모든 세부 사항이 일생일대의 여행을 위해 계획되었습니다.",
    chatOnlineStatus: "온라인 · Tourly 지원팀",
    chatReply1: "연락 주셔서 감사합니다! 여행 전문가가 곧 도와드리겠습니다.",
    chatReply2: "좋은 질문입니다! 팀에서 메시지를 확인하고 있습니다.",
    chatReply3: "완벽한 여행 계획을 도와드리겠습니다! 자세한 내용을 알려주시겠어요?",
    chatReply4: "패키지는 완전히 맞춤 가능합니다. 전문가에게 연결해드리겠습니다.",
    chatReply5: "즉시 도움이 필요하시면 +01 (123) 4567 90으로 전화해 주세요.",
    priceAny: "전체", priceUnder500: "< 500", price500to1000: "500 – 700", priceOver1000: "> 700",
    signIn: "로그인", signUp: "회원가입", password: "비밀번호", confirmPassword: "비밀번호 확인",
    forgotPassword: "비밀번호를 잊으셨나요?", dontHaveAccount: "계정이 없으신가요?", alreadyHaveAccount: "이미 계정이 있으신가요?",
    orContinueWith: "또는 다음으로 계속", signingIn: "로그인 중...", signingUp: "계정 생성 중...",
    passwordMismatch: "비밀번호가 일치하지 않습니다", passwordTooShort: "비밀번호는 8자 이상이어야 합니다",
    welcomeTo: "환영합니다", createAccount: "계정 만들기", signInSubtitle: "예약 및 저장된 여행에 접근하려면 로그인하세요",
    signUpSubtitle: "Tourly에 가입하고 꿈의 여행을 계획하세요",
    continueWithGoogle: "Google로 계속", continueWithApple: "Apple로 계속",
    agreeToTerms: "가입하면 다음에 동의하는 것입니다", termsOfService: "이용약관", privacyPolicy: "개인정보 처리방침", andText: "및",
    signOut: "로그아웃", signOutConfirm: "정말 로그아웃하시겠습니까?",
    // Onboarding
    onboardingTitle1: "놀라운 여행지 발견", onboardingDesc1: "당신을 위해 엄선된 전 세계의 숨 막히는 장소를 탐험하세요.",
    onboardingTitle2: "자신 있게 예약", onboardingDesc2: "유연한 예약, 최저가 보장, 24시간 지원.",
    onboardingTitle3: "여행하며 리워드 적립", onboardingDesc3: "매 여행마다 포인트를 적립하고 독점 혜택을 잠금 해제하세요.",
    getStarted: "시작하기", next: "다음", skip: "건너뛰기",
    // Premium
    premiumTitle: "Tourly Pro", premiumSubtitle: "최고의 여행 경험을 잠금 해제",
    premiumProTitle: "프로", premiumEliteTitle: "엘리트",
    premiumPerMonth: "/월", premiumPerYear: "/년", premiumSavePercent: "할인",
    premiumSubscribe: "지금 구독", premiumRestore: "구매 복원", premiumCurrentPlan: "현재 플랜", premiumFreePlan: "무료",
    premiumFeatureDeals: "독점 할인 및 조기 접근", premiumFeatureSupport: "우선 고객 지원",
    premiumFeatureCancellation: "모든 예약 무료 취소", premiumFeatureAI: "AI 여행 플래너",
    premiumFeatureAdFree: "광고 없는 경험", premiumFeatureConcierge: "개인 컨시어지 서비스",
    premiumFeatureLounge: "공항 라운지 이용", premiumFeatureDoublePoints: "2배 로열티 포인트",
    premiumMostPopular: "가장 인기", premiumBestValue: "최고의 가치",
    // Loyalty
    loyaltyTitle: "리워드", loyaltyPoints: "포인트", loyaltyTier: "등급",
    loyaltyExplorer: "탐험가", loyaltyAdventurer: "모험가", loyaltyGlobetrotter: "세계여행가",
    loyaltyEarnPoints: "포인트 적립", loyaltyRedeemPoints: "포인트 사용", loyaltyHistory: "내역",
    loyaltyNextTier: "다음 등급", loyaltyPointsToNext: "다음 등급까지 포인트",
    loyaltyReferralBonus: "추천 보너스", loyaltyBookingPoints: "예약 포인트", loyaltyReviewPoints: "리뷰 포인트",
    // Referral
    referralTitle: "친구 초대", referralSubtitle: "Tourly를 공유하고 추천당 500포인트 적립",
    referralCode: "내 추천 코드", referralCopyCode: "코드 복사", referralCopied: "복사 완료!",
    referralShareText: "Tourly에 함께 하세요! 보너스 코드: ",
    referralFriendsJoined: "참여한 친구", referralHowItWorks: "이용 방법",
    referralStep1: "친구에게 고유 코드 공유",
    referralStep2: "친구가 가입하고 첫 여행 예약",
    referralStep3: "둘 다 500 보너스 포인트 적립!",
    // Reviews
    reviewsTitle: "리뷰", writeReview: "리뷰 작성", submitReview: "리뷰 제출",
    reviewPlaceholder: "경험을 공유하세요...", noReviewsYet: "아직 리뷰가 없습니다",
    beFirstReview: "첫 번째 리뷰를 남겨보세요!", ratingRequired: "평점을 선택해 주세요",
    reviewSubmitted: "리뷰가 제출되었습니다!", averageRating: "평균 평점",
    // AI Assistant
    aiAssistantTitle: "AI 여행 플래너", aiAssistantSubtitle: "AI로 완벽한 여행 계획",
    aiPlaceholder: "여행에 대해 무엇이든 물어보세요...",
    aiWelcomeMessage: "안녕하세요! AI 여행 어시스턴트입니다. 여행 계획, 목적지 추천, 일정 작성 등을 도와드립니다. 무엇을 탐험하고 싶으세요?",
    aiSuggestion1: "발리 5일 여행 계획", aiSuggestion2: "가족을 위한 최고의 여행지", aiSuggestion3: "유럽 알뜰 여행 팁",
    aiProFeature: "Pro로 업그레이드하여 무제한 AI 계획",
    // Travel Extras
    extrasTitle: "여행 업그레이드", extrasSubtitle: "엑스트라를 추가하여 여행을 더욱 풍성하게",
    extrasTransfer: "공항 교통편", extrasTransferDesc: "전용 차량 픽업 및 드롭오프",
    extrasInsurance: "여행자 보험", extrasInsuranceDesc: "여행을 위한 종합 보장",
    extrasSim: "eSIM 데이터 플랜", extrasSimDesc: "무제한 데이터로 연결 유지",
    extrasLounge: "공항 라운지", extrasLoungeDesc: "비행 전 편안하게 휴식",
    addToBooking: "예약에 추가", skipExtras: "건너뛰고 확인으로",
    // Featured
    featuredBadge: "추천", sponsoredBadge: "스폰서", trendingBadge: "인기",
    // Landing page
    landingBrand: "Tourly", landingHeroBadge: "#1 AI 기반 여행 앱",
    landingHeroTitle: "Tourly와\n함께 세계를\n탐험하세요", landingHeroSubtitle: "숨 막히는 여행지, 엄선된 패키지, AI 여행 계획 — 모두 하나의 앱에서.",
    landingCTA: "시작하기",
    landingStatTrips: "50K+", landingStatTripsLabel: "예약된 여행", landingStatDest: "120+", landingStatDestLabel: "여행지", landingStatRating: "4.9", landingStatRatingLabel: "앱 평점",
    landingWhyEyebrow: "왜 Tourly", landingWhyTitle: "스마트하게 여행,\n힘들지 않게", landingWhySubtitle: "최신 기술과 현지 인사이트로 완벽한 여행에 필요한 모든 것.",
    landingFeatureAI: "AI 여행 플래너", landingFeatureAIDesc: "선호도와 예산에 맞춰 AI가 만든 맞춤 여행 일정을 받으세요.",
    landingFeatureDest: "50+ 여행지", landingFeatureDestDesc: "6개 대륙의 숨겨진 보석부터 상징적인 랜드마크까지 엄선된 여행지를 탐험하세요.",
    landingFeatureSecure: "안전한 예약", landingFeatureSecureDesc: "종단 간 암호화 결제, 유연한 취소 및 전액 환불 보장.",
    landingFeatureConcierge: "24/7 컨시어지", landingFeatureConciergeDesc: "목적지의 구석구석을 아는 현지 전문가의 실시간 지원.",
    landingTrendingEyebrow: "트렌딩", landingTrendingTitle: "인기 여행지",
    landingCuratedEyebrow: "당신을 위해 엄선", landingCuratedTitle: "여행 패키지",
    landingTestimonialsEyebrow: "후기", landingTestimonialsTitle: "여행자들이 사랑합니다",
    landingTestimonial1Name: "Sarah Mitchell", landingTestimonial1Location: "뉴욕, 미국",
    landingTestimonial1Quote: "Tourly 덕분에 허니문 계획이 쉬워졌어요. AI가 찾지 못했을 장소를 추천해줬어요!",
    landingTestimonial2Name: "다나카 켄지", landingTestimonial2Location: "도쿄, 일본",
    landingTestimonial2Quote: "컨시어지 서비스가 놀라웠어요. 방문한 모든 도시에 현지 친구가 있는 것 같았어요.",
    landingTestimonial3Name: "Amara Osei", landingTestimonial3Location: "아크라, 가나",
    landingTestimonial3Quote: "최고의 여행 앱입니다. 할인이 진짜고 예약 과정이 매끄러워요.",
    landingReadyCTA: "다음 모험 준비 되셨나요?", landingReadyDesc: "Tourly로 계획하고 예약하는 5만 명 이상의 여행자에 합류하세요. 오늘 무료 계정을 만드세요.",
    landingCreateAccount: "무료 계정 생성",
    landingFooterTagline: "2024년부터 여행을 접근 가능하고, 맞춤화되고, 잊을 수 없게 만들어갑니다.",
    landingFooterAbout: "소개", landingFooterContact: "연락처", landingFooterDeals: "특가",
    landingFooterCopyright: "© 2024–2026 Tourly. 모든 권리 보유.",
    landingExplore: "탐험",
    // Download page
    downloadTitle: "앱 다운로드",
    downloadHeroSubtitle: "주머니 속 여행 동반자.\n탐색, 예약, 출발 — 모두 하나의 앱으로.",
    downloadOnThe: "에서 다운로드", downloadGetItOn: "에서 받기", downloadAppStore: "App Store", downloadGooglePlay: "Google Play",
    downloadStatRating: "4.9", downloadStatRatingLabel: "앱 평점", downloadStatDownloads: "500K+", downloadStatDownloadsLabel: "다운로드",
    downloadStatDest: "100+", downloadStatDestLabel: "여행지", downloadStatSupport: "24/7", downloadStatSupportLabel: "지원",
    downloadExclusiveEyebrow: "앱 전용", downloadWhyTitle: "왜 Tourly를 다운로드하나요?", downloadWhySubtitle: "앱은 브라우저에서 사용할 수 없는 기능을 제공합니다.",
    downloadFeatureFast: "초고속", downloadFeatureFastDesc: "브라우저보다 부드러운 네이티브 성능.",
    downloadFeatureNotif: "푸시 알림", downloadFeatureNotifDesc: "특가를 놓치지 마세요 — 플래시 세일 즉시 알림을 받으세요.",
    downloadFeatureOffline: "오프라인 액세스", downloadFeatureOfflineDesc: "인터넷 없이 사용할 수 있도록 일정과 지도를 저장하세요.",
    downloadFeatureOneTap: "원탭 예약", downloadFeatureOneTapDesc: "저장된 결제 정보로 몇 초 만에 예약하세요.",
    downloadFeatureAI: "AI 여행 플래너", downloadFeatureAIDesc: "AI 기반 맞춤 여행 제안이 앱에 바로 내장되어 있습니다.",
    downloadFeatureSecure: "안전하고 개인적", downloadFeatureSecureDesc: "생체 인증 로그인과 암호화된 데이터로 정보를 안전하게.",
    downloadReviewsEyebrow: "여행자들이 사랑합니다", downloadReviewsTitle: "사용자 후기",
    downloadReview1Name: "Sarah M.", downloadReview1Text: "최고의 여행 앱! 발리 여행을 2분 만에 예약했어요.",
    downloadReview2Name: "James K.", downloadReview2Text: "오프라인 지도가 일본 시골에서 도움이 됐어요. 완전 게임체인저.",
    downloadReview3Name: "Aisha R.", downloadReview3Text: "푸시 알림으로 40% 플래시 세일을 잡았어요. 여행에서 $300 절약!",
    downloadCompareTitle: "앱 vs. 브라우저", downloadCompareApp: "앱", downloadCompareWeb: "웹",
    downloadComparePush: "푸시 알림", downloadCompareOffline: "오프라인 액세스", downloadCompareBiometric: "생체 인증 로그인",
    downloadCompareOneTap: "원탭 예약", downloadCompareAI: "AI 여행 플래너", downloadCompareBrowse: "여행지 탐색",
    downloadBottomCTATitle: "더 스마트하게 여행할 준비가 되셨나요?", downloadBottomCTADesc: "iOS와 Android에서 Tourly를 무료로 다운로드하세요.",
    downloadPlatformIOS: "iOS", downloadPlatformAndroid: "Android",
    authError: "오류", authInvalidCredentials: "잘못된 자격 증명",
    authSignInFailed: "로그인 실패. 다시 시도해주세요.", authSignUpFailed: "회원가입 실패. 다시 시도해주세요.",
    authOAuthFailed: "OAuth 로그인 실패. 다시 시도해주세요.", authGoogle: "Google", authApple: "Apple",
    getTheApp: "앱 다운로드", adminPanel: "관리자 패널", adminPanelDesc: "예약, 사용자 및 여행지 관리",
    tierElite: "엘리트", tierPro: "프로", aiLabel: "AI",
    premiumNoPurchases: "이전 구매 내역이 없습니다.",
    thankYou: "감사합니다!", shareDestination: "Tourly에서 이 여행지를 확인하세요!", sharePackage: "Tourly에서 이 패키지를 확인하세요!",
    shareVia: "공유하기", shareWhatsApp: "WhatsApp", shareTwitter: "X (Twitter)", shareFacebook: "Facebook", shareTelegram: "Telegram", shareEmail: "이메일", shareSMS: "SMS", shareCopyLink: "링크 복사", shareLinkCopied: "클립보드에 링크가 복사되었습니다!", shareMoreOptions: "더 많은 옵션",
    aiResponseBali: "발리는 환상적인 선택입니다! 5일 추천 일정입니다:\n\n📍 1일차: 도착, 스미냑 비치 탐방\n📍 2일차: 우붓 라이스 테라스 & 원숭이 숲\n📍 3일차: 울루와투 사원 & 케차크 댄스\n📍 4일차: 누사 페니다 당일 여행\n📍 5일차: 스파 데이 & 출발\n\n최적 시기: 4월-10월 (건기). 예산: 편안함에 따라 ~$50-150/일.",
    aiResponseFamily: "훌륭한 가족 여행지:\n\n🏖️ 몰디브 - 수상 빌라, 스노클링\n🏰 일본 - 도쿄 디즈니랜드, 문화 체험\n🌴 태국 - 해변, 코끼리 보호구역\n🏔️ 스위스 - 파노라마 기차, 하이킹\n🦁 케냐 - 가족 사파리\n\n더 자세한 정보를 원하시나요?",
    aiResponseBudget: "최고의 예산 여행 팁:\n\n💡 비수기(봄/가을)에 여행\n💡 화요일에 항공권 예약\n💡 대중교통 이용\n💡 게스트하우스에 숙박\n💡 현지 시장에서 식사\n💡 투어 패스 구매\n\n저렴한 여행지: 베트남, 포르투갈, 멕시코, 태국, 모로코.",
    aiResponseEurope: "유럽 여행 계획:\n\n🇫🇷 파리 - 최소 3일\n🇮🇹 로마/피렌체 - 4일\n🇪🇸 바르셀로나 - 2-3일\n🇬🇷 산토리니 - 2-3일\n\n✈️ 팁: 도시 간 저가 항공 이용. 장거리엔 유레일 패스. 예산: €60-150/일.",
    aiResponseDefault: "좋은 질문입니다! 최고의 할인을 위해 엄선된 패키지를 추천합니다. 영감을 위해 여행지 페이지도 확인하세요.\n\n특정 여행을 계획해 드릴까요? 말씀해 주세요:\n• 어디로 가고 싶은지\n• 며칠 동안\n• 예산 범위\n• 여행 스타일 (모험, 휴식, 문화)",
    bannerGetApp: "Tourly 앱 받기", bannerFasterOn: "더 빠른 경험", bannerOpen: "열기",
    chatWelcomeBack: "돌아오셨군요! 👋 다시 만나서 반갑습니다. 어떻게 도와드릴까요?",
    chatNewConvo: "새 대화 시작! ✨ 이전 채팅이 보관되었습니다. 어떻게 도와드릴까요?",
    chatFreshConvo: "새 대화 시작! ✨ 무엇을 도와드릴까요?",
    chatLiveAgent: "라이브 에이전트", chatConnectedTeam: "지원팀에 연결됨", chatEnd: "종료",
    chatConvoClosed: "이 대화가 종료되었습니다", chatStartNew: "새 대화 시작",
    chatHereToHelp: "도움이 필요하시면 무엇이든 물어보세요",
    chatReturnLive: "라이브 채팅으로 돌아가기", chatActiveConvo: "지원팀과 활성 대화가 있습니다",
    chatConnectAgent: "에이전트와 채팅", chatConnectAgentDesc: "실시간 도움을 위해 지원팀에 연결하세요",
    chatConnectedLive: "라이브 지원에 연결됨", chatAgentRespondSoon: "지원 에이전트가 곧 응답합니다.\n메시지를 입력하여 시작하세요.",
    chatEnded: "채팅 종료",
    chatArchivedChat: "보관된 채팅", chatHistory: "채팅 기록", chatClearAll: "모두 삭제", chatDelete: "삭제",
    chatNoArchives: "보관된 채팅 없음", chatLiveAgentChat: "라이브 에이전트 채팅", chatBotConvo: "봇 대화",
    chatBackToArchives: "보관함으로 돌아가기", chatConversations: "대화", chatMessages: "메시지",
    chatTranslate: "번역", chatShowOriginal: "원문 보기", chatTranslating: "번역 중…",
    chatTranslateAll: "모두 번역", chatAutoTranslate: "자동 번역",
    chatTranslatedFrom: "번역 원본", chatTranslationFailed: "번역 실패",
    adminTitle: "관리자 패널", adminDashboardTitle: "관리자 대시보드", adminDashboardSubtitle: "여행 플랫폼 관리",
    adminTabDashboard: "대시보드", adminTabBookings: "예약", adminTabChat: "채팅",
    adminTabDestinations: "여행지", adminTabPackages: "패키지", adminTabUsers: "사용자",
    adminCancel: "취소", adminSave: "저장", adminEdit: "편집", adminDelete: "삭제", adminSearch: "검색",
    adminValidation: "유효성 검사", adminTapUpload: "탭하여 업로드", adminChange: "변경", adminRemove: "제거",
    adminPermissionNeeded: "권한 필요", adminGrantCameraAccess: "이미지 업로드를 위해 카메라 롤 접근을 허용해주세요.",
    adminTotalBookings: "총 예약", adminTotalBookingsTrend: "이번 달 +12%",
    adminRevenue: "수익", adminRevenueTrend: "이번 달 +8%",
    adminTotalUsers: "총 사용자", adminTotalUsersTrend: "이번 주 +3",
    adminDestinations: "여행지",
    adminQuickActions: "빠른 작업", adminAddDestination: "여행지 추가", adminCreatePackage: "패키지 생성",
    adminSendNotification: "알림 보내기", adminViewReports: "보고서 보기",
    adminRecentBookings: "최근 예약", adminNoBookingsYet: "아직 예약이 없습니다",
    adminReports: "보고서", adminDone: "완료",
    adminBookingStatus: "예약 상태", adminConfirmed: "확인됨", adminPending: "대기 중", adminCancelled: "취소됨",
    adminMonthlyBookings: "월별 예약 (최근 6개월)", adminTotalPeriod: "이 기간 합계",
    adminRevenueLabel: "수익", adminRevenueByPackage: "패키지별 수익", adminNoRevenueYet: "수익 데이터 없음",
    adminLatestBookings: "최신 예약", adminCustomTrip: "맞춤 여행", adminAvgBooking: "평균 / 예약",
    adminSendTo: "보내기", adminAllUsers: "모든 사용자", adminSelectUsers: "사용자 선택",
    adminNotifTitle: "제목", adminNotifTitlePlaceholder: "예: 여름 세일 — 30% 할인",
    adminNotifMessage: "메시지", adminNotifMessagePlaceholder: "알림 메시지...", adminNotifType: "유형",
    adminTitleMessageRequired: "제목과 메시지가 필요합니다.", adminSelectAtLeastOne: "사용자를 한 명 이상 선택하세요.",
    adminSent: "전송됨", adminNotifSentTo: "알림 전송 대상", adminUsersSelected: "선택됨", adminClear: "지우기",
    adminBookingDetails: "예약 상세", adminFullName: "이름", adminEmail: "이메일", adminPhone: "전화",
    adminTravelers: "여행자", adminCheckIn: "체크인", adminCheckOut: "체크아웃", adminDatePlaceholder: "YYYY-MM-DD",
    adminUpdated: "업데이트됨", adminBookingUpdated: "예약 상세 업데이트됨 (로컬 데모).",
    adminAll: "전체", adminNoBookingsFound: "예약을 찾을 수 없음", adminConfirm: "확인", adminPax: "명", adminNA: "N/A",
    adminEditDestination: "여행지 편집", adminAddDestinationTitle: "여행지 추가",
    adminCoverImage: "커버 이미지", adminName: "이름", adminNamePlaceholder: "예: 산토리니",
    adminCountry: "국가", adminCountryPlaceholder: "예: 그리스", adminRating: "평점 (1-5)",
    adminDescription: "설명", adminDescPlaceholder: "간단한 설명...",
    adminSearchDestinations: "여행지 검색...", adminAddNewDestination: "새 여행지 추가",
    adminDeleteDestination: "여행지 삭제", adminDeleteConfirm: "정말 삭제하시겠습니까",
    adminNameCountryRequired: "이름과 국가가 필요합니다.",
    adminEditPackage: "패키지 편집", adminAddPackageTitle: "패키지 추가",
    adminPackageImage: "패키지 이미지", adminPackageTitle: "제목", adminTitlePlaceholder: "예: 해변 휴가",
    adminLocation: "위치", adminLocationPlaceholder: "예: 말레이시아",
    adminDuration: "기간", adminDurationPlaceholder: "예: 7일/6박", adminMaxPax: "최대 인원",
    adminPrice: "가격 ($)", adminPricePlaceholder: "예: 750",
    adminPackageDescPlaceholder: "패키지 설명...", adminSearchPackages: "패키지 검색...",
    adminAddNewPackage: "새 패키지 추가", adminDeletePackage: "패키지 삭제",
    adminTitleLocationPriceRequired: "제목, 위치, 가격이 필요합니다.", adminReviews: "리뷰",
    adminEditUser: "사용자 편집", adminAvatar: "아바타", adminRole: "역할",
    adminSearchUsers: "사용자 검색...", adminActive: "활성", adminSuspended: "정지됨", adminAdmins: "관리자",
    adminJoined: "가입일", adminBookingsCount: "예약",
    adminPromote: "승격", adminDemote: "강등", adminSuspend: "정지", adminActivate: "활성화",
    adminNameEmailRequired: "이름과 이메일이 필요합니다.",
    adminConversations: "대화", adminLive: "라이브", adminNoConvoYet: "아직 대화가 없습니다",
    adminNoConvoDesc: "사용자가 라이브 채팅을 시작하면\n대화가 여기에 표시됩니다.",
    adminNoMessages: "메시지 없음", adminReopen: "재개", adminClose: "닫기",
    adminConvoClosed: "대화가 종료되었습니다", adminTypeReply: "답장 입력...",
    adminYou: "나: ", adminClosed: "종료됨", adminUnread: "읽지 않음",
  },

  // ─────────────────────────── Chinese (Simplified) ───────────────────────────
  zh: {
    tabHome: "首页", tabExplore: "探索", tabTrips: "行程", tabSaved: "已收藏", tabGallery: "图库",
    heroTitle: "踏上探索\n世界之旅", heroSubtitle: "与Tourly一起发现令人惊叹的目的地，创造难忘的回忆",
    learnMore: "了解更多", bookNow: "立即预订", contactUs: "联系我们",
    findYourTrip: "寻找您的旅行", enterDestination: "输入目的地", numberOfTravelers: "旅客人数",
    inquireNow: "立即咨询", popularDestinations: "热门目的地", checkoutPackages: "查看我们的套餐",
    viewAll: "查看全部 →", dealsTitle: "特惠 & 限时抢购 🔥", dealsSubtitle: "最高享受30%折扣",
    save: "保存", saved: "已保存", share: "分享", back: "返回", search: "搜索",
    searchPlaceholder: "搜索目的地、套餐...", noResults: "未找到结果",
    filterAll: "全部", filterDestinations: "目的地", filterPackages: "套餐",
    sortBy: "排序", sortDefault: "默认", sortNameAZ: "名称: A–Z", sortRelevance: "相关性", sortPriceLow: "价格: 低→高", sortPriceHigh: "价格: 高→低", sortRating: "最高评分",
    priceRange: "价格", resultsFound: "条结果", searchTourly: "搜索Tourly",
    searchHint: "找到您理想的目的地或旅行套餐", tryDifferent: "尝试其他关键词或调整筛选条件",
    clearFilters: "清除筛选",
    bookThisDestination: "预订此目的地", aboutDestination: "关于此目的地",
    whatToExpect: "行程亮点", whatsIncluded: "包含内容", sampleItinerary: "行程示例",
    bookingTitle: "预订旅行", fullName: "姓名", email: "电子邮件", phone: "电话",
    travelers: "旅客", checkIn: "入住日期", checkOut: "退房日期",
    submitBooking: "提交预订", bookingSuccess: "预订已成功提交！",
    notificationsTitle: "通知", markAllRead: "全部标为已读", noNotifications: "暂无通知",
    profileTitle: "我的资料", myBookings: "我的预订", settings: "设置", aboutUs: "关于我们",
    settingsTitle: "设置", darkMode: "深色模式", language: "语言", currency: "货币",
    pushNotifications: "推送通知", emailNotifications: "邮件通知",
    myWishlist: "我的心愿单", savedPlaces: "已保存的地方", nothingSaved: "暂无收藏",
    nothingSavedHint: "点击任何目的地或套餐的心形图标将其保存至此。",
    exploreDestinations: "探索目的地", photoGallery: "照片库", photosFromTravellers: "旅行者照片",
    chatTitle: "在线客服", chatPlaceholder: "输入消息...", chatSend: "发送",
    chatWelcome: "👋 您好！欢迎来到Tourly。我们能为您做什么？",
    chatHello: "您好！我是您的Tourly旅行助手。有关目的地、套餐或预订的任何问题都可以问我！",
    personalInfo: "个人信息", tripDetails: "行程详情",
    selectedPackage: "已选套餐", destinationLabel: "目的地",
    whereToGo: "您想去哪里？", preferredCheckIn: "首选入住日期",
    preferredCheckOut: "首选退房日期", specialRequests: "特别要求",
    specialRequestsPlaceholder: "有特殊需求吗？", submitBookingRequest: "提交预订请求",
    validationNameRequired: "姓名为必填项", validationEmailRequired: "邮箱为必填项",
    validationEmailInvalid: "请输入有效的电子邮件", validationPhoneRequired: "电话为必填项",
    aboutPageTitle: "关于我们", whoWeAre: "我们是谁", trustedTravelPartner: "您值得信赖的旅行伙伴",
    whyChooseUs: "为什么选择我们", whatMakesDifferent: "我们的不同之处",
    ourMission: "我们的使命", happyTravelers: "满意旅客", tourPackages: "旅行套餐", supportUs: "支持",
    getInTouch: "联系我们", feelFreeContact: "欢迎随时联系我们！",
    newsletter: "新闻通讯", newsletterSubtitle: "订阅获取最新优惠信息。",
    subscribe: "订阅", enterYourEmail: "输入您的邮箱", readyForTravel: "准备好开启难忘之旅了吗？",
    limitedTime: "限时", flashDeals: "限时抢购 🔥", flashDealsSubtitle: "热门套餐最高省30%",
    endsIn: "剩余", bookAt: "预订价", perPersonShort: "/人",
    packageNotFound: "未找到套餐", destinationNotFound: "未找到目的地",
    goBack: "返回", aboutThisPackage: "关于此套餐",
    maxPax: "最大人数", durationLabel: "时长", locationLabel: "位置",
    reviewsLabel: "评价", topRated: "最高评分", countryLabel: "国家",
    bestTime: "最佳时间", allYear: "全年", groupSizeLabel: "团队规模",
    ratingLabel: "评分",
    uncoverPlace: "发现目的地", popularDestinationsSubtitle: "探索我们全球最受欢迎的旅游目的地",
    popularPackages: "热门套餐", packagesSubtitle: "为您的下一次冒险找到完美的旅行套餐",
    callToAction: "立即咨询", ctaDescription: "今天就联系我们，我们将帮助您规划梦想假期！",
    perPerson: "每人",
    defaultUsername: "旅行者", welcomeBack: "欢迎回来！",
    countriesLabel: "国家", noBookingsHint: "暂无预订。预订套餐或目的地后将在此显示。",
    browsePackages: "浏览套餐", cancelBookingTitle: "取消预订",
    cancelBookingMessage: "确定要取消此行程的预订吗？", keepIt: "保留",
    cancelBookingAction: "取消预订", bookedOn: "预订日期", cancel: "取消", ok: "确定",
    customTrip: "定制行程", travellersCount: "位旅客",
    viewDetails: "查看详情",
    featureBestPrice: "最优价格保证",
    featureBestPriceDesc: "我们为所有旅行套餐提供最优惠的价格，无隐藏费用。",
    featureHandpicked: "精选目的地",
    featureHandpickedDesc: "我们的专家精心挑选最美丽、最独特的旅游目的地。",
    featureExpertGuides: "专业导游",
    featureExpertGuidesDesc: "了解目的地每个角落的专业当地导游。",
    featureFlexibleBooking: "灵活预订",
    featureFlexibleBookingDesc: "便捷的预订流程，灵活的取消政策。",
    aboutParagraph1: "Tourly是一家专注于创造难忘旅行体验的高端旅行社。凭借多年经验，我们将旅行者与世界上最令人印象深刻的目的地连接起来。",
    aboutParagraph2: "我们充满热情的旅行专家团队不懈努力，打造超越普通旅游的独特体验。",
    missionStatement: "通过提供卓越、可持续且经济实惠的旅行体验，激励和帮助人们探索世界。",
    ctaContactDescription: "今天联系我们，我们将帮助您规划梦想假期。我们的团队全天候为您服务。",
    addressLabel: "地址", footerCopyright: "© 2024 Tourly. 保留所有权利",
    datePlaceholder: "年-月-日",
    tagFlashSale: "限时抢购", tagWeekendDeal: "周末特惠", tagLimitedOffer: "限量优惠",
    timeJustNow: "刚刚", timeMinutesAgo: "分钟前", timeHoursAgo: "小时前", timeDaysAgo: "天前",
    unreadNotifications: "条未读通知",
    notifWelcomeTitle: "欢迎来到 Tourly 🌍", notifWelcomeBody: "开始探索精彩目的地，预订您的下一次冒险。",
    notifSaleTitle: "夏季特惠 — 最高七折", notifSaleBody: "精选套餐限时优惠。2026年3月31日前预订。",
    notifNewDestTitle: "新目的地已添加", notifNewDestBody: "巴厘岛（印度尼西亚）现已开放。查看我们的专属套餐！",
    destinationDetailDesc: "体验这个令人惊叹的目的地的美丽与文化。从令人叹为观止的风景到丰富的当地传统，每一刻都将令人难忘。",
    expectGuidedTours: "当地专家带领的导览", expectLocalCuisine: "正宗当地美食体验",
    expectAccommodations: "舒适住宿", expectTransportation: "交通包含", expectSupport: "全天候旅行支持",
    inclusionAirfare: "往返机票", inclusionTransfers: "机场接送",
    inclusionAccommodation: "住宿（四星级酒店）", inclusionBreakfast: "每日早餐",
    inclusionGuidedTours: "导览", inclusionInsurance: "旅行保险", inclusionSupport: "全天候客服",
    itineraryDay1Title: "抵达与欢迎", itineraryDay1Desc: "机场接机、入住、欢迎晚宴",
    itineraryDay2Title: "城市探索", itineraryDay2Desc: "导览参观、当地集市、文化遗址",
    itineraryDay3Title: "探险日", itineraryDay3Desc: "户外活动、自然徒步",
    itineraryDay4Title: "文化体验", itineraryDay4Desc: "传统工作坊、当地美食",
    itineraryDay5Title: "自由活动日", itineraryDay5Desc: "选择性活动或休闲放松",
    itineraryDay6Title: "全景游览", itineraryDay6Desc: "前往附近景点游览",
    itineraryDay7Title: "离开", itineraryDay7Desc: "早餐、退房、机场送机",
    packageDetailExtended: "通过我们精心设计的旅行套餐，体验一次难忘的旅程。每个细节都为打造您一生难忘的旅行而规划。",
    chatOnlineStatus: "在线 · Tourly客服",
    chatReply1: "感谢您的联系！旅行专家将很快为您服务。",
    chatReply2: "好问题！我们的团队正在查看您的消息。",
    chatReply3: "我们很乐意帮您规划完美旅程！能否分享更多细节？",
    chatReply4: "我们的套餐完全可定制。我将为您连接专家。",
    chatReply5: "如需即时帮助，您也可以拨打 +01 (123) 4567 90。",
    priceAny: "不限", priceUnder500: "< 500", price500to1000: "500 – 700", priceOver1000: "> 700",
    signIn: "登录", signUp: "注册", password: "密码", confirmPassword: "确认密码",
    forgotPassword: "忘记密码？", dontHaveAccount: "还没有账号？", alreadyHaveAccount: "已有账号？",
    orContinueWith: "或通过以下方式继续", signingIn: "登录中...", signingUp: "创建账号中...",
    passwordMismatch: "密码不匹配", passwordTooShort: "密码至少需要8个字符",
    welcomeTo: "欢迎来到", createAccount: "创建账号", signInSubtitle: "登录以访问您的预订和已保存的行程",
    signUpSubtitle: "加入Tourly，开始规划您的梦想假期",
    continueWithGoogle: "使用Google继续", continueWithApple: "使用Apple继续",
    agreeToTerms: "注册即表示您同意我们的", termsOfService: "服务条款", privacyPolicy: "隐私政策", andText: "和",
    signOut: "退出登录", signOutConfirm: "您确定要退出登录吗？",
    // Onboarding
    onboardingTitle1: "发现精彩目的地", onboardingDesc1: "探索为您精心挑选的世界各地令人叹为观止的地方。",
    onboardingTitle2: "放心预订", onboardingDesc2: "灵活预订、最低价保证、全天候客服支持。",
    onboardingTitle3: "旅行赚取奖励", onboardingDesc3: "每次旅行积累积分，解锁专属福利。",
    getStarted: "开始使用", next: "下一步", skip: "跳过",
    // Premium
    premiumTitle: "Tourly Pro", premiumSubtitle: "解锁终极旅行体验",
    premiumProTitle: "专业版", premiumEliteTitle: "精英版",
    premiumPerMonth: "/月", premiumPerYear: "/年", premiumSavePercent: "节省",
    premiumSubscribe: "立即订阅", premiumRestore: "恢复购买", premiumCurrentPlan: "当前方案", premiumFreePlan: "免费",
    premiumFeatureDeals: "专属优惠和提前访问", premiumFeatureSupport: "优先客户支持",
    premiumFeatureCancellation: "所有预订免费取消", premiumFeatureAI: "AI旅行规划师",
    premiumFeatureAdFree: "无广告体验", premiumFeatureConcierge: "私人礼宾服务",
    premiumFeatureLounge: "机场贵宾室通行", premiumFeatureDoublePoints: "2倍忠诚积分",
    premiumMostPopular: "最受欢迎", premiumBestValue: "最超值",
    // Loyalty
    loyaltyTitle: "奖励", loyaltyPoints: "积分", loyaltyTier: "等级",
    loyaltyExplorer: "探索者", loyaltyAdventurer: "冒险家", loyaltyGlobetrotter: "环球旅行家",
    loyaltyEarnPoints: "赚取积分", loyaltyRedeemPoints: "兑换积分", loyaltyHistory: "历史记录",
    loyaltyNextTier: "下一等级", loyaltyPointsToNext: "距下一等级还需积分",
    loyaltyReferralBonus: "推荐奖励", loyaltyBookingPoints: "预订积分", loyaltyReviewPoints: "评价积分",
    // Referral
    referralTitle: "推荐好友", referralSubtitle: "分享Tourly，每次推荐赚500积分",
    referralCode: "你的推荐码", referralCopyCode: "复制代码", referralCopied: "已复制！",
    referralShareText: "加入我的Tourly！使用我的代码获得奖励：",
    referralFriendsJoined: "已加入的好友", referralHowItWorks: "使用方法",
    referralStep1: "与好友分享你的专属代码",
    referralStep2: "他们注册并预订第一次旅行",
    referralStep3: "双方各获得500奖励积分！",
    // Reviews
    reviewsTitle: "评价", writeReview: "写评价", submitReview: "提交评价",
    reviewPlaceholder: "分享你的体验...", noReviewsYet: "暂无评价",
    beFirstReview: "成为第一个评价的人！", ratingRequired: "请选择评分",
    reviewSubmitted: "评价已提交！", averageRating: "平均评分",
    // AI Assistant
    aiAssistantTitle: "AI旅行规划师", aiAssistantSubtitle: "用AI规划完美旅行",
    aiPlaceholder: "关于旅行随便问我...",
    aiWelcomeMessage: "你好！我是你的AI旅行助手。我可以帮你规划旅行、推荐目的地、创建行程等。你想探索什么？",
    aiSuggestion1: "规划5天巴厘岛之旅", aiSuggestion2: "最适合家庭的目的地", aiSuggestion3: "欧洲省钱旅行攻略",
    aiProFeature: "升级Pro享受无限AI规划",
    // Travel Extras
    extrasTitle: "升级你的旅程", extrasSubtitle: "添加额外服务让旅行更精彩",
    extrasTransfer: "机场接送", extrasTransferDesc: "私人专车接送服务",
    extrasInsurance: "旅行保险", extrasInsuranceDesc: "为你的旅程提供全面保障",
    extrasSim: "eSIM流量套餐", extrasSimDesc: "无限流量保持连接",
    extrasLounge: "机场贵宾室", extrasLoungeDesc: "飞行前舒适放松",
    addToBooking: "添加到预订", skipExtras: "跳过，继续确认",
    // Featured
    featuredBadge: "精选", sponsoredBadge: "赞助", trendingBadge: "热门",
    // Landing page
    landingBrand: "Tourly", landingHeroBadge: "#1 AI驱动旅行应用",
    landingHeroTitle: "用Tourly\n探索\n世界", landingHeroSubtitle: "发现令人惊叹的目的地、精选套餐和AI旅行规划 — 尽在一个应用中。",
    landingCTA: "立即开始",
    landingStatTrips: "50K+", landingStatTripsLabel: "已预订旅行", landingStatDest: "120+", landingStatDestLabel: "目的地", landingStatRating: "4.9", landingStatRatingLabel: "应用评分",
    landingWhyEyebrow: "为什么选择Tourly", landingWhyTitle: "智慧旅行,\n不再困难", landingWhySubtitle: "现代技术和本地专业知识驱动，为完美旅行提供所需的一切。",
    landingFeatureAI: "AI旅行规划", landingFeatureAIDesc: "根据您的喜好和预算，获得AI创建的个性化行程。",
    landingFeatureDest: "50+目的地", landingFeatureDestDesc: "探索6大洲的精选目的地，从隐藏宝石到标志性地标。",
    landingFeatureSecure: "安全预订", landingFeatureSecureDesc: "端到端加密支付，灵活取消和全额退款保障。",
    landingFeatureConcierge: "24/7礼宾服务", landingFeatureConciergeDesc: "熟悉目的地每个角落的本地专家实时支持。",
    landingTrendingEyebrow: "热门趋势", landingTrendingTitle: "热门目的地",
    landingCuratedEyebrow: "为您精选", landingCuratedTitle: "旅行套餐",
    landingTestimonialsEyebrow: "用户评价", landingTestimonialsTitle: "深受旅行者喜爱",
    landingTestimonial1Name: "Sarah Mitchell", landingTestimonial1Location: "纽约，美国",
    landingTestimonial1Quote: "Tourly让蜜月计划变得轻松。AI推荐了我们永远找不到的地方！",
    landingTestimonial2Name: "田中健二", landingTestimonial2Location: "东京，日本",
    landingTestimonial2Quote: "礼宾服务太棒了。感觉每个城市都有一个当地朋友。",
    landingTestimonial3Name: "Amara Osei", landingTestimonial3Location: "阿克拉，加纳",
    landingTestimonial3Quote: "用过最好的旅行应用。优惠是真实的，预订过程很流畅。",
    landingReadyCTA: "准备好下一次冒险了吗？", landingReadyDesc: "加入超过5万名使用Tourly计划和预订的旅行者。今天就创建免费账户。",
    landingCreateAccount: "创建免费账户",
    landingFooterTagline: "自2024年起，让旅行触手可及、个性化且难忘。",
    landingFooterAbout: "关于我们", landingFooterContact: "联系", landingFooterDeals: "优惠",
    landingFooterCopyright: "© 2024–2026 Tourly。保留所有权利。",
    landingExplore: "探索",
    // Download page
    downloadTitle: "下载应用",
    downloadHeroSubtitle: "您的口袋旅行伙伴。\n探索、预订、出发 — 一个应用搞定。",
    downloadOnThe: "下载于", downloadGetItOn: "获取于", downloadAppStore: "App Store", downloadGooglePlay: "Google Play",
    downloadStatRating: "4.9", downloadStatRatingLabel: "应用评分", downloadStatDownloads: "500K+", downloadStatDownloadsLabel: "下载量",
    downloadStatDest: "100+", downloadStatDestLabel: "目的地", downloadStatSupport: "24/7", downloadStatSupportLabel: "支持",
    downloadExclusiveEyebrow: "应用专属", downloadWhyTitle: "为什么下载Tourly？", downloadWhySubtitle: "应用解锁浏览器中无法使用的功能。",
    downloadFeatureFast: "极速", downloadFeatureFastDesc: "比任何浏览器体验更流畅的原生性能。",
    downloadFeatureNotif: "推送通知", downloadFeatureNotifDesc: "不错过任何优惠 — 获取限时特卖的即时提醒。",
    downloadFeatureOffline: "离线访问", downloadFeatureOfflineDesc: "保存行程和地图，在没有网络时使用。",
    downloadFeatureOneTap: "一键预订", downloadFeatureOneTapDesc: "使用已保存的支付和旅客信息，几秒钟内完成预订。",
    downloadFeatureAI: "AI旅行规划", downloadFeatureAIDesc: "AI驱动的个性化旅行建议，直接集成在应用中。",
    downloadFeatureSecure: "安全私密", downloadFeatureSecureDesc: "生物识别登录和加密数据保护您的信息安全。",
    downloadReviewsEyebrow: "深受旅行者喜爱", downloadReviewsTitle: "用户评价",
    downloadReview1Name: "Sarah M.", downloadReview1Text: "最好的旅行应用！不到2分钟就预订了巴厘岛之旅。",
    downloadReview2Name: "James K.", downloadReview2Text: "离线地图在日本乡村救了我。绝对的游戏改变者。",
    downloadReview3Name: "Aisha R.", downloadReview3Text: "推送通知捕获了40%限时特卖。旅行节省了$300！",
    downloadCompareTitle: "应用 vs. 浏览器", downloadCompareApp: "应用", downloadCompareWeb: "网页",
    downloadComparePush: "推送通知", downloadCompareOffline: "离线访问", downloadCompareBiometric: "生物识别登录",
    downloadCompareOneTap: "一键预订", downloadCompareAI: "AI旅行规划", downloadCompareBrowse: "浏览目的地",
    downloadBottomCTATitle: "准备好更智慧地旅行了吗？", downloadBottomCTADesc: "在iOS和Android上免费下载Tourly。",
    downloadPlatformIOS: "iOS", downloadPlatformAndroid: "Android",
    authError: "错误", authInvalidCredentials: "凭证无效",
    authSignInFailed: "登录失败，请重试。", authSignUpFailed: "注册失败，请重试。",
    authOAuthFailed: "OAuth登录失败，请重试。", authGoogle: "Google", authApple: "Apple",
    getTheApp: "下载应用", adminPanel: "管理面板", adminPanelDesc: "管理预订、用户和目的地",
    tierElite: "精英", tierPro: "专业", aiLabel: "AI",
    premiumNoPurchases: "未找到以前的购买记录。",
    thankYou: "谢谢！", shareDestination: "在Tourly上查看这个目的地！", sharePackage: "在Tourly上查看这个套餐！",
    shareVia: "分享到", shareWhatsApp: "WhatsApp", shareTwitter: "X (Twitter)", shareFacebook: "Facebook", shareTelegram: "Telegram", shareEmail: "电子邮件", shareSMS: "短信", shareCopyLink: "复制链接", shareLinkCopied: "链接已复制到剪贴板！", shareMoreOptions: "更多选项",
    aiResponseBali: "巴厘岛是绝佳选择！这是5天推荐行程：\n\n📍 第1天：抵达，探索库塔海滩\n📍 第2天：乌布梯田和猴子森林\n📍 第3天：乌鲁瓦图寺和克查克舞\n📍 第4天：努沙佩尼达一日游\n📍 第5天：水疗日和出发\n\n最佳时间：4月-10月（旱季）。预算：~$50-150/天。",
    aiResponseFamily: "绝佳家庭旅行地：\n\n🏖️ 马尔代夫 - 水上别墅、浮潜\n🏰 日本 - 东京迪士尼、文化体验\n🌴 泰国 - 海滩、大象保护区\n🏔️ 瑞士 - 观景火车、徒步\n🦁 肯尼亚 - 家庭野生动物园\n\n想了解更多细节吗？",
    aiResponseBudget: "最佳预算旅行贴士：\n\n💡 淡旺季之间出行\n💡 周二订机票最优惠\n💡 使用当地交通\n💡 住民宿或青旅\n💡 在当地市场用餐\n💡 购买城市通票\n\n经济实惠目的地：越南、葡萄牙、墨西哥、泰国、摩洛哥。",
    aiResponseEurope: "欧洲旅行规划：\n\n🇫🇷 巴黎 - 至少3天\n🇮🇹 罗马/佛罗伦萨 - 4天\n🇪🇸 巴塞罗那 - 2-3天\n🇬🇷 圣托里尼 - 2-3天\n\n✈️ 专业提示：城市间使用廉价航空。长途用欧铁通票。预算：€60-150/天。",
    aiResponseDefault: "好问题！建议探索我们的精选套餐获取最优惠价。也可以查看目的地页面获取灵感。\n\n需要我帮您规划特定旅行吗？告诉我：\n• 想去哪里\n• 几天\n• 预算范围\n• 旅行风格（冒险、休闲、文化）",
    bannerGetApp: "获取Tourly应用", bannerFasterOn: "更快的体验", bannerOpen: "打开",
    chatWelcomeBack: "欢迎回来！👋 很高兴再见到你。今天有什么可以帮忙的？",
    chatNewConvo: "新对话已开始！✨ 之前的聊天已归档。有什么可以帮您？",
    chatFreshConvo: "开始新对话！✨ 有什么可以帮您？",
    chatLiveAgent: "真人客服", chatConnectedTeam: "已连接支持团队", chatEnd: "结束",
    chatConvoClosed: "此对话已关闭", chatStartNew: "开始新对话",
    chatHereToHelp: "我们随时为您提供帮助 — 有什么问题请随时问",
    chatReturnLive: "返回在线聊天", chatActiveConvo: "您有一个与支持团队的活跃对话",
    chatConnectAgent: "与客服聊天", chatConnectAgentDesc: "连接我们的支持团队获取实时帮助",
    chatConnectedLive: "已连接在线客服", chatAgentRespondSoon: "客服人员将很快回复。\n请输入消息开始。",
    chatEnded: "聊天已结束",
    chatArchivedChat: "已归档聊天", chatHistory: "聊天记录", chatClearAll: "清除全部", chatDelete: "删除",
    chatNoArchives: "没有归档的聊天", chatLiveAgentChat: "真人客服聊天", chatBotConvo: "机器人对话",
    chatBackToArchives: "返回归档", chatConversations: "对话", chatMessages: "消息",
    chatTranslate: "翻译", chatShowOriginal: "显示原文", chatTranslating: "翻译中…",
    chatTranslateAll: "全部翻译", chatAutoTranslate: "自动翻译",
    chatTranslatedFrom: "翻译自", chatTranslationFailed: "翻译失败",
    adminTitle: "管理面板", adminDashboardTitle: "管理仪表板", adminDashboardSubtitle: "管理您的旅行平台",
    adminTabDashboard: "仪表板", adminTabBookings: "预订", adminTabChat: "聊天",
    adminTabDestinations: "目的地", adminTabPackages: "套餐", adminTabUsers: "用户",
    adminCancel: "取消", adminSave: "保存", adminEdit: "编辑", adminDelete: "删除", adminSearch: "搜索",
    adminValidation: "验证", adminTapUpload: "点击上传", adminChange: "更改", adminRemove: "移除",
    adminPermissionNeeded: "需要权限", adminGrantCameraAccess: "请授予相册访问权限以上传图片。",
    adminTotalBookings: "总预订", adminTotalBookingsTrend: "本月+12%",
    adminRevenue: "收入", adminRevenueTrend: "本月+8%",
    adminTotalUsers: "总用户", adminTotalUsersTrend: "本周+3",
    adminDestinations: "目的地",
    adminQuickActions: "快速操作", adminAddDestination: "添加目的地", adminCreatePackage: "创建套餐",
    adminSendNotification: "发送通知", adminViewReports: "查看报告",
    adminRecentBookings: "最近预订", adminNoBookingsYet: "暂无预订",
    adminReports: "报告", adminDone: "完成",
    adminBookingStatus: "预订状态", adminConfirmed: "已确认", adminPending: "待处理", adminCancelled: "已取消",
    adminMonthlyBookings: "月度预订（近6个月）", adminTotalPeriod: "本期总计",
    adminRevenueLabel: "收入", adminRevenueByPackage: "套餐收入", adminNoRevenueYet: "暂无收入数据",
    adminLatestBookings: "最新预订", adminCustomTrip: "定制旅行", adminAvgBooking: "均价 / 预订",
    adminSendTo: "发送至", adminAllUsers: "所有用户", adminSelectUsers: "选择用户",
    adminNotifTitle: "标题", adminNotifTitlePlaceholder: "例：夏季特卖 — 七折优惠",
    adminNotifMessage: "消息", adminNotifMessagePlaceholder: "通知消息...", adminNotifType: "类型",
    adminTitleMessageRequired: "标题和消息为必填项。", adminSelectAtLeastOne: "请至少选择一个用户。",
    adminSent: "已发送", adminNotifSentTo: "通知已发送至", adminUsersSelected: "已选择", adminClear: "清除",
    adminBookingDetails: "预订详情", adminFullName: "全名", adminEmail: "邮箱", adminPhone: "电话",
    adminTravelers: "旅客", adminCheckIn: "入住", adminCheckOut: "退房", adminDatePlaceholder: "YYYY-MM-DD",
    adminUpdated: "已更新", adminBookingUpdated: "预订详情已更新（本地演示）。",
    adminAll: "全部", adminNoBookingsFound: "未找到预订", adminConfirm: "确认", adminPax: "人", adminNA: "无",
    adminEditDestination: "编辑目的地", adminAddDestinationTitle: "添加目的地",
    adminCoverImage: "封面图片", adminName: "名称", adminNamePlaceholder: "例：圣托里尼",
    adminCountry: "国家", adminCountryPlaceholder: "例：希腊", adminRating: "评分 (1-5)",
    adminDescription: "描述", adminDescPlaceholder: "简短描述...",
    adminSearchDestinations: "搜索目的地...", adminAddNewDestination: "添加新目的地",
    adminDeleteDestination: "删除目的地", adminDeleteConfirm: "确定要删除吗",
    adminNameCountryRequired: "名称和国家为必填项。",
    adminEditPackage: "编辑套餐", adminAddPackageTitle: "添加套餐",
    adminPackageImage: "套餐图片", adminPackageTitle: "标题", adminTitlePlaceholder: "例：海滩度假",
    adminLocation: "位置", adminLocationPlaceholder: "例：马来西亚",
    adminDuration: "时长", adminDurationPlaceholder: "例：7天/6晚", adminMaxPax: "最大人数",
    adminPrice: "价格 ($)", adminPricePlaceholder: "例：750",
    adminPackageDescPlaceholder: "套餐描述...", adminSearchPackages: "搜索套餐...",
    adminAddNewPackage: "添加新套餐", adminDeletePackage: "删除套餐",
    adminTitleLocationPriceRequired: "标题、位置和价格为必填项。", adminReviews: "评价",
    adminEditUser: "编辑用户", adminAvatar: "头像", adminRole: "角色",
    adminSearchUsers: "搜索用户...", adminActive: "活跃", adminSuspended: "已暂停", adminAdmins: "管理员",
    adminJoined: "加入日期", adminBookingsCount: "预订",
    adminPromote: "升级", adminDemote: "降级", adminSuspend: "暂停", adminActivate: "激活",
    adminNameEmailRequired: "名称和邮箱为必填项。",
    adminConversations: "对话", adminLive: "在线", adminNoConvoYet: "暂无对话",
    adminNoConvoDesc: "当用户开始在线聊天时，\n他们的对话将显示在这里。",
    adminNoMessages: "暂无消息", adminReopen: "重新打开", adminClose: "关闭",
    adminConvoClosed: "对话已关闭", adminTypeReply: "输入回复...",
    adminYou: "你: ", adminClosed: "已关闭", adminUnread: "未读",
  },
};

// ─── Storage Key ──────────────────────────────────────────────────────────

const LANG_KEY = "@tourly:language";

// ─── Context ──────────────────────────────────────────────────────────────

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: Translations;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextValue>({
  language: "en",
  setLanguage: async () => {},
  t: translations.en,
  isRTL: false,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<Language>("en");

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((stored) => {
      if (stored && translations[stored as Language]) {
        setLangState(stored as Language);
      }
    });
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLangState(lang);
    await AsyncStorage.setItem(LANG_KEY, lang);
  }, []);

  const isRTL = LANGUAGES.find((l) => l.code === language)?.rtl ?? false;
  const t = translations[language];

  return React.createElement(
    I18nContext.Provider,
    { value: { language, setLanguage, t, isRTL } },
    children
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
