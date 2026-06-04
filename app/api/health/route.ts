import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  let groqStatus = "unknown";
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      method: "GET",
      headers: { "Authorization": "Bearer test" },
      signal: AbortSignal.timeout(3000),
    });
    groqStatus = res.status === 401 ? "reachable" : "reachable";
  } catch {
    groqStatus = "unreachable";
  }

  return NextResponse.json({
    status: "operational",
    version: "2.0.0",
    groqApi: groqStatus,
    timestamp: new Date().toISOString(),
  });
}
