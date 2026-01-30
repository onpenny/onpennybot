import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createFamilyMemberSchema = z.object({
  name: z.string().min(1),
  relationship: z.enum(["BLOOD", "ADOPTED", "MARRIAGE", "PARTNER"]),
  isAlive: z.boolean(),
  dateOfBirth: z.string().optional(),
  dateOfDeath: z.string().optional(),
  notes: z.string().optional(),
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
    const data = createFamilyMemberSchema.parse(body);

    const member = await prisma.familyMember.create({
      data: {
        ...data,
        userId: session.user.id,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        dateOfDeath: data.dateOfDeath ? new Date(data.dateOfDeath) : undefined,
      },
    });

    return NextResponse.json(
      { message: "成員創建成功", member },
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

    const members = await prisma.familyMember.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        parent: true,
        children: true,
        spouse: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ members });
  } catch (error) {
    return NextResponse.json(
      { error: "獲取失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
