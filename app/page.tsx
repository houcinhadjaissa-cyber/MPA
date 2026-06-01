"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");
    if (key !== "omega") {
      router.replace("/404");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-green-400 text-sm animate-pulse">Verifying key...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center max-w-sm w-full">
        <p className="text-green-400 text-xs uppercase tracking-widest mb-2 font-mono">
          Access Granted
        </p>
        <h1 className="text-white text-2xl font-bold mb-6">
          Master Plan Architect
        </h1>
        <a
          href="/dashboard"
          className="inline-block bg-green-400 text-black font-bold px-6 py-3 rounded-lg hover:bg-green-300 transition-colors"
        >
          Enter the Terminal →
        </a>
      </div>
    </div>
  );
}
