import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function WillsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const wills = await prisma.will.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-xl font-bold">
                OnHeritage
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-semibold">遺囑管理</span>
            </div>
            <Link href="/dashboard/wills/new">
              <Button>+ 創建遺囑</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">遺囑管理</h1>
          <p className="text-muted-foreground">
            管理您的遺囑文檔
          </p>
        </div>

        {wills.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <span className="text-6xl mb-4">📜</span>
              <h3 className="text-xl font-semibold mb-2">還沒有遺囑</h3>
              <p className="text-muted-foreground mb-4">
                開始創建您的第一份遺囑
              </p>
              <Link href="/dashboard/wills/new">
                <Button>創建遺囑</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wills.map((will) => (
              <Card key={will.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{will.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={will.isSigned ? "default" : "secondary"}>
                        {will.isSigned ? "已簽署" : "未簽署"}
                      </Badge>
                      {will.isWitnessed && (
                        <Badge variant="outline">已見證</Badge>
                      )}
                    </div>
                    {will.jurisdiction && (
                      <p className="text-sm text-muted-foreground">
                        法域：{will.jurisdiction}
                      </p>
                    )}
                    {will.signedAt && (
                      <p className="text-sm text-muted-foreground">
                        簽署日期：{new Date(will.signedAt).toLocaleDateString("zh-TW")}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      創建日期：{new Date(will.createdAt).toLocaleDateString("zh-TW")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
