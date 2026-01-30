import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateFamilyMemberSchema = z.object({
  name: z.string().min(1).optional(),
  relationship: z.enum(["BLOOD", "ADOPTED", "MARRIAGE", "PARTNER"]).optional(),
  isAlive: z.boolean().optional(),
  dateOfBirth: z.string().optional(),
  dateOfDeath: z.string().optional(),
  notes: z.string().optional(),
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
    const data = updateFamilyMemberSchema.parse(body);

    // 验证成员是否属于当前用户
    const existingMember = await prisma.familyMember.findUnique({
      where: { id },
    });

    if (!existingMember || existingMember.userId !== session.user.id) {
      return NextResponse.json(
        { error: "成員不存在或無權限" },
        { status: 404 }
      );
    }

    const member = await prisma.familyMember.update({
      where: { id },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        dateOfDeath: data.dateOfDeath ? new Date(data.dateOfDeath) : undefined,
      },
    });

    return NextResponse.json({ message: "成員更新成功", member });
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

    // 验证成员是否属于当前用户
    const existingMember = await prisma.familyMember.findUnique({
      where: { id },
    });

    if (!existingMember || existingMember.userId !== session.user.id) {
      return NextResponse.json(
        { error: "成員不存在或無權限" },
        { status: 404 }
      );
    }

    await prisma.familyMember.delete({
      where: { id },
    });

    return NextResponse.json({ message: "成員刪除成功" });
  } catch (error) {
    return NextResponse.json(
      { error: "刪除失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
