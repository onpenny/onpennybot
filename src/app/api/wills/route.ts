import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createWillSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  jurisdiction: z.string().optional(),
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
    const data = createWillSchema.parse(body);

    const will = await prisma.will.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "遺囑創建成功", will },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
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

    const wills = await prisma.will.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ wills });
  } catch (error) {
    return NextResponse.json(
      { error: "獲取失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
