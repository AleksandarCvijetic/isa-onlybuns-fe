import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '@/components/Register.vue'
import Login from '@/components/Login.vue'
import Home from '@/components/HomePage.vue'
import HomeUserView from '@/views/HomeUserView.vue'
import UserProfile from '@/components/UserProfile.vue'
import UserInfoProfile from '@/components/UserInfoProfile.vue'
import Posts from '@/components/Posts.vue'
import PostDetails from '@/components/PostDetails.vue'
import DisplayUsers from '@/components/DisplayUsers.vue'

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
      component: HomeUserView
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
    { path: '/posts', name: 'posts',component: Posts},
    { path: '/post-details/:id', name: 'post-details', component: PostDetails},
    { path: '/users', name: 'users', component: DisplayUsers },
  ],
})

export default router
