import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard, ProgressBar, DonutChart } from "@/components/charts/Charts";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // 并行获取所有统计数据
  const [assetsCount, familyCount, willsCount, inheritanceCount] = await Promise.all([
    prisma.asset.count({ where: { userId: session.user.id } }),
    prisma.familyMember.count({ where: { userId: session.user.id } }),
    prisma.will.count({ where: { userId: session.user.id } }),
    prisma.inheritance.count({ where: { userId: session.user.id } }),
  ]);

  // 获取资产总价值
  const assets = await prisma.asset.findMany({
    where: { userId: session.user.id },
    select: { value: true, currency: true, category: true },
  });

  const totalValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
  const currency = assets.length > 0 ? assets[0].currency : "MOP";

  // 按类别统计资产数量和价值
  const categoryStats = assets.reduce((acc: any, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = { count: 0, value: 0 };
    }
    acc[asset.category].count += 1;
    acc[asset.category].value += asset.value || 0;
    return acc;
  }, {});

  // 统计已签名和未签名的遗嘱
  const wills = await prisma.will.findMany({
    where: { userId: session.user.id },
    select: { isSigned: true, isWitnessed: true },
  });

  const signedWills = wills.filter((will) => will.isSigned).length;
  const totalWills = wills.length;

  // 统计在世和已故家族成员
  const familyMembers = await prisma.familyMember.findMany({
    where: { userId: session.user.id },
    select: { isAlive: true },
  });

  const aliveMembers = familyMembers.filter((member) => member.isAlive).length;
  const totalMembers = familyMembers.length;

  // 统计继承规则状态
  const inheritances = await prisma.inheritance.findMany({
    where: { userId: session.user.id },
    select: { status: true },
  });

  const inheritanceStats = {
    PENDING: inheritances.filter((i) => i.status === "PENDING").length,
    IN_PROGRESS: inheritances.filter((i) => i.status === "IN_PROGRESS").length,
    COMPLETED: inheritances.filter((i) => i.status === "COMPLETED").length,
    DISPUTED: inheritances.filter((i) => i.status === "DISPUTED").length,
  };

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
            <div className="flex items-center gap-3">
              <a
                href="/api/export"
                className="h-10 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <span className="text-lg">📊</span>
                導出數據
              </a>
              <span className="text-sm text-slate-500 hidden md:block">
                {session.user.name}
              </span>
              <form action="/api/auth/signout" method="POST">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 17V7m0 10l2-2m-2 2l-2-2M9 19V5m0 10h6a3 3 0 013 0v-10a3 3 0 01-3 0h-6a3 3 0 010-3v10a3 3 0 013 0h-6a3 3 0 010-3V4" />
                  </svg>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            歡迎回來，<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{session.user.name}</span>
          </h1>
          <p className="text-xl text-slate-600">
            開始管理您的資產與遺產規劃
          </p>
        </div>

        {/* 数据可视化 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="資產"
            value={assetsCount}
            label="總數量"
            color="bg-gradient-to-br from-indigo-500 to-indigo-600"
            icon="💰"
          />

          <StatCard
            title="家族成員"
            value={familyCount}
            label="總數量"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            icon="👨‍👩‍👧‍👦"
          />

          <StatCard
            title="遺囑"
            value={willsCount}
            label="總數量"
            color="bg-gradient-to-br from-amber-500 to-amber-600"
            icon="📜"
          />

          <StatCard
            title="繼承規則"
            value={inheritanceCount}
            label="總數量"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            icon="🎯"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <DonutChart
            title="資產類別分布"
            data={Object.keys(categoryStats).map((category) => ({
              label: category,
              value: categoryStats[category].count,
              color: category === "BANK" ? "bg-blue-500" :
                     category === "INSURANCE" ? "bg-emerald-500" :
                     category === "BROKERAGE" ? "bg-purple-500" :
                     category === "FUND" ? "bg-amber-500" :
                     category === "REAL_ESTATE" ? "bg-pink-500" :
                     category === "CRYPTOCURRENCY" ? "bg-indigo-500" :
                     category === "STOCK" ? "bg-orange-500" :
                     category === "COLLECTION" ? "bg-teal-500" :
                     "bg-slate-500",
            }))}
          />

          <DonutChart
            title="繼承規則狀態"
            data={[
              { label: "待處理", value: inheritanceStats.PENDING, color: "bg-slate-500" },
              { label: "進行中", value: inheritanceStats.IN_PROGRESS, color: "bg-blue-500" },
              { label: "已完成", value: inheritanceStats.COMPLETED, color: "bg-emerald-500" },
              { label: "糾紛中", value: inheritanceStats.DISPUTED, color: "bg-red-500" },
            ]}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <ProgressBar
            value={aliveMembers}
            max={totalMembers}
            label="在世成員佔比"
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            icon="👤"
          />

          <ProgressBar
            value={signedWills}
            max={totalWills}
            label="已簽署遺囑佔比"
            color="bg-gradient-to-r from-amber-500 to-amber-600"
            icon="📜"
          />
        </div>

        {/* 总价值卡片 */}
        <Card className="mb-10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-0">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <span>💎</span>
              資產總價值
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              <div className="text-6xl font-bold text-slate-800 mb-4">
                {currency} {totalValue.toLocaleString()}
              </div>
              <p className="text-slate-600 text-lg">
                所有資產的總估值
              </p>
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
                <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600 font-semibold">
                  <span>{assetsCount} 個資產</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7" />
                  </svg>
                </div>
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
                <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-semibold">
                  <span>{familyCount} 位成員</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7" />
                  </svg>
                </div>
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
                <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 font-semibold">
                  <span>{willsCount} 份遺囑</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7" />
                  </svg>
                </div>
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
                <div className="mt-4 flex items-center gap-2 text-sm text-purple-600 font-semibold">
                  <span>{inheritanceCount} 條規則</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 开始提示 - 只对新用户显示 */}
        {(session.user.name === "OnPenny Test User" || session.user.email === "onpenny@gmail.com" || assetsCount === 0) && (
          <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-amber-800 flex items-center gap-3">
                <span className="text-5xl">🚀</span>
                歡迎開始使用
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-8 rounded-2xl">
                <p className="text-slate-700 text-2xl font-bold mb-6">
                  您還沒有添加任何資產，這是開始的好地方！
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-700 text-xl leading-relaxed flex-1">
                      <span className="font-bold text-slate-900 text-2xl">第一步：</span>
                      添加您的第一個資產（銀行賬戶、保險等）
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <p className="text-slate-700 text-xl leading-relaxed flex-1">
                      <span className="font-bold text-slate-900 text-2xl">第二步：</span>
                      添加家族成員建立譜系
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-700 text-xl leading-relaxed flex-1">
                      <span className="font-bold text-slate-900 text-2xl">第三步：</span>
                      設定遺囑和繼承規則
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Link href="/dashboard/assets/new" className="flex-1">
                  <Button className="h-16 text-2xl font-bold w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-2xl hover:scale-105 transition-all">
                    立即添加資產
                  </Button>
                </Link>
                <Link href="/dashboard/family/new" className="flex-1">
                  <Button variant="outline" className="h-16 text-2xl font-bold w-full border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50 transition-all">
                    添加家族成員
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Link href="/dashboard/settings" className="flex-1">
            <Button className="h-14 text-lg font-semibold bg-gradient-to-r from-slate-600 to-slate-800 hover:shadow-xl transition-all">
              ⚙️ 賬戶設置
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
