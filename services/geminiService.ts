
import { GoogleGenAI, Type } from "@google/genai";
import { ProfileAnalysis } from "../types";

export class GeminiService {
  // Initialize GoogleGenAI strictly using process.env.API_KEY as per guidelines
  private static ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  static async analyzeAndSearch(profileUrl: string): Promise<ProfileAnalysis> {
    const prompt = `
      Analyze this social media profile URL: ${profileUrl}.
      
      Step 1: Deeply analyze the subject's identity, professional niche, and creative style.
      
      Step 2: Define a "Synergy Circle" which includes:
      - Similar Peers: People doing exactly what they do (for networking/clones).
      - Complementary Partners: People who provide services or skillsets that perfectly balance the subject (e.g., if they are a coder, find designers; if they are a chef, find food photographers).
      
      Step 3: Use Google Search to find exactly 25 REAL, ACTIVE social media profiles. 
      You must source these from across these 10 platforms: 
      1. LinkedIn, 2. X (Twitter), 3. Instagram, 4. GitHub, 5. YouTube, 6. TikTok, 7. Medium, 8. Reddit, 9. Pinterest, 10. Facebook or Behance.
      
      CRITICAL URL VERIFICATION RULES:
      - YOU MUST PROVIDE 25 UNIQUE SUGGESTIONS.
      - Every single URL must be a direct link to a profile, verified via search grounding.
      - DO NOT hallucinate URLs. If a profile's direct URL cannot be verified, find a different person.
      - Ensure a healthy mix across all 10 platforms.
      
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
      // Using gemini-3-pro-preview for maximum reasoning capability to handle 25 complex objects
      const response = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
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

      // Filter invalid URLs just in case
      if (data.suggestions) {
        data.suggestions = data.suggestions.filter((s: any) => 
          s.url && (s.url.startsWith('http://') || s.url.startsWith('https://'))
        );
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
