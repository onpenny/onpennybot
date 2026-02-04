"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FamilyTreeProps {
  family: any[];
}

interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
  x?: number;
  y?: number;
  spouse?: string;
  spouseX?: number;
}

export function FamilyTree({ family }: FamilyTreeProps) {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [layout, setLayout] = useState<"vertical" | "horizontal" | "radial">("vertical");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 構建家谱树结构
  useEffect(() => {
    if (family.length === 0) return;

    // 找到根节点（没有父辈的成员）
    const root = family.find((member) => !member.parentId);

    if (root) {
      const treeData = buildTree(root.id, family);
      setTree(treeData);
    }
  }, [family]);

  // 递归构建树
  const buildTree = (memberId: string, allMembers: any[]): TreeNode => {
    const member = allMembers.find((m) => m.id === memberId);
    const children = allMembers.filter((m) => m.parentId === memberId);
    const spouse = member.spouseId ? allMembers.find((m) => m.id === member.spouseId) : null;

    return {
      id: member.id,
      name: member.name,
      spouse: spouse?.name,
      children: children.map((child) => buildTree(child.id, allMembers)),
    };
  };

  // 计算树节点坐标
  const calculateCoordinates = (node: TreeNode, depth: number = 0, x: number = 0, width: number = 800) => {
    node.x = x + width / 2;
    node.y = depth * 120 + 80;

    const childrenWidth = width / Math.max(node.children.length, 1);

    node.children.forEach((child, index) => {
      const childX = x + index * childrenWidth;
      calculateCoordinates(child, depth + 1, childX, childrenWidth);
    });

    return node;
  };

  // 绘制树
  const drawTree = (ctx: CanvasRenderingContext2D, node: TreeNode, layout: "vertical" | "horizontal" | "radial") => {
    if (!node.x || !node.y) return;

    const padding = 20;
    const nodeRadius = 40;
    const textHeight = 20;
    const textPadding = 10;

    if (layout === "vertical") {
      // 绘制节点
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      ctx.fill();

      // 绘制文字
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(node.name, node.x, node.y + nodeRadius + textPadding);

      // 绘制配偶
      if (node.spouse) {
        const spouseX = node.x + nodeRadius * 2 + 40;
        const spouseY = node.y;

        ctx.beginPath();
        ctx.arc(spouseX, spouseY, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#f59e0b";
        ctx.fill();

        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(node.spouse, spouseX, spouseY + nodeRadius + textPadding);

        // 绘制连接线
        ctx.beginPath();
        ctx.moveTo(node.x + nodeRadius, node.y);
        ctx.lineTo(spouseX - nodeRadius, spouseY);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 3;
        ctx.stroke();

        // 绘制心形
        ctx.fillStyle = "#ec4899";
        ctx.font = "24px sans-serif";
        ctx.fillText("❤", (node.x + spouseX) / 2, node.y - 10);
      }

      // 绘制子节点连接线
      node.children.forEach((child) => {
        if (!child.x || !child.y) return;

        ctx.beginPath();
        ctx.moveTo(node.x, node.y + nodeRadius);
        ctx.lineTo(child.x, child.y - nodeRadius);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 3;
        ctx.stroke();
      });

    } else if (layout === "horizontal") {
      // 绘制节点
      ctx.beginPath();
      ctx.arc(node.y, node.x, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      ctx.fill();

      // 绘制文字
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.name, node.y + nodeRadius + textPadding, node.x);

      // 绘制子节点连接线
      node.children.forEach((child) => {
        if (!child.x || !child.y) return;

        ctx.beginPath();
        ctx.moveTo(node.y + nodeRadius, node.x);
        ctx.lineTo(child.y - nodeRadius, child.x);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 3;
        ctx.stroke();
      });

    } else if (layout === "radial") {
      const centerX = 400;
      const centerY = 300;
      const radius = 200;
      const angle = (node.x || 0) / 800 * Math.PI * 2;

      // 绘制节点（圆形布局）
      const nodeX = centerX + radius * Math.cos(angle);
      const nodeY = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(nodeX, nodeY, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      ctx.fill();

      // 绘制文字
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.name, nodeX, nodeY + nodeRadius + textPadding);

      // 绘制到中心的连接线
      if (node.children.length === 0) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nodeX, nodeY - nodeRadius);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // 递归绘制子节点
    node.children.forEach((child) => drawTree(ctx, child, layout));
  };

  // 绘制整个家谱
  const drawFamilyTree = () => {
    if (!tree || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 计算坐标
    calculateCoordinates(tree, 0, 0, canvas.width);

    // 绘制树
    drawTree(ctx, tree, layout);
  };

  useEffect(() => {
    drawFamilyTree();
  }, [tree, layout]);

  // 下载图片
  const handleDownload = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `family-tree-${layout}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!tree) {
    return (
      <Card className="border-2 border-slate-200">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <span className="text-5xl">👨‍👩‍👧‍👦</span>
          </div>
          <p className="text-xl text-slate-600">請先添加家族成員</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-slate-100 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">🌳</span>
            家族譜系樹形圖
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLayout("vertical")}
              className={layout === "vertical" ? "bg-indigo-50 border-indigo-300" : ""}
            >
              垂直樹
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLayout("horizontal")}
              className={layout === "horizontal" ? "bg-indigo-50 border-indigo-300" : ""}
            >
              水平樹
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLayout("radial")}
              className={layout === "radial" ? "bg-indigo-50 border-indigo-300" : ""}
            >
              放射圖
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full"
          />
        </div>
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleDownload}
            className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl transition-all flex items-center gap-3"
          >
            <span className="text-2xl">📥</span>
            <span className="text-xl font-bold">下載圖片</span>
          </Button>
        </div>
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-slate-100">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💡</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                使用提示
              </h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>設置每個成員的"父親"關係可以建立樹形結構</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>點擊"配偶"按鈕可以建立夫妻關係</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>選擇不同佈局（垂直、水平、放射）查看家譜</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>點擊下載按鈕可以保存家譜圖片</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
