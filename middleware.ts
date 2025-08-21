import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// 定义需要保护的路由
const protectedRoutes = ["/dashboard", "/profile", "/upload"];
// 定义认证相关路由
const authRoutes = ["/login", "/register", "/forgot-password"];

async function verifyAccessToken(token: string) {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    const { payload } = await jwtVerify(token, secret);
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, payload: null };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // 检查是否为受保护的路由
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  // 检查是否为认证路由
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 如果访问受保护路由但没有token或token无效，重定向到登录页

  if (isProtectedRoute) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // // 验证token有效性 这个后面去看
    // const { valid } = await verifyAccessToken(token)
    // if (!valid) {
    //   const url = request.nextUrl.clone()
    //   url.pathname = '/login'
    //   return NextResponse.redirect(url)
    // }
  }

  // 如果已登录用户访问登录/注册页面，重定向到首页
  if (isAuthRoute && token) {
    // 验证token有效性
    const { valid } = await verifyAccessToken(token);
    if (valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径除了以下开头的路径:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
