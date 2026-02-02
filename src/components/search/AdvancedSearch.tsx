"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AdvancedSearchProps {
  onSearch: (filters: any) => void;
  onReset: () => void;
}

export function AdvancedSearch({ onSearch, onReset }: AdvancedSearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    category: "ALL",
    location: "ALL",
    minValue: "",
    maxValue: "",
    institution: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      name: "",
      category: "ALL",
      location: "ALL",
      minValue: "",
      maxValue: "",
      institution: "",
    });
    onReset();
  };

  return (
    <Card className="border-2 border-slate-100 bg-white">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* 基础搜索 */}
          <Input
            placeholder="搜索資產名稱、機構..."
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="h-12 text-lg border-2 border-slate-200 focus:border-indigo-500"
          />

          {/* 展开/收起 */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full border-2 border-slate-200 hover:border-indigo-300"
          >
            {showAdvanced ? "收起高級搜索" : "展開高級搜索"}
            <span className="ml-2">{showAdvanced ? "▲" : "▼"}</span>
          </Button>

          {/* 高级搜索 */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t-2 border-slate-100">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    類別
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="flex h-10 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-sm focus:border-indigo-500"
                  >
                    <option value="ALL">全部</option>
                    <option value="BANK">銀行賬戶</option>
                    <option value="INSURANCE">保險</option>
                    <option value="BROKERAGE">證券賬戶</option>
                    <option value="FUND">基金</option>
                    <option value="REAL_ESTATE">不動產</option>
                    <option value="CRYPTOCURRENCY">虛擬貨幣</option>
                    <option value="STOCK">股票</option>
                    <option value="COLLECTION">收藏品</option>
                    <option value="OTHER">其他</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    位置
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="flex h-10 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-sm focus:border-indigo-500"
                  >
                    <option value="ALL">全部</option>
                    <option value="DOMESTIC">本地</option>
                    <option value="OVERSEAS">海外</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    最小價值
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={filters.minValue}
                    onChange={(e) => setFilters({ ...filters, minValue: e.target.value })}
                    className="h-10 border-2 border-slate-200 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    最大價值
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="99999999.99"
                    value={filters.maxValue}
                    onChange={(e) => setFilters({ ...filters, maxValue: e.target.value })}
                    className="h-10 border-2 border-slate-200 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  金融機構
                </label>
                <Input
                  placeholder="例如：招商銀行"
                  value={filters.institution}
                  onChange={(e) => setFilters({ ...filters, institution: e.target.value })}
                  className="h-10 border-2 border-slate-200 focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t-2 border-slate-100">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all font-semibold"
                >
                  🔍 搜索
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 h-12 border-2 border-slate-200 hover:border-slate-300 transition-all font-semibold"
                >
                  🔄 重置
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
