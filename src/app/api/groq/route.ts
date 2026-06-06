import { NextRequest } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, systemPrompt, model, temperature } = body;

    const apiKey = process.env.GROQ_API_KEY || body.apiKey;

    if (!apiKey?.trim()) {
      return new Response(
        JSON.stringify({ error: "Groq API key required. Set GROQ_API_KEY in env or enter it in Settings." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let Groq: new (opts: { apiKey: string }) => {
      chat: {
        completions: {
          create: (opts: object) => Promise<{
            choices?: { message?: { content?: string | null } }[];
            usage?: { total_tokens?: number };
          }>;
        };
      };
    };

    try {
      const mod = await import("groq-sdk");
      Groq = (mod as unknown as { default: typeof Groq }).default;
    } catch {
      return new Response(
        JSON.stringify({ error: "Groq SDK not installed." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const groq = new Groq({ apiKey: apiKey.trim() });

    const apiMessages: { role: "system" | "user" | "assistant"; content: string }[] = [];

    if (systemPrompt) {
      apiMessages.push({ role: "system", content: systemPrompt });
    }

    if (body.history && Array.isArray(body.history)) {
      for (const msg of body.history) {
        if ((msg.role === "user" || msg.role === "assistant") && msg.content) {
          apiMessages.push({ role: msg.role, content: String(msg.content) });
        }
      }
    }

    const userMessage =
      body.message?.trim() ||
      (Array.isArray(messages) && messages.length > 0
        ? messages[messages.length - 1]?.content
        : "") ||
      "";

    if (userMessage) {
      apiMessages.push({ role: "user", content: userMessage });
    }

    if (apiMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages to process." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const modelId: string = model || "llama-3.3-70b-versatile";
    const temp = Math.min(2.0, 0.3 + ((temperature ?? 0.7) * 0.9));
    const maxTokens = modelId.includes("8b") ? 4096 : modelId.includes("versatile") ? 32768 : 8000;

    const response = await groq.chat.completions.create({
      model: modelId,
      messages: apiMessages,
      temperature: temp,
      max_tokens: maxTokens,
      top_p: 0.9,
    });

    const reply = response.choices?.[0]?.message?.content;
    if (!reply?.trim()) {
      return new Response(
        JSON.stringify({ error: "Empty response from Groq. Try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: reply,
        model: modelId,
        tokensUsed: response.usage?.total_tokens ?? Math.round(reply.length / 4),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    const status = e?.status ?? 500;
    let message = "Generation failed. Please try again.";

    if (status === 401 || /auth|invalid.*key/i.test(e?.message ?? "")) {
      message = "Invalid Groq API key. Check your key at console.groq.com.";
    } else if (status === 429 || /rate/i.test(e?.message ?? "")) {
      message = "Rate limit reached. Wait 60 seconds.";
    } else if (/network|fetch|ECONNREFUSED/i.test(e?.message ?? "")) {
      message = "Network error. Check your connection.";
    } else if (e?.message) {
      message = e.message;
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: Math.min(status, 599), headers: { "Content-Type": "application/json" } }
    );
  }
}
