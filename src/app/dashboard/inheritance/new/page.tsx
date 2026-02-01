"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NewInheritancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assets, setAssets] = useState<any[]>([]);
  const [heirs, setHeirs] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    assetId: "",
    heirId: "",
    percentage: "100",
    conditions: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsRes, heirsRes] = await Promise.all([
        fetch("/api/assets"),
        fetch("/api/family"),
      ]);

      const assetsData = await assetsRes.json();
      const heirsData = await heirsRes.json();

      setAssets(assetsData.assets || []);
      setHeirs(heirsData.members || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
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

    setLoading(true);

    try {
      const response = await fetch("/api/inheritance", {
        method: "POST",
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
        setError(data.error || "創建失敗");
        setLoading(false);
        return;
      }

      router.push("/dashboard/inheritance");
    } catch (err) {
      setError("創建失敗，請稍後再試");
      setLoading(false);
    }
  };

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
            <span className="text-lg font-semibold text-slate-700">繼承規則</span>
          </div>
          <Link href="/dashboard/inheritance">
            <Button variant="outline" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
              返回
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            設置繼承規則
          </h1>
          <p className="text-xl text-slate-600">
            選擇資產並設定繼承規則
          </p>
        </div>

        <Card className="border-2 border-slate-100 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">選擇資產和繼承人</CardTitle>
            <p className="text-slate-500 text-lg">
              請選擇要分配的資產和繼承人
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="asset" className="text-lg font-semibold text-slate-700">
                  選擇資產 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="asset"
                  value={formData.assetId}
                  onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                  className="flex h-14 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
                <Label htmlFor="heir" className="text-lg font-semibold text-slate-700">
                  選擇繼承人 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="heir"
                  value={formData.heirId}
                  onChange={(e) => setFormData({ ...formData, heirId: e.target.value })}
                  className="flex h-14 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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

              <div className="p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border-2 border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🎯</span>
                  <Label htmlFor="percentage" className="text-2xl font-bold text-slate-800">
                    分配比例
                  </Label>
                </div>
                <div className="flex items-center gap-4">
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
                    className="flex-1 h-16 text-3xl font-bold text-center border-2 border-slate-200 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  />
                  <span className="text-4xl font-bold text-slate-500">%</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  這個繼承人將獲得此資產的
                  <span className="font-bold text-purple-600 text-lg">
                    {formData.percentage}%
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="conditions" className="text-lg font-semibold text-slate-700">
                  繼承條件（可選）
                </Label>
                <Textarea
                  id="conditions"
                  value={formData.conditions}
                  onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                  placeholder="例如：年滿 25 歲時繼承、完成高等教育後繼承等"
                  rows={4}
                  className="text-lg border-2 border-slate-200 focus:border-purple-500 resize-none"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="border-2 border-red-200">
                  <AlertDescription className="text-lg">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 pt-6 border-t-2 border-slate-100">
                <Link href="/dashboard/inheritance" className="flex-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-14 text-lg font-semibold border-2 border-slate-200 hover:border-purple-300 hover:bg-slate-50 transition-all"
                  >
                    取消
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-2xl transition-all hover:scale-105"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      創建規則中...
                    </span>
                  ) : "創建繼承規則"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl border-2 border-slate-100">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-3 shadow-md">
              <span className="text-3xl">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">使用建議</h3>
              <ul className="space-y-2 text-slate-700 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">1.</span>
                  <span>確保分配比例總和為 100%（如果有繼承人）</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">2.</span>
                  <span>可以設置繼承條件，例如年齡、教育程度等</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">3.</span>
                  <span>建議提前與繼承人溝通，避免糾紛</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">4.</span>
                  <span>可以隨時編輯或刪除繼承規則</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-slate-100">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-3 shadow-md">
              <span className="text-3xl">📜</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                準備好這些資料
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                設置繼承規則前，請確保您已經：
              </p>
              <ul className="mt-3 space-y-2 text-slate-700">
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>添加了相關資產（如不動產、銀行賬戶等）</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>添加了家族成員信息</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>清楚了解資產的實際價值</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
