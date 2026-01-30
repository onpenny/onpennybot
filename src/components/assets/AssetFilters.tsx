"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AssetFilters({
  onSearchChange,
  onCategoryChange,
  onLocationChange,
}: {
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [location, setLocation] = useState("ALL");

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <Input
        placeholder="搜索資產名稱、機構..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onSearchChange(e.target.value);
        }}
      />

      <Select
        value={category}
        onValueChange={(value) => {
          setCategory(value);
          onCategoryChange(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="全部類別" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">全部類別</SelectItem>
          <SelectItem value="BANK">銀行賬戶</SelectItem>
          <SelectItem value="INSURANCE">保險</SelectItem>
          <SelectItem value="BROKERAGE">證券賬戶</SelectItem>
          <SelectItem value="FUND">基金</SelectItem>
          <SelectItem value="REAL_ESTATE">不動產</SelectItem>
          <SelectItem value="CRYPTOCURRENCY">虛擬貨幣</SelectItem>
          <SelectItem value="STOCK">股票</SelectItem>
          <SelectItem value="COLLECTION">收藏品</SelectItem>
          <SelectItem value="INTELLECTUAL_PROPERTY">知識產權</SelectItem>
          <SelectItem value="OTHER">其他</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={location}
        onValueChange={(value) => {
          setLocation(value);
          onLocationChange(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="全部位置" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">全部位置</SelectItem>
          <SelectItem value="DOMESTIC">本地</SelectItem>
          <SelectItem value="OVERSEAS">海外</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
