import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { generateAccessToken } from '@/lib/auth'

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
    
    // 验证refresh token
    const result = await db.query(
      'SELECT user_id, expires_at FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    )
    
    const tokenRecord = result.rows[0]
    
    if (!tokenRecord) {
      return NextResponse.json({
        success: false,
        error: '无效或过期的refresh token'
      }, { status: 401 })
    }
    
    // 获取用户信息
    const userResult = await db.query(
      'SELECT id, username, name FROM users WHERE id = $1',
      [tokenRecord.user_id]
    )
    
    const user = userResult.rows[0]
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 404 })
    }
    
    // 生成新的access token
    const newAccessToken = generateAccessToken({ 
      id: user.id, 
      username: user.username 
    })
    
    return NextResponse.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          username: user.username,
          name: user.name
        }
      }
    })
  } catch (error) {
    console.error('Token刷新错误:', error)
    return NextResponse.json({
      success: false,
      error: 'Token刷新失败'
    }, { status: 500 })
  }
}