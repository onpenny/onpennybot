export { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "未找到文件" },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "不支持的文件類型" },
        { status: 400 }
      );
    }

    // 验证文件大小（最大 10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "文件大小不能超過 10MB" },
        { status: 400 }
      );
    }

    // 确保上传目录存在
    const uploadsDir = join(process.cwd(), "public", "uploads", session.user.id);
    await mkdir(uploadsDir, { recursive: true });

    // 生成唯一文件名
    const fileExtension = file.name.split(".").pop();
    const fileName = `${nanoid()}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // 保存文件
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    return NextResponse.json({
      message: "文件上傳成功",
      url: `/uploads/${session.user.id}/${fileName}`,
      fileName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("上傳失敗:", error);
    return NextResponse.json(
      { error: "上傳失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
