import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JARI - Poultry Farm Risk Intelligence & Financial Enablement",
  description: "Poultry Farm Intelligence and Financial Enablement Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

