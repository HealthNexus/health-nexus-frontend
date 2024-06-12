import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), name:'home' },
      { path: 'signup', name:'signup', component: () => import('pages/signUpPage.vue') },
      { path: 'signin', name:'signin', component: () => import('pages/signInPage.vue') },
      { path: 'dashboard', name:'dashboard', component: () => import('pages/userDashboard.vue') },
    ],
  },

  {
    path: '/posts/',
    component: () => import('layouts/PostLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), name:'posts' },
      {path: ':id', name:'post', component: ()=> import('pages/PostPage.vue') }
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
