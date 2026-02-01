"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("兩次輸入的密碼不一致");
      return;
    }

    if (password.length < 8) {
      setError("密碼至少需要 8 個字符");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "註冊失敗");
        setLoading(false);
        return;
      }

      router.push("/auth/signin?registered=true");
    } catch (err) {
      setError("註冊失敗，請稍後再試");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-1 pb-8">
          <div className="text-center">
            <div className="inline-block mb-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-3xl font-bold px-6 py-2 rounded-xl">
                OnHeritage
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-800">
              創建賬戶
            </CardTitle>
            <p className="text-slate-600 text-lg">
              開始您的遺產管理之旅
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-semibold text-slate-700">
                姓名
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="您的姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 text-lg border-2 border-slate-200 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-semibold text-slate-700">
                電子郵件
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-lg border-2 border-slate-200 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-base font-semibold text-slate-700">
                密碼
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="至少 8 個字符"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-lg border-2 border-slate-200 focus:border-indigo-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                密碼將被加密存儲
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-base font-semibold text-slate-700">
                確認密碼
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次輸入密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 text-lg border-2 border-slate-200 focus:border-indigo-500"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? "註冊中..." : "註冊"}
            </Button>
          </form>
        </CardContent>
        <CardContent className="flex justify-center pb-8 pt-4 border-t border-slate-100">
          <p className="text-slate-600">
            已有賬號？{" "}
            <Link href="/auth/signin" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors">
              立即登入
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
