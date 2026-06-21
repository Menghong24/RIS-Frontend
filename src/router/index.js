import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../hooks/useAuth'; 

import LoginView from '../components/Login.vue';
import MainLayout from '../components/layout/MainLayout.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true } 
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true }, 
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../components/Dashboard.vue') 
      },
      // --- Classes Route ---
      // Both admins and teachers can likely view classes
      {
        path: 'classes',
        name: 'Classes',
        component: () => import('../components/Classes.vue'),
        meta: { roles: ['admin', 'teacher'] }
      },
      // --- Users Route ---
      // Protected: Only admins should be able to manage users
    //   {
    //     path: 'users',
    //     name: 'Users',
    //     component: () => import('../components/Users.vue'),
    //     meta: { roles: ['admin'] } 
    //   }
    ]
  },
  {
    // Catch-all route for 404s
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// --- GLOBAL NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  // Bring in getUser alongside getToken to check the user's role
  const { getToken, getUser } = useAuth(); 
  
  const isAuthenticated = !!getToken(); 
  const user = getUser(); // Retrieves the parsed user object from localStorage

  if (to.meta.requiresAuth && !isAuthenticated) {
    // 1. Protected route + NOT logged in -> Kick to Login
    next({ name: 'Login' });
    
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // 2. Guest route (Login) + IS logged in -> Push to Dashboard
    next({ name: 'Dashboard' });
    
  } else if (to.meta.roles && user) {
    // 3. Role Verification
    // Check if the route has specific role requirements, and if the user matches them
    if (!to.meta.roles.includes(user.role)) {
      // User does not have permission (e.g., a teacher trying to access /users)
      console.warn("Access denied: Insufficient permissions.");
      next({ name: 'Dashboard' }); 
    } else {
      // User has the correct role
      next();
    }
    
  } else {
    // 4. Allowed to proceed normally
    next();
  }
});

export default router;