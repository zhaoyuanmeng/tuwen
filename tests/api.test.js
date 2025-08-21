// API测试脚本 - tests/api.test.js

const fetch = require('node-fetch');
const fs = require('fs');

// 测试配置
const BASE_URL = 'http://localhost:3000';
let accessToken = '';
let refreshToken = '';

console.log('开始API测试流程...\n');

async function testLogin() {
  console.log('1. 测试登录接口...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      accessToken = data.data.accessToken;
      refreshToken = data.data.refreshToken;
      console.log('✅ 登录成功');
      console.log(`   Access Token: ${accessToken.substring(0, 20)}...`);
      console.log(`   Refresh Token: ${refreshToken.substring(0, 20)}...`);
    } else {
      console.log('❌ 登录失败:', data.error);
    }
  } catch (error) {
    console.log('❌ 登录接口错误:', error.message);
  }
}

async function testGetPhotos() {
  console.log('\n2. 测试获取照片列表接口...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/photos`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ 获取照片列表成功，共${data.data.length}张照片`);
      if (data.data.length > 0) {
        console.log(`   第一张照片: ${data.data[0].title}`);
      }
    } else {
      console.log('❌ 获取照片列表失败:', data.error);
    }
  } catch (error) {
    console.log('❌ 获取照片列表接口错误:', error.message);
  }
}

async function testGetPhotoDetail() {
  console.log('\n3. 测试获取照片详情接口...');
  
  try {
    // 先获取一张照片的ID
    const listResponse = await fetch(`${BASE_URL}/api/photos`);
    const listData = await listResponse.json();
    
    if (listData.success && listData.data.length > 0) {
      const photoId = listData.data[0].id;
      
      const response = await fetch(`${BASE_URL}/api/photos/${photoId}`);
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ 获取照片详情成功: ${data.data.title}`);
      } else {
        console.log('❌ 获取照片详情失败:', data.error);
      }
    } else {
      console.log('⚠️  没有可测试的照片');
    }
  } catch (error) {
    console.log('❌ 获取照片详情接口错误:', error.message);
  }
}

async function testRefreshToken() {
  console.log('\n4. 测试刷新token接口...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: refreshToken
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      accessToken = data.data.accessToken;
      console.log('✅ Token刷新成功');
      console.log(`   New Access Token: ${accessToken.substring(0, 20)}...`);
    } else {
      console.log('❌ Token刷新失败:', data.error);
    }
  } catch (error) {
    console.log('❌ 刷新token接口错误:', error.message);
  }
}

async function testUploadPhoto() {
  console.log('\n5. 测试上传照片接口...');
  
  try {
    // 创建测试表单数据
    const formData = new FormData();
    formData.append('title', '测试照片');
    formData.append('description', '这是一张测试照片');
    formData.append('content', '<p>这是照片的详细内容</p>');
    
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 照片上传成功');
      console.log(`   照片ID: ${data.data.id}`);
      console.log(`   照片标题: ${data.data.title}`);
    } else {
      console.log('❌ 照片上传失败:', data.error);
    }
  } catch (error) {
    console.log('❌ 上传照片接口错误:', error.message);
  }
}

async function testLogout() {
  console.log('\n6. 测试登出接口...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: refreshToken
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 登出成功');
    } else {
      console.log('❌ 登出失败:', data.error);
    }
  } catch (error) {
    console.log('❌ 登出接口错误:', error.message);
  }
}

// 运行所有测试
async function runAllTests() {
  await testLogin();
  await testGetPhotos();
  await testGetPhotoDetail();
  await testRefreshToken();
  await testUploadPhoto();
  await testLogout();
  
  console.log('\n🏁 所有测试完成');
}

// 如果直接运行此脚本，则执行测试
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testLogin,
  testGetPhotos,
  testGetPhotoDetail,
  testRefreshToken,
  testUploadPhoto,
  testLogout,
  runAllTests
};