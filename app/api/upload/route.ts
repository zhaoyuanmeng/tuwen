import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'

// 处理图片上传
export async function POST(request: Request) {
  try {
    // 获取上传的数据
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const content = formData.get('content') as string
    const image = formData.get('image') as File | null
    
    if (!image) {
      return NextResponse.json({
        success: false,
        error: '缺少图片文件'
      }, { status: 400 })
    }
    
    // 生成唯一文件名
    const fileExtension = image.name.split('.').pop()
    const fileName = `${nanoid()}.${fileExtension}`
    
    // 确保存储目录存在
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    const filePath = join(uploadDir, fileName)
    const relativePath = `/uploads/${fileName}`
    
    // 将文件保存到 public/uploads 目录
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    try {
      await mkdir(uploadDir, { recursive: true })
      await writeFile(filePath, buffer)
    } catch (error) {
      console.error('文件保存失败:', error)
      return NextResponse.json({
        success: false,
        error: '文件保存失败'
      }, { status: 500 })
    }
    
    // 连接数据库
    const db = await connectToDatabase()
    
    // 保存到数据库
    const result = await db.query(
      'INSERT INTO photos (title, description, content, imageUrl, date, createdAt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [
        title,
        description,
        content,
        relativePath, // 存储相对路径
        new Date(),
        new Date()
      ]
    )

    const newPhoto = {
      id: result.rows[0].id,
      title,
      description,
      content,
      imageUrl: relativePath, // 返回相对路径
      date: new Date()
    }

    return NextResponse.json({
      success: true,
      message: '发布成功',
      data: newPhoto
    })
  } catch (error) {
    console.error('发布失败:', error)
    return NextResponse.json({
      success: false,
      error: '发布失败，请稍后重试'
    }, { status: 500 })
  }
}