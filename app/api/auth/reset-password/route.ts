import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const { identifier, newPassword } = await request.json();

    // 连接数据库
    const db = await connectToDatabase();

    // 查找用户（通过用户名或邮箱）
    const result = await db.query(
      "SELECT id FROM users WHERE username = $1",
      [identifier]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "用户不存在",
        },
        { status: 404 }
      );
    }

    // 更新密码（注意：实际应用中需要加密密码）
    await db.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [newPassword, user.id]
    );

    return NextResponse.json({
      success: true,
      message: "密码重置成功",
    });
  } catch (error) {
    console.error("重置密码错误:", error);
    return NextResponse.json(
      {
        success: false,
        error: "密码重置失败，请稍后重试",
      },
      { status: 500 }
    );
  }
}