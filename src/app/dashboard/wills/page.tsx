"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function WillsContent() {
  const router = useRouter();
  const [wills, setWills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWills();
  }, []);

  const fetchWills = async () => {
    const response = await fetch("/api/wills");
    const data = await response.json();
    setWills(data.wills || []);
    setLoading(false);
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
              <span className="text-lg font-semibold text-slate-700">遺囑管理</span>
            </div>
            <Link href="/dashboard/wills/new">
              <Button className="h-12 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg transition-all">
                + 創建遺囑
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            遺囑管理
          </h1>
          <p className="text-xl text-slate-600">
            創建和管理您的遺囑
          </p>
        </div>

        {/* 統計信息 */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-full border-2 border-white shadow-md">
            <span className="text-base text-slate-600">已創建</span>
            <span className="text-3xl font-bold text-amber-600">{wills.length}</span>
            <span className="text-base text-slate-600">份遺囑</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : wills.length === 0 ? (
          <Card className="border-2 border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-24">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <span className="text-7xl">📜</span>
              </div>
              <h3 className="text-3xl font-semibold text-slate-800 mb-4">
                還沒有遺囑
              </h3>
              <p className="text-xl text-slate-600 mb-8 text-center">
                創建您的第一份遺囑，規劃您的資產傳承
              </p>
              <Link href="/dashboard/wills/new">
                <Button className="h-16 px-10 text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-xl transition-all">
                  創建第一份遺囑
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wills.map((will) => (
              <Link href={`/dashboard/wills/${will.id}/edit`} key={will.id} className="group">
                <Card className="h-full border-2 border-slate-100 hover:border-amber-300 hover:shadow-2xl transition-all hover:-translate-y-1 bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                        {will.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {will.isSigned && (
                          <Badge variant="default" className="bg-emerald-500 text-white">
                            已簽署
                          </Badge>
                        )}
                        {will.isWitnessed && (
                          <Badge variant="default" className="bg-blue-500 text-white">
                            已見證
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {will.jurisdiction && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🌍</span>
                          <span className="text-base text-slate-600">法域：</span>
                          <span className="text-base font-semibold text-slate-700">
                            {will.jurisdiction}
                          </span>
                        </div>
                      )}
                      {will.signedAt && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">✍️</span>
                          <span className="text-base text-slate-600">簽署日期：</span>
                          <span className="text-base text-slate-700">
                            {new Date(will.signedAt).toLocaleDateString("zh-TW")}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <span className="text-base text-slate-600">創建日期：</span>
                        <span className="text-base text-slate-700">
                          {new Date(will.createdAt).toLocaleDateString("zh-TW")}
                        </span>
                      </div>
                      <div className="pt-4 border-t border-slate-100 mt-4">
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                          {will.content.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Link href={`/dashboard/wills/${will.id}/edit`} className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full h-12 border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all font-semibold"
                        >
                          查看詳情
                        </Button>
                      </Link>
                      <Link href={`/dashboard/wills/${will.id}/edit`} className="flex-1">
                        <Button 
                          className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg transition-all font-semibold"
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

export default function WillsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent"></div>
    </div>}>
      <WillsContent />
    </Suspense>
  );
}
