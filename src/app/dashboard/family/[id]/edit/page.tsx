"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EditFamilyMemberPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    relationship: "BLOOD",
    isAlive: true,
    dateOfBirth: "",
    dateOfDeath: "",
    notes: "",
  });

  useEffect(() => {
    // 获取成员详情
    fetch(`/api/family/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
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
    if (!confirm("確定要刪除此成員嗎？此操作無法撤銷。")) {
      return;
    }

    try {
      const response = await fetch(`/api/family/${params.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "刪除失敗");
        return;
      }

      router.push("/dashboard/family");
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
            <Link href="/dashboard/family">家族譜系</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">編輯成員</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">編輯家族成員</h1>
          <p className="text-muted-foreground">
            修改成員信息
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>成員信息</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">姓名 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="成員姓名"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">關係 *</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => setFormData({ ...formData, relationship: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BLOOD">血緣關係</SelectItem>
                    <SelectItem value="ADOPTED">收養關係</SelectItem>
                    <SelectItem value="MARRIAGE">婚姻關係</SelectItem>
                    <SelectItem value="PARTNER">伴侶</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAlive"
                  checked={formData.isAlive}
                  onChange={(e) => setFormData({ ...formData, isAlive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isAlive">在世</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">出生日期</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>

              {!formData.isAlive && (
                <div className="space-y-2">
                  <Label htmlFor="dateOfDeath">逝世日期</Label>
                  <Input
                    id="dateOfDeath"
                    type="date"
                    value={formData.dateOfDeath}
                    onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">備註</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="其他信息"
                  rows={3}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Link href="/dashboard/family" className="flex-1">
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
