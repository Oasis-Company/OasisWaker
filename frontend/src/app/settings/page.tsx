"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <div className="space-y-3xl">
      <div>
        <h1 className="text-h1">Settings</h1>
        <p className="text-swiss-gray-500 mt-sm">
          System configuration and preferences
        </p>
      </div>

      {/* Backend Connection */}
      <div className="card">
        <h2 className="text-h2 mb-md">Backend Connection</h2>
        <div className="space-y-sm">
          <div className="flex items-center justify-between">
            <span className="text-body">API Server</span>
            <span className="text-caption text-swiss-gray-500 font-mono">
              http://127.0.0.1:8000
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body">WebSocket</span>
            <span className="text-caption text-swiss-gray-500 font-mono">
              ws://127.0.0.1:8000/ws/v1/events
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body">Status</span>
            <span className="inline-flex items-center gap-sm">
              <span className="w-2 h-2 bg-swiss-black" />
              <span className="text-caption text-swiss-gray-500">Connected</span>
            </span>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <h2 className="text-h2 mb-md">About</h2>
        <div className="space-y-sm">
          <div className="flex items-center justify-between">
            <span className="text-body">Version</span>
            <span className="text-caption text-swiss-gray-500">2.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body">Backend</span>
            <span className="text-caption text-swiss-gray-500">
              FastAPI + SQLAlchemy + SQLite
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body">Frontend</span>
            <span className="text-caption text-swiss-gray-500">
              Next.js 14 + TailwindCSS + Swiss Style
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <h2 className="text-h2 mb-md">Actions</h2>
        <div className="flex gap-md">
          <Button variant="secondary" size="md">
            Reset Database
          </Button>
          <Button variant="ghost" size="md">
            Export Logs
          </Button>
        </div>
      </div>
    </div>
  );
}