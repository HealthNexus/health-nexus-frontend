<template>
  <q-page padding class="flex content-center justify-center ">
    <!-- content -->
      <div class="md:grid md:grid-cols-2 md:gap-5 content-center justify-center md:w-2/3" style="height:100%">
        <form @submit.prevent="submitForm">
          <h2 class="text-center font-semibold text-xl">Create an account</h2>
          <!-- Name -->
          <q-input
            v-model="name"
            for="name"
            label="Name"
            aria-placeholder="Name"
          >
            <template v-slot:prepend>
              <q-icon name="person" class="text-black" />
            </template>
          </q-input>

          <!-- Email -->
          <q-input
            v-model="email"
            for="email"
            class="mt-2"
            label="Email"
            aria-placeholder="Email"
          >
            <template v-slot:prepend>
              <q-icon name="email" class="text-black" />
            </template>
          </q-input>

          <!-- Password -->
          <q-input
            v-model="password"
            for="password"
            class="mt-2"
            :type="visible ? 'text' : 'password'"
            label="Password"
            aria-placeholder="Password"
          >
            <template v-slot:prepend>
              <q-icon name="lock" class="text-black" />
            </template>
            <template #append>
              <q-icon :name="visible?'visibility':'visibility_off'" class="text-black" @click="visible = !visible"/>
            </template>
          </q-input>

          <!-- Password Confirmation -->
          <q-input
            v-model="password_confirmation"
            for="password_confirmation"
            type="password"
            class="mt-2 mb-10"
            label="Password Confirmation"
            aria-placeholder="Password Confirmation"
          >
            <template v-slot:prepend>
              <q-icon name="lock" class="text-black" />
            </template>
          </q-input>

          <!-- Register Button -->
          <q-btn
            label="Register"
            class="full-width mb-5 rounded-lg font-semibold submit-button-bg-color text-white"
            padding="10px"
            type="submit"
          />

          <!-- aready have an account? -->
          <div class="flex justify-between font-bold">
            <span>Don't have an account?</span>
            <router-link :to="{name: 'signin'}" class="text-blue-700 hover:text-blue-900">Sign In</router-link>
          </div>
        </form>

        <div id="login_image">
          <!-- Background image goes here -->
        </div>
      </div>
  </q-page>

  <pre>
    {{ resp }}
  </pre>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

let email = ref('');
let password = ref('');
let visible = ref(false);
let name = ref('');
let password_confirmation = ref('');
let resp = ref('');

const router = useRouter();

const authStore = useAuthStore();

const submitForm = async () => {
  authStore.loading = true;
  try {
    let response = await authStore.register(
      name.value,
      email.value,
      password.value,
      password_confirmation.value
    );
    console.log(response);
    response = await authStore.login(email.value, password.value);
    console.log(response);
    router.push({name: 'dashboard'});
  } catch (error) {
    console.log(error)
    resp.value = 'An error occurred';
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

.input_style{
  border-bottom: solid 1px black;
}
</style>
