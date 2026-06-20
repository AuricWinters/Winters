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
  async function register(account, password, confirmPassword, extra = {}) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, password, confirm_password: confirmPassword, ...extra })
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

  // 更新用户信息（真API）
  async function updateUserInfo(updates) {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || '更新失败');
      user.value = data.user;
      localStorage.setItem('winters_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 获取用户详情（从服务器）
  async function getUserInfo() {
    try {
      const res = await fetch('/api/user/me', { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || '获取失败');
      user.value = data;
      localStorage.setItem('winters_user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 注销账户
  async function deleteAccount() {
    try {
      const res = await fetch('/api/user/account', { method: 'DELETE', headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || '注销失败');
      logout();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  return {
    token, refreshToken, user, isLoggedIn, username, userId,
    login, register, logout, getAuthHeaders,
    updateUserInfo, getUserInfo, deleteAccount,
  };
});
