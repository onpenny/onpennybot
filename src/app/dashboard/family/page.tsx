"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/components/notifications/Notifications";

export default function FamilyPage() {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    relationship: "ALL",
    isAlive: "ALL",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/family");
      const data = await response.json();
      setMembers(data.members || []);
    } catch (err) {
      showNotification({
        type: "error",
        title: "加載失敗",
        message: "無法獲取家族成員列表",
      });
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

  const filteredMembers = members.filter((member) => {
    if (filters.search && !member.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.relationship !== "ALL" && member.relationship !== filters.relationship) {
      return false;
    }
    if (filters.isAlive === "ALIVE" && !member.isAlive) {
      return false;
    }
    if (filters.isAlive === "DEAD" && member.isAlive) {
      return false;
    }
    return true;
  });

  const hasFilters = filters.search || filters.relationship !== "ALL" || filters.isAlive !== "ALL";

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
                onClick={() => setShowFilters(!showFilters)}
                className="border-2 border-slate-200 hover:border-blue-300"
              >
                {showFilters ? "收起搜索" : "展開搜索"}
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
            管理您的家族成員與關係
          </p>
        </div>

        {/* 搜索栏 */}
        {showFilters && (
          <Card className="mb-8 border-2 border-slate-100 bg-white">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Input
                  placeholder="搜索成員姓名..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500"
                />

                <select
                  value={filters.relationship}
                  onChange={(e) => setFilters({ ...filters, relationship: e.target.value })}
                  className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <option value="ALL">全部關係</option>
                  <option value="BLOOD">血緣關係</option>
                  <option value="ADOPTED">收養關係</option>
                  <option value="MARRIAGE">婚姻關係</option>
                  <option value="PARTNER">伴侶</option>
                </select>

                <select
                  value={filters.isAlive}
                  onChange={(e) => setFilters({ ...filters, isAlive: e.target.value })}
                  className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <option value="ALL">全部狀態</option>
                  <option value="ALIVE">在世</option>
                  <option value="DEAD">已逝世</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 统计信息 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border-2 border-white shadow-md">
            <span className="text-lg text-slate-600">家族成員</span>
            <span className="text-3xl font-bold text-blue-600">{filteredMembers.length}</span>
            <span className="text-base text-slate-600">位</span>
          </div>
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ search: "", relationship: "ALL", isAlive: "ALL" })}
              className="border-2 border-slate-200 hover:border-blue-300"
            >
              清除篩選
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <Card className="border-2 border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-24">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <span className="text-6xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-3xl font-semibold text-slate-800 mb-4">
                還沒有家族成員
              </h3>
              <p className="text-xl text-slate-600 mb-8 max-w-md text-center">
                {hasFilters ? "調整搜索條件或清除篩選" : "開始添加您的第一個家族成員"}
              </p>
              {!hasFilters && (
                <Link href="/dashboard/family/new">
                  <Button className="h-16 px-10 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all">
                    添加第一個成員
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((member) => (
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
                      {member.notes && (
                        <div className="pt-3 border-t border-slate-100 mt-3">
                          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                            備註：{member.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/dashboard/family/${member.id}/edit`);
                        }}
                      >
                        編輯
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-all"
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
