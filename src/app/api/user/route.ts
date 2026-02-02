import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

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
    const action = body.action;

    if (action === "profile") {
      const data = updateProfileSchema.parse(body);

      // 更新个人资料
      const user = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: data.name,
          email: data.email,
        },
      });

      return NextResponse.json({
        message: "個人資料更新成功",
        user,
      });
    } else if (action === "password") {
      const data = changePasswordSchema.parse(body);

      // 验证当前密码
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!currentUser || !currentUser.passwordHash) {
        return NextResponse.json(
          { error: "用戶不存在或使用第三方登入" },
          { status: 400 }
        );
      }

      const isValidPassword = await bcrypt.compare(
        data.currentPassword,
        currentUser.passwordHash
      );

      if (!isValidPassword) {
        return NextResponse.json(
          { error: "當前密碼錯誤" },
          { status: 400 }
        );
      }

      // 更新密码
      const passwordHash = await bcrypt.hash(data.newPassword, 12);

      await prisma.user.update({
        where: { id: session.user.id },
        data: { passwordHash },
      });

      return NextResponse.json({ message: "密碼修改成功" });
    } else {
      return NextResponse.json(
        { error: "無效的操作" },
        { status: 400 }
      );
    }
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

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    // 删除用户账户（级联删除）
    await prisma.inheritance.deleteMany({
      where: { userId: session.user.id },
    });

    await prisma.will.deleteMany({
      where: { userId: session.user.id },
    });

    await prisma.familyMember.deleteMany({
      where: { userId: session.user.id },
    });

    await prisma.asset.deleteMany({
      where: { userId: session.user.id },
    });

    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ message: "賬戶刪除成功" });
  } catch (error) {
    return NextResponse.json(
      { error: "刪除失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
