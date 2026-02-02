"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EditInheritancePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [heirs, setHeirs] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    assetId: "",
    heirId: "",
    percentage: "100",
    conditions: "",
    status: "PENDING",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ruleRes, assetsRes, heirsRes] = await Promise.all([
        fetch(`/api/inheritance/${params.id}`),
        fetch("/api/assets"),
        fetch("/api/family"),
      ]);

      const ruleData = await ruleRes.json();
      const assetsData = await assetsRes.json();
      const heirsData = await heirsRes.json();

      if (ruleData.error) {
        setError(ruleData.error);
        setLoading(false);
        return;
      }

      setAssets(assetsData.assets || []);
      setHeirs(heirsData.members || []);

      setFormData({
        assetId: ruleData.inheritance.assetId,
        heirId: ruleData.inheritance.heirId,
        percentage: ruleData.inheritance.percentage.toString(),
        conditions: ruleData.inheritance.conditions || "",
        status: ruleData.inheritance.status,
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("加載失敗，請稍後再試");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.assetId) {
      setError("請選擇資產");
      return;
    }

    if (!formData.heirId) {
      setError("請選擇繼承人");
      return;
    }

    if (parseFloat(formData.percentage) <= 0 || parseFloat(formData.percentage) > 100) {
      setError("分配比例必須在 0 到 100 之間");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/inheritance/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          percentage: parseFloat(formData.percentage),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "更新失敗");
        setSaving(false);
        return;
      }

      router.push("/dashboard/inheritance");
    } catch (err) {
      setError("更新失敗，請稍後再試");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/inheritance/${params.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "刪除失敗");
        setDeleting(false);
        setShowDeleteConfirm(false);
        return;
      }

      router.push("/dashboard/inheritance");
    } catch (err) {
      setError("刪除失敗，請稍後再試");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-slate-200 text-slate-700";
      case "IN_PROGRESS":
        return "bg-blue-500 text-white";
      case "COMPLETED":
        return "bg-emerald-500 text-white";
      case "DISPUTED":
        return "bg-red-500 text-white";
      default:
        return "bg-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                OnHeritage
              </div>
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-lg font-semibold text-slate-700">編輯繼承規則</span>
          </div>
          <Link href="/dashboard/inheritance">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
              返回列表
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            編輯繼承規則
          </h1>
          <p className="text-xl text-slate-600">
            修改資產分配規則
          </p>
        </div>

        <Card className="border-2 border-slate-100 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">選擇資產和繼承人</CardTitle>
            <p className="text-slate-500">更新繼承規則</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-3 shadow-md">
                      <span className="text-3xl">💰</span>
                    </div>
                    <Label htmlFor="asset" className="text-2xl font-bold text-slate-800">
                      選擇資產
                    </Label>
                  </div>
                  <select
                    id="asset"
                    value={formData.assetId}
                    onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                    className="flex h-16 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 text-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    required
                  >
                    <option value="">請選擇資產...</option>
                    {assets.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        💰 {asset.name}
                        {asset.value && ` - ${asset.currency} ${asset.value.toLocaleString()}`}
                      </option>
                    ))}
                  </select>
                  {assets.length === 0 && (
                    <p className="text-sm text-slate-500 mt-2">
                      還沒有資產，請先
                      <Link href="/dashboard/assets/new" className="text-purple-600 font-semibold hover:underline">
                        添加資產
                      </Link>
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl p-3 shadow-md">
                      <span className="text-3xl">👤</span>
                    </div>
                    <Label htmlFor="heir" className="text-2xl font-bold text-slate-800">
                      選擇繼承人
                    </Label>
                  </div>
                  <select
                    id="heir"
                    value={formData.heirId}
                    onChange={(e) => setFormData({ ...formData, heirId: e.target.value })}
                    className="flex h-16 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 text-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    required
                  >
                    <option value="">請選擇繼承人...</option>
                    {heirs.map((heir) => (
                      <option key={heir.id} value={heir.id}>
                        👤 {heir.name}
                        {!heir.isAlive && ` (已逝世)`}
                      </option>
                    ))}
                  </select>
                  {heirs.length === 0 && (
                    <p className="text-sm text-slate-500 mt-2">
                      還沒有家族成員，請先
                      <Link href="/dashboard/family/new" className="text-purple-600 font-semibold hover:underline">
                        添加成員
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              <div className="p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl border-2 border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🎯</span>
                  <Label htmlFor="percentage" className="text-3xl font-bold text-slate-800">
                    分配比例
                  </Label>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={formData.percentage}
                      onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                      placeholder="100"
                      required
                      className="h-16 text-4xl font-bold text-center border-2 border-slate-200 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    />
                  </div>
                  <span className="text-5xl font-bold text-purple-600">%</span>
                </div>
                <p className="text-center text-xl text-slate-600 mt-2">
                  這個繼承人將獲得資產的
                  <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {formData.percentage}%
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-full p-3 shadow-md">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <Label htmlFor="conditions" className="text-xl font-semibold text-slate-700">
                    繼承條件（可選）
                  </Label>
                </div>
                <Textarea
                  id="conditions"
                  value={formData.conditions}
                  onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                  placeholder="例如：年滿 25 歲時繼承、完成高等教育後繼承等"
                  rows={4}
                  className="text-lg border-2 border-slate-200 focus:border-purple-500 resize-none"
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="status" className="text-xl font-semibold text-slate-700">
                  規則狀態
                </Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="flex h-14 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <option value="PENDING">⏳ 待處理</option>
                  <option value="IN_PROGRESS">🔄 進行中</option>
                  <option value="COMPLETED">✅ 已完成</option>
                  <option value="DISPUTED">❌ 糾紛中</option>
                </select>
                <p className="text-sm text-slate-500 mt-1">
                  更新規則的當前狀態
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="border-2 border-red-200">
                  <AlertDescription className="text-xl">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 pt-6 border-t-2 border-slate-100">
                <Link href="/dashboard/inheritance" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-14 text-lg font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    取消修改
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleting}
                  className="w-[30%] h-14 text-lg font-semibold border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-all"
                >
                  {deleting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-600 border-t-transparent"></div>
                      刪除
                    </span>
                  ) : "🗑 刪除"}
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-2xl transition-all"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      保存中...
                    </span>
                  ) : "💾 保存修改"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl border-2 border-slate-100">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <span className="text-5xl">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">使用建議</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold text-xl mt-1">•</span>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      確保分配比例總和為 100%（如果有其他繼承人）
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold text-xl mt-1">•</span>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      合理設置繼承條件，避免爭議
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold text-xl mt-1">•</span>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      建議提前與繼承人溝通，了解他們的需求
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold text-xl mt-1">•</span>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      規則可以隨時編輯或刪除
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-purple-50 rounded-3xl border-2 border-slate-100">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <span className="text-3xl">📋</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                準備好這些資料
              </h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-slate-700">資產證明</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-slate-700">繼承人身份證明</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-slate-700">關係證明</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-slate-700">公證文件</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-3xl">確認刪除</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center py-8">
                <div className="bg-red-100 rounded-full p-8">
                  <span className="text-6xl">⚠️</span>
                </div>
              </div>
              <p className="text-center text-2xl text-slate-700">
                您確定要刪除此繼承規則嗎？
              </p>
              <p className="text-center text-lg text-slate-500">
                刪除後此規則將無法恢復
              </p>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 h-14 text-xl font-semibold"
                >
                  取消
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  variant="destructive"
                  className="flex-1 h-14 text-xl font-semibold"
                >
                  {deleting ? "刪除中..." : "確認刪除"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
