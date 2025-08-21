"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface PhotoItem {
  id: number;
  title: string;
  description: string;
  imageurl: string;
  date: string;
}

export default function Dashboard() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("Dashboard component mounted.");
    // 检查用户是否已登录
    const checkAuth = () => {
      // 获取所有cookie并解析
      const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [name, value] = cookie.split("=");
        acc[name] = value;
        return acc;
      }, {} as { [key: string]: string });

      const accessToken = cookies.accessToken;

      // 简化token检查逻辑
      if (!accessToken) {
        router.replace("/login");
        return false;
      }

      return true;
    };

    if (!checkAuth()) {
      return;
    }

    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/photos");
        const result = await response.json();

        if (result.success) {
          // 格式化日期显示
          const formattedPhotos = result.data.map((photo: any) => ({
            ...photo,
            // 处理图片路径，添加安全检查确保imageurl存在且为字符串
            imageurl: photo.imageurl && typeof photo.imageurl === 'string' && photo.imageurl.startsWith('/uploads/') 
              ? photo.imageurl 
              : `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
            date: new Date(photo.date).toLocaleDateString("zh-CN"),
          }));
          setPhotos(formattedPhotos);
        }
      } catch (error) {
        console.error("获取照片失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [router]);

  const handleLogout = () => {
    // 清除认证信息
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // 跳转到登录页面
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-secondary-900">
                我的相册
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                发布图文
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                登出
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* 返回首页按钮 - 悬浮在右侧中间 */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-10">
        <Link 
          href="/"
          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 text-primary-600 hover:text-primary-800"
          title="返回首页"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-secondary-900">
                精选照片
              </h2>
              <p className="mt-2 text-secondary-600">记录我们每一个美好瞬间</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/photo/${photo.id}`}>
                    <div className="relative pb-[75%]">
                      {" "}
                      {/* 4:3 Aspect Ratio */}
                      <img
                        src={photo.imageurl}
                        alt={photo.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-secondary-900 mb-2">
                        {photo.title}
                      </h3>
                      <p className="text-secondary-600 mb-4 line-clamp-2">
                        {photo.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary-500">
                          {photo.date}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                          查看详情
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}