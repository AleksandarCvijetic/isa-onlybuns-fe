import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '@/components/Register.vue'
import Login from '@/components/Login.vue'
import Home from '@/components/HomePage.vue'
import HomeUserView from '@/views/HomeUserView.vue'
import UserProfile from '@/components/UserProfile.vue'
import UserInfoProfile from '@/components/UserInfoProfile.vue'
import AllPostsMap from '@/components/AllPostsMap.vue'
import Posts from '@/components/Posts.vue'
import PostDetails from '@/components/PostDetails.vue'
import DisplayUsers from '@/components/DisplayUsers.vue'
import AdminPanel from '@/components/AdminPanel.vue'
import Analytics from '@/components/ApplicationAnalytics.vue'
import AdvertisePost from '@/components/AdvertisePost.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/homepage',
      name: 'homepage',
      component: Home,
    },
    {
      path: '/home-user',
      name: 'homeuser',
      component: HomeUserView,
      meta: { requiresAuth: true }
    },
    {
      path: '/user/:username',
      name: 'userProfile',
      component: UserProfile
    },
    {
      path: '/userprofile/:userId',
      name: 'userInfoProfile',
      component: UserInfoProfile
    },
    {
      path: '/postsmap',
      name: 'postsMap',
      component: AllPostsMap,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      component: AdminPanel,
      children: [
        // {
        //   path: 'posts',
        //   name: 'admin-posts',
        //   component: Posts
        // },
        // {
        //   path: 'trends',
        //   name: 'admin-trends',
        //   component: Trends
        // },
        {
          path: 'analytics',
          name: 'admin-analytics',
          component: Analytics
        },
        {
          path: 'users',
          name: 'admin-users',
          component: DisplayUsers
        }
      ],
      meta: { requiresAuth: true }
    },
    { path: '/posts', name: 'posts',component: Posts},
    { path: '/post-details/:id', name: 'post-details', component: PostDetails},
    { path: '/users', name: 'users', component: DisplayUsers, meta: { requiresAuth: true } },
    { path: '/advertise', name: 'advertise', component: AdvertisePost},

  ],
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = !!localStorage.getItem('jwtToken'); // ili druga tvoja logika za proveru prijave

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' });  // Preusmerava na login ako nije prijavljen
  } else {
    next();
  }
});


export default router
