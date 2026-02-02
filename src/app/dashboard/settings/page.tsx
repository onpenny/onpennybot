"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // TODO: 实现 API 更新
      setSuccess("個人資料更新成功！");
      setLoading(false);
    } catch (err) {
      setError("更新失敗，請稍後再試");
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("兩次輸入的新密碼不一致");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("新密碼至少需要 8 個字符");
      setLoading(false);
      return;
    }

    try {
      // TODO: 实现 API 更新密碼
      setSuccess("密碼修改成功！");
      setLoading(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("密碼修改失敗，請檢查當前密碼");
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: "/auth/signin" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-slate-600 to-slate-800 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                OnHeritage
              </div>
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-lg font-semibold text-slate-700">設置</span>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
              返回儀表板
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            賬戶設置
          </h1>
          <p className="text-xl text-slate-600">
            管理您的賬戶信息和安全設置
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 个人信息卡片 */}
          <Card className="border-2 border-slate-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">👤</span>
                個人信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-lg font-semibold text-slate-700">
                    姓名
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="您的姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-14 text-lg border-2 border-slate-200 focus:border-slate-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-lg font-semibold text-slate-700">
                    電子郵件
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-14 text-lg border-2 border-slate-200 focus:border-slate-500"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    如需更改電子郵件，請聯繫客服
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-2 border-red-200">
                    <AlertDescription className="text-lg">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-2 border-emerald-200 bg-emerald-50">
                    <AlertDescription className="text-lg text-emerald-700">
                      ✅ {success}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-slate-600 to-slate-800 hover:shadow-xl hover:scale-105 transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      保存中...
                    </span>
                  ) : "保存更改"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 安全设置卡片 */}
          <Card className="border-2 border-slate-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">🔒</span>
                安全設置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="currentPassword" className="text-lg font-semibold text-slate-700">
                    當前密碼
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="輸入當前密碼以確認身份"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    required
                    className="h-14 text-lg border-2 border-slate-200 focus:border-slate-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="newPassword" className="text-lg font-semibold text-slate-700">
                    新密碼
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="至少 8 個字符"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="h-14 text-lg border-2 border-slate-200 focus:border-slate-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-lg font-semibold text-slate-700">
                    確認新密碼
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="再次輸入新密碼"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="h-14 text-lg border-2 border-slate-200 focus:border-slate-500"
                  />
                </div>

                <p className="text-sm text-slate-500 leading-relaxed">
                  建議使用包含大小寫字母、數字和特殊字符的強密碼
                </p>

                {error && (
                  <Alert variant="destructive" className="border-2 border-red-200">
                    <AlertDescription className="text-lg">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-2 border-emerald-200 bg-emerald-50">
                    <AlertDescription className="text-lg text-emerald-700">
                      ✅ {success}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-slate-600 to-slate-800 hover:shadow-xl hover:scale-105 transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      更新密碼中...
                    </span>
                  ) : "更新密碼"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 账户操作 */}
        <Card className="mt-8 border-2 border-slate-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">⚙️</span>
              賬戶操作
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">登出賬戶</h3>
                <p className="text-slate-600 text-sm">
                  登出後您需要重新登入
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="h-12 px-6 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all"
              >
                登出
              </Button>
            </div>

            <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
              <div className="flex items-start gap-3">
                <span className="text-3xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-800 mb-2">
                    危險操作區域
                  </h3>
                  <p className="text-red-700 text-sm leading-relaxed">
                    以下操作是不可逆的。請謹慎操作，並確保您已經備份了所有重要信息。
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-red-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>刪除賬戶將移除所有數據（資產、家族成員、遺囑等）</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>此操作無法撤銷</span>
                    </li>
                  </ul>
                  <Button
                    variant="destructive"
                    className="w-full h-14 text-xl font-bold bg-red-600 hover:bg-red-700 hover:shadow-xl transition-all"
                    disabled
                  >
                    刪除賬戶（功能開發中）
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-3xl">📝</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    關於我們
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed mb-3">
                    OnHeritage 是一個專業的遺產管理平台，幫助您妥善管理財富並確保順利傳承給下一代。
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-semibold">版本：</span>
                      <span>v1.0.0</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-semibold">聯繫我們：</span>
                      <a href="mailto:support@onheritage.com" className="text-blue-600 hover:underline">
                        support@onheritage.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
