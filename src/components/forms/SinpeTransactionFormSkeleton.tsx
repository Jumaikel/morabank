"use client";

export const SinpeTransactionFormSkeleton = () => (
  <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow animate-pulse">
    <div className="h-7 w-2/3 bg-neutral-200 rounded mb-6 mx-auto" />
    {[...Array(4)].map((_, i) => (
      <div key={i} className="mb-4 space-y-2">
        <div className="h-4 w-36 bg-neutral-200 rounded" />
        <div className="h-10 w-full bg-neutral-200 rounded" />
      </div>
    ))}
    <div className="h-10 w-full bg-neutral-200 rounded mt-6" />
  </div>
);
