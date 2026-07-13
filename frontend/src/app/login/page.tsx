"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Activity } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-swiss-white flex flex-col">
      {/* Header */}
      <header className="border-b border-swiss-gray-300">
        <div className="max-w-6xl mx-auto px-lg flex items-center h-16">
          <Link href="/" className="flex items-center gap-md">
            <Activity className="w-6 h-6 text-swiss-black" />
            <span className="text-body-bold text-swiss-black">OasisWaker</span>
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-lg">
        <div className="w-full max-w-sm border border-swiss-gray-300 p-2xl">
          <div className="w-10 h-1 bg-swiss-red mb-xl" />
          <h1 className="text-h2 mb-sm">Sign in</h1>
          <p className="text-caption text-swiss-gray-500 mb-2xl">
            Access your OasisWaker dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-lg">
            <div>
              <label
                htmlFor="email"
                className="text-caption text-swiss-gray-500 uppercase tracking-wider block mb-xs"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-swiss-gray-300 px-md py-sm text-body text-swiss-black bg-swiss-white focus:outline-none focus:border-swiss-black"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-caption text-swiss-gray-500 uppercase tracking-wider block mb-xs"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-swiss-gray-300 px-md py-sm text-body text-swiss-black bg-swiss-white focus:outline-none focus:border-swiss-black"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-caption text-swiss-red">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-swiss-black text-swiss-white text-body-bold px-xl py-md hover:bg-swiss-gray-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-xl pt-xl border-t border-swiss-gray-200">
            <p className="text-caption text-swiss-gray-500 text-center">
              No account?{" "}
              <Link
                href="/signup"
                className="text-swiss-black underline hover:text-swiss-gray-600"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}