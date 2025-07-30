import { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      // Allow unauthenticated access to forgot-password and reset-password
      if (
        authStore.loggedIn &&
        (to.name === 'signin' || to.name === 'signup')
      ) {
        next({ name: from.name || 'home' });
      } else if (
        authStore.loggedIn &&
        (to.name === 'forgot-password' || to.name === 'reset-password')
      ) {
        // If already logged in, allow access to password reset routes (or optionally redirect)
        next();
      } else {
        next();
      }
    },
    children: [
      { path: '', name:'home', component: () => import('pages/LandingPage.vue') },
      { path: 'signup', name:'signup', component: () => import('pages/signUpPage.vue') },
      { path: 'signin', name:'signin', component: () => import('pages/signInPage.vue') },
      { path: 'test', name:'test', component: () => import('pages/TestPage.vue') },
      { path: 'forgot-password', name: 'forgot-password', component: () => import('pages/ForgotPasswordPage.vue') },
      { path: 'reset-password', name: 'reset-password', component: () => import('pages/ResetPasswordPage.vue') },
      { path: 'records', name:'records', component: () => import('pages/RecordsPage.vue') },
      { path: 'landing', name:'Landing', component: () => import('src/pages/LandingPage.vue') },
      // { path: 'blogs', name:'Blog', component: () => import('src/pages/BlogTest.vue') },
      { path: 'record/create', name:'record.create', component: () => import('src/pages/CreateRecordPage.vue') },
      { path: 'analytics/general', name:'general.analytics', component: () => import('src/pages/GeneralAnalyticsPage.vue') },
      // Posts routes
      { path: 'posts/', component: () => import('pages/IndexPage.vue'), name:'posts' },
      {path: 'posts/:id', name:'post', component: ()=> import('pages/PostPage.vue') },
      {path: 'posts/create', name:'createPost', component: ()=> import('pages/CreatePostForm.vue') },
      
      // E-Pharmacy routes
      { path: 'pharmacy', name: 'pharmacy', component: () => import('pages/EPharmacyPage.vue') },
      { path: 'pharmacy/:slug', name: 'productDetails', component: () => import('pages/ProductDetails.vue') },
      { path: 'checkout', name: 'checkout', component: () => import('pages/CheckoutPage.vue') },
      { path: 'payment/callback', name: 'paymentCallback', component: () => import('pages/PaymentCallbackPage.vue') },
      { path: 'orders/:id/status', name: 'orderStatus', component: () => import('pages/OrderStatusPage.vue') }
    ],
  },
    {
      path: '/contact',
      component: () => import('pages/ContactPage.vue'), // Replace with your page component
      name: 'contact',
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
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
