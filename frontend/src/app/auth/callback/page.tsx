"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("No authorization code received from GitHub.");
      return;
    }

    const exchangeCode = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/github/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || "OAuth callback failed");
        }

        const tokens = await res.json();
        localStorage.setItem("ow_access_token", tokens.access_token);
        localStorage.setItem("ow_refresh_token", tokens.refresh_token);

        router.push("/dashboard");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Authentication failed"
        );
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="text-center">
        <div className="w-10 h-1 bg-swiss-red mb-md mx-auto" />
        <h1 className="text-h2 mb-sm">Authentication failed</h1>
        <p className="text-body text-swiss-gray-500 mb-xl">{error}</p>
        <a
          href="/login"
          className="bg-swiss-black text-swiss-white text-body-bold px-xl py-md inline-block"
        >
          Back to login
        </a>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-10 h-1 bg-swiss-black mb-md mx-auto" />
      <h1 className="text-h2 mb-sm">Authenticating...</h1>
      <p className="text-body text-swiss-gray-500">
        Completing GitHub sign-in.
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-swiss-white flex flex-col items-center justify-center px-lg">
      <Activity className="w-8 h-8 text-swiss-black mb-lg" />
      <Suspense
        fallback={
          <div className="text-center">
            <div className="w-10 h-1 bg-swiss-black mb-md mx-auto" />
            <h1 className="text-h2 mb-sm">Authenticating...</h1>
            <p className="text-body text-swiss-gray-500">
              Completing GitHub sign-in.
            </p>
          </div>
        }
      >
        <CallbackHandler />
      </Suspense>
    </div>
  );
}