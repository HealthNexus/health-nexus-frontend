<template>
  <q-page padding>
    <!-- content -->
    <div class="md:grid md:grid-cols-2 gap-5 content-center" id="#form_container" style="height: 80vh;">
      <form @click.prevent="login">
        <h2 class="text-center font-semibold text-xl">Login into your account</h2>
        <q-input v-model="email" for="email" type="email" label="Email">
          <template v-slot:prepend>
            <q-icon name="email" class="text-black" />
          </template>
        </q-input>
        <q-input
          v-model="password"
          class="mt-5 mb-10"
          :type="visible ? 'text' : 'password'"
          for="password"
          label="Password"
        >
          <template v-slot:prepend>
            <q-icon name="lock" class="text-black" />
          </template>
          <template #append>
            <q-icon name="visibility_off" class="text-black" />
          </template>
        </q-input>
        <div class="flex justify-between hover:text-semibold">
          <label for="remember">
            <input type="checkbox" id="remember" class="mr-2" />
            Remember me
          </label>
          <a href="#">Forgot Password?</a>
        </div>
        <q-btn
          label="Login"
          class="full-width mt-10 mb-5 rounded-lg font-semibold submit-button-bg-color text-white"
          padding="10px"
        />
        <div class="flex justify-between font-bold">
          <span>Don't have an account?</span>
          <a href="#" class="text-primary">Sign Up</a>
        </div>
      </form>
      <div id="login_image">
        <!-- Background image goes here -->
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

<style>
@media screen and (min-width: 640px) {
  #login_image {
    display: block;
    background: url('/src/assets/login_img.jpg');
    background-size: cover;
  }

}
@media screen and (max-width: 639px) {
  #login_image {
    display: none;
  }
}
</style>
