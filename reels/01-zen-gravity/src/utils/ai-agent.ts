const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_KEY;

export const getVibePhysics = async (prompt: string) => {
  if (!OPENROUTER_API_KEY) {
    console.error("Missing API Key");
    return null;
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-lite-preview",
      messages: [
        {
          role: "system",
          content: "Return ONLY a JSON object: {color: string (hex), emissive: string (hex), speed: number (0.5-3.0), baseG: number (-1.5 to 3.0), bloom: number (1.0-2.5)}. No prose."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};