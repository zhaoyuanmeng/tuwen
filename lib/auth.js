// 简单实现，实际项目中应使用JWT库
export function generateAccessToken(payload) {
  // 实际项目中应使用JWT库生成token
  return `access-token-${Date.now()}-${Math.random()}`
}

export function generateRefreshToken() {
  // 实际项目中应使用加密安全的方式生成token
  return `refresh-token-${Date.now()}-${Math.random()}`
}

export function verifyAccessToken(token) {
  // 实际项目中应验证JWT token
  return { valid: true, payload: { id: 1, username: 'test' } }
}