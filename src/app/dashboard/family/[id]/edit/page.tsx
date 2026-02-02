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

export default function EditFamilyMemberPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "BLOOD",
    isAlive: true,
    dateOfBirth: "",
    dateOfDeath: "",
    notes: "",
  });

  useEffect(() => {
    fetchMember();
  }, [params.id]);

  const fetchMember = async () => {
    try {
      const response = await fetch(`/api/family/${params.id}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setFormData({
        name: data.member.name,
        relationship: data.member.relationship,
        isAlive: data.member.isAlive,
        dateOfBirth: data.member.dateOfBirth ? new Date(data.member.dateOfBirth).toISOString().split('T')[0] : "",
        dateOfDeath: data.member.dateOfDeath ? new Date(data.member.dateOfDeath).toISOString().split('T')[0] : "",
        notes: data.member.notes || "",
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
      const response = await fetch(`/api/family/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: formData.dateOfBirth || undefined,
          dateOfDeath: !formData.isAlive && formData.dateOfDeath ? formData.dateOfDeath : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "更新失敗");
        setSaving(false);
        return;
      }

      router.push("/dashboard/family");
    } catch (err) {
      setError("更新失敗，請稍後再試");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/family/${params.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "刪除失敗");
        setDeleting(false);
        setShowDeleteConfirm(false);
        return;
      }

      router.push("/dashboard/family");
    } catch (err) {
      setError("刪除失敗，請稍後再試");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/family" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                OnHeritage
              </div>
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-lg font-semibold text-slate-700">編輯成員</span>
          </div>
          <Link href="/dashboard/family">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
              返回列表
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            編輯家族成員
          </h1>
          <p className="text-xl text-slate-600">
            修改成員信息
          </p>
        </div>

        <Card className="border-2 border-slate-100 shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold">成員信息</CardTitle>
            <p className="text-slate-500">更新家族成員的詳細信息</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="name" className="text-lg font-semibold text-slate-700">
                  姓名 <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-full p-3 shadow-md">
                    <span className="text-2xl">👤</span>
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="成員姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="flex-1 h-14 text-lg border-2 border-slate-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="relationship" className="text-lg font-semibold text-slate-700">
                  關係 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="relationship"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="flex h-14 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  required
                >
                  <option value="BLOOD">👨‍👩‍👧‍👦 血緣關係</option>
                  <option value="ADOPTED">👨‍👧 收養關係</option>
                  <option value="MARRIAGE">💒 婚姻關係</option>
                  <option value="PARTNER">💑 伴侶</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-slate-100">
                <input
                  type="checkbox"
                  id="isAlive"
                  checked={formData.isAlive}
                  onChange={(e) => setFormData({ ...formData, isAlive: e.target.checked })}
                  className="w-6 h-6 rounded cursor-pointer border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <Label htmlFor="isAlive" className="text-xl font-semibold text-slate-700 cursor-pointer">
                  此成員目前在世
                </Label>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="dateOfBirth" className="text-lg font-semibold text-slate-700">
                    出生日期
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="bg-white rounded-full p-3 shadow-md">
                      <span className="text-xl">📅</span>
                    </div>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="flex-1 h-14 text-lg border-2 border-slate-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                {!formData.isAlive && (
                  <div className="space-y-4">
                    <Label htmlFor="dateOfDeath" className="text-lg font-semibold text-slate-700">
                      逝世日期
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="bg-white rounded-full p-3 shadow-md">
                        <span className="text-xl">⚰️</span>
                      </div>
                      <Input
                        id="dateOfDeath"
                        type="date"
                        value={formData.dateOfDeath}
                        onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })}
                        className="flex-1 h-14 text-lg border-2 border-slate-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white rounded-full p-3 shadow-md">
                    <span className="text-xl">📝</span>
                  </div>
                  <Label htmlFor="notes" className="text-lg font-semibold text-slate-700">
                    備註
                  </Label>
                </div>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="其他信息，例如：職業、愛好、聯絡方式等"
                  rows={4}
                  className="text-lg border-2 border-slate-200 focus:border-blue-500 resize-none"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="border-2 border-red-200">
                  <AlertDescription className="text-lg">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 pt-6 border-t-2 border-slate-100">
                <Link href="/dashboard/family" className="flex-1">
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
                  className="flex-[2] h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all"
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

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-slate-100">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-3 shadow-md">
              <span className="text-3xl">👨‍👩‍👧‍👦</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">編輯建議</h3>
              <ul className="space-y-3 text-slate-700 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span className="leading-relaxed">確保姓名準確無誤</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span className="leading-relaxed">檢查日期是否正確</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span className="leading-relaxed">如成員已逝世，請更新狀態和日期</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span className="leading-relaxed">定期更新聯絡方式</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* 刪除确认对话框 */}
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
              <p className="text-center text-xl text-slate-700">
                您確定要刪除家族成員 <span className="font-bold text-red-600">{formData.name}</span> 嗎？
              </p>
              <p className="text-center text-slate-500">
                刪除後此成員信息將無法恢復
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
