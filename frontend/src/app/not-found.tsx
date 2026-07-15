import Link from "next/link";

/**
 * 404 Not Found page — Swiss Style.
 *
 * Minimalist design with black/white/red color palette,
 * sharp corners, no shadows, consistent 8px grid.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-swiss-white">
      <div className="text-center max-w-md px-lg">
        {/* Red accent bar */}
        <div className="w-12 h-1 bg-swiss-red mx-auto mb-xl" />

        <p className="text-[80px] leading-none font-bold text-swiss-black tracking-tight">
          404
        </p>
        <p className="text-h3 text-swiss-gray-500 mt-lg mb-2xl leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-swiss-black text-swiss-white text-body-bold px-xl py-md hover:bg-swiss-gray-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}