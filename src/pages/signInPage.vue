<template>
  <q-page padding class="flex content-center justify-center" >
    <!-- content -->
    <div class="md:grid md:grid-cols-2 md:gap-5 content-center justify-center w-4/5" id="#form_container">
      <form @submit.prevent="login">
        <h2 class="text-center font-semibold text-xl">Login into your account</h2>

        <!-- Email -->
        <q-input v-model="email" for="email" type="email" label="Email"
        bottom-slots
        :error="authStore.validationErrors?.email ? true: false"
        :rules="[
          val => !!val || 'Email field is required',
          ]"
          :disable="authStore.loading"
        >
          <template v-slot:prepend>
            <q-icon name="email" class="text-black" />
          </template>
          <template #error>
            <div v-if="authStore.validationErrors?.email">
              <div v-for="(error, index) in authStore.validationErrors.email" :key="index" class="q-field__error" >
                {{ error }}
              </div>
            </div>
          </template>
        </q-input>

        <!-- Password -->
        <q-input
          v-model="password"
          class="mt-5 mb-10"
          :type="visible ? 'text' : 'password'"
          for="password"
          label="Password"
          bottom-slots
          :error="authStore.validationErrors?.password ? true: false"
          :rules="[
            val => !!val || 'Password field is required',
            ]"
          :disable="authStore.loading"
          >
          <template v-slot:prepend>
            <q-icon name="lock" class="text-black" />
          </template>
          <template #append>
            <q-icon :name="visible?'visibility':'visibility_off'" class="text-black" @click="visible = !visible"/>
          </template>
          <template #error>
            <div v-if="authStore.validationErrors?.password">
              <div v-for="(error, index) in authStore.validationErrors.password" :key="index" class="q-field__error">
                {{ error }}
              </div>
            </div>
          </template>
        </q-input>

        <!-- Remember me -->
        <div class="flex justify-between hover:text-semibold">
          <q-checkbox v-model="remember_me" label="Remember me" />
         <div class="flex content-center justify-center">
          <a href="#">Forgot Password?</a>
         </div>
        </div>


        <q-spinner
        v-if="authStore.loading"
        size="50px"
        color="primary"
        class="q-mt-md"
      />

        <!-- Login -->
        <q-btn
          :disable="authStore.loading"
          label="Login"
          class="full-width mt-10 mb-5 rounded-lg font-semibold submit-button-bg-color text-white"
          padding="10px"
          type="submit"
        />

        <!-- Don't have an account -->
        <div class="flex justify-between font-bold">
          <span>Don't have an account?</span>
          <router-link :to="{name: 'signup'}" class="text-blue-700 hover:text-blue-900">Sign Up</router-link>
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
import { useAuthStore } from '../stores/auth';



let email = ref('');
let password = ref('');
let remember_me= ref('');
let visible = ref(false);

const authStore = useAuthStore();

const login = async () => {
  authStore.loading = true;
  try {
    await authStore.login(email.value, password.value);
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
