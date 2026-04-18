// Vite requires 'import.meta.env' to access variables
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_KEY; 

export const getVibePhysics = async (prompt: string) => {
  if (!OPENROUTER_API_KEY) {
    console.error("API Key missing! Check your Vercel Env Variables.");
    return { color: "#60a5fa", emissive: "#1d4ed8", speed: 1.0, baseG: 0.5, bloom: 1.5 };
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-lite-preview", // 2026's fastest budget model
      messages: [
        {
          role: "system",
          content: "Return ONLY a JSON object: {color: string, emissive: string, speed: number, baseG: number, bloom: number}. Values should represent the 3D physics of the user's vibe."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};