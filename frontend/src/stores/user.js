import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('winters_token') || '');
  const refreshToken = ref(localStorage.getItem('winters_refresh_token') || '');
  let parsedUser = null;
  try { parsedUser = JSON.parse(localStorage.getItem('winters_user') || 'null'); } catch { parsedUser = null; }
  const user = ref(parsedUser);

  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!user.value);
  const username = computed(() => user.value?.nickname || user.value?.username || 'User');
  const userId = computed(() => user.value?.id || null);

  // 登录（密码登录）
  async function login(account, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || '登录失败');

      token.value = data.token;
      user.value = data.user;

      localStorage.setItem('winters_token', data.token);
      localStorage.setItem('winters_user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 注册
  async function register(account, password, confirmPassword) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, password, confirm_password: confirmPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || '注册失败');

      // 注册成功自动登录
      return await login(account, password);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 登出
  function logout() {
    token.value = '';
    refreshToken.value = '';
    user.value = null;

    localStorage.removeItem('winters_token');
    localStorage.removeItem('winters_refresh_token');
    localStorage.removeItem('winters_user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  }

  // 获取认证请求头
  function getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    };
  }

  // 更新用户信息
  async function updateUserInfo(updates) {
    try {
      // 本地模拟更新逻辑
      await new Promise(resolve => setTimeout(resolve, 500));

      // 更新本地用户信息
      user.value = { ...user.value, ...updates };

      // 持久化
      localStorage.setItem('winters_user', JSON.stringify(user.value));
      if (updates.username || updates.nickname) {
        localStorage.setItem('username', updates.username || updates.nickname || user.value.username);
      }

      return { success: true, user: user.value };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 获取用户详情
  async function getUserInfo() {
    try {
      // 本地模拟获取用户信息
      await new Promise(resolve => setTimeout(resolve, 300));

      // 如果用户信息不存在，返回空对象
      if (!user.value) {
        return { success: false, error: '用户未登录' };
      }

      return { success: true, user: user.value };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 刷新令牌
  async function refreshTokenFunc() {
    try {
      // 本地模拟刷新令牌
      await new Promise(resolve => setTimeout(resolve, 300));

      const newToken = 'mock_token_' + Date.now();
      const newRefreshToken = 'mock_refresh_' + Date.now();

      token.value = newToken;
      refreshToken.value = newRefreshToken;

      localStorage.setItem('winters_token', newToken);
      localStorage.setItem('winters_refresh_token', newRefreshToken);

      return { success: true, token: newToken };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  return {
    token,
    refreshToken,
    user,
    isLoggedIn,
    username,
    userId,
    login,
    register,
    logout,
    getAuthHeaders,
    updateUserInfo,
    getUserInfo,
    refreshTokenFunc,
  };
});
