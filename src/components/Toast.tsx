"use client";

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center">
      <div className="toast-in rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-lg dark:bg-stone-100 dark:text-stone-900">
        {message}
      </div>
    </div>
  );
}
