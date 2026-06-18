import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      meta: {
        title: '首页 - Winters',
      },
    },

    {
      path: '/blog',
      name: 'Blog',
      component: () => import('../views/Blog.vue'),
      meta: {
        title: '动态 - Winters',
      },
    },
    {
      path: '/community',
      name: 'Community',
      component: () => import('../views/Community.vue'),
      meta: { title: 'AI 社区 - Winters' },
    },
    {
      path: '/community/new',
      name: 'PostEditor',
      component: () => import('../views/PostEditor.vue'),
      meta: { title: '发动态 - Winters' },
    },
    {
      path: '/community/:id',
      name: 'PostDetail',
      component: () => import('../views/PostDetail.vue'),
      meta: { title: '帖子详情 - Winters' },
    },
    {
      path: '/drive',
      name: 'Drive',
      component: () => import('../views/Drive.vue'),
      meta: {
        title: '云盘 - Winters',
      },
    },
    {
      path: '/lab',
      name: 'Lab',
      component: () => import('../views/Lab.vue'),
      meta: {
        title: '实验室 - Winters',
      },
    },
    {
      path: '/ai',
      name: 'AI',
      component: () => import('../views/AI.vue'),
      meta: {
        title: 'AI 聊天 - Winters',
      },
    },
    {
      path: '/projects',
      name: 'Projects',
      component: () => import('../views/Projects.vue'),
      meta: {
        title: '项目 - Winters',
      },
    },
    {
      path: '/projects/:id',
      name: 'ProjectDetail',
      component: () => import('../views/ProjectDetail.vue'),
      meta: {
        title: '项目详情 - Winters',
      },
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../views/Contact.vue'),
      meta: {
        title: '联系我 - Winters',
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: {
        title: '登录 - Winters',
      },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: {
        title: '注册 - Winters',
      },
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('../views/ResetPassword.vue'),
      meta: {
        title: '重置密码 - Winters',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue'),
      meta: {
        title: '个人中心 - Winters',
        requiresAuth: true,
      },
    },
    {
      path: '/care',
      name: 'Care',
      component: () => import('../views/Care.vue'),
      meta: {
        title: '暖心关怀 - Winters',
      },
    },
    {
      path: '/system',
      name: 'System',
      component: () => import('../views/System.vue'),
      meta: {
        title: '自驱工作站 - Winters',
      },
    },
    {
      path: '/learning',
      name: 'Learning',
      component: () => import('../views/Learning.vue'),
      meta: {
        title: 'AI 学习路线 - Winters',
      },
    },
    {
      path: '/lab/particles',
      name: 'ParticleLab',
      component: () => import('../views/lab/ParticleLab.vue'),
      meta: {
        title: '粒子实验 - Winters',
        fullWidth: true,
      },
    },
    {
      path: '/lab/piano',
      name: 'PianoLab',
      component: () => import('../views/lab/PianoLab.vue'),
      meta: {
        title: '钢琴实验室 - Winters',
        fullWidth: true,
      },
    },
    {
      path: '/lab/2048',
      name: 'Game2048Lab',
      component: () => import('../views/lab/Game2048Lab.vue'),
      meta: {
        title: '2048 - Winters',
        fullWidth: true,
      },
    },
    {
      path: '/lab/minesweeper',
      name: 'MinesweeperLab',
      component: () => import('../views/lab/MinesweeperLab.vue'),
      meta: {
        title: '扫雷 - Winters',
        fullWidth: true,
      },
    },
    {
      path: '/lab/showcase',
      name: 'Showcase',
      component: () => import('../views/lab/Showcase.vue'),
      // 84-component showcase, loaded as separate chunk
      meta: {
        title: '组件实验室 - Winters',
      },
    },
    {
      path: '/lab/code',
      name: 'CodeLab',
      component: () => import('../views/lab/CodeLab.vue'),
      meta: {
        title: '编程学习实验室 - Winters',
      },
    },
  ],
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 路由守卫，设置页面标题和权限控制
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Winters';
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // 未登录，重定向到登录页
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
