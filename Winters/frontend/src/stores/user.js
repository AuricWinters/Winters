import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('winters_token') || '');
  const refreshToken = ref(localStorage.getItem('winters_refresh_token') || '');
  const user = ref(JSON.parse(localStorage.getItem('winters_user') || 'null'));

  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!user.value);
  const username = computed(() => user.value?.username || user.value?.nickname || 'User');
  const userId = computed(() => user.value?.id || null);

  // 登录（支持密码和验证码登录）
  async function login(identifier, password, isCodeLogin = false) {
    try {
      if (!identifier) {
        throw new Error('账号不能为空');
      }

      if (!isCodeLogin && !password) {
        throw new Error('密码不能为空');
      }

      if (isCodeLogin && !password) {
        throw new Error('验证码不能为空');
      }

      // 本地模拟登录逻辑
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 生成脱敏的手机号格式：111****1111
      const maskedPhone = identifier.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      
      const mockUser = {
        id: Date.now(),
        username: maskedPhone,
        phone: identifier,
        nickname: maskedPhone,
        email: '',
        avatar: '',
        bio: '',
        createdAt: new Date().toISOString()
      };

      const mockData = {
        access_token: 'mock_token_' + Date.now(),
        refresh_token: 'mock_refresh_' + Date.now(),
        user: mockUser
      };

      // 保存状态
      token.value = mockData.access_token;
      refreshToken.value = mockData.refresh_token;
      user.value = mockData.user;

      // 持久化
      localStorage.setItem('winters_token', mockData.access_token);
      localStorage.setItem('winters_refresh_token', mockData.refresh_token);
      localStorage.setItem('winters_user', JSON.stringify(mockData.user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', mockData.user.username);

      return { success: true, user: mockData.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 注册
  async function register(phone, email, password, nickname) {
    try {
      // 本地模拟注册逻辑
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!phone || !email || !password) {
        throw new Error('注册信息不完整');
      }

      // 生成脱敏的手机号格式：111****1111
      const maskedPhone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

      const mockUser = {
        id: Date.now(),
        username: nickname || maskedPhone,
        nickname: nickname || maskedPhone,
        phone: phone,
        email: email,
        avatar: '',
        bio: '',
        createdAt: new Date().toISOString()
      };

      const mockData = {
        access_token: 'mock_token_' + Date.now(),
        refresh_token: 'mock_refresh_' + Date.now(),
        user: mockUser
      };

      // 注册成功后自动登录
      token.value = mockData.access_token;
      refreshToken.value = mockData.refresh_token;
      user.value = mockData.user;

      localStorage.setItem('winters_token', mockData.access_token);
      localStorage.setItem('winters_refresh_token', mockData.refresh_token);
      localStorage.setItem('winters_user', JSON.stringify(mockData.user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', mockData.user.username);

      return { success: true, user: mockData.user };
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
