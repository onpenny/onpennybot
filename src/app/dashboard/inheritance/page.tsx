"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/components/notifications/Notifications";

export default function InheritancePage() {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [inheritances, setInheritances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
  });

  useEffect(() => {
    fetchInheritances();
  }, []);

  const fetchInheritances = async () => {
    try {
      const response = await fetch("/api/inheritance");
      const data = await response.json();
      setInheritances(data.inheritances || []);
    } catch (err) {
      showNotification({
        type: "error",
        title: "加載失敗",
        message: "無法獲取繼承規則列表",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`您確定要刪除繼承規則「${name}」嗎？此操作無法撤銷。`)) {
      return;
    }

    try {
      const response = await fetch(`/api/inheritance/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showNotification({
          type: "success",
          title: "刪除成功",
          message: `繼承規則「${name}」已刪除`,
        });
        setInheritances(inheritances.filter((i) => i.id !== id));
      } else {
        throw new Error("刪除失敗");
      }
    } catch (err) {
      showNotification({
        type: "error",
        title: "刪除失敗",
        message: "無法刪除繼承規則，請稍後再試",
      });
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-slate-500";
      case "IN_PROGRESS":
        return "text-blue-500";
      case "COMPLETED":
        return "text-emerald-500";
      case "DISPUTED":
        return "text-red-500";
      default:
        return "text-slate-500";
    }
  };

  const filteredInheritances = inheritances.filter((item) => {
    if (filters.search && !item.asset?.name.toLowerCase().includes(filters.search.toLowerCase()) && 
                       !item.heir?.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== "ALL" && item.status !== filters.status) {
      return false;
    }
    return true;
  });

  const hasFilters = filters.search || filters.status !== "ALL";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                  OnHeritage
                </div>
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-lg font-semibold text-slate-700">繼承規則</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-2 border-slate-200 hover:border-purple-300"
              >
                {showFilters ? "收起搜索" : "展開搜索"}
              </Button>
              <Link href="/dashboard/inheritance/new">
                <Button className="h-12 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg transition-all">
                  + 設置規則
                </Button>
              </Link>
            </div>
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

        {/* 搜索栏 */}
        {showFilters && (
          <Card className="mb-8 border-2 border-slate-100 bg-white">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  placeholder="搜索資產或繼承人..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="h-12 text-lg border-2 border-slate-200 focus:border-purple-500"
                />

                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <option value="ALL">全部狀態</option>
                  <option value="PENDING">⏳ 待處理</option>
                  <option value="IN_PROGRESS">🔄 進行中</option>
                  <option value="COMPLETED">✅ 已完成</option>
                  <option value="DISPUTED">❌ 糾紛中</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 统计信息 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-full border-2 border-white shadow-md">
            <span className="text-base text-slate-600">繼承規則</span>
            <span className="text-3xl font-bold text-purple-600">{filteredInheritances.length}</span>
            <span className="text-base text-slate-600">條</span>
          </div>
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ search: "", status: "ALL" })}
              className="border-2 border-slate-200 hover:border-purple-300"
            >
              清除篩選
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : filteredInheritances.length === 0 ? (
          <Card className="border-2 border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-24">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <span className="text-6xl">🎯</span>
              </div>
              <h3 className="text-3xl font-semibold text-slate-800 mb-4">
                還沒有繼承規則
              </h3>
              <p className="text-xl text-slate-600 mb-8 max-w-md text-center">
                {hasFilters ? "調整搜索條件或清除篩選" : "開始設置資產分配規則，確保財富能夠按照您的願望傳承給家人"}
              </p>
              {!hasFilters && (
                <Link href="/dashboard/inheritance/new">
                  <Button className="h-16 px-10 text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl transition-all">
                    設置第一條規則
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInheritances.map((inheritance) => (
              <Link href={`/dashboard/inheritance/${inheritance.id}/edit`} key={inheritance.id} className="group">
                <Card className="h-full border-2 border-slate-100 hover:border-purple-300 hover:shadow-2xl transition-all hover:-translate-y-1 bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 bg-gradient-to-br ${inheritance.status === "COMPLETED" ? "from-emerald-400 to-emerald-600" : inheritance.status === "IN_PROGRESS" ? "from-blue-400 to-blue-600" : inheritance.status === "DISPUTED" ? "from-red-400 to-red-600" : "from-slate-400 to-slate-600"} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          <span className="text-3xl">🎯</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-800 mb-1">
                            {inheritance.asset?.name || "未命名資產"}
                          </h3>
                          {inheritance.asset?.category && (
                            <Badge variant="outline" className="text-sm">{inheritance.asset.category}</Badge>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(inheritance.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👤</span>
                        <div className="flex-1">
                          <span className="text-sm text-slate-600">繼承人</span>
                          <p className="text-base font-semibold text-slate-800">
                            {inheritance.heir?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {inheritance.percentage}%
                      </div>
                    </div>

                    {inheritance.conditions && (
                      <div className="p-4 bg-gradient-to-r from-amber-50 to-purple-50 rounded-xl border-2 border-purple-100">
                        <div className="flex items-start gap-3">
                          <span className="text-xl">⚠️</span>
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-slate-700">條件</span>
                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                              {inheritance.conditions}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="text-slate-400">📅</span>
                      <span>設定時間</span>
                      <span className="font-medium text-slate-700">
                        {new Date(inheritance.createdAt).toLocaleDateString("zh-TW")}
                      </span>
                      <span className={`font-semibold ${getStatusColor(inheritance.status)}`}>
                        {inheritance.status === "PENDING" && "等待處理"}
                        {inheritance.status === "IN_PROGRESS" && "執行中"}
                        {inheritance.status === "COMPLETED" && "已完成"}
                        {inheritance.status === "DISPUTED" && "糾紛"}
                      </span>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Link href={`/dashboard/inheritance/${inheritance.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all">
                          編輯
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(inheritance.id, inheritance.asset?.name || "未命名資產");
                        }}
                        className="w-[30%] border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-all"
                      >
                        🗑
                      </Button>
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
