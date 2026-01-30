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

export default function EditWillPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    jurisdiction: "",
    isSigned: false,
    isWitnessed: false,
  });

  useEffect(() => {
    // 获取遗嘱详情
    fetch(`/api/wills/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
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
      })
      .catch(() => {
        setError("加載失敗，請稍後再試");
        setLoading(false);
      });
  }, [params.id]);

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
    if (!confirm("確定要刪除此遺囑嗎？此操作無法撤銷。")) {
      return;
    }

    try {
      const response = await fetch(`/api/wills/${params.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "刪除失敗");
        return;
      }

      router.push("/dashboard/wills");
    } catch (err) {
      setError("刪除失敗，請稍後再試");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p>加載中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold">
              OnHeritage
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/dashboard/wills">遺囑管理</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">編輯遺囑</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">編輯遺囑</h1>
          <p className="text-muted-foreground">
            修改遺囑內容
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>遺囑信息</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">標題 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：我的遺囑"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurisdiction">法域</Label>
                <Input
                  id="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  placeholder="例如：香港、澳門、台灣"
                />
                <p className="text-xs text-muted-foreground">
                  適用於此遺囑的法律管轄區域
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">遺囑內容 *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="在此輸入您的遺囑內容..."
                  rows={12}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  請根據當地法律要求撰寫遺囑內容
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isSigned"
                    checked={formData.isSigned}
                    onChange={(e) => setFormData({ ...formData, isSigned: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isSigned">已簽署</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isWitnessed"
                    checked={formData.isWitnessed}
                    onChange={(e) => setFormData({ ...formData, isWitnessed: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isWitnessed">已見證</Label>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  ⚠️ 本平台僅提供遺囑存儲功能，不構成法律建議。建議在簽署前諮詢律師。
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Link href="/dashboard/wills" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    取消
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1"
                >
                  刪除
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? "保存中..." : "保存"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
