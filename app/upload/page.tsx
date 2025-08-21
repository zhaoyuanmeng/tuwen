'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Upload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('content', content)
      if (image) {
        formData.append('image', image)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        // 上传成功后跳转到相册页面
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(result.error || '发布失败，请稍后重试')
      }
    } catch (err) {
      setError('发布失败，请稍后重试')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-2xl font-bold text-secondary-900">发布图文</h1>
            <div></div> {/* 占位元素，用于保持标题居中 */}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {error}
                </div>
              </div>
            )}

            {/* 标题 */}
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-secondary-900 mb-2">
                标题
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="请输入标题"
                required
              />
            </div>

            {/* 描述 */}
            <div>
              <label htmlFor="description" className="block text-lg font-medium text-secondary-900 mb-2">
                简短描述
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="请输入简短描述"
                required
              />
            </div>

            {/* 图片上传 */}
            <div>
              <label className="block text-lg font-medium text-secondary-900 mb-2">
                封面图片
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-secondary-300 rounded-lg">
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="mb-4">
                      <img 
                        src={previewUrl} 
                        alt="预览图片" 
                        className="mx-auto max-h-64 rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex text-sm text-secondary-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>上传图片</span>
                        <input 
                          type="file" 
                          className="sr-only" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          required
                        />
                      </label>
                      <p className="pl-1">或拖拽图片到此处</p>
                    </div>
                  )}
                  <p className="text-xs text-secondary-500">
                    PNG, JPG, GIF 最大20MB
                  </p>
                </div>
              </div>
            </div>

            {/* 正文内容 */}
            <div>
              <label htmlFor="content" className="block text-lg font-medium text-secondary-900 mb-2">
                正文内容
              </label>
              <textarea
                id="content"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="请输入正文内容，支持HTML格式"
                required
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-4">
              <Link 
                href="/dashboard"
                className="px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? '发布中...' : '发布'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}