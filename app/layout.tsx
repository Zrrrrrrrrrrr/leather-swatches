import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "皮革色卡推荐系统",
  description: "专业的皮革色卡管理与推荐平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
