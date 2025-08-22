// 手动加载指定的 .env 文件
require('dotenv').config({ path: process.argv[2] || '.env' });
// 启动 Next.js 服务
require('next/dist/bin/next').start();