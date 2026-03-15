"use client";

import { useEffect } from "react";
import { useDictionary } from "@/i18n";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error in app:", error);
  }, [error]);

  const { dict } = useDictionary();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-red-600">
          {dict.error.somethingWentWrong}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{error.message}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {dict.common.tryAgain}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            {dict.common.reload}
          </button>
        </div>
        <pre className="mt-6 max-h-64 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-white">
          {error.stack}
        </pre>
      </div>
    </div>
  );
}
