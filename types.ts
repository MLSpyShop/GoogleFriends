
export type Platform = 
  | 'LinkedIn' | 'X' | 'Instagram' | 'GitHub' | 'YouTube' 
  | 'TikTok' | 'Medium' | 'Reddit' | 'Pinterest' | 'Facebook' 
  | 'Behance' | 'Dribbble' | 'Product Hunt' | 'Crunchbase' 
  | 'Wellfound' | 'Stack Overflow' | 'Substack' | 'Polywork' 
  | 'Contra' | 'Upwork' | 'Threads' | 'Bluesky' | 'Mastodon' 
  | 'Quora' | 'Discord' | 'Twitch' | 'Tumblr';

export interface SocialProfile {
  name: string;
  handle: string;
  platform: string;
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

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
