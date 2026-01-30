import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateInheritanceSchema = z.object({
  assetId: z.string().optional(),
  heirId: z.string().optional(),
  percentage: z.number().min(0).max(100).optional(),
  conditions: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "DISPUTED"]).optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const data = updateInheritanceSchema.parse(body);

    // 验证继承规则是否属于当前用户
    const existingInheritance = await prisma.inheritance.findUnique({
      where: { id },
      include: {
        asset: true,
        heir: true,
      },
    });

    if (!existingInheritance || existingInheritance.userId !== session.user.id) {
      return NextResponse.json(
        { error: "繼承規則不存在或無權限" },
        { status: 404 }
      );
    }

    // 如果更新资产或继承人，验证它们属于当前用户
    if (data.assetId) {
      const asset = await prisma.asset.findUnique({
        where: { id: data.assetId },
      });
      if (!asset || asset.userId !== session.user.id) {
        return NextResponse.json(
          { error: "資產不存在或無權限" },
          { status: 404 }
        );
      }
    }

    if (data.heirId) {
      const heir = await prisma.familyMember.findUnique({
        where: { id: data.heirId },
      });
      if (!heir || heir.userId !== session.user.id) {
        return NextResponse.json(
          { error: "繼承人不存在或無權限" },
          { status: 404 }
        );
      }
    }

    const inheritance = await prisma.inheritance.update({
      where: { id },
      data,
    });

    return NextResponse.json({ message: "繼承規則更新成功", inheritance });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "更新失敗，請稍後再試" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // 验证继承规则是否属于当前用户
    const existingInheritance = await prisma.inheritance.findUnique({
      where: { id },
    });

    if (!existingInheritance || existingInheritance.userId !== session.user.id) {
      return NextResponse.json(
        { error: "繼承規則不存在或無權限" },
        { status: 404 }
      );
    }

    await prisma.inheritance.delete({
      where: { id },
    });

    return NextResponse.json({ message: "繼承規則刪除成功" });
  } catch (error) {
    return NextResponse.json(
      { error: "刪除失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
