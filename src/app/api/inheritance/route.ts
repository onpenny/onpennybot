import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createInheritanceSchema = z.object({
  assetId: z.string(),
  heirId: z.string(),
  percentage: z.number().min(0).max(100),
  conditions: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const data = createInheritanceSchema.parse(body);

    // 验证资产和继承人是否属于当前用户
    const [asset, heir] = await Promise.all([
      prisma.asset.findUnique({
        where: { id: data.assetId },
      }),
      prisma.familyMember.findUnique({
        where: { id: data.heirId },
      }),
    ]);

    if (!asset || asset.userId !== session.user.id) {
      return NextResponse.json(
        { error: "資產不存在或無權限" },
        { status: 404 }
      );
    }

    if (!heir || heir.userId !== session.user.id) {
      return NextResponse.json(
        { error: "繼承人不存在或無權限" },
        { status: 404 }
      );
    }

    const inheritance = await prisma.inheritance.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "繼承規則創建成功", inheritance },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "創建失敗，請稍後再試" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const inheritances = await prisma.inheritance.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        asset: true,
        heir: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ inheritances });
  } catch (error) {
    return NextResponse.json(
      { error: "獲取失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
