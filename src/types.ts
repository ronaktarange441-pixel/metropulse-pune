export type CityId = 'pune' | 'pcmc' | 'lonavla' | 'talegaon' | 'mulshi' | 'junnar' | 'lavasa' | 'baramati';

export interface CityInfo {
  id: CityId;
  name: string;
  region: string;
  lat: number;
  lng: number;
  zoom: number;
  tagline: string;
  safetyScore: number;
  cleanlinessScore: number;
  affordabilityScore: number;
  transitScore: number;
  aqi: number;
  temp: number;
  weatherCondition: string;
  population: string;
}

export type PlaceCategory = 'attraction' | 'food' | 'hotel' | 'budget' | 'nightlife' | 'heritage' | 'nature';

export interface Place {
  id: string;
  cityId: CityId;
  name: string;
  category: PlaceCategory;
  categoryLabel: string;
  description: string;
  aiSummary: string;
  rating: number;
  reviewsCount: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  lat: number;
  lng: number;
  address: string;
  imageUrl: string;
  tags: string[];
  hiddenGem: boolean;
  hiddenGemScore?: number;
  safetyRating: number;
  cleanlinessRating: number;
  affordabilityRating: number;
  transitAccess: number;
  hours: string;
  contact: string;
  localTip: string;
}

export interface HeritageSite {
  id: string;
  cityId: CityId;
  name: string;
  era: string;
  builtYear: string;
  description: string;
  historyStory: string;
  audioDuration: string;
  lat: number;
  lng: number;
  imageUrlCurrent: string;
  imageUrlHistorical: string;
  architecturalStyle: string;
  culturalSignificance: string;
  visitorTips: string;
}

export interface SafetyZone {
  id: string;
  cityId: CityId;
  areaName: string;
  safetyLevel: 'safe' | 'caution' | 'unsafe';
  lightingLevel: 'High' | 'Moderate' | 'Low';
  cctvCoverage: 'Dense' | 'Moderate' | 'Sparse';
  description: string;
  lat: number;
  lng: number;
  radius: number;
  reportedIssuesCount: number;
  safeHours: string;
  isBlackspot?: boolean;
}

export interface SafeRoute {
  id: string;
  cityId: CityId;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  fastestTimeMin: number;
  safestTimeMin: number;
  lightingScore: number;
  cctvCoverageScore: number;
  overallSafetyIndex: number;
  waypoints: [number, number][];
  highlights: string[];
}

export type ReportCategory = 'Safety' | 'Civic Maintenance' | 'Traffic Hazard' | 'Hidden Gem Spot' | 'Accident Prone Zone' | 'Natural Disaster' | 'Flood Alert' | 'Fire Incident';

export interface CitizenReport {
  id: string;
  cityId: CityId;
  title: string;
  category: ReportCategory;
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  timestamp: string;
  votes: number;
  status: 'Verified by AI' | 'Under Investigation' | 'Resolved by City' | 'Emergency Alert';
  hasVoiceNote?: boolean;
  voiceNoteDuration?: string;
  audioTranscript?: string;
  imageUrl?: string;
  aiRiskScore: 'Low' | 'Medium' | 'High' | 'Critical';
  isDisaster?: boolean;
}

export interface SocialPulseItem {
  id: string;
  cityId: CityId;
  username: string;
  userHandle: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  shares: number;
  imageUrl?: string;
  tag: string;
}

export interface WeatherAlert {
  id: string;
  cityId: CityId;
  severity: 'info' | 'warning' | 'severe';
  title: string;
  description: string;
  recommendation: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isLoading?: boolean;
}
