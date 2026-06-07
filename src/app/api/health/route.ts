export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      version: "2.0.0",
      timestamp: Date.now(),
      uptime: process.uptime(),
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
