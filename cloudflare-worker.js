// KrydsFelt Chat Worker
// Deploy this on https://workers.cloudflare.com/
// Add ANTHROPIC_API_KEY as a secret (Settings → Variables → Secrets)

const SYSTEM_PROMPT = `Du er en hjælpsom og venlig assistent for KrydsFelt — et lille dansk webbureau der bygger skræddersyede hjemmesider og digitale løsninger.

KrydsFelt tilbyder:
- Webudvikling (skræddersyede hjemmesider)
- Brand Strategy
- Lead Generation
- Design & UX

Hold svar korte og relevante. Anbefal altid at booke et møde på krydsfelt.com/booking hvis spørgsmålet handler om et konkret projekt eller pris. Svar altid på det sprog brugeren skriver på.`;

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://krydsfelt.com",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const { messages } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "Beklager, jeg kunne ikke svare.";

    return new Response(JSON.stringify({ reply }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://krydsfelt.com",
      },
    });
  },
};
