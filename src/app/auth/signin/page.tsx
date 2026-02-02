"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNotifications } from "@/components/notifications/Notifications";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showNotification } = useNotifications();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      showNotification({
        type: "success",
        title: "註冊成功",
        message: "歡迎加入 OnHeritage！請登入您的賬戶。",
      });
    }
  }, [searchParams, showNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        showNotification({
          type: "error",
          title: "登入失敗",
          message: result.error,
        });
      } else {
        showNotification({
          type: "success",
          title: "登入成功",
          message: "歡迎回來！",
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      const errorMessage = "登入失敗，請稍後再試";
      setError(errorMessage);
      showNotification({
        type: "error",
        title: "登入失敗",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      const errorMessage = "Google 登入失敗，請稍後再試";
      setError(errorMessage);
      showNotification({
        type: "error",
        title: "Google 登入失敗",
        message: errorMessage,
      });
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
              歡迎回來
            </CardTitle>
            <p className="text-slate-600 text-lg">
              登入您的賬戶
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "登入中..." : "登入"}
            </Button>
          </form>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-slate-200"></span>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm font-semibold text-slate-500">
                或
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full h-14 text-lg font-semibold border-2 border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            使用 Google 登入
          </Button>
        </CardContent>
        <CardContent className="flex justify-center pb-8 pt-6 border-t border-slate-100">
          <p className="text-slate-600">
            還沒有賬戶？{" "}
            <Link href="/auth/signup" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors">
              立即註冊
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
