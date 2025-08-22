const dotenv = require('dotenv');
const { spawn } = require('child_process');
const path = require('path');

// 从命令行参数获取要加载的.env文件路径（默认用.env.development）
const envFilePath = process.argv[2] || '.env.development';
console.log(`开发模式 - 加载环境文件：${envFilePath}`);

// 加载指定的.env文件
const loadResult = dotenv.config({ path: envFilePath });
if (loadResult.error) {
  console.error('❌ 环境文件加载失败：', loadResult.error.message);
  process.exit(1);
}

// 拼接本地next开发服务器路径
const nextDevPath = path.join(__dirname, '../node_modules/next/dist/bin/next');

// 启动开发服务器（next dev），保留热更新特性
const devProcess = spawn('node', [nextDevPath, 'dev'], {
  stdio: 'inherit', // 继承终端输出，保留开发日志
  env: { ...process.env, ...loadResult.parsed, NODE_ENV: 'development' } // 强制开发环境
});

// 监听进程事件
devProcess.on('exit', (code) => {
  console.log(`开发服务器退出，状态码：${code}`);
  process.exit(code);
});

devProcess.on('error', (err) => {
  console.error('❌ 开发服务器启动失败：', err.message);
  process.exit(1);
});
