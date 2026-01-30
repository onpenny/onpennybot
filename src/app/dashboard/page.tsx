import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 顶部导航 */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">OnHeritage</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session.user.name}
            </span>
            <form action="/api/auth/signout" method="POST">
              <Button variant="outline" size="sm">
                登出
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">歡迎回來，{session.user.name}</h2>
          <p className="text-muted-foreground">
            開始管理您的資產與遺產規劃
          </p>
        </div>

        {/* 快捷操作卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/assets">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">💰</span>
                  資產管理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  添加和管理您的各類資產
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/family">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">👨‍👩‍👧‍👦</span>
                  家族譜系
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  建立家族成員與關係
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/wills">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">📜</span>
                  遺囑管理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  創建和管理您的遺囑
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/inheritance">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">🎯</span>
                  繼承規則
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  設置資產分配規則
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 统计概览 */}
        <Card>
          <CardHeader>
            <CardTitle>概覽</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-slate-900">0</p>
                <p className="text-sm text-muted-foreground">資產</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-slate-900">0</p>
                <p className="text-sm text-muted-foreground">家族成員</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-slate-900">0</p>
                <p className="text-sm text-muted-foreground">遺囑</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
