import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AssetsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const assets = await prisma.asset.findMany({
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
              <span className="font-semibold">資產管理</span>
            </div>
            <Link href="/auth/signin">
              <Button variant="outline" size="sm">
                返回
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">資產管理</h1>
            <p className="text-muted-foreground">
              管理您的所有資產
            </p>
          </div>
          <Link href="/dashboard/assets/new">
            <Button>
              + 添加資產
            </Button>
          </Link>
        </div>

        {assets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <span className="text-6xl mb-4">📦</span>
              <h3 className="text-xl font-semibold mb-2">還沒有資產</h3>
              <p className="text-muted-foreground mb-4">
                開始添加您的第一個資產
              </p>
              <Link href="/dashboard/assets/new">
                <Button>添加資產</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <Card key={asset.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                    <Badge variant={asset.location === "DOMESTIC" ? "default" : "secondary"}>
                      {asset.location === "DOMESTIC" ? "本地" : "海外"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">類別</span>
                      <Badge variant="outline">{asset.category}</Badge>
                    </div>
                    {asset.value && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">價值</span>
                        <span className="font-semibold">
                          {asset.currency} {asset.value.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {asset.institution && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">機構</span>
                        <span className="text-sm">{asset.institution}</span>
                      </div>
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
