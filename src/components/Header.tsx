"use client";

import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <h1 className="text-lg font-bold text-blue-700">
          セキュリティクイズ
        </h1>
        {session?.user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{session.user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-100 cursor-pointer"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
