"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Activity } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signup(email, password, fullName || undefined);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed"
      );
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

      {/* Signup Form */}
      <div className="flex-1 flex items-center justify-center px-lg">
        <div className="w-full max-w-sm border border-swiss-gray-300 p-2xl">
          <div className="w-10 h-1 bg-swiss-red mb-xl" />
          <h1 className="text-h2 mb-sm">Create account</h1>
          <p className="text-caption text-swiss-gray-500 mb-2xl">
            Join the OasisWaker network.
          </p>

          <form onSubmit={handleSubmit} className="space-y-lg">
            <div>
              <label
                htmlFor="fullName"
                className="text-caption text-swiss-gray-500 uppercase tracking-wider block mb-xs"
              >
                Full name <span className="text-swiss-gray-400">(optional)</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-swiss-gray-300 px-md py-sm text-body text-swiss-black bg-swiss-white focus:outline-none focus:border-swiss-black"
                placeholder="Ada Lovelace"
              />
            </div>

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
                placeholder="At least 8 characters"
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
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-xl pt-xl border-t border-swiss-gray-200">
            <p className="text-caption text-swiss-gray-500 text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-swiss-black underline hover:text-swiss-gray-600"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}