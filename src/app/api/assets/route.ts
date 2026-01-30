import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createAssetSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["BANK", "INSURANCE", "BROKERAGE", "FUND", "REAL_ESTATE", "CRYPTOCURRENCY", "STOCK", "COLLECTION", "INTELLECTUAL_PROPERTY", "OTHER"]),
  description: z.string().optional(),
  value: z.number().optional(),
  currency: z.string().optional(),
  location: z.enum(["DOMESTIC", "OVERSEAS"]),
  institution: z.string().optional(),
  accountNumber: z.string(),
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
    const data = createAssetSchema.parse(body);

    const asset = await prisma.asset.create({
      data: {
        ...data,
        userId: session.user.id,
        isEncrypted: true,
      },
    });

    return NextResponse.json(
      { message: "資產創建成功", asset },
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

    const assets = await prisma.asset.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ assets });
  } catch (error) {
    return NextResponse.json(
      { error: "獲取失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
