import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SF11 - Earned Wage Access & Salary-Linked Lending | Shinhan Finance",
  description: "AI-powered Earned Wage Access & Salary-Linked Lending platform for Shinhan Finance Vietnam - Qwen AI Build Day 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
