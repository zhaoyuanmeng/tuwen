import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 连接数据库
    const db = await connectToDatabase();

    // 查找用户
    const result = await db.query(
      "SELECT id, username, name, password FROM users WHERE username = $1",
      [username]
    );

    const user = result.rows[0];

    // 验证用户凭据
    if (!user) {
      console.log("用户不存在:", username);
      return NextResponse.json(
        {
          success: false,
          error: "用户名或密码错误",
        },
        { status: 401 }
      );
    }

    // 使用 bcrypt 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log("密码验证失败:", username);
      return NextResponse.json(
        {
          success: false,
          error: "用户名或密码错误",
        },
        { status: 401 }
      );
    }

    // 生成双token
    const accessToken = generateAccessToken({
      id: user.id,
      username: user.username,
    });

    const refreshToken = generateRefreshToken();

    // 存储refresh token到数据库
    await db.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)] // 7天过期
    );

    return NextResponse.json({
      success: true,
      message: "登录成功",
      data: {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("登录错误:", error);
    return NextResponse.json(
      {
        success: false,
        error: "登录失败，请稍后重试",
      },
      { status: 500 }
    );
  }
}