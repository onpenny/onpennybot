"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NewFamilyMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    relationship: "BLOOD",
    isAlive: true,
    dateOfBirth: "",
    dateOfDeath: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/family", {
        method: "POST",
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
        setError(data.error || "創建失敗");
        setLoading(false);
        return;
      }

      router.push("/dashboard/family");
    } catch (err) {
      setError("創建失敗，請稍後再試");
      setLoading(false);
    }
  };

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
            <span className="text-lg font-semibold text-slate-700">添加成員</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            添加家族成員
          </h1>
          <p className="text-xl text-slate-600">
            記錄您的家族成員信息
          </p>
        </div>

        <Card className="border-2 border-slate-100 shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold">成員信息</CardTitle>
            <p className="text-slate-500">請填寫成員的詳細信息</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="name" className="text-lg font-semibold text-slate-700">
                  姓名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="成員姓名"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-14 text-lg border-2 border-slate-200 focus:border-blue-500"
                />
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
                <Label htmlFor="isAlive" className="text-lg font-semibold text-slate-700 cursor-pointer">
                  此成員目前在世
                </Label>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="dateOfBirth" className="text-lg font-semibold text-slate-700">
                    出生日期
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="h-14 text-lg border-2 border-slate-200 focus:border-blue-500"
                  />
                </div>

                {!formData.isAlive && (
                  <div className="space-y-4">
                    <Label htmlFor="dateOfDeath" className="text-lg font-semibold text-slate-700">
                      逝世日期
                    </Label>
                    <Input
                      id="dateOfDeath"
                      type="date"
                      value={formData.dateOfDeath}
                      onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })}
                      className="h-14 text-lg border-2 border-slate-200 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label htmlFor="notes" className="text-lg font-semibold text-slate-700">
                  備註
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="其他信息，例如：職業、愛好、聯繫方式等"
                  rows={4}
                  className="text-lg border-2 border-slate-200 focus:border-blue-500 resize-none"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="border-2 border-red-200">
                  <AlertDescription className="text-lg">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <Link href="/dashboard/family" className="flex-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-14 text-lg font-semibold border-2 border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-all"
                  >
                    取消
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-105 transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      保存中...
                    </span>
                  ) : "保存成員"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100">
          <div className="flex items-start gap-4">
            <div className="bg-white rounded-full p-3 shadow-md">
              <span className="text-4xl">👨‍👩‍👧‍👦</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">溫馨提示</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                完善家族成員信息可以幫助您更好地建立族譜系統。
                <br /><br />
                建議添加父母、配偶、子女等直系親屬信息，以便自動生成家族樹。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
