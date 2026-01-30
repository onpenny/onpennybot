import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function FamilyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const familyMembers = await prisma.familyMember.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      parent: true,
      children: true,
      spouse: true,
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
              <span className="font-semibold">家族譜系</span>
            </div>
            <Link href="/dashboard/family/new">
              <Button>+ 添加成員</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">家族譜系</h1>
          <p className="text-muted-foreground">
            管理您的家族成員與關係
          </p>
        </div>

        {familyMembers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <span className="text-6xl mb-4">👨‍👩‍👧‍👦</span>
              <h3 className="text-xl font-semibold mb-2">還沒有家族成員</h3>
              <p className="text-muted-foreground mb-4">
                開始添加第一個家族成員
              </p>
              <Link href="/dashboard/family/new">
                <Button>添加成員</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge variant={member.isAlive ? "default" : "secondary"}>
                      {member.isAlive ? "在世" : "逝世"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">關係</span>
                      <Badge variant="outline">{member.relationship}</Badge>
                    </div>
                    {member.dateOfBirth && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">出生日期</span>
                        <span className="text-sm">
                          {new Date(member.dateOfBirth).toLocaleDateString("zh-TW")}
                        </span>
                      </div>
                    )}
                    {member.dateOfDeath && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">逝世日期</span>
                        <span className="text-sm">
                          {new Date(member.dateOfDeath).toLocaleDateString("zh-TW")}
                        </span>
                      </div>
                    )}
                    {member.parent && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">父母</span>
                        <span className="text-sm">{member.parent.name}</span>
                      </div>
                    )}
                    {member.spouse && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">配偶</span>
                        <span className="text-sm">{member.spouse.name}</span>
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
