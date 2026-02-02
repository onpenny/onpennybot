"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EditWillPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    jurisdiction: "",
    isSigned: false,
    isWitnessed: false,
  });

  useEffect(() => {
    fetchWill();
  }, [params.id]);

  const fetchWill = async () => {
    try {
      const response = await fetch(`/api/wills/${params.id}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setFormData({
        title: data.will.title,
        content: data.will.content,
        jurisdiction: data.will.jurisdiction || "",
        isSigned: data.will.isSigned,
        isWitnessed: data.will.isWitnessed,
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
      const response = await fetch(`/api/wills/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "更新失敗");
        setSaving(false);
        return;
      }

      router.push("/dashboard/wills");
    } catch (err) {
      setError("更新失敗，請稍後再試");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/wills/${params.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "刪除失敗");
        setDeleting(false);
        setShowDeleteConfirm(false);
        return;
      }

      router.push("/dashboard/wills");
    } catch (err) {
      setError("刪除失敗，請稍後再試");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

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
            <span className="text-lg font-semibold text-slate-700">編輯遺囑</span>
          </div>
          <Link href="/dashboard/wills">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
              返回列表
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
            編輯遺囑
          </h1>
          <p className="text-xl text-slate-600">
            修改遺囑內容
          </p>
        </div>

        <Card className="border-2 border-slate-100 shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold">遺囑信息</CardTitle>
            <p className="text-slate-500 text-lg">更新您的遺囑詳細信息</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 rounded-full p-3">
                    <span className="text-2xl">📜</span>
                  </div>
                  <Label htmlFor="title" className="text-xl font-semibold text-slate-700 flex-1">
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
                  <Label htmlFor="jurisdiction" className="text-xl font-semibold text-slate-700 flex-1">
                    法域（可選）
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    id="jurisdiction"
                    type="text"
                    placeholder="例如：香港、澳門、台灣"
                    value={formData.jurisdiction}
                    onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                    className="flex-1 h-14 text-lg border-2 border-slate-200 focus:border-amber-500"
                  />
                  <p className="text-sm text-slate-500">
                    適用於此遺囑的法律管轄區域
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-8 bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl border-2 border-amber-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📝</span>
                  <Label htmlFor="content" className="text-2xl font-bold text-slate-800 flex-1">
                    遺囑內容 <span className="text-red-500">*</span>
                  </Label>
                </div>
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
                  rows={14}
                  required
                  className="text-lg border-0 focus:ring-0 resize-none leading-relaxed"
                />
                <p className="text-sm text-slate-600 mt-3">
                  <span className="font-semibold">🔒 安全提示：</span>內容將被加密存儲，只有您可以查看
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">✍️</span>
                    <Label htmlFor="isSigned" className="text-lg font-semibold text-slate-700 cursor-pointer">
                      已簽署
                    </Label>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    此遺囑是否已由您本人簽署
                  </p>
                  <input
                    type="checkbox"
                    id="isSigned"
                    checked={formData.isSigned}
                    onChange={(e) => setFormData({ ...formData, isSigned: e.target.checked })}
                    className="w-6 h-6 cursor-pointer border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  />
                  {formData.isSigned && formData.signedAt && (
                    <p className="text-sm text-slate-500 mt-2">
                      簽署日期：{new Date().toLocaleDateString("zh-TW")}
                    </p>
                  )}
                </div>

                <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">👥</span>
                    <Label htmlFor="isWitnessed" className="text-lg font-semibold text-slate-700 cursor-pointer">
                      已見證
                    </Label>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    此遺囑是否已由公證人見證
                  </p>
                  <input
                    type="checkbox"
                    id="isWitnessed"
                    checked={formData.isWitnessed}
                    onChange={(e) => setFormData({ ...formData, isWitnessed: e.target.checked })}
                    className="w-6 h-6 cursor-pointer border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
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
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                      刪除
                    </span>
                  ) : "🗑 刪除"}
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="flex-[2] h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-2xl transition-all"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      保存中...
                    </span>
                  ) : "💾 保存修改"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 p-8 bg-gradient-to-r from-amber-50 to-amber-100 rounded-3xl border-2 border-amber-200">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-4 shadow-md">
              <span className="text-5xl">⚠️</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-amber-800 mb-3">重要法律聲明</h3>
              <div className="space-y-2 text-slate-700 text-lg leading-relaxed">
                <p>1. 本平台僅提供遺囑存儲功能，不構成法律建議。</p>
                <p>2. 強烈建議在簽署或更新遺囑前諮詢專業律師。</p>
                <p>3. 確保遺囑內容符合當地法律要求。</p>
                <p>4. 遺囑修改後將被記錄，建議定期審視。</p>
                <p>5. 請妥善保管您的遺囑訪問權限。</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 刪除確認对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-2xl">確認刪除</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center py-8">
                <div className="bg-red-100 rounded-full p-6">
                  <span className="text-6xl">⚠️</span>
                </div>
              </div>
              <p className="text-center text-xl text-slate-700">
                您確定要刪除遺囑 <span className="font-bold text-red-600">{formData.title}</span> 嗎？
              </p>
              <p className="text-center text-slate-500">
                此操作無法撤銷，刪除後遺囑內容將永久丟失。
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
