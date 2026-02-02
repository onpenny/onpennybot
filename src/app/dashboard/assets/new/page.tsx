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

export default function NewAssetPage() {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "BANK",
    description: "",
    value: "",
    currency: "MOP",
    location: "DOMESTIC",
    institution: "",
    accountNumber: "",
    fileUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/assets", {
        method: "POST",
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
        setError(data.error || "創建失敗");
        setLoading(false);
        return;
      }

      showNotification({
        type: "success",
        title: "資產創建成功",
        message: `${formData.name} 已成功添加到您的資產列表`,
      });

      router.push("/dashboard/assets");
    } catch (err) {
      setError("創建失敗，請稍後再試");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                OnHeritage
              </div>
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-lg font-semibold text-slate-700">添加資產</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            添加資產
          </h1>
          <p className="text-xl text-slate-600">
            記錄您的財產，方便將來的規劃和管理
          </p>
        </div>

        <Card className="border-2 border-slate-100 shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold">資產信息</CardTitle>
            <p className="text-slate-500">請填寫資產的詳細信息</p>
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
                  placeholder="例如：招商銀行儲蓄賬戶、友邦保險終身壽險"
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
                    <option value="STOCK">📈 股票</option>
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
                    幣種類別
                  </Label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="flex h-14 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <option value="MOP">🇲🇳 MOP</option>
                    <option value="USD">🇺🇸 USD</option>
                    <option value="HKD">🇭🇰 HKD</option>
                    <option value="CNY">🇨🇳 CNY</option>
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
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🔒</span>
                  <Label htmlFor="accountNumber" className="text-xl font-bold text-slate-800">
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
                <p className="text-sm text-slate-600 mt-2">
                  <span className="font-semibold">🔒 加密存儲：</span>此信息將使用 AES-256 加密技術安全存儲，只有您可以查看
                </p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="description" className="text-lg font-semibold text-slate-700">
                  備註信息
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="關於此資產的額外信息，例如：賬戶用途、保單號、聯繫人等"
                  rows={4}
                  className="text-lg border-2 border-slate-200 focus:border-indigo-500 resize-none"
                />
              </div>

              {/* 文件上传 */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-slate-700">
                  相關文檔
                </Label>
                <UploadComponent
                  onUploadSuccess={(url, fileName) => {
                    setFormData({ ...formData, fileUrl: url });
                    showNotification({
                      type: "success",
                      title: "文件上傳成功",
                      message: `${fileName} 已成功上傳`,
                    });
                  }}
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                  maxSize={10}
                />
                <p className="text-sm text-slate-500 mt-2">
                  上傳相關文檔，如銀行對賬單、保單、房產證等
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="border-2 border-red-200">
                  <AlertDescription className="text-lg">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <Link href="/dashboard/assets" className="flex-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-14 text-lg font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    取消
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:scale-105 transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      保存中...
                    </span>
                  ) : "保存資產"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-3 shadow-md">
              <span className="text-3xl">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2">溫馨提示</h3>
              <p className="text-slate-600 leading-relaxed">
                完善記錄資產信息可以幫助您更好地規劃遺產。
                建議定期更新資產價值，並添加相關文檔（如銀行對賬單、保單、房產證等）。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
