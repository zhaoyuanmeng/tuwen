"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 检查用户登录状态
    const checkLoginStatus = () => {
      const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [name, value] = cookie.split("=");
        acc[name] = value;
        return acc;
      }, {} as { [key: string]: string });

      const accessToken = cookies.accessToken;
      setIsLoggedIn(!!accessToken);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    // 获取轮播图数据
    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/photos");
        const result = await response.json();

        if (result.success) {
          console.log("获取轮播图数据成功:", result.data);
          setPhotos([
            {
              id: 1,
              title: "海边浪漫时光",
              imageurl:
                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
            },
            {
              id: 2,
              title: "花园中的誓言",
              imageurl:
                "https://images.unsplash.com/photo-1511798616182-aab3698ac53e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
            },
            {
              id: 3,
              title: "城市夜景",
              imageurl:
                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
            },
          ]);
          // setPhotos(result.data.slice(0, 5)); // 取前5张作为轮播图
        }
      } catch (error) {
        console.error("获取轮播图数据失败:", error);
        // 如果API失败，使用默认图片
        setPhotos([
          {
            id: 1,
            title: "海边浪漫时光",
            imageurl:
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
          },
          {
            id: 2,
            title: "花园中的誓言",
            imageurl:
              "https://images.unsplash.com/photo-1511798616182-aab3698ac53e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
          },
          {
            id: 3,
            title: "城市夜景",
            imageurl:
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
          },
        ]);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [photos.length]);

  const handleDashboardRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {photos.length > 0 ? (
          <>
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url('${photo.imageurl}')`,
                }}
              ></div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 z-10"></div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1511798616182-aab3698ac53e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 z-10"></div>
          </>
        )}

        <div className="relative z-20 text-center text-white px-4">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            爱的见证
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            记录我们的美好时光，分享幸福的每一个瞬间
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {isLoggedIn ? (
              <button
                onClick={handleDashboardRedirect}
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
              >
                进入相册
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
              >
                查看相册
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              我们的故事
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              用镜头记录爱情，用影像讲述故事
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "精美相册",
                description: "高质量婚纱照展示，多种风格任您欣赏",
                icon: "📸",
              },
              {
                title: "故事分享",
                description: "记录拍摄背后的故事和美好回忆",
                icon: "📖",
              },
              {
                title: "私人定制",
                description: "专属您的个性化展示空间",
                icon: "✨",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-secondary-50 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              开启您的专属相册
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              注册账户，创建属于您和TA的专属婚纱照展示空间
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="bg-white text-primary-600 hover:bg-secondary-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300"
              >
                立即注册
              </Link>
              <Link
                href="/login"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-full text-lg transition duration-300"
              >
                登录账户
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
