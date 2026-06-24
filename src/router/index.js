import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '../components/Login.vue';
import MainLayout from '../components/layout/MainLayout.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../components/Dashboard.vue'),
      },
      {
        path: 'classes',
        name: 'Classes',
        component: () => import('../components/Classes.vue'),
        meta: { roles: ['admin', 'teacher'] },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


// ===============================
// 🔐 GLOBAL AUTH GUARD (FIXED)
// ===============================
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    localStorage.removeItem('user');
  }

  const isAuthenticated = !!token;

  // 1. NOT logged in → block protected routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' });
  }

  // 2. Logged in → block login page
  if (to.meta.requiresGuest && isAuthenticated) {
    return next({ name: 'Dashboard' });
  }

  // 3. Role-based access control
  if (to.meta.roles) {
    if (!user || !to.meta.roles.includes(user.role)) {
      console.warn('Access denied: role not allowed');
      return next({ name: 'Dashboard' });
    }
  }

  // 4. Allow
  next();
});

export default router;