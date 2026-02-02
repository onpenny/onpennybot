"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EditAssetPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "BANK",
    description: "",
    value: "",
    currency: "MOP",
    location: "DOMESTIC",
    institution: "",
    accountNumber: "",
  });

  useEffect(() => {
    fetchAsset();
  }, [params.id]);

  const fetchAsset = async () => {
    try {
      const response = await fetch(`/api/assets/${params.id}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setFormData({
        name: data.asset.name,
        category: data.asset.category,
        description: data.asset.description || "",
        value: data.asset.value?.toString() || "",
        currency: data.asset.currency || "MOP",
        location: data.asset.location,
        institution: data.asset.institution || "",
        accountNumber: data.asset.accountNumber,
      });
      setLoading(false);
    } catch (err) {
      setError("加載失敗，請稍後再試");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`/api/assets/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          value: formData.value ? parseFloat(formData.value) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "更新失敗");
        setSaving(false);
        return;
      }

      router.push("/dashboard/assets");
    } catch (err) {
      setError("更新失敗，請稍後再試");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/assets/${params.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "刪除失敗");
        setDeleting(false);
        setShowDeleteConfirm(false);
        return;
      }

      router.push("/dashboard/assets");
    } catch (err) {
      setError("刪除失敗，請稍後再試");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/assets" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                OnHeritage
              </div>
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-lg font-semibold text-slate-700">編輯資產</span>
          </div>
          <Link href="/dashboard/assets">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
              返回列表
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            編輯資產信息
          </h1>
          <p className="text-xl text-slate-600">
            修改資產的詳細信息
          </p>
        </div>

        <Card className="border-2 border-slate-100 shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold">資產信息</CardTitle>
            <p className="text-slate-500">更新資產的詳細信息</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="name" className="text-lg font-semibold text-slate-700">
                  資產名稱 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="例如：招商銀行儲蓄賬戶"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-14 text-lg border-2 border-slate-200 focus:border-indigo-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="category" className="text-lg font-semibold text-slate-700">
                    資產類別 <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex h-14 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    required
                  >
                    <option value="BANK">💰 銀行賬戶</option>
                    <option value="INSURANCE">🛡️ 保險</option>
                    <option value="BROKERAGE">📈 證券賬戶</option>
                    <option value="FUND">📊 基金</option>
                    <option value="REAL_ESTATE">🏠 不動產</option>
                    <option value="CRYPTOCURRENCY">₿ 虛擬貨幣</option>
                    <option value="STOCK">📉 股票</option>
                    <option value="COLLECTION">🏺 收藏品</option>
                    <option value="INTELLECTUAL_PROPERTY">💡 知識產權</option>
                    <option value="OTHER">📦 其他</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="location" className="text-lg font-semibold text-slate-700">
                    資產位置 <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="flex h-14 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    required
                  >
                    <option value="DOMESTIC">🏠 本地</option>
                    <option value="OVERSEAS">🌐 海外</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="value" className="text-lg font-semibold text-slate-700">
                    資產價值
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="h-14 text-lg border-2 border-slate-200 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="currency" className="text-lg font-semibold text-slate-700">
                    幣種
                  </Label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="flex h-14 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <option value="MOP">🇲🇳 MOP</option>
                    <option value="HKD">🇭🇰 HKD</option>
                    <option value="CNY">🇨🇳 CNY</option>
                    <option value="USD">🇺🇸 USD</option>
                    <option value="EUR">🇪🇺 EUR</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="institution" className="text-lg font-semibold text-slate-700">
                  金融機構 / 持有方
                </Label>
                <Input
                  id="institution"
                  placeholder="例如：招商銀行、友邦保險、中國銀行"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="h-14 text-lg border-2 border-slate-200 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🔒</span>
                  <Label htmlFor="accountNumber" className="text-2xl font-bold text-slate-800">
                    賬產編號 <span className="text-red-500">*</span>
                  </Label>
                </div>
                <Input
                  id="accountNumber"
                  type="password"
                  placeholder="請輸入賬號、憑證號碼或相關信息"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  required
                  className="h-14 text-lg border-2 border-indigo-300 bg-white focus:border-indigo-500"
                />
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  <span className="font-semibold">🔒 安全提示：</span>此信息將使用 AES-256 加密技術安全存儲，只有您可以查看
                </p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="description" className="text-lg font-semibold text-slate-700">
                  備註
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="資產的詳細描述，例如：賬戶用途、保單號、聯絡人等"
                  rows={4}
                  className="text-lg border-2 border-slate-200 focus:border-indigo-500 resize-none"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="border-2 border-red-200">
                  <AlertDescription className="text-lg">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 pt-6 border-t-2 border-slate-100">
                <Link href="/dashboard/assets" className="flex-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-16 text-lg font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    取消修改
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="w-full h-16 text-lg font-semibold border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-all"
                >
                  {deleting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                      刪除中...
                    </span>
                  ) : "🗑 刪除資產"}
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="flex-[2] h-16 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-2xl transition-all"
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

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border-2 border-slate-100">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <span className="text-4xl">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">編輯建議</h3>
              <ul className="space-y-2 text-lg text-slate-700 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>請確保賬號或其他識別信息準確無誤</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>定期更新資產價值，保持記錄最新</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>如資產已轉讓或出售，請及時刪除</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>建議添加相關文檔（如銀行對賬單、保單）</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-2xl">確認刪除</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center py-6">
                <div className="bg-red-100 rounded-full p-4">
                  <span className="text-4xl">⚠️</span>
                </div>
              </div>
              <p className="text-center text-lg text-slate-700">
                您確定要刪除資產 <span className="font-bold text-red-600">{formData.name}</span> 嗎？
              </p>
              <p className="text-center text-slate-500">
                此操作無法撤銷，刪除後資產信息將永久丟失。
              </p>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 h-12 text-lg font-semibold"
                >
                  取消
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  variant="destructive"
                  className="flex-1 h-12 text-lg font-semibold"
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
