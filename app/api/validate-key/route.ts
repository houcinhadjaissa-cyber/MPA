import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey?.trim()) {
      return NextResponse.json({ valid: false, error: "No API key provided." }, { status: 400 });
    }

    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey });

    const models = await groq.models.list();
    const modelIds = models.data?.map((m: { id: string }) => m.id) ?? [
      "llama3-70b-8192", "llama3-8b-8192", "mixtral-8x7b-32768", "gemma2-9b-it",
    ];

    return NextResponse.json({ valid: true, models: modelIds });
  } catch (err: unknown) {
    const e = err as { status?: number };
    if (e?.status === 401) {
      return NextResponse.json({ valid: false, error: "Invalid API key." });
    }
    return NextResponse.json({ valid: false, error: "Validation failed. Please try again." });
  }
}
