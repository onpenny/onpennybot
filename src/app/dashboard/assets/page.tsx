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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-xl font-bold">
                OnHeritage
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-semibold">資產管理</span>
            </div>
            <Link href="/dashboard/assets/new">
              <Button>+ 添加資產</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">資產管理</h1>
          <p className="text-muted-foreground">
            管理您的所有資產
          </p>
        </div>

        {/* 搜索和过滤器 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              placeholder="搜索資產名稱、機構..."
              value={filters.search}
              onChange={(e) => updateFilters("search", e.target.value)}
            />

            <select
              value={filters.category}
              onChange={(e) => updateFilters("category", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="ALL">全部位置</option>
              <option value="DOMESTIC">本地</option>
              <option value="OVERSEAS">海外</option>
            </select>
          </div>
        </div>

        {/* 过滤结果统计 */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {loading ? "搜索中..." : `共找到 ${assets.length} 個資產`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <p>加載中...</p>
          </div>
        ) : assets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <span className="text-6xl mb-4">📦</span>
              <h3 className="text-xl font-semibold mb-2">沒有找到資產</h3>
              <p className="text-muted-foreground mb-4">
                調整搜索條件或添加新資產
              </p>
              <Link href="/dashboard/assets/new">
                <Button>添加資產</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <Card key={asset.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                    <Badge variant={asset.location === "DOMESTIC" ? "default" : "secondary"}>
                      {asset.location === "DOMESTIC" ? "本地" : "海外"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">類別</span>
                      <Badge variant="outline">{asset.category}</Badge>
                    </div>
                    {asset.value && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">價值</span>
                        <span className="font-semibold">
                          {asset.currency} {asset.value.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {asset.institution && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">機構</span>
                        <span className="text-sm">{asset.institution}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/dashboard/assets/${asset.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        編輯
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AssetsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">加載中...</div>}>
      <AssetsContent />
    </Suspense>
  );
}
