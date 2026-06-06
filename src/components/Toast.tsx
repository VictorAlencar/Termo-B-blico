"use client";

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[84px] z-60 flex justify-center">
      <div className="tb-toast">{message}</div>
    </div>
  );
}
