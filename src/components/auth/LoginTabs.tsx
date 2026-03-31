"use client";

import { useState } from "react";

export default function LoginTabs({
  magicLink,
  password,
}: {
  magicLink: React.ReactNode;
  password: React.ReactNode;
}) {
  const [tab, setTab] = useState<"magic" | "password">("password");

  return (
    <div>
      <div className="mb-4 flex rounded-lg border border-gray-200 bg-gray-50 p-1">
        <button
          onClick={() => setTab("password")}
          className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
            tab === "password"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Passord
        </button>
        <button
          onClick={() => setTab("magic")}
          className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
            tab === "magic"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Magisk lenke
        </button>
      </div>

      {tab === "password" ? password : magicLink}
    </div>
  );
}
