import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reminderSchema = z.object({
  type: z.enum(["ASSET_UPDATE", "INSURANCE_EXPIRED", "ID_CARD_EXPIRED", "BIRTHDAY"]),
  title: z.string().min(1),
  message: z.string().min(1),
  assetId: z.string().optional(),
  memberId: z.string().optional(),
  remindAt: z.string().datetime().optional(),
});

const preferencesSchema = z.object({
  assetUpdateDays: z.number().int().positive().optional(),
  insuranceExpiryDays: z.number().int().positive().optional(),
  idCardExpiryDays: z.number().int().positive().optional(),
  birthdayReminderDays: z.number().int().positive().optional(),
});

// GET /api/reminders - 获取所有提醒
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const reminders = await prisma.reminder.findMany({
      where: {
        userId: session.user.id,
        isRead: false,
        remindAt: {
          lte: new Date(),
        },
      },
      orderBy: {
        remindAt: "asc",
      },
      include: {
        asset: true,
        member: true,
      },
    });

    return NextResponse.json({ reminders });
  } catch (error) {
    console.error("获取提醒失败:", error);
    return NextResponse.json(
      { error: "獲取提醒失敗" },
      { status: 500 }
    );
  }
}

// POST /api/reminders - 创建提醒
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
    const validatedData = reminderSchema.parse(body);

    const reminder = await prisma.reminder.create({
      userId: session.user.id,
      ...validatedData,
      remindAt: validatedData.remindAt ? new Date(validatedData.remindAt) : new Date(),
    });

    return NextResponse.json({
      message: "提醒創建成功",
      reminder,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("创建提醒失败:", error);
    return NextResponse.json(
      { error: "創建提醒失敗" },
      { status: 500 }
    );
  }
}

// PATCH /api/reminders/[id]/read - 标记已读
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const reminder = await prisma.reminder.updateMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      message: "提醒已標記為已讀",
    });
  } catch (error) {
    console.error("标记已读失败:", error);
    return NextResponse.json(
      { error: "標記已讀失敗" },
      { status: 500 }
    );
  }
}

// DELETE /api/reminders/[id] - 删除提醒
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    await prisma.reminder.deleteMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: "提醒刪除成功",
    });
  } catch (error) {
    console.error("刪除提醒失败:", error);
    return NextResponse.json(
      { error: "刪除提醒失敗" },
      { status: 500 }
    );
  }
}

// GET /api/reminders/preferences - 获取提醒偏好
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const preferences = await prisma.reminderPreferences.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    return NextResponse.json(
      { error: "獲取偏好失敗" },
      { status: 500 }
    );
  }
}

// PUT /api/reminders/preferences - 更新提醒偏好
export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = preferencesSchema.parse(body);

    const preferences = await prisma.reminderPreferences.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...validatedData,
      },
      update: {
        ...validatedData,
      },
    });

    return NextResponse.json({
      message: "偏好更新成功",
      preferences,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("更新偏好失败:", error);
    return NextResponse.json(
      { error: "更新偏好失敗" },
      { status: 500 }
    );
  }
}
