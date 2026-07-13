"use client";

import React from "react";
import { Link2, Cloud, Globe, Database } from "lucide-react";
import { Button } from "@/components/ui/Button";

const platforms = [
  {
    name: "Cloudflare Workers",
    icon: Cloud,
    description: "Edge compute + R2 object storage",
    status: "Available",
  },
  {
    name: "Vercel Edge",
    icon: Globe,
    description: "Edge functions + Blob storage",
    status: "Available",
  },
  {
    name: "Supabase Edge",
    icon: Database,
    description: "Edge functions + Storage buckets",
    status: "Coming Soon",
  },
];

export default function ConnectionsPage() {
  return (
    <div className="space-y-3xl">
      <div>
        <h1 className="text-h1">Connections</h1>
        <p className="text-swiss-gray-500 mt-sm">
          Link your cloud platform accounts to contribute resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isAvailable = platform.status === "Available";
          return (
            <div key={platform.name} className="card flex flex-col">
              <div className="flex items-center gap-md mb-md">
                <Icon className="w-8 h-8 text-swiss-black" />
                <div>
                  <h3 className="text-h3">{platform.name}</h3>
                  <p className="text-caption text-swiss-gray-500">
                    {platform.description}
                  </p>
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex items-center gap-sm mb-md">
                  <div
                    className={`w-2 h-2 ${
                      isAvailable ? "bg-swiss-black" : "bg-swiss-gray-300"
                    }`}
                  />
                  <span className="text-caption text-swiss-gray-500">
                    {platform.status}
                  </span>
                </div>
                <Button
                  variant={isAvailable ? "primary" : "secondary"}
                  size="md"
                  className="w-full"
                  disabled={!isAvailable}
                >
                  <Link2 className="w-4 h-4 mr-sm" />
                  {isAvailable ? "Connect" : "Coming Soon"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}