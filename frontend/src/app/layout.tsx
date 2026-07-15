import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light" as const,
};

export const metadata: Metadata = {
  title: "OasisWaker",
  description: "Decentralized edge storage network",
  openGraph: {
    title: "OasisWaker — Decentralized Edge Storage Network",
    description:
      "Open protocol for decentralized edge storage. Real-time sync, zero-config deployment, cross-platform.",
    type: "website",
    siteName: "OasisWaker",
  },
  twitter: {
    card: "summary_large_image",
    title: "OasisWaker — Decentralized Edge Storage Network",
    description:
      "Open protocol for decentralized edge storage. Real-time sync, zero-config deployment, cross-platform.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}