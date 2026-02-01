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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                  OnHeritage
                </div>
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-lg font-semibold text-slate-700">儀表板</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden md:block">
                歡迎回來，{session.user.name}
              </span>
              <form action="/api/auth/signout" method="POST">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 17V7m0 10l2-2m-2 2l-2-2M9 19V5m0 6h6a3 3 0 013 0v10a3 3 0 013-3h-6a3 3 0 010-3v-10a3 3 0 010 3h6a3 3 0 013 0v10a3 3 0 013-3h-6a3 3 0 010-3V4" />
                  </svg>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            歡迎回來，{session.user.name}
          </h1>
          <p className="text-xl text-slate-600">
            開始管理您的資產與遺產規劃
          </p>
        </div>

        {/* 统计概览 */}
        <Card className="mb-10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-0">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">總覽</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-2xl shadow-md">
                <div className="text-6xl font-bold text-indigo-600 mb-2">0</div>
                <p className="text-slate-600 font-medium text-lg">資產</p>
              </div>
              <div className="text-center p-8 bg-white rounded-2xl shadow-md">
                <div className="text-6xl font-bold text-emerald-600 mb-2">0</div>
                <p className="text-slate-600 font-medium text-lg">家族成員</p>
              </div>
              <div className="text-center p-8 bg-white rounded-2xl shadow-md">
                <div className="text-6xl font-bold text-amber-600 mb-2">0</div>
                <p className="text-slate-600 font-medium text-lg">遺囑</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快捷操作卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/dashboard/assets" className="group">
            <Card className="h-full border-2 border-slate-100 hover:border-indigo-300 hover:shadow-2xl transition-all hover:-translate-y-1 bg-white">
              <CardHeader className="space-y-3 pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">💰</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">資產管理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-lg leading-relaxed">
                  添加和管理您的各類資產
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/family" className="group">
            <Card className="h-full border-2 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all hover:-translate-y-1 bg-white">
              <CardHeader className="space-y-3 pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">👨‍👩‍👧‍👦</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">家族譜系</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-lg leading-relaxed">
                  建立家族成員與關係
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/wills" className="group">
            <Card className="h-full border-2 border-slate-100 hover:border-amber-300 hover:shadow-2xl transition-all hover:-translate-y-1 bg-white">
              <CardHeader className="space-y-3 pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">📜</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">遺囑管理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-lg leading-relaxed">
                  創建和管理您的遺囑
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/inheritance" className="group">
            <Card className="h-full border-2 border-slate-100 hover:border-purple-300 hover:shadow-2xl transition-all hover:-translate-y-1 bg-white">
              <CardHeader className="space-y-3 pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🎯</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">繼承規則</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-lg leading-relaxed">
                  設置資產分配規則
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 开始提示 */}
        {session.user.name === "OnPenny Test User" || session.user.email === "onpenny@gmail.com" ? (
          <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-amber-800 flex items-center gap-3">
                <span>💡</span>
                歡迎開始使用
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-6 rounded-2xl">
                <p className="text-slate-700 font-semibold text-lg mb-4">
                  您還沒有添加任何資產，這是開始的好地方！
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-800">第一步：</span>
                      添加您的第一個資產（銀行賬戶、保險等）
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-800">第二步：</span>
                      添加家族成員建立譜系
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-800">第三步：</span>
                      設定遺囑和繼承規則
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Link href="/dashboard/assets/new" className="flex-1">
                  <Button className="h-14 text-lg font-semibold w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg transition-all">
                    立即添加資產
                  </Button>
                </Link>
                <Link href="/dashboard/family/new" className="flex-1">
                  <Button variant="outline" className="h-14 text-lg font-semibold w-full border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50 transition-all">
                    添加家族成員
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
