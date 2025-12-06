import { GoogleGenAI, Type } from "@google/genai";
import { MediaItem, CastMember, Episode } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiRecommendations = async (query: string, filterType?: string): Promise<MediaItem[]> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return [];
  }

  const typeInstruction = filterType && filterType !== 'all' 
    ? `Strictly return only ${filterType}s.` 
    : "You can return movies or TV shows.";

  const systemInstruction = `
    You are a media discovery engine for a Plex-like application. 
    User will ask for recommendations or search for movies/shows.
    ${typeInstruction}
    Return a list of 4-6 fictitious or real movies/shows that match the query.
    If the query is generic, provide popular and highly rated real movies.
    Ensure you include a 'posterUrl' from 'https://picsum.photos/seed/{seed}/300/450' where {seed} is a random string.
    Ensure you include a 'backdropUrl' from 'https://picsum.photos/seed/{seed}/1280/720'.
    The description should be short (under 20 words).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Recommend content for query: "${query}".`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              year: { type: Type.INTEGER },
              type: { type: Type.STRING, enum: ["movie", "tv"] },
              posterUrl: { type: Type.STRING },
              backdropUrl: { type: Type.STRING },
              duration: { type: Type.STRING },
              rating: { type: Type.STRING },
              description: { type: Type.STRING },
              genre: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "title", "year", "type", "posterUrl", "description"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as MediaItem[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const getPersonalizedSuggestions = async (): Promise<MediaItem[]> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return [];
  }

  const systemInstruction = `
    You are an AI personalization engine for a media server.
    Generate 5 distinct media recommendations (movies or TV shows) for a user's home screen.
    Assume the user enjoys Sci-Fi, Thrillers, and High-Concept Dramas.
    The titles should be a mix of real popular content and plausible fictional titles.
    Ensure you include a 'posterUrl' from 'https://picsum.photos/seed/{seed}/300/450' where {seed} is a random unique string.
    Ensure you include a 'backdropUrl' from 'https://picsum.photos/seed/{seed}/1280/720'.
    The description should be intriguing but short (under 25 words).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Suggest personalized content for the home dashboard.",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              year: { type: Type.INTEGER },
              type: { type: Type.STRING, enum: ["movie", "tv"] },
              posterUrl: { type: Type.STRING },
              backdropUrl: { type: Type.STRING },
              duration: { type: Type.STRING },
              rating: { type: Type.STRING },
              description: { type: Type.STRING },
              genre: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "title", "year", "type", "posterUrl", "description"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as MediaItem[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const getSimilarContent = async (item: MediaItem): Promise<MediaItem[]> => {
  if (!process.env.API_KEY) return [];

  const systemInstruction = `
    You are a movie recommendation engine.
    The user is viewing a specific title. Provide 4-6 similar movies or TV shows.
    They should be similar in genre, tone, or theme.
    Ensure you include a 'posterUrl' from 'https://picsum.photos/seed/{seed}/300/450'.
    Ensure you include a 'backdropUrl' from 'https://picsum.photos/seed/{seed}/1280/720'.
    The description should be short.
  `;

  const prompt = `The user is viewing "${item.title}" (${item.year}), a ${item.type} about: ${item.description}. Genres: ${item.genre?.join(', ')}. Recommend similar content.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              year: { type: Type.INTEGER },
              type: { type: Type.STRING, enum: ["movie", "tv"] },
              posterUrl: { type: Type.STRING },
              backdropUrl: { type: Type.STRING },
              duration: { type: Type.STRING },
              rating: { type: Type.STRING },
              description: { type: Type.STRING },
              genre: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "title", "year", "type", "posterUrl", "description"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as MediaItem[];
  } catch (error) {
    console.error("Gemini API Error (Similar Content):", error);
    return [];
  }
};

export const getMediaCast = async (title: string): Promise<CastMember[]> => {
  if (!process.env.API_KEY) return [];

  const systemInstruction = `
    You are a movie database. 
    Return a list of 5-8 main cast members for the given movie or TV show title. 
    If the title is fictitious, generate plausible actor names and character names.
    Use a placeholder image URL for the actor from 'https://i.pravatar.cc/150?u={random_string}'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Who is in the cast of "${title}"?`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              character: { type: Type.STRING },
              imageUrl: { type: Type.STRING }
            },
            required: ["name", "character", "imageUrl"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as CastMember[];
  } catch (error) {
    console.error("Gemini API Error (Cast):", error);
    return [];
  }
};

export const getEpisodes = async (title: string, type: 'movie' | 'tv'): Promise<Episode[]> => {
  if (!process.env.API_KEY) return [];

  const systemInstruction = `
    You are a media database.
    If the type is 'tv', return a list of 6-10 episodes for Season 1 of the show.
    If the type is 'movie', return 3-4 "Behind the Scenes" or "Deleted Scenes" clips formatted as episodes.
    Generate plausible titles, durations (e.g., "45 min"), and descriptions.
    Use 'https://picsum.photos/seed/{seed}/300/170' for thumbnails.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `List episodes for ${type} "${title}".`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              episodeNumber: { type: Type.INTEGER },
              seasonNumber: { type: Type.INTEGER },
              thumbnailUrl: { type: Type.STRING },
              duration: { type: Type.STRING },
              description: { type: Type.STRING },
              airDate: { type: Type.STRING }
            },
            required: ["id", "title", "episodeNumber", "seasonNumber", "thumbnailUrl", "duration"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Episode[];
  } catch (error) {
    console.error("Gemini API Error (Episodes):", error);
    return [];
  }
};