<template>
  <q-layout view="hHh lpR fFf" >
    <q-header elevated class="bg-dark text-white"  v-if="showHeader">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <svg
              width="26"
              height="35"
              viewBox="0 0 26 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.269 9.17206H5.814C4.284 9.17206 3.06 10.4201 3.06 11.9801V23.8361C3.06 25.3961 4.284 26.6441 5.814 26.6441H16.218C17.748 26.6441 18.972 25.3961 18.972 23.8361V11.9801C19.023 10.4201 17.799 9.17206 16.269 9.17206ZM16.065 18.4281H14.484C14.229 18.4281 14.025 18.2721 13.974 18.0121L13.668 16.9201L11.832 22.0161C11.73 22.2241 11.577 22.3801 11.373 22.3801H11.322C11.118 22.3801 10.914 22.2241 10.863 21.9641L9.384 15.4641L8.262 17.5441C8.16 17.7001 8.007 17.8041 7.803 17.8041H6.018C5.763 17.8041 5.508 17.5961 5.508 17.2841C5.508 17.0241 5.763 16.7641 6.018 16.7641H7.497L9.129 13.8001C9.231 13.5921 9.435 13.4881 9.639 13.5401C9.843 13.5921 10.047 13.7481 10.047 13.9561L11.424 20.0921L13.26 15.1001C13.311 14.8921 13.566 14.7361 13.77 14.7881C13.974 14.7881 14.178 14.9441 14.229 15.2041L14.841 17.5441H16.014C16.269 17.5441 16.524 17.7521 16.524 18.0641C16.575 18.2201 16.32 18.4281 16.065 18.4281Z"
                fill="white"
              />
              <path
                d="M23.103 14.7881H22.083V10.6281C22.083 8.28805 20.451 6.36405 18.258 5.94805L17.034 2.41206C16.728 1.52806 15.912 0.956055 14.994 0.956055H7.089C6.171 0.956055 5.355 1.52806 5.049 2.41206L3.825 5.94805C1.683 6.36405 0 8.28805 0 10.6281V25.2401C0 27.5801 1.632 29.5041 3.825 29.9201L5.049 33.4561C5.355 34.3401 6.171 34.9121 7.089 34.9121H14.994C15.912 34.9121 16.728 34.3401 17.034 33.4561L18.258 29.9201C20.4 29.5041 22.083 27.5801 22.083 25.2401V19.0001H23.103C24.225 19.0001 25.143 18.0641 25.143 16.8681C25.143 15.7241 24.225 14.7881 23.103 14.7881ZM17.391 28.9321H4.692C2.703 28.9321 1.071 27.2681 1.071 25.2401V10.5761C1.071 8.54806 2.703 6.88405 4.692 6.88405H17.391C19.38 6.88405 21.012 8.54806 21.012 10.5761V25.1881C21.063 27.2681 19.38 28.9321 17.391 28.9321Z"
                fill="white"
              />
            </svg>
          </q-avatar>
          HealthNexus
        </q-toolbar-title>

        <!-- Add search box that is allingned at the center -->
        <input
          type="text"
          v-model="search"
          class="bg-inherit border border-blue-500 rounded-xl py-1 placeholder:text-center mobile-hidden mr-3"
          placeholder="search"
          v-if="globalStore.showSearch"
        />

        <q-tabs align="left" class="mobile-hide gt-xs">
          <q-route-tab v-if="!authStore.loggedIn"  :to="{ name: 'signin' }" label="sign in" />
          <q-route-tab v-if="!authStore.loggedIn" :to="{ name: 'signup' }" label="sign up" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered v-if="showHeader">
      <!-- drawer content -->
      <!-- dummy routes -->
      <q-list class="mt-10">
        <!-- Sign In -->
        <q-item clickable v-ripple :to="{ name: 'signin' }" v-if="!authStore.loggedIn">
          <q-item-section class="flex flex-row gap-5 justify-start">
            <q-item-label class="capitalize">sign in</q-item-label>
            <!-- add icon -->
             <q-icon name="login" class="text-black" />
          </q-item-section>
        </q-item>

        <!-- Sign Up -->
        <q-item v-if="!authStore.loggedIn" clickable v-ripple :to="{ name: 'signup' }">
          <q-item-section class="flex flex-row gap-5 justify-start">
            <q-item-label class="capitalize">sign up</q-item-label>
            <!-- add icon -->
            <q-icon name="person_add" class="text-black" />
          </q-item-section>
        </q-item>

        <!-- Sign Out -->
        <q-item clickable v-ripple  @click="logout" v-if="authStore.loggedIn">
          <q-item-section class="flex flex-row gap-5 justify-start">
            <q-item-label class="capitalize">sign out</q-item-label>
            <!-- add icon -->
            <q-icon name="logout" class="text-black" />
          </q-item-section>
        </q-item>

        <!-- Blog -->
        <q-item clickable v-ripple :to="{ name: 'posts' }">
          <q-item-section class="flex flex-row gap-5 justify-start">
            <q-item-label class="capitalize">blog</q-item-label>
            <!-- add icon -->
            <q-icon name="article" class="text-black" />
          </q-item-section>
        </q-item>

        <!-- Dashboard -->
        <q-item  clickable v-ripple :to="{ name: 'dashboard' }" v-if="authStore.loggedIn">
          <q-item-section class="flex flex-row gap-5 justify-start">
            <q-item-label class="capitalize">dashboard</q-item-label>
            <!-- add icon -->
            <q-icon name="dashboard" class="text-black" />
          </q-item-section>
        </q-item>

        <!-- Health Records -->
        <q-item clickable v-ripple  v-if="authStore.loggedIn">
          <q-item-section class="flex flex-row gap-5 justify-start">
            <q-item-label class="capitalize">health records</q-item-label>
            <!-- add icon -->
            <q-icon name="description" class="text-black" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, provide, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useGlobalStore } from '../stores/global';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const authStore = useAuthStore();
    const globalStore = useGlobalStore();
    const router = useRouter();
    const search = ref('');
    const route = useRoute();



    provide('search', search)



    const showHeader = computed(() => {
      return route.name !== 'signin' && route.name !== 'signup';
    });
    const logout = async ()=>{
      try{
        await authStore.logout();
        router.push('/signin');
      }catch(error){
        console.error('Logout error:', error);
        authStore.message.name = 'An error occured while logging out';
        authStore.message.success = false;
      }
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      logout,
      router,
      search,
      authStore,
      showHeader,
      globalStore,

    }
}
};
</script>
