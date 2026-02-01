"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NewWillPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    jurisdiction: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/wills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "創建失敗");
        setLoading(false);
        return;
      }

      router.push("/dashboard/wills");
    } catch (err) {
      setError("創建失敗，請稍後再試");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/wills" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                OnHeritage
              </div>
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-lg font-semibold text-slate-700">創建遺囑</span>
          </div>
          <Link href="/dashboard/wills">
            <Button variant="outline" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
              返回
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
            創建您的遺囑
          </h1>
          <p className="text-xl text-slate-600">
            規劃您的遺產分配，確保家人的未來得到妥善照顧
          </p>
        </div>

        <Card className="border-2 border-slate-100 shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold">遺囑信息</CardTitle>
            <p className="text-slate-500 text-lg">
              請認真填寫以下信息，這將作為您遺產分配的法律依據
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="title" className="text-lg font-semibold text-slate-700">
                  遺囑標題 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="例如：我的最終遺囑"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="h-14 text-lg border-2 border-slate-200 focus:border-amber-500"
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="jurisdiction" className="text-lg font-semibold text-slate-700">
                  適用法域（可選）
                </Label>
                <Input
                  id="jurisdiction"
                  type="text"
                  placeholder="例如：香港、澳門、台灣"
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  className="h-14 text-lg border-2 border-slate-200 focus:border-amber-500"
                />
                <p className="text-sm text-slate-500 mt-1">
                  適用於此遺囑的法律管轄區域，請根據您的居住地選擇
                </p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="content" className="text-lg font-semibold text-slate-700">
                  遺囑內容 <span className="text-red-500">*</span>
                </Label>
                <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-100">
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="在此輸入您的遺囑內容...

建議包括以下部分：
1. 明確指定所有資產的分配
2. 指定每個繼承人的身份和繼承比例
3. 指定遺囑執行人的身份
4. 如有必要，指定遺囑見證人
5. 添加任何特殊要求或指示"
                    rows={12}
                    required
                    className="text-base border-0 focus:ring-0 resize-none leading-relaxed"
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2 flex items-start gap-2">
                  <span className="text-amber-600 font-bold">💡</span>
                  <span className="leading-relaxed">
                    請根據當地法律要求撰寫遺囑。內容應清晰、明確，避免歧義。
                  </span>
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="border-2 border-red-200">
                  <AlertDescription className="text-lg">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 pt-6 border-t-2 border-slate-100">
                <Link href="/dashboard/wills" className="flex-1">
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
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-xl hover:scale-105 transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      創建中...
                    </span>
                  ) : "創建遺囑"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-10 p-8 bg-gradient-to-r from-amber-50 to-amber-100 rounded-3xl border-2 border-amber-200">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-3 shadow-md">
              <span className="text-4xl">⚠️</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-amber-800 mb-3">
                重要法律聲明
              </h3>
              <div className="space-y-2 text-slate-700 text-lg leading-relaxed">
                <p>1. 本平台僅提供遺囑存儲功能，不構成法律建議。</p>
                <p>2. 強烈建議在簽署前諮詢專業律師。</p>
                <p>3. 確保遺囑內容符合當地法律要求。</p>
                <p>4. 遺囑創建後可隨時編輯和更新。</p>
                <p>5. 建議定期審視和更新您的遺囑。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500">
            需要幫助？聯繫我們的客服團隊
          </p>
        </div>
      </main>
    </div>
  );
}
