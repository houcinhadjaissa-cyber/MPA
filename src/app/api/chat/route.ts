import { NextRequest } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, systemPrompt, model, temperature } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured. Set OPENAI_API_KEY in Vercel environment variables." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({ apiKey });

    const apiMessages: { role: "system" | "user" | "assistant"; content: string }[] = [];

    if (systemPrompt) {
      apiMessages.push({ role: "system", content: systemPrompt });
    }

    for (const msg of messages) {
      if (msg.role === "user" || msg.role === "assistant") {
        apiMessages.push({ role: msg.role, content: String(msg.content) });
      }
    }

    const modelId: string = model || "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      messages: apiMessages,
      model: modelId,
      temperature: temperature ?? 0.7,
      max_tokens: 8000,
    });

    const reply = completion.choices?.[0]?.message?.content;
    if (!reply?.trim()) {
      return new Response(
        JSON.stringify({ error: "Empty response from OpenAI. Try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: reply,
        model: modelId,
        tokensUsed: completion.usage?.total_tokens ?? Math.round(reply.length / 4),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    const status = e?.status ?? 500;
    let message = "Generation failed. Please try again.";

    if (status === 401 || /auth|invalid.*key/i.test(e?.message ?? "")) {
      message = "OpenAI API key is invalid. Check your OPENAI_API_KEY env var.";
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
