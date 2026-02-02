import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    // 获取所有数据
    const [assets, familyMembers, wills, inheritances] = await Promise.all([
      prisma.asset.findMany({
        where: { userId: session.user.id },
      }),
      prisma.familyMember.findMany({
        where: { userId: session.user.id },
      }),
      prisma.will.findMany({
        where: { userId: session.user.id },
      }),
      prisma.inheritance.findMany({
        where: { userId: session.user.id },
        include: {
          asset: true,
          heir: true,
        },
      }),
    ]);

    // 创建 Excel 工作簿
    const workbook = XLSX.utils.book_new();

    // 资产表
    if (assets.length > 0) {
      const assetsData = assets.map((asset) => ({
        名稱: asset.name,
        類別: asset.category,
        描述: asset.description || "",
        價值: asset.value || 0,
        幣種: asset.currency,
        位置: asset.location,
        機構: asset.institution,
        賬戶號: "****", // 隐藏敏感信息
        創建時間: new Date(asset.createdAt).toLocaleDateString("zh-TW"),
      }));
      const assetsSheet = XLSX.utils.json_to_sheet(assetsData);
      XLSX.utils.book_append_sheet(workbook, assetsSheet, "資產");
    }

    // 家族成员表
    if (familyMembers.length > 0) {
      const familyData = familyMembers.map((member) => ({
        姓名: member.name,
        關係: member.relationship,
        在世: member.isAlive ? "是" : "否",
        出生日期: member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString("zh-TW") : "",
        逝世日期: member.dateOfDeath ? new Date(member.dateOfDeath).toLocaleDateString("zh-TW") : "",
        備註: member.notes || "",
        創建時間: new Date(member.createdAt).toLocaleDateString("zh-TW"),
      }));
      const familySheet = XLSX.utils.json_to_sheet(familyData);
      XLSX.utils.book_append_sheet(workbook, familySheet, "家族成員");
    }

    // 遗嘱表
    if (wills.length > 0) {
      const willsData = wills.map((will) => ({
        標題: will.title,
        法域: will.jurisdiction || "",
        已簽署: will.isSigned ? "是" : "否",
        已見證: will.isWitnessed ? "是" : "否",
        內容: will.content.substring(0, 100) + "...",
        創建時間: new Date(will.createdAt).toLocaleDateString("zh-TW"),
      }));
      const willsSheet = XLSX.utils.json_to_sheet(willsData);
      XLSX.utils.book_append_sheet(workbook, willsSheet, "遺囑");
    }

    // 继承规则表
    if (inheritances.length > 0) {
      const inheritanceData = inheritances.map((item) => ({
        資產: item.asset?.name || "",
        資產類別: item.asset?.category || "",
        資產價值: item.asset?.value || 0,
        資產幣種: item.asset?.currency || "",
        繼承人: item.heir?.name || "",
        分配比例: `${item.percentage}%`,
        條件: item.conditions || "",
        狀態: item.status,
        創建時間: new Date(item.createdAt).toLocaleDateString("zh-TW"),
      }));
      const inheritanceSheet = XLSX.utils.json_to_sheet(inheritanceData);
      XLSX.utils.book_append_sheet(workbook, inheritanceSheet, "繼承規則");
    }

    // 生成 Excel 文件
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileName = `OnHeritage_數據_${new Date().toISOString().split("T")[0]}.xlsx`;

    // 返回文件
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });
  } catch (error) {
    console.error("导出失败:", error);
    return NextResponse.json(
      { error: "導出失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
