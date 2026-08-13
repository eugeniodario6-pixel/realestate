// Core domain types for the Real Estate Agent Platform MVP1

export type ListingStatus = 'active' | 'under_offer' | 'sold' | 'let';
export type ListingType = 'apartment' | 'house' | 'townhouse' | 'commercial' | 'land';

export type LeadStage =
  | 'lead'
  | 'viewing_requested'
  | 'viewing_confirmed'
  | 'viewed'
  | 'offer'
  | 'closed';

export type ObjectionChip =
  | 'price'
  | 'condition'
  | 'location'
  | 'size'
  | 'timing'
  | 'financing'
  | 'just_looking'
  | 'loved_it';

export interface Agent {
  id: string;
  name: string;
  photo?: string;
  bio?: string;
  ppra_number?: string;
  agency?: string;
  areas_served: string[];
  profile_url: string;
  whatsapp?: string;
  created_at: string;
}

export interface Listing {
  id: string;
  agent_id: string;
  agent?: Agent;
  address: string;
  price: number;
  beds: number;
  baths: number;
  type: ListingType;
  area: string;
  size_sqm?: number;
  video_url?: string;
  photo_urls: string[];
  description?: string;
  status: ListingStatus;
  created_at: string;
  // aggregated stats (from analytics)
  stats?: ListingStats;
}

export interface ListingStats {
  total_views: number;
  unique_views: number;
  returning_views: number;
  saves: number;
  viewing_requests: number;
  watch_25: number;
  watch_50: number;
  watch_75: number;
  watch_100: number;
}

export interface ListingView {
  id: string;
  listing_id: string;
  session_id: string;
  is_returning: boolean;
  watch_percent: number;
  saved: boolean;
  timestamp: string;
}

export interface Lead {
  id: string;
  listing_id: string;
  listing?: Listing;
  agent_id: string;
  buyer_name?: string;
  buyer_phone: string;
  stage: LeadStage;
  feedback?: ViewingFeedback;
  created_at: string;
  updated_at: string;
}

export interface ViewingFeedback {
  id: string;
  lead_id: string;
  listing_id: string;
  objection_chip: ObjectionChip;
  submitted_at: string;
}
