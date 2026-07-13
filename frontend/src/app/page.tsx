import Link from "next/link";
import { Activity, Server, Shield, Cloud, ArrowRight } from "lucide-react";

/* ───────────────────────────────────────────────────────────────────────────
   OasisWaker — Landing Page (Swiss Style)
   ─────────────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-swiss-white text-swiss-black">
      {/* ═══ Header ═══════════════════════════════════════════════════════ */}
      <header className="border-b border-swiss-gray-300">
        <div className="max-w-6xl mx-auto px-lg flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-md">
            <Activity className="w-6 h-6 text-swiss-black" />
            <span className="text-body-bold text-swiss-black">OasisWaker</span>
          </Link>
          <nav className="flex items-center gap-lg">
            <Link
              href="/dashboard"
              className="text-body text-swiss-gray-500 hover:text-swiss-black transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="bg-swiss-black text-swiss-white text-body-bold px-md py-sm hover:bg-swiss-gray-700 transition-colors"
            >
              Launch App
              <ArrowRight className="inline w-4 h-4 ml-sm" />
            </Link>
          </nav>
        </div>
      </header>

      {/* ═══ Hero ═════════════════════════════════════════════════════════ */}
      <section className="border-b border-swiss-gray-300">
        <div className="max-w-6xl mx-auto px-lg py-4xl md:py-5xl">
          <div className="max-w-3xl">
            <div className="w-12 h-1 bg-swiss-red mb-xl" />
            <h1 className="text-[56px] md:text-[72px] leading-[1.05] font-bold tracking-tight">
              Crowdsourced
              <br />
              Edge Infrastructure
            </h1>
            <p className="text-h3 text-swiss-gray-500 mt-xl max-w-2xl leading-relaxed">
              Your free cloud quotas from Cloudflare, Vercel, and Supabase —
              aggregated into a single, resilient storage network that no single
              company controls.
            </p>
            <div className="flex gap-md mt-2xl">
              <Link
                href="/dashboard"
                className="bg-swiss-black text-swiss-white text-body-bold px-xl py-md hover:bg-swiss-gray-700 transition-colors"
              >
                Enter Dashboard
              </Link>
              <Link
                href="#how-it-works"
                className="border border-swiss-black text-swiss-black text-body-bold px-xl py-md hover:bg-swiss-gray-100 transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Manifesto ════════════════════════════════════════════════════ */}
      <section className="border-b border-swiss-gray-300 bg-swiss-gray-100">
        <div className="max-w-6xl mx-auto px-lg py-4xl">
          <div className="max-w-3xl">
            <p className="text-caption text-swiss-gray-500 uppercase tracking-widest mb-md">
              The Problem
            </p>
            <h2 className="text-h1 mb-lg">
              Three companies own the cloud.
            </h2>
            <p className="text-body text-swiss-gray-600 leading-relaxed max-w-2xl">
              AWS, Google Cloud, and Azure control 67% of global cloud
              infrastructure. Every developer pays rent to build on their
              land. Meanwhile, the free tiers of Cloudflare Workers, Vercel
              Edge Functions, and Supabase sit mostly unused — isolated
              islands of capacity that could power something bigger.
            </p>
          </div>
          <div className="mt-2xl grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="border border-swiss-gray-300 bg-swiss-white p-lg">
              <p className="text-h2 text-swiss-red mb-sm">100K</p>
              <p className="text-caption text-swiss-gray-500 uppercase tracking-wider">
                Requests / day
              </p>
              <p className="text-body text-swiss-gray-600 mt-sm">
                Cloudflare Workers free tier
              </p>
            </div>
            <div className="border border-swiss-gray-300 bg-swiss-white p-lg">
              <p className="text-h2 text-swiss-red mb-sm">100K</p>
              <p className="text-caption text-swiss-gray-500 uppercase tracking-wider">
                Invocations / day
              </p>
              <p className="text-body text-swiss-gray-600 mt-sm">
                Vercel Edge Functions free tier
              </p>
            </div>
            <div className="border border-swiss-gray-300 bg-swiss-white p-lg">
              <p className="text-h2 text-swiss-red mb-sm">500K</p>
              <p className="text-caption text-swiss-gray-500 uppercase tracking-wider">
                Edge calls / month
              </p>
              <p className="text-body text-swiss-gray-600 mt-sm">
                Supabase Edge Functions free tier
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Features ═════════════════════════════════════════════════════ */}
      <section className="border-b border-swiss-gray-300">
        <div className="max-w-6xl mx-auto px-lg py-4xl">
          <p className="text-caption text-swiss-gray-500 uppercase tracking-widest mb-md">
            How OasisWaker Works
          </p>
          <h2 className="text-h1 mb-2xl">Three pillars.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="border border-swiss-gray-300 p-lg">
              <div className="w-10 h-10 bg-swiss-black flex items-center justify-center mb-md">
                <Shield className="w-5 h-5 text-swiss-white" />
              </div>
              <h3 className="text-h3 mb-sm">Client-Side Encrypted</h3>
              <p className="text-body text-swiss-gray-600 leading-relaxed">
                Data is encrypted with AES-256-GCM before it leaves your
                machine. Node operators see only ciphertext.
              </p>
            </div>
            <div className="border border-swiss-gray-300 p-lg">
              <div className="w-10 h-10 bg-swiss-black flex items-center justify-center mb-md">
                <Cloud className="w-5 h-5 text-swiss-white" />
              </div>
              <h3 className="text-h3 mb-sm">Multi-Cloud Native</h3>
              <p className="text-body text-swiss-gray-600 leading-relaxed">
                Deploy to Cloudflare Workers, Vercel Edge, or Supabase
                Edge Functions. Each stores blocks on its own durable layer.
              </p>
            </div>
            <div className="border border-swiss-gray-300 p-lg">
              <div className="w-10 h-10 bg-swiss-black flex items-center justify-center mb-md">
                <Server className="w-5 h-5 text-swiss-white" />
              </div>
              <h3 className="text-h3 mb-sm">Aggregated Capacity</h3>
              <p className="text-body text-swiss-gray-600 leading-relaxed">
                Every connected node pools its free-tier storage into a
                shared network. The more nodes join, the more capacity
                everyone gets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═════════════════════════════════════════════════ */}
      <section id="how-it-works" className="border-b border-swiss-gray-300 bg-swiss-gray-100">
        <div className="max-w-6xl mx-auto px-lg py-4xl">
          <p className="text-caption text-swiss-gray-500 uppercase tracking-widest mb-md">
            Getting Started
          </p>
          <h2 className="text-h1 mb-2xl">Four steps.</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
            <div className="border border-swiss-gray-300 bg-swiss-white p-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-swiss-black text-swiss-white text-body-bold mb-md">
                1
              </div>
              <h3 className="text-body-bold mb-sm">Install the CLI</h3>
              <p className="text-caption text-swiss-gray-500 leading-relaxed">
                <code className="bg-swiss-gray-100 px-xs py-2xs text-swiss-black">
                  npx @oasisbio/oasiswaker init
                </code>
              </p>
            </div>
            <div className="border border-swiss-gray-300 bg-swiss-white p-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-swiss-black text-swiss-white text-body-bold mb-md">
                2
              </div>
              <h3 className="text-body-bold mb-sm">Connect Platforms</h3>
              <p className="text-caption text-swiss-gray-500 leading-relaxed">
                OAuth login to Cloudflare, Vercel, or Supabase. One
                command per platform.
              </p>
            </div>
            <div className="border border-swiss-gray-300 bg-swiss-white p-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-swiss-black text-swiss-white text-body-bold mb-md">
                3
              </div>
              <h3 className="text-body-bold mb-sm">Deploy Adapters</h3>
              <p className="text-caption text-swiss-gray-500 leading-relaxed">
                Edge workers are deployed to your account automatically.
                They register with the network.
              </p>
            </div>
            <div className="border border-swiss-gray-300 bg-swiss-white p-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-swiss-black text-swiss-white text-body-bold mb-md">
                4
              </div>
              <h3 className="text-body-bold mb-sm">Store & Retrieve</h3>
              <p className="text-caption text-swiss-gray-500 leading-relaxed">
                Put and get blocks through the CLI. Data is encrypted,
                dispersed, and always available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ══════════════════════════════════════════════════════════ */}
      <section className="border-b border-swiss-gray-300">
        <div className="max-w-6xl mx-auto px-lg py-4xl text-center">
          <h2 className="text-h1 mb-lg">Ready to contribute?</h2>
          <p className="text-body text-swiss-gray-500 max-w-xl mx-auto mb-2xl leading-relaxed">
            OasisWaker is in early development. Join the network, contribute
            your free-tier capacity, and help build the infrastructure that
            belongs to everyone.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-md bg-swiss-black text-swiss-white text-body-bold px-2xl py-md hover:bg-swiss-gray-700 transition-colors"
          >
            <Activity className="w-5 h-5" />
            Enter Dashboard
          </Link>
        </div>
      </section>

      {/* ═══ Footer ═══════════════════════════════════════════════════════ */}
      <footer className="max-w-6xl mx-auto px-lg py-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-md">
            <Activity className="w-4 h-4 text-swiss-gray-400" />
            <span className="text-caption text-swiss-gray-400">
              OasisWaker v2.0
            </span>
          </div>
          <p className="text-caption text-swiss-gray-400">
            &copy; {new Date().getFullYear()} OasisBio
          </p>
        </div>
      </footer>
    </div>
  );
}