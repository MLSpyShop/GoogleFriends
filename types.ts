
export interface SocialProfile {
  name: string;
  handle: string;
  platform: 'LinkedIn' | 'X' | 'Instagram' | 'GitHub' | 'YouTube' | 'TikTok' | 'Medium' | 'Other';
  bio: string;
  relevanceScore: number;
  url: string;
  tags: string[];
}

export interface ProfileAnalysis {
  originalProfile: {
    name: string;
    niche: string;
    description: string;
  };
  suggestions: SocialProfile[];
  groundingSources: Array<{
    title: string;
    uri: string;
  }>;
}

export interface SearchState {
  loading: boolean;
  error: string | null;
  results: ProfileAnalysis | null;
}
