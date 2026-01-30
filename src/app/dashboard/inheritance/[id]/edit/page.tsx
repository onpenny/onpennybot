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

export default function EditInheritancePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [assets, setAssets] = useState<any[]>([]);
  const [heirs, setHeirs] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    assetId: "",
    heirId: "",
    percentage: "",
    conditions: "",
    status: "PENDING",
  });

  useEffect(() => {
    // 获取继承规则详情
    fetch(`/api/inheritance/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        setFormData({
          assetId: data.inheritance.assetId,
          heirId: data.inheritance.heirId,
          percentage: data.inheritance.percentage.toString(),
          conditions: data.inheritance.conditions || "",
          status: data.inheritance.status,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("加載失敗，請稍後再試");
        setLoading(false);
      });

    // 获取资产列表
    fetch("/api/assets")
      .then((res) => res.json())
      .then((data) => setAssets(data.assets || []));

    // 获取家族成员列表
    fetch("/api/family")
      .then((res) => res.json())
      .then((data) => setHeirs(data.members || []));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`/api/inheritance/${params.id}`, {
        method: "PUT",
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
        setError(data.error || "更新失敗");
        setSaving(false);
        return;
      }

      router.push("/dashboard/inheritance");
    } catch (err) {
      setError("更新失敗，請稍後再試");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("確定要刪除此繼承規則嗎？此操作無法撤銷。")) {
      return;
    }

    try {
      const response = await fetch(`/api/inheritance/${params.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "刪除失敗");
        return;
      }

      router.push("/dashboard/inheritance");
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
            <Link href="/dashboard/inheritance">繼承規則</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">編輯規則</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">編輯繼承規則</h1>
          <p className="text-muted-foreground">
            修改資產分配規則
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>繼承規則信息</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="asset">選擇資產 *</Label>
                <Select
                  value={formData.assetId}
                  onValueChange={(value) => setFormData({ ...formData, assetId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇資產" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heir">選擇繼承人 *</Label>
                <Select
                  value={formData.heirId}
                  onValueChange={(value) => setFormData({ ...formData, heirId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇家族成員" />
                  </SelectTrigger>
                  <SelectContent>
                    {heirs.map((heir) => (
                      <SelectItem key={heir.id} value={heir.id}>
                        {heir.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="percentage">分配比例 (%) *</Label>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions">條件（可選）</Label>
                <Textarea
                  id="conditions"
                  value={formData.conditions}
                  onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                  placeholder="例如：年滿 25 歲時繼承"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">狀態</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">待處理</SelectItem>
                    <SelectItem value="IN_PROGRESS">進行中</SelectItem>
                    <SelectItem value="COMPLETED">已完成</SelectItem>
                    <SelectItem value="DISPUTED">糾紛中</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Link href="/dashboard/inheritance" className="flex-1">
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
