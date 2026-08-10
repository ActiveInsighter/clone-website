import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Website Clone Lab",
  description: "Multiple website replicas running on one Next.js server",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hans-CN"
      className="h-full antialiased"
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
