import { ReactNode } from "react";
import { Navbar } from "@/components/common/Navbar";

interface InternetBankingLayoutProps {
  children: ReactNode;
}

export default function InternetBankingLayout({ children }: InternetBankingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-neutral-800 text-white">
      <Navbar />
      <main className="p-10 flex items-center justify-center ">
        {children}
      </main>
    </div>
  );
}
