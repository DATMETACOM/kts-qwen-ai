import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SB10 - Branch Traffic Prediction",
  description: "Dự đoán lưu lượng chi nhánh & quản lý hàng đợi thông minh | Shinhan Bank InnoBoost 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
