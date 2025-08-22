# 基础镜像
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g pnpm
RUN pnpm install

# 构建阶段（注入对应环境的变量）
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建时通过脚本加载指定.env文件（变量会被静态注入到代码）
ARG ENV_FILE=.env.production
RUN node scripts/build-with-env.js $ENV_FILE

# 生产阶段
FROM base AS runner
WORKDIR /app

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物（已包含环境变量）
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 图片上传目录
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

USER nextjs
EXPOSE 3000

# 直接启动官方服务入口（变量已在构建时注入，无需再加载.env）
CMD ["npm", "start"]