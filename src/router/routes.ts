import { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.loggedIn && (to.name === 'signin' || to.name === 'signup')) {
        next({name: from.name || 'dashboard'})
      } else {
        next()
      }
    },
    children: [
      { path: '', name:'home', component: () => import('pages/IndexPage.vue') },
      { path: 'signup', name:'signup', component: () => import('pages/signUpPage.vue') },
      { path: 'signin', name:'signin', component: () => import('pages/signInPage.vue') },
      { path: 'test', name:'test', component: () => import('pages/TestPage.vue') },
      { path: 'records', name:'records', component: () => import('pages/RecordsPage.vue') },
      { path: 'landing', name:'Landing', component: () => import('src/pages/LandingPage.vue') },

      // Posts routes
      { path: 'posts/', component: () => import('pages/IndexPage.vue'), name:'posts' },
      {path: 'posts/:id', name:'post', component: ()=> import('pages/PostPage.vue') },
      {path: 'posts/create', name:'createPost', component: ()=> import('pages/CreatePostForm.vue') }
    ],
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.loggedIn) {
       next()
      } else {
        next({name: 'signin'})
      }
    },
    children: [
      { path: 'dashboard', name:'dashboard', component: () => import('pages/userDashboard.vue')},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
