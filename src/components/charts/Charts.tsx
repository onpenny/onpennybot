"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartProps {
  title: string;
  value: number;
  label: string;
  color: string;
  icon: string;
}

export function StatCard({ title, value, label, color, icon }: ChartProps) {
  return (
    <Card className="border-2 border-slate-100 bg-white shadow-md hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-700">
            {title}
          </CardTitle>
          <div className="text-3xl">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <div className={`text-4xl font-bold ${color} mb-2`}>
              {value}
            </div>
            <p className="text-sm text-slate-600">{label}</p>
          </div>
          <div className={`h-16 w-16 rounded-xl ${color} flex items-center justify-center shadow-lg`}>
            <span className="text-2xl text-white font-bold">
              {value > 0 ? "📈" : "📊"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  label: string;
  icon: string;
}

export function ProgressBar({ value, max, color, label, icon }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <Card className="border-2 border-slate-100 bg-white shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-700">
            {label}
          </CardTitle>
          <div className="text-2xl">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">當前</span>
            <span className="font-bold text-slate-800">{value}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full ${color} rounded-full transition-all duration-500`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-500">進度</span>
            <span className="font-bold text-slate-800">{percentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

export function DonutChart({ data, title }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const segments = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) : 0;
    const angle = percentage * 360;
    const segmentAngle = currentAngle + angle;

    const startX = 50 + radius * Math.cos((currentAngle * Math.PI) / 180);
    const startY = 50 + radius * Math.sin((currentAngle * Math.PI) / 180);
    const endX = 50 + radius * Math.cos((segmentAngle * Math.PI) / 180);
    const endY = 50 + radius * Math.sin((segmentAngle * Math.PI) / 180);

    const largeArc = angle > 180 ? 1 : 0;

    currentAngle = segmentAngle;

    return (
      <circle
        key={item.label}
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke={item.color}
        strokeWidth="20"
        strokeDasharray={`${angle * (Math.PI * radius) / 180} ${circumference - (angle * (Math.PI * radius) / 180)}`}
        strokeDashoffset="0"
        transform={`rotate(-90 50 50)`}
        transformOrigin="center"
        style={{ transition: "all 0.3s" }}
      />
    );
  });

  return (
    <Card className="border-2 border-slate-100 bg-white shadow-md hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-6">
          <svg viewBox="0 0 100 100" className="w-48 h-48">
            {segments}
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${item.color}`}
              />
              <span className="text-sm text-slate-700">{item.label}</span>
              <span className="text-sm font-bold text-slate-800">
                {total > 0 ? Math.round((item.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
