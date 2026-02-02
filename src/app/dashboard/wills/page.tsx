"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadComponent } from "@/components/upload/UploadComponent";
import { useNotifications } from "@/components/notifications/Notifications";

export default function WillsPage() {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [wills, setWills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
  });

  useEffect(() => {
    fetchWills();
  }, [filters]);

  const fetchWills = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status !== "ALL") params.set("status", filters.status);

    try {
      const response = await fetch(`/api/wills?${params.toString()}`);
      const data = await response.json();
      setWills(data.wills || []);
    } catch (err) {
      showNotification({
        type: "error",
        title: "加載失敗",
        message: "無法獲取遺囑列表，請稍後再試",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`您確定要刪除遺囑「${title}」嗎？此操作無法撤銷。`)) {
      return;
    }

    try {
      const response = await fetch(`/api/wills/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showNotification({
          type: "success",
          title: "刪除成功",
          message: "遺囑已成功刪除",
        });
        setWills(wills.filter((w) => w.id !== id));
      } else {
        throw new Error("刪除失敗");
      }
    } catch (err) {
      showNotification({
        type: "error",
        title: "刪除失敗",
        message: "無法刪除遺囑，請稍後再試",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                  OnHeritage
                </div>
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-lg font-semibold text-slate-700">遺囑管理</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-2 border-slate-200 hover:border-amber-300"
              >
                {showFilters ? "收起篩選" : "展開篩選"}
              </Button>
              <Link href="/dashboard/wills/new">
                <Button className="h-12 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg transition-all">
                  + 創建遺囑
                </Button>
              </Link>
            </div>
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

        {/* 过滤器 */}
        {showFilters && (
          <Card className="mb-8 border-2 border-slate-100 bg-white">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-slate-700">
                    搜索
                  </Label>
                  <Input
                    placeholder="搜索遺囑標題..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="h-12 text-lg border-2 border-slate-200 focus:border-amber-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold text-slate-700">
                    狀態
                  </Label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-amber-500"
                  >
                    <option value="ALL">全部</option>
                    <option value="SIGNED">已簽署</option>
                    <option value="UNSIGNED">未簽署</option>
                    <option value="WITNESSED">已見證</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 统计信息 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-full border-2 border-white shadow-md">
            <span className="text-base text-slate-600">找到</span>
            <span className="text-3xl font-bold text-amber-600">{wills.length}</span>
            <span className="text-base text-slate-600">份遺囑</span>
          </div>
          {filters.search && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ search: "", status: "ALL" })}
              className="border-2 border-slate-200 hover:border-amber-300"
            >
              清除篩選
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : wills.length === 0 ? (
          <Card className="border-2 border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-24">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <span className="text-6xl">📜</span>
              </div>
              <h3 className="text-3xl font-semibold text-slate-800 mb-4">
                還沒有遺囑
              </h3>
              <p className="text-xl text-slate-600 mb-8 text-center">
                創建您的第一份遺囑，開始規劃遺產
              </p>
              <Link href="/dashboard/wills/new">
                <Button className="h-16 px-10 text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-2xl transition-all">
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
                          <Badge className="bg-emerald-500 text-white">已簽署</Badge>
                        )}
                        {will.isWitnessed && (
                          <Badge className="bg-blue-500 text-white">已見證</Badge>
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
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <span className="text-base text-slate-600">創建時間：</span>
                        <span className="text-base text-slate-700">
                          {new Date(will.createdAt).toLocaleDateString("zh-TW")}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-slate-100 mt-3">
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                          {will.content.substring(0, 150)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link href={`/dashboard/wills/${will.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all">
                          查看詳情
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-all"
                        onClick={() => handleDelete(will.id, will.title)}
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
