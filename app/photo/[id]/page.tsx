'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PhotoDetail {
  id: number
  title: string
  description: string
  imageurl: string
  date: string
  content: string
}

export default function PhotoDetailPage({ params }: { params: { id: string } }) {
  const [photo, setPhoto] = useState<PhotoDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPhoto = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/photos/${params.id}`)
        const result = await response.json()
        
        if (result.success) {
          // 处理图片路径，添加安全检查确保imageurl存在且为字符串
          const photoData = {
            ...result.data,
            imageurl: result.data.imageurl && typeof result.data.imageurl === 'string' && result.data.imageurl.startsWith('/uploads/')
              ? result.data.imageurl
              : `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
          };
          setPhoto(photoData);
        }
      } catch (error) {
        console.error('获取照片详情失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPhoto()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!photo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">照片未找到</h2>
          <button 
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            返回上一页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-secondary-900 hover:text-primary-600">
                ← 返回相册
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 图片展示 */}
          <div className="relative">
            <img
              src={photo.imageurl}
              alt={photo.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* 内容区域 */}
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">{photo.title}</h1>
              <div className="flex items-center text-secondary-500">
                <span>{new Date(photo.date).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-secondary-600 text-lg mb-6">{photo.description}</p>
              
              <div 
                className="text-secondary-800"
                dangerouslySetInnerHTML={{ __html: photo.content }} 
              />
            </div>
          </div>
        </article>

        {/* 相关操作 */}
        <div className="mt-8 flex justify-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            返回相册
          </Link>
        </div>
      </main>
    </div>
  )
}