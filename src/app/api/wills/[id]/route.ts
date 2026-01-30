import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateWillSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  jurisdiction: z.string().optional(),
  isSigned: z.boolean().optional(),
  isWitnessed: z.boolean().optional(),
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
    const data = updateWillSchema.parse(body);

    // 验证遗嘱是否属于当前用户
    const existingWill = await prisma.will.findUnique({
      where: { id },
    });

    if (!existingWill || existingWill.userId !== session.user.id) {
      return NextResponse.json(
        { error: "遺囑不存在或無權限" },
        { status: 404 }
      );
    }

    const will = await prisma.will.update({
      where: { id },
      data,
    });

    return NextResponse.json({ message: "遺囑更新成功", will });
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

    // 验证遗嘱是否属于当前用户
    const existingWill = await prisma.will.findUnique({
      where: { id },
    });

    if (!existingWill || existingWill.userId !== session.user.id) {
      return NextResponse.json(
        { error: "遺囑不存在或無權限" },
        { status: 404 }
      );
    }

    await prisma.will.delete({
      where: { id },
    });

    return NextResponse.json({ message: "遺囑刪除成功" });
  } catch (error) {
    return NextResponse.json(
      { error: "刪除失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
