import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import Layout from '@/components/Layout.vue'

const routes = [
  // 👉 Редирект на /login при заходе на /
  {
    path: '/',
    redirect: '/login'
  },

  // 👉 Страница логина (не в Layout)
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },

  // 👉 Всё остальное — в Layout
  {
    path: '/app',
    children: [
      {
        path: '',
        redirect: 'incomes'
      },
      {
        path: 'incomes',
        name: 'Incomes',
        component: () => import('@/views/Incomes.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue')
      },
      {
        path: 'sales',
        name: 'Sales',
        component: () => import('@/views/Sales.vue')
      },
      {
        path: 'stocks',
        name: 'Stocks',
        component: () => import('@/views/Stocks.vue')
      }
    ]
  },

  // 👉 Фолбэк 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔒 Защита маршрутов
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('loggedInUser')

  if (!isLoggedIn && to.path !== '/login') {
    next('/login')
  } else if (isLoggedIn && to.path === '/login') {
    next('/app/incomes')
  } else {
    next()
  }
})

export default router
