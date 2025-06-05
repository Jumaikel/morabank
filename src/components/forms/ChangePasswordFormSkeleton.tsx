"use client";

export const ChangePasswordFormSkeleton = () => (
  <div className="flex flex-col w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 animate-pulse">
    <div className="h-8 bg-neutral-200 rounded mb-6 w-1/2 mx-auto" />
    <form className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-32 bg-neutral-200 rounded" />
          <div className="h-10 w-full bg-neutral-200 rounded" />
        </div>
      ))}
      <div className="h-10 w-full bg-neutral-200 rounded mt-4" />
    </form>
  </div>
);
