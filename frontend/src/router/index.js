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
      name: 'ShowcaseIndex',
      component: () => import('../views/lab/ShowcaseIndex.vue'),
      meta: { title: '组件实验室 - Winters' },
    },
    {
      path: '/lab/showcase/text',
      name: 'ShowcaseText',
      component: () => import('../views/lab/ShowcaseText.vue'),
      meta: { title: '文字特效 - Winters' },
    },
    {
      path: '/lab/showcase/hover',
      name: 'ShowcaseHover',
      component: () => import('../views/lab/ShowcaseHover.vue'),
      meta: { title: '悬停交互 - Winters' },
    },
    {
      path: '/lab/showcase/entry',
      name: 'ShowcaseEntry',
      component: () => import('../views/lab/ShowcaseEntry.vue'),
      meta: { title: '入场动画 - Winters' },
    },
    {
      path: '/lab/showcase/bg',
      name: 'ShowcaseBg',
      component: () => import('../views/lab/ShowcaseBg.vue'),
      meta: { title: '背景装饰 - Winters' },
    },
    {
      path: '/lab/showcase/ui',
      name: 'ShowcaseUi',
      component: () => import('../views/lab/ShowcaseUi.vue'),
      meta: { title: 'UI 组件 - Winters' },
    },
    {
      path: '/lab/showcase/3d',
      name: 'Showcase3d',
      component: () => import('../views/lab/Showcase3d.vue'),
      meta: { title: '3D / 工具 - Winters' },
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
  
  // 检查 JWT token 是否存在
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('winters_token');
    if (!token) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
