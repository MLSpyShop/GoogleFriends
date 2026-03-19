
import { GoogleGenAI, Type } from "@google/genai";
import { ProfileAnalysis } from "../types";

export class GeminiService {
  static async analyzeAndSearch(profileUrl: string, excludeUrls: string[] = [], enabledPlatforms: string[] = []): Promise<ProfileAnalysis> {
    // Create a new instance right before making the call to use the latest selected API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const exclusionList = excludeUrls.length > 0 
      ? `\n      CRITICAL: DO NOT suggest any of the following URLs (they have already been shown):
      ${excludeUrls.join('\n      ')}`
      : '';

    const platformsToSearch = enabledPlatforms.length > 0 
      ? enabledPlatforms.join(', ')
      : 'LinkedIn, X (Twitter), Threads, Instagram, Facebook, Reddit, Discord, Bluesky, Mastodon, TikTok, YouTube, GitHub, Behance, Dribbble, Pinterest, Medium, Substack, Quora, Twitch, Tumblr';

    const prompt = `
      Analyze this social media profile URL: ${profileUrl}.
      
      Step 1: Deeply analyze the subject's identity, professional niche, and creative style.
      
      Step 2: Define a "Synergy Circle" which includes:
      - Similar Peers: People doing exactly what they do (for networking/clones).
      - Complementary Partners: People who provide services or skillsets that perfectly balance the subject (e.g., if they are a coder, find designers; if they are a chef, find food photographers).
      
      Step 3: Use Google Search to find exactly 25 REAL, ACTIVE social media profiles. 
      You must source these EXCLUSIVELY from across these platforms: 
      ${platformsToSearch}
      
      CRITICAL URL VERIFICATION RULES:
      - YOU MUST PROVIDE 25 UNIQUE SUGGESTIONS.
      - Every single URL must be a direct link to a profile, verified via search grounding.
      - DO NOT hallucinate URLs. If a profile's direct URL cannot be verified as LIVE and WORKING, find a different person.
      - NO DEAD END LINKS. If the profile appears inactive or the URL returns a 404 in your search context, skip it.
      - Ensure a healthy mix across the top 20 allowed platforms.
      ${exclusionList}
      - NEVER repeat a profile that was in the exclusion list above.
      - Ensure the 25 suggestions are completely different from any previous set.
      
      Return a JSON object with:
      1. originalProfile: { name: string, niche: string, description: string }
      2. suggestions: Array of 25 { 
          name: string, 
          handle: string, 
          platform: string, 
          bio: string, 
          relevanceScore: number (0-100), 
          url: string, 
          tags: string[] 
      }
    `;

    try {
      // Using gemini-3.1-pro-preview for maximum reasoning capability to handle 25 complex objects
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              originalProfile: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  niche: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["name", "niche", "description"],
              },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    handle: { type: Type.STRING },
                    platform: { type: Type.STRING },
                    bio: { type: Type.STRING },
                    relevanceScore: { type: Type.NUMBER },
                    url: { type: Type.STRING },
                    tags: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["name", "handle", "platform", "bio", "relevanceScore", "url", "tags"],
                },
              },
            },
            required: ["originalProfile", "suggestions"],
          },
        },
      });

      const text = response.text || "{}";
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          data = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not parse AI response as JSON");
        }
      }
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const groundingSources = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title,
          uri: chunk.web.uri,
        }));

      // Filter invalid or suspicious URLs
      if (data.suggestions) {
        data.suggestions = data.suggestions.filter((s: any) => {
          if (!s.url) return false;
          try {
            const urlObj = new URL(s.url);
            // Basic check for valid protocol and hostname
            if (!['http:', 'https:'].includes(urlObj.protocol)) return false;
            if (urlObj.hostname.length < 4) return false;
            
            // Check for common social media domains to ensure it's a profile link
            const validDomains = [
              'linkedin.com', 'twitter.com', 'x.com', 'instagram.com', 'github.com', 
              'stackoverflow.com', 'youtube.com', 'tiktok.com', 'medium.com', 
              'substack.com', 'reddit.com', 'quora.com', 'producthunt.com', 
              'crunchbase.com', 'wellfound.com', 'polywork.com', 'contra.com', 
              'upwork.com', 'behance.net', 'dribbble.com', 'pinterest.com', 
              'facebook.com', 'discord.com', 'bluesky.social', 'mastodon.social',
              'threads.net'
            ];
            
            const isSocialDomain = validDomains.some(domain => urlObj.hostname.includes(domain));
            // We allow other domains too, but we want to be strict about the URL being a profile
            // If it's just a homepage, it might be a "dead end" in terms of profile discovery
            if (urlObj.pathname === '/' || urlObj.pathname === '') {
              // Some platforms use subdomains for profiles (e.g. substack)
              if (!s.url.includes('substack.com') && !s.url.includes('medium.com')) {
                return false; 
              }
            }

            return true;
          } catch (e) {
            return false;
          }
        });
      }

      return {
        ...data,
        groundingSources,
      };
    } catch (error) {
      console.error("Gemini Multi-Search Error:", error);
      throw new Error("Failed to map the social galaxy. The network might be too complex or the source profile is private.");
    }
  }
}
