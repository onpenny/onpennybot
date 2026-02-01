"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function FamilyContent() {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const response = await fetch("/api/family");
    const data = await response.json();
    setMembers(data.members || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                  OnHeritage
                </div>
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-lg font-semibold text-slate-700">家族譜系</span>
            </div>
            <Link href="/dashboard/family/new">
              <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all">
                + 添加成員
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            家族譜系
          </h1>
          <p className="text-xl text-slate-600">
            管理您的家族成員與關係
          </p>
        </div>

        {/* 統計信息 */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border-2 border-white shadow-md">
            <span className="text-base text-slate-600">家族成員</span>
            <span className="text-3xl font-bold text-blue-600">{members.length}</span>
            <span className="text-base text-slate-600">位</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : members.length === 0 ? (
          <Card className="border-2 border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-24">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <span className="text-7xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-3xl font-semibold text-slate-800 mb-4">
                還沒有家族成員
              </h3>
              <p className="text-xl text-slate-600 mb-8 max-w-md text-center">
                開始添加您的第一個家族成員，建立完整的家族譜系
              </p>
              <Link href="/dashboard/family/new">
                <Button className="h-16 px-10 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all">
                  添加第一個成員
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <Link href={`/dashboard/family/${member.id}/edit`} key={member.id} className="group">
                <Card className="h-full border-2 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all hover:-translate-y-1 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <span className="text-3xl">👤</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {member.name}
                        </CardTitle>
                      </div>
                      <Badge 
                        variant={member.isAlive ? "default" : "secondary"}
                        className={member.isAlive ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}
                      >
                        {member.isAlive ? "在世" : "逝世"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base text-slate-600 font-medium">關係</span>
                        <Badge variant="outline" className="text-sm">
                          {member.relationship === "BLOOD" && "血緣"}
                          {member.relationship === "ADOPTED" && "收養"}
                          {member.relationship === "MARRIAGE" && "婚姻"}
                          {member.relationship === "PARTNER" && "伴侶"}
                        </Badge>
                      </div>
                      {member.dateOfBirth && (
                        <div className="flex justify-between items-center">
                          <span className="text-base text-slate-600 font-medium">出生日期</span>
                          <span className="text-lg text-slate-700">
                            {new Date(member.dateOfBirth).toLocaleDateString("zh-TW")}
                          </span>
                        </div>
                      )}
                      {member.dateOfDeath && (
                        <div className="flex justify-between items-center">
                          <span className="text-base text-slate-600 font-medium">逝世日期</span>
                          <span className="text-lg text-slate-700">
                            {new Date(member.dateOfDeath).toLocaleDateString("zh-TW")}
                          </span>
                        </div>
                      )}
                      {member.parent && (
                        <div className="flex justify-between items-center">
                          <span className="text-base text-slate-600 font-medium">父母</span>
                          <span className="text-lg text-slate-700 font-semibold">
                            {member.parent.name}
                          </span>
                        </div>
                      )}
                      {member.spouse && (
                        <div className="flex justify-between items-center">
                          <span className="text-base text-slate-600 font-medium">配偶</span>
                          <span className="text-lg text-slate-700 font-semibold">
                            {member.spouse.name}
                          </span>
                        </div>
                      )}
                      {member.notes && (
                        <div className="pt-3 border-t border-slate-100 mt-3">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            備註：{member.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Link href={`/dashboard/family/${member.id}/edit`} className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full h-12 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                        >
                          編輯
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function FamilyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
    </div>}>
      <FamilyContent />
    </Suspense>
  );
}
