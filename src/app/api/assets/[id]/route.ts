import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateAssetSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(["BANK", "INSURANCE", "BROKERAGE", "FUND", "REAL_ESTATE", "CRYPTOCURRENCY", "STOCK", "COLLECTION", "INTELLECTUAL_PROPERTY", "OTHER"]).optional(),
  description: z.string().optional(),
  value: z.number().optional(),
  currency: z.string().optional(),
  location: z.enum(["DOMESTIC", "OVERSEAS"]).optional(),
  institution: z.string().optional(),
  accountNumber: z.string().optional(),
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
    const data = updateAssetSchema.parse(body);

    // 验证资产是否属于当前用户
    const existingAsset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!existingAsset || existingAsset.userId !== session.user.id) {
      return NextResponse.json(
        { error: "資產不存在或無權限" },
        { status: 404 }
      );
    }

    const asset = await prisma.asset.update({
      where: { id },
      data,
    });

    return NextResponse.json({ message: "資產更新成功", asset });
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

    // 验证资产是否属于当前用户
    const existingAsset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!existingAsset || existingAsset.userId !== session.user.id) {
      return NextResponse.json(
        { error: "資產不存在或無權限" },
        { status: 404 }
      );
    }

    await prisma.asset.delete({
      where: { id },
    });

    return NextResponse.json({ message: "資產刪除成功" });
  } catch (error) {
    return NextResponse.json(
      { error: "刪除失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
