export interface WeboreelTheme {
    id: string;
    title: string;
    hook: string;      // The 0-3s hook
    purpose: string;
    audioUrl: string;
    colors: {
      primary: string;
      secondary: string;
      background: string;
    };
    physics: {
      chaosSensitivity: number; // 0.1 to 1.0
      decayRate: number;        // Higher = returns to Zen faster
      particleCount: number;
    };
  }
  
  export const CURRENT_THEME: WeboreelTheme = {
    id: "zen-01",
    title: "ZEN GRAVITY",
    hook: "Breathe with the AI.",
    purpose: "An AI-powered neural mirror that visualizes your internal entropy.",
    audioUrl: "/audio/zen.mp3",
    colors: {
      primary: "#60a5fa",
      secondary: "#1d4ed8",
      background: "#000000",
    },
    physics: {
      chaosSensitivity: 0.15,
      decayRate: 0.08,
      particleCount: 40,
    }
  };