const dotenv = require('dotenv');
const { spawn } = require('child_process');
const path = require('path');

// 从命令行参数获取.env文件路径（默认用.env.production）
const envFilePath = process.argv[2] || '.env.production';
console.log(`构建 - 加载环境文件：${envFilePath}`);

// 加载指定的.env文件
const loadResult = dotenv.config({ path: envFilePath });
if (loadResult.error) {
  console.error('❌ 环境文件加载失败：', loadResult.error.message);
  process.exit(1);
}

// 拼接本地next build命令路径
const nextBuildPath = path.join(__dirname, '../node_modules/next/dist/bin/next');

// 执行构建命令（next build）
const buildProcess = spawn('node', [nextBuildPath, 'build'], {
  stdio: 'inherit', // 显示构建日志
  env: { ...process.env, ...loadResult.parsed } // 注入环境变量
});

// 监听构建结果
buildProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ 构建成功');
  } else {
    console.error(`❌ 构建失败，状态码：${code}`);
  }
  process.exit(code);
});

buildProcess.on('error', (err) => {
  console.error('❌ 构建进程启动失败：', err.message);
  process.exit(1);
});
