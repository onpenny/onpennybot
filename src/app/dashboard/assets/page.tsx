"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function AssetsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "ALL",
    location: searchParams.get("location") || "ALL",
  });

  useEffect(() => {
    fetchAssets();
  }, [filters]);

  const fetchAssets = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category !== "ALL") params.set("category", filters.category);
    if (filters.location !== "ALL") params.set("location", filters.location);

    const response = await fetch(`/api/assets?${params.toString()}`);
    const data = await response.json();
    setAssets(data.assets || []);
    setLoading(false);
  };

  const updateFilters = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.category !== "ALL") params.set("category", newFilters.category);
    if (newFilters.location !== "ALL") params.set("location", newFilters.location);

    router.push(`/dashboard/assets?${params.toString()}`);
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
              <span className="text-lg font-semibold text-slate-700">資產管理</span>
            </div>
            <Link href="/dashboard/assets/new">
              <Button className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all">
                + 添加資產
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            資產管理
          </h1>
          <p className="text-xl text-slate-600">
            管理您的所有資產
          </p>
        </div>

        {/* 搜索和过滤器 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Input
              placeholder="搜索資產名稱、機構..."
              value={filters.search}
              onChange={(e) => updateFilters("search", e.target.value)}
              className="h-12 text-lg border-2 border-slate-200 focus:border-indigo-500"
            />

            <select
              value={filters.category}
              onChange={(e) => updateFilters("category", e.target.value)}
              className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <option value="ALL">全部類別</option>
              <option value="BANK">銀行賬戶</option>
              <option value="INSURANCE">保險</option>
              <option value="BROKERAGE">證券賬戶</option>
              <option value="FUND">基金</option>
              <option value="REAL_ESTATE">不動產</option>
              <option value="CRYPTOCURRENCY">虛擬貨幣</option>
              <option value="STOCK">股票</option>
              <option value="COLLECTION">收藏品</option>
              <option value="INTELLECTUAL_PROPERTY">知識產權</option>
              <option value="OTHER">其他</option>
            </select>

            <select
              value={filters.location}
              onChange={(e) => updateFilters("location", e.target.value)}
              className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <option value="ALL">全部位置</option>
              <option value="DOMESTIC">本地</option>
              <option value="OVERSEAS">海外</option>
            </select>
          </div>
        </div>

        {/* 过滤结果统计 */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full">
            <span className="text-sm text-slate-600">找到</span>
            <span className="text-2xl font-bold text-indigo-600">{assets.length}</span>
            <span className="text-sm text-slate-600">個資產</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : assets.length === 0 ? (
          <Card className="border-2 border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <span className="text-5xl">📦</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                沒有找到資產
              </h3>
              <p className="text-lg text-slate-600 mb-6">
                調整搜索條件或添加新資產
              </p>
              <Link href="/dashboard/assets/new">
                <Button className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all">
                  添加第一個資產
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assets.map((asset) => (
              <Link href={`/dashboard/assets/${asset.id}/edit`} key={asset.id} className="group">
                <Card className="h-full border-2 border-slate-100 hover:border-indigo-300 hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {asset.name}
                      </CardTitle>
                      <Badge 
                        variant={asset.location === "DOMESTIC" ? "default" : "secondary"}
                        className={asset.location === "DOMESTIC" ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"}
                      >
                        {asset.location === "DOMESTIC" ? "本地" : "海外"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base text-slate-600 font-medium">類別</span>
                        <Badge variant="outline" className="text-sm">
                          {asset.category}
                        </Badge>
                      </div>
                      {asset.value && (
                        <div className="flex justify-between items-center">
                          <span className="text-base text-slate-600 font-medium">價值</span>
                          <span className="text-xl font-bold text-slate-800">
                            {asset.currency} {asset.value.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {asset.institution && (
                        <div className="flex justify-between items-center">
                          <span className="text-base text-slate-600 font-medium">機構</span>
                          <span className="text-base text-slate-700">{asset.institution}</span>
                        </div>
                      )}
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

export default function AssetsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
    </div>}>
      <AssetsContent />
    </Suspense>
  );
}
