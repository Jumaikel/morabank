import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "MoraBank",
  description: "Simulación de red bancaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased`}>
        <Toaster richColors
          position="bottom-center"
        />
        {children}
      </body>
    </html>
  );
}
