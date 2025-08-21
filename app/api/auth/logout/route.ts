import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json()
    
    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        error: '缺少refresh token'
      }, { status: 400 })
    }
    
    // 连接数据库
    const db = await connectToDatabase()
    
    // 删除refresh token
    await db.query(
      'DELETE FROM refresh_tokens WHERE token = $1',
      [refreshToken]
    )
    
    return NextResponse.json({
      success: true,
      message: '登出成功'
    })
  } catch (error) {
    console.error('登出错误:', error)
    return NextResponse.json({
      success: false,
      error: '登出失败'
    }, { status: 500 })
  }
}