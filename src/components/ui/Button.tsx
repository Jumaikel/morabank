"use client";

import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import type { ReactNode, MouseEventHandler } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-neutral-950 text-white hover:bg-neutral-800",
        secondary: "bg-neutral-50 text-black border border-black hover:bg-neutral-200",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  asLink?: boolean;
  href?: string;
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export const Button = ({
  asLink = false,
  href = "",
  children,
  type = "button",
  disabled = false,
  isLoading = false,
  onClick,
  className,
  variant,
  size,
}: ButtonProps) => {
  const finalClassName = twMerge(buttonVariants({ variant, size }), className);

  if (asLink && href) {
    return (
      <Link href={href} className={finalClassName}>
        {isLoading ? <Spinner /> : children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={finalClassName}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-inherit"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);
