import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pinoy Arcade",
  description: "Classic Filipino games, playable in your browser.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-sky-950 text-white antialiased">{children}</body>
    </html>
  );
}
