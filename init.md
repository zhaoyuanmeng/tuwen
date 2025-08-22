# 婚纱照个人主题网站

## 介绍
这是个人的婚纱照网站，用于记录自己的生活，记录自己的照片，记录自己的故事。网站采用现代化的前端技术栈，提供流畅的用户体验和优雅的视觉效果。

## 功能
- 用户认证系统（登录、注册、忘记密码）
- 图片和内容上传功能
- 首页展示（包含酷炫的轮播图和优美的动画效果）
- 图文详情展示
- 响应式布局适配各种设备
- 页面路由守卫和权限控制（未登录用户限制访问）

页面风格：简约、大气、动画丝滑

## 技术栈
- 前端框架：Next.js 14 (App Router模式)
- 后端：Node.js
- 数据库：PostgreSQL
- 样式：Tailwind CSS
- 状态管理：React Context API
- 路由守卫：Next.js Middleware
- HTTP客户端：Axios
- 认证：JWT
- 动画效果：Framer Motion
- 响应式设计：Tailwind CSS

## 数据表结构

# 测试
帮我从 路由鉴权、接口鉴权、页面风格、动画风格、骨架屏、边界条件处理、等方面去优化代码自查验


# 启动容器（直接用官方命令，无需挂载.env文件）

docker build -t my-app:prod --build-arg ENV_FILE=.env.production .

docker run -d --name zyd-app-prod -p 3000:3000 -v /zyd/uploads:/app/public/uploads zyd-app:prod