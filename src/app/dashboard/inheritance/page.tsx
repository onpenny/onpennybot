"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function InheritanceContent() {
  const router = useRouter();
  const [inheritances, setInheritances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInheritances();
  }, []);

  const fetchInheritances = async () => {
    const response = await fetch("/api/inheritance");
    const data = await response.json();
    setInheritances(data.inheritances || []);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-slate-200 text-slate-700">待處理</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500 text-white">進行中</Badge>;
      case "COMPLETED":
        return <Badge className="bg-emerald-500 text-white">已完成</Badge>;
      case "DISPUTED":
        return <Badge variant="destructive">糾紛中</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                  OnHeritage
                </div>
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-lg font-semibold text-slate-700">繼承規則</span>
            </div>
            <Link href="/dashboard/inheritance/new">
              <Button className="h-12 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg transition-all">
                + 設置規則
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            繼承規則
          </h1>
          <p className="text-xl text-slate-600">
            設置資產分配規則
          </p>
        </div>

        {/* 統計信息 */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-full">
            <span className="text-sm text-slate-600">共</span>
            <span className="text-2xl font-bold text-purple-600">{inheritances.length}</span>
            <span className="text-sm text-slate-600">條繼承規則</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : inheritances.length === 0 ? (
          <Card className="border-2 border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-24">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <span className="text-6xl">🎯</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">
                還沒有設置繼承規則
              </h3>
              <p className="text-lg text-slate-600 mb-8 text-center max-w-md">
                開始為您的資產設置繼承規則，確保財富能夠按照您的願望傳承給家人
              </p>
              <Link href="/dashboard/inheritance/new">
                <Button className="h-16 px-12 text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-2xl transition-all">
                  設置第一條規則
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {inheritances.map((inheritance) => (
              <Link href={`/dashboard/inheritance/${inheritance.id}/edit`} key={inheritance.id} className="group">
                <Card className="h-full border-2 border-slate-100 hover:border-purple-300 hover:shadow-2xl transition-all hover:-translate-y-1 bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <span className="text-2xl">🎯</span>
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                          {inheritance.asset?.name || "未命名資產"}
                        </CardTitle>
                      </div>
                      {getStatusBadge(inheritance.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-lg">👤</span>
                        </div>
                        <span className="text-sm text-slate-600 font-medium">繼承人</span>
                      </div>
                      <span className="text-lg font-bold text-slate-800">
                        {inheritance.heir?.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                      <span className="text-sm text-slate-600 font-medium">分配比例</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {inheritance.percentage}%
                      </span>
                    </div>

                    {inheritance.conditions && (
                      <div className="py-3 px-4 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">⚠️</span>
                          <div>
                            <span className="text-sm font-semibold text-slate-700">條件</span>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {inheritance.conditions}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="text-slate-400">📅</span>
                        <span>設定時間</span>
                        <span className="font-medium text-slate-600">
                          {new Date(inheritance.createdAt).toLocaleDateString("zh-TW")}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Link href={`/dashboard/inheritance/${inheritance.id}/edit`} className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full h-12 border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all font-semibold"
                        >
                          編輯
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function InheritancePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
    </div>}>
      <InheritanceContent />
    </Suspense>
  );
}
