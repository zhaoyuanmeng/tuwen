import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'

// 根据ID获取照片详情
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: '无效的照片ID'
      }, { status: 400 })
    }
    
    // 连接数据库
    const db = await connectToDatabase()
    
    // 查询照片
    const result = await db.query(
      'SELECT id, title, description, imageUrl, date, content, createdAt FROM photos WHERE id = $1',
      [id]
    )
    
    const photo = result.rows[0]
    
    if (!photo) {
      return NextResponse.json({
        success: false,
        error: '照片未找到'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: photo
    })
  } catch (error) {
    console.error('获取照片详情失败:', error)
    return NextResponse.json({
      success: false,
      error: '获取照片详情失败'
    }, { status: 500 })
  }
}