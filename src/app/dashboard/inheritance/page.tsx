import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function InheritancePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const inheritances = await prisma.inheritance.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      asset: true,
      heir: true,
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
              <span className="font-semibold">繼承規則</span>
            </div>
            <Link href="/dashboard/inheritance/new">
              <Button>+ 設置規則</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">繼承規則</h1>
          <p className="text-muted-foreground">
            設置資產分配規則
          </p>
        </div>

        {inheritances.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <span className="text-6xl mb-4">🎯</span>
              <h3 className="text-xl font-semibold mb-2">還沒有繼承規則</h3>
              <p className="text-muted-foreground mb-4">
                開始設置資產的繼承規則
              </p>
              <Link href="/dashboard/inheritance/new">
                <Button>設置規則</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inheritances.map((inheritance) => (
              <Card key={inheritance.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {inheritance.asset.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">繼承人</span>
                      <span className="text-sm font-semibold">
                        {inheritance.heir.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">分配比例</span>
                      <span className="text-sm font-semibold">
                        {inheritance.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        inheritance.status === "PENDING" ? "default" :
                        inheritance.status === "IN_PROGRESS" ? "secondary" :
                        inheritance.status === "COMPLETED" ? "default" : "destructive"
                      }>
                        {
                          inheritance.status === "PENDING" ? "待處理" :
                          inheritance.status === "IN_PROGRESS" ? "進行中" :
                          inheritance.status === "COMPLETED" ? "已完成" : "糾紛中"
                        }
                      </Badge>
                    </div>
                    {inheritance.conditions && (
                      <p className="text-xs text-muted-foreground">
                        條件：{inheritance.conditions}
                      </p>
                    )}
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
