const dotenv = require('dotenv');
const { spawn } = require('child_process');
const path = require('path');

// 从命令行参数获取.env文件路径（默认使用.env）
const envFilePath = process.argv[2] || '.env';
console.log(`正在加载环境文件：${envFilePath}`);

// 加载指定的.env文件
const loadResult = dotenv.config({ path: envFilePath });
if (loadResult.error) {
  console.error('❌ 环境文件加载失败：', loadResult.error.message);
  process.exit(1);
}

// 拼接本地next命令路径（避免依赖全局npx）
const nextExecutablePath = path.join(__dirname, '../node_modules/next/dist/bin/next');

// 启动Next.js服务（传递加载的环境变量）
const nextProcess = spawn('node', [nextExecutablePath, 'start'], {
  stdio: 'inherit', // 显示Next.js日志
  env: { ...process.env, ...loadResult.parsed } // 合并环境变量
});

// 监听进程事件
nextProcess.on('exit', (code) => {
  console.log(`应用进程退出，状态码：${code}`);
  process.exit(code);
});

nextProcess.on('error', (err) => {
  console.error('❌ 应用启动失败：', err.message);
  process.exit(1);
});
