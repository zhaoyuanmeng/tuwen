import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'

// 获取照片列表
export async function GET() {
  try {
    // 连接数据库
    const db = await connectToDatabase()
    
    // 查询照片列表
    const result = await db.query(
      'SELECT id, title, description, imageUrl, date, content, createdAt FROM photos ORDER BY createdAt DESC'
    )
    
    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('获取照片失败:', error)
    return NextResponse.json({
      success: false,
      error: '获取照片失败'
    }, { status: 500 })
  }
}