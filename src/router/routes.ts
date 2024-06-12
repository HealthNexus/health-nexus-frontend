import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/home/posts', component: () => import('pages/IndexPage.vue') },
      { path: 'signup', component: () => import('pages/signUpPage.vue') },
      { path: 'signin', component: () => import('pages/signInPage.vue') },
      { path: 'dashboard', component: () => import('pages/userDashboard.vue') },
    ],
  },

  {
    path: '/posts/',
    component: () => import('layouts/PostLayout.vue'),
    children: [
      {path: ':id', component: ()=> import('pages/PostPage.vue') }
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
