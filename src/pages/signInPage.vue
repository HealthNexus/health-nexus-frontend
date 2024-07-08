<template>
  <q-page padding>
    <!-- content -->
     <div class="md:grid md:grid-cols-2 content-center" style="height:70vh;">
        <form @click.prevent="login">
          <h2 class="text-center font-semibold text-xl">Login into your account</h2>
          <q-input v-model="email" >
            <template v-slot:prepend>
              <q-icon name="email" class="text-black" />
            </template>
          </q-input>
          <q-input v-model="password"  class="mt-5 mb-10" :type="visible?'text':'password'">
            <template v-slot:prepend>
              <q-icon name="lock" class="text-black" />
            </template>
            <template #append>
              <q-icon name="visibility_off" class="text-black" />
            </template>
          </q-input>
          <div class='flex justify-between hover:text-semibold'>
           <label for="remember">
              <input type="checkbox" id="remember" class="mr-2">
              Remember me
           </label>
           <a href="#">Forgot Password?</a>
          </div>
          <q-btn label="Login" class="full-width mt-10 mb-5 rounded-lg font-semibold" color="blue-10" padding="10px"/>
          <div class="flex justify-between font-bold">
            <span>Don't have an account?</span>
            <a href="#" class="text-primary">Sign Up</a>
          </div>
        </form>
        <div class="mobile-hide">
          <img src="https://cdn.quasar.dev/img/parallax2.jpg" alt="">
        </div>
     </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
let email = ref('');
let password = ref('');
let visible = ref(false);
const router = useRouter();

const authStore = useAuthStore();


const login = async () => {
  authStore.loading = true;
  try {
    await authStore.login(email.value, password.value);
    router.push('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    authStore.loading = false;
  }
};

</script>
