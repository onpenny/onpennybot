"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/components/notifications/Notifications";
import { FamilyTree } from "@/components/family/FamilyTree";

export default function FamilyPage() {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const searchParams = useSearchParams();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showTree, setShowTree] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "tree">("tree");

  useEffect(() => {
    fetchMembers();
  }, [searchParams]);

  const fetchMembers = async () => {
    setLoading(true);
    const search = searchParams.get("search") || "";
    const relationship = searchParams.get("relationship") || "ALL";
    const isAlive = searchParams.get("isAlive") || "ALL";

    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (relationship !== "ALL") params.set("relationship", relationship);
      if (isAlive !== "ALL") params.set("isAlive", isAlive);

      const response = await fetch(`/api/family?${params.toString()}`);
      const data = await response.json();
      setMembers(data.members || []);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`您確定要刪除家族成員「${name}」嗎？此操作無法撤銷。`)) {
      return;
    }

    try {
      const response = await fetch(`/api/family/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showNotification({
          type: "success",
          title: "刪除成功",
          message: `家族成員「${name}」已刪除`,
        });
        setMembers(members.filter((m) => m.id !== id));
      } else {
        throw new Error("刪除失敗");
      }
    } catch (err) {
      showNotification({
        type: "error",
        title: "刪除失敗",
        message: "無法刪除家族成員，請稍後再試",
      });
    }
  };

  const handleToggleTree = () => {
    setViewMode(viewMode === "tree" ? "list" : "tree");
  };

  const getStatusBadge = (member: any) => {
    if (member.isAlive) {
      return <Badge className="bg-emerald-500 text-white">在世</Badge>;
    } else {
      return <Badge className="bg-slate-500 text-white">逝世</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-md">
                  OnHeritage
                </div>
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-lg font-semibold text-slate-700">家族譜系</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleTree}
                className={viewMode === "tree" ? "bg-indigo-50 border-indigo-300" : "border-slate-200"}
              >
                <span className="text-lg">{viewMode === "tree" ? "📊" : "📋"}</span>
                {viewMode === "tree" ? "樹形圖" : "列表"}
              </Button>
              <Link href="/dashboard/family/new">
                <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all">
                  + 添加成員
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            家族譜系
          </h1>
          <p className="text-xl text-slate-600">
            {viewMode === "tree" ? "查看您的家族關係樹形圖" : "管理您的家族成員與關係"}
          </p>
        </div>

        {viewMode === "tree" && members.length > 0 ? (
          <FamilyTree family={members} />
        ) : null}

        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border-2 border-white shadow-md">
            <span className="text-base text-slate-600">家族成員</span>
            <span className="text-3xl font-bold text-blue-600">{members.length}</span>
            <span className="text-base text-slate-600">位</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "tree" ? "list" : "tree")}
              className={viewMode === "tree" ? "bg-blue-50 border-blue-300" : "border-slate-200"}
            >
              {viewMode === "tree" ? "📋" : "📊"}
              {viewMode === "tree" ? "列表視圖" : "樹形視圖"}
            </Button>
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
                <span className="text-6xl">👨‍👩‍👧‍👦</span>
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
                        <div className={`w-16 h-16 ${member.isAlive ? "bg-gradient-to-br from-blue-400 to-blue-600" : "bg-gradient-to-br from-slate-400 to-slate-600"} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          <span className="text-3xl">👤</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {member.name}
                        </CardTitle>
                      </div>
                      {getStatusBadge(member)}
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
                          <span className="text-base text-slate-700">
                            {new Date(member.dateOfBirth).toLocaleDateString("zh-TW")}
                          </span>
                        </div>
                      )}
                      {member.dateOfDeath && (
                        <div className="flex justify-between items-center">
                          <span className="text-base text-slate-600 font-medium">逝世日期</span>
                          <span className="text-base text-slate-700">
                            {new Date(member.dateOfDeath).toLocaleDateString("zh-TW")}
                          </span>
                        </div>
                      )}
                      {member.spouse && (
                        <div className="flex justify-between items-center">
                          <span className="text-base text-slate-600 font-medium">配偶</span>
                          <span className="text-base text-slate-700 font-semibold">
                            {member.spouse.name}
                          </span>
                        </div>
                      )}
                      {member.parent && (
                        <div className="flex justify-between items-center">
                          <span className="text-base text-slate-600 font-medium">父母</span>
                          <span className="text-base text-slate-700 font-semibold">
                            {member.parent.name}
                          </span>
                        </div>
                      )}
                      {member.notes && (
                        <div className="pt-3 border-t border-slate-100 mt-3">
                          <p className="text-sm text-slate-500 leading-relaxed">
                            備註：{member.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Link href={`/dashboard/family/${member.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full h-12 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                          編輯
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full h-12 border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(member.id, member.name);
                        }}
                      >
                        🗑
                      </Button>
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
