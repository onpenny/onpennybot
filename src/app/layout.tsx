"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Notifications } from "@/components/notifications/Notifications";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OnHeritage - 您的遺產，您的傳承",
  description: "專業的遺產管理平台，幫助您妥善管理資產、建立家族譜系、規劃遺囑，確保財富與記憶的順利傳承給下一代",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Notifications />
        {children}
      </body>
    </html>
  );
}
