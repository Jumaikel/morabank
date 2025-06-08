import { ReactNode } from "react";
import { Navbar } from "@/components/common/Navbar";
import SSEListener from "@/components/alerts/SSEListener";

interface InternetBankingLayoutProps {
  children: ReactNode;
}

export default function InternetBankingLayout({ children }: InternetBankingLayoutProps) {
  return (
    <>
      <SSEListener />
      <div className="min-h-screen bg-gradient-to-br from-black to-neutral-800 text-white">
        <Navbar />
        <div className="p-10 flex items-center justify-center ">
          {children}
        </div>
      </div>
    </>
  );
}
