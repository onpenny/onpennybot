"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNotifications } from "@/components/notifications/Notifications";
import { WILL_TEMPLATES } from "@/lib/will-templates";

export default function NewWillPage() {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    jurisdiction: "",
    content: "",
    isSigned: false,
    isWitnessed: false,
  });

  // 加载模板
  const handleTemplateSelect = (templateId: string) => {
    const template = WILL_TEMPLATES[templateId as keyof typeof WILL_TEMPLATES];
    if (template) {
      setFormData({
        ...formData,
        jurisdiction: template.jurisdiction,
        content: template.content,
        title: `我的${template.name}`,
      });
      setSelectedTemplate(templateId);
    }
  };

  // 清除模板
  const handleClearTemplate = () => {
    setSelectedTemplate("");
    setFormData({
      title: "",
      jurisdiction: "",
      content: "",
      isSigned: false,
      isWitnessed: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        throw new Error(data.error || "創建失敗");
      }

      showNotification({
        type: "success",
        title: "遺囑創建成功",
        message: "您的遺囑已成功保存",
      });

      router.push("/dashboard/wills");
    } catch (err) {
      showNotification({
        type: "error",
        title: "創建失敗",
        message: err instanceof Error ? err.message : "請稍後再試",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                OnHeritage
              </div>
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-lg font-semibold text-slate-700">創建遺囑</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            創建您的遺囑
          </h1>
          <p className="text-xl text-slate-600">
            選擇預製模板或自定義內容，規劃您的遺產分配
          </p>
        </div>

        <Card className="border-2 border-slate-100 shadow-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">📜</span>
              選擇模板
            </CardTitle>
            <p className="text-slate-500 text-lg">選擇一個法域模板或自定義</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(WILL_TEMPLATES).map(([id, template]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTemplateSelect(id)}
                  className={`p-6 border-2 rounded-xl transition-all text-left
                    ${selectedTemplate === id 
                      ? "border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg" 
                      : "border-slate-200 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md"
                    }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-4xl ${selectedTemplate === id ? "scale-110 transition-transform" : ""}`}>
                      {id === "macau" && "🇲🇳"}
                      {id === "hongkong" && "🇭🇰"}
                      {id === "china" && "🇨🇳"}
                      {id === "custom" && "📝"}
                    </span>
                    <span className="font-bold text-slate-800 text-lg">
                      {template.name}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {template.jurisdiction}法域
                  </p>
                  {selectedTemplate === id && (
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                      <span className="text-lg">✓</span>
                      <span>已選擇</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {selectedTemplate && (
              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearTemplate}
                  className="border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all"
                >
                  清除選擇
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-100 shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold">遺囑內容</CardTitle>
            <p className="text-slate-500 text-lg">
              {selectedTemplate ? "模板已加載，請填寫並確認" : "請填寫以下信息"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 rounded-full p-3">
                    <span className="text-2xl">📋</span>
                  </div>
                  <Label htmlFor="title" className="text-xl font-bold text-slate-800 flex-1">
                    遺囑標題 <span className="text-red-500">*</span>
                  </Label>
                </div>
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
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-full p-3 shadow-md">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <Label htmlFor="jurisdiction" className="text-xl font-bold text-slate-800 flex-1">
                    法域（可選）
                  </Label>
                </div>
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
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">📝</span>
                  <Label htmlFor="content" className="text-2xl font-bold text-slate-800 flex-1">
                    遺囑內容 <span className="text-red-500">*</span>
                  </Label>
                  {selectedTemplate && (
                    <span className="text-sm text-amber-600 font-medium bg-amber-100 px-3 py-1 rounded-full">
                      模板已加載
                    </span>
                  )}
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 border-2 border-amber-100">
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
                    rows={16}
                    required
                    className="text-base border-0 focus:ring-0 resize-none leading-relaxed font-mono"
                  />
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    <span className="font-semibold">🔒 安全提示：</span>內容將被加密存儲，只有您可以查看
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">✍️</span>
                    <Label htmlFor="isSigned" className="text-lg font-bold text-slate-700 cursor-pointer">
                      已簽署
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      id="isSigned"
                      checked={formData.isSigned}
                      onChange={(e) => setFormData({ ...formData, isSigned: e.target.checked })}
                      className="w-6 h-6 cursor-pointer border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    />
                    <span className="text-base text-slate-600">此遺囑是否已由您本人簽署</span>
                  </div>
                  {formData.isSigned && (
                    <p className="text-sm text-slate-500">
                      簽署日期：{new Date().toLocaleDateString("zh-TW")}
                    </p>
                  )}
                </div>

                <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">👥</span>
                    <Label htmlFor="isWitnessed" className="text-lg font-bold text-slate-700 cursor-pointer">
                      已見證
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      id="isWitnessed"
                      checked={formData.isWitnessed}
                      onChange={(e) => setFormData({ ...formData, isWitnessed: e.target.checked })}
                      className="w-6 h-6 cursor-pointer border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    />
                    <span className="text-base text-slate-600">此遺囑是否已由公證人見證</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    見證人通常是律師或公證處
                  </p>
                </div>
              </div>

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
                  className="flex-[2] h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      保存中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="text-xl">💾</span>
                      保存遺囑
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 p-8 bg-gradient-to-r from-amber-50 to-amber-100 rounded-3xl border-2 border-amber-200">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <span className="text-5xl">⚠️</span>
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-amber-900 mb-4">
                重要法律聲明
              </h3>
              <div className="space-y-3 text-slate-700 text-lg leading-relaxed">
                <p>1. 本平台僅提供遺囑存儲功能，不構成法律建議。</p>
                <p>2. 強烈建議在簽署或更新遺囑前諮詢專業律師。</p>
                <p>3. 確保遺囑內容符合當地法律要求。</p>
                <p>4. 遺囑修改後將被記錄，建議定期審視。</p>
                <p>5. 請妥善保管您的遺囑訪問權限。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border-2 border-slate-100">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <span className="text-3xl">📋</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                模板使用提示
              </h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">1.</span>
                  <p className="leading-relaxed">選擇對應法域的模板（澳門、香港、中國）</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">2.</span>
                  <p className="leading-relaxed">模板會自動填充法域和內容</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">3.</span>
                  <p className="leading-relaxed">您可以在基礎上修改和補充內容</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">4.</span>
                  <p className="leading-relaxed">使用「自定義模板」創建個人化的遺囑</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">5.</span>
                  <p className="leading-relaxed">完成後點擊「保存遺囑」</p>
                </li>
              </ul>
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
