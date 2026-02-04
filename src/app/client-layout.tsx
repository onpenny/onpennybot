"use client";

import { Notifications } from "@/components/notifications/Notifications";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        <Notifications />
        {children}
      </body>
    </html>
  );
}
