"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RemindersList() {
  const router = useRouter();
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await fetch("/api/reminders");
      const data = await response.json();
      setReminders(data.reminders || []);
    } catch (error) {
      console.error("Failed to fetch reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      const response = await fetch(`/api/reminders/${id}/read`, {
        method: "PATCH",
      });

      if (response.ok) {
        setReminders(reminders.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error("Failed to mark reminder as read:", error);
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case "ASSET_UPDATE":
        return "💰";
      case "INSURANCE_EXPIRED":
        return "🛡️";
      case "ID_CARD_EXPIRED":
        return "🪪";
      case "BIRTHDAY":
        return "🎂";
      default:
        return "🔔";
    }
  };

  const getReminderColor = (type: string) => {
    switch (type) {
      case "ASSET_UPDATE":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "INSURANCE_EXPIRED":
        return "bg-red-100 text-red-700 border-red-200";
      case "ID_CARD_EXPIRED":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "BIRTHDAY":
        return "bg-pink-100 text-pink-700 border-pink-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <Card className="border-2 border-slate-200">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-3xl">🔕</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            暫時沒有提醒
          </h3>
          <p className="text-slate-600 text-center mb-4">
            您可以設置資產更新、保險到期等提醒
          </p>
          <Button
            onClick={() => router.push("/dashboard/reminders/settings")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg transition-all"
          >
            設置提醒
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-slate-100 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">🔔</span>
            提醒列表
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-700">
            {reminders.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`flex items-start gap-4 p-6 rounded-xl border-2 transition-all hover:shadow-md
              ${getReminderColor(reminder.type)}
            `}
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl">{getReminderIcon(reminder.type)}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-800 mb-1">
                    {reminder.title}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {reminder.message}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">
                    {new Date(reminder.remindAt).toLocaleDateString("zh-TW")} {new Date(reminder.remindAt).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
              {(reminder.asset || reminder.member) && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  {reminder.asset && (
                    <Badge variant="outline" className="text-xs">
                      💰 {reminder.asset.name}
                    </Badge>
                  )}
                  {reminder.member && (
                    <Badge variant="outline" className="text-xs">
                      👤 {reminder.member.name}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarkRead(reminder.id)}
              className="flex-shrink-0 hover:bg-white/50"
            >
              ✓
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
