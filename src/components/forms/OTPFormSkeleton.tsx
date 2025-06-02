"use client";

import React from "react";

export const OTPFormSkeleton = () => {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-6 w-3/5 mx-auto" />
      <div className="h-4 bg-gray-200 rounded mb-8 w-4/5 mx-auto" />
      <div className="h-4 bg-gray-200 rounded mb-2 w-2/5" />
      <div className="h-10 bg-gray-200 rounded mb-6 w-full" />
      <div className="h-10 bg-gray-200 rounded w-full" />
    </div>
  );
};
