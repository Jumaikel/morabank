"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = "text",
      placeholder,
      disabled,
      size = "md",
      error,
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-8 px-2 text-sm",
      md: "h-10 px-3 text-base",
      lg: "h-12 px-4 text-lg",
    };

    return (
      <div className="flex flex-col space-y-1 text-neutral-700">
        {label && (
          <label className="text-sm font-medium text-neutral-950">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          className={twMerge(
            `placeholder:text-neutral-500 bg-transparent border border-neutral-950 rounded-md transition-colors focus:ring-neutral-950 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 ${sizeClasses[size]}`,
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
