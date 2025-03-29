import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ChatbotButton from "./components/ChatbotButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI导航器 - 您的AI工具资源中心",
  description: "发现和使用各种AI工具的导航平台，内置DeepSeek R1满血版AI助手",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-min-screen w-screen flex bg-slate-50`}
      >
        <div className="w-60 h-screen">
          <Navbar />
        </div>
        <div className="flex-1 relative">
          {children}
          <ChatbotButton />
        </div>
      </body>
    </html>
  );
}
