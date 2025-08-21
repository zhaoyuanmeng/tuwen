import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { username, name, password } = await request.json();

    // 连接数据库
    const db = await connectToDatabase();

    // 检查用户名是否已存在
    const existingUser = await db.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "用户名已存在",
        },
        { status: 400 }
      );
    }

    // 对密码进行加密
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 创建新用户
    const result = await db.query(
      "INSERT INTO users (username, name, password) VALUES ($1, $2, $3) RETURNING id, username, name",
      [username, name, hashedPassword]
    );

    const newUser = result.rows[0];

    return NextResponse.json({
      success: true,
      message: "注册成功！欢迎加入我们。",
      data: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("注册错误:", error);
    return NextResponse.json(
      {
        success: false,
        error: "注册失败，请稍后重试",
      },
      { status: 500 }
    );
  }
}