"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";

function AssetsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(true);

  // 解析URL参数
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "ALL";
    const location = searchParams.get("location") || "ALL";
    const minValue = searchParams.get("minValue");
    const maxValue = searchParams.get("maxValue");
    const institution = searchParams.get("institution") || "";

    fetchAssets(search, category, location, minValue, maxValue, institution);
  }, [searchParams]);

  const fetchAssets = async (
    search: string,
    category: string,
    location: string,
    minValue: string,
    maxValue: string,
    institution: string
  ) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "ALL") params.set("category", category);
    if (location !== "ALL") params.set("location", location);
    if (minValue) params.set("minValue", minValue);
    if (maxValue) params.set("maxValue", maxValue);
    if (institution) params.set("institution", institution);

    const response = await fetch(`/api/assets?${params.toString()}`);
    const data = await response.json();
    setAssets(data.assets || []);
    setLoading(false);
  };

  const handleSearch = (filters: any) => {
    const params = new URLSearchParams();
    if (filters.name) params.set("search", filters.name);
    if (filters.category && filters.category !== "ALL") params.set("category", filters.category);
    if (filters.location && filters.location !== "ALL") params.set("location", filters.location);
    if (filters.minValue) params.set("minValue", filters.minValue);
    if (filters.maxValue) params.set("maxValue", filters.maxValue);
    if (filters.institution) params.set("institution", filters.institution);

    router.push(`/dashboard/assets?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/dashboard/assets");
  };

  // 判断是否在搜索状态
  const hasFilters = searchParams.get("search") || 
                      searchParams.get("category") !== "ALL" ||
                      searchParams.get("location") !== "ALL" ||
                      searchParams.get("minValue") ||
                      searchParams.get("maxValue") ||
                      searchParams.get("institution");

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
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className="border-2 border-slate-200 hover:border-indigo-300"
              >
                {showSearch ? "收起搜索" : "展開搜索"}
              </Button>
              <Link href="/dashboard/assets/new">
                <Button className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all">
                  + 添加資產
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            資產管理
          </h1>
          <p className="text-xl text-slate-600">
            管理您的所有資產
          </p>
        </div>

        {/* 搜索栏 */}
        {showSearch && (
          <div className="mb-8">
            <AdvancedSearch
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </div>
        )}

        {/* 过滤结果统计 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border-2 border-white shadow-md">
            <span className="text-base text-slate-600">找到</span>
            <span className="text-3xl font-bold text-indigo-600">{assets.length}</span>
            <span className="text-base text-slate-600">個資產</span>
          </div>
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="border-2 border-slate-200 hover:border-indigo-300"
            >
              清除篩選
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : assets.length === 0 ? (
          <Card className="border-2 border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-24">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <span className="text-6xl">📦</span>
              </div>
              <h3 className="text-3xl font-semibold text-slate-800 mb-4">
                沒有找到資產
              </h3>
              <p className="text-xl text-slate-600 mb-8 max-w-md text-center">
                {hasFilters ? "嘗試調整搜索條件或清除篩選" : "開始添加您的第一個資產"}
              </p>
              {!hasFilters && (
                <Link href="/dashboard/assets/new">
                  <Button className="h-16 px-10 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl transition-all">
                    添加第一個資產
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assets.map((asset) => (
              <Link href={`/dashboard/assets/${asset.id}/edit`} key={asset.id} className="group">
                <Card className="h-full border-2 border-slate-100 hover:border-indigo-300 hover:shadow-2xl transition-all hover:-translate-y-1 bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
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
                        <Badge variant="outline" className="text-sm">{asset.category}</Badge>
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
                    <div className="flex gap-2 mt-4">
                      <Link href={`/dashboard/assets/${asset.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
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

export default function AssetsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
    </div>}>
      <AssetsContent />
    </Suspense>
  );
}
