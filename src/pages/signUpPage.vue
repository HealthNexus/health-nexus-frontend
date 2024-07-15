<template>
  <q-page padding class="flex content-center justify-center ">
    <!-- content -->
      <div class="md:grid md:grid-cols-2 md:gap-5 content-center justify-center md:w-2/3" style="height:100%">
        <form @submit.prevent="submitForm" >
          <h2 class="text-center font-semibold text-xl">Create an account</h2>
          <!-- Name -->
          <q-input
            v-model="name"
            for="name"
            label="Name"
            aria-placeholder="Name"
            bottom-slots
            :error="authStore.validationErrors?.name ? true: false"
            :rules="[
              val => !!val || 'Name field is required',
              val => typeof val == 'string' || 'Name field must be a string'
              ]"
              :disable="authStore.loading"

          >
            <template v-slot:prepend>
              <q-icon name="person" class="text-black" />
            </template>
            <template #error>
              <div v-if="authStore.validationErrors?.name">
                <div v-for="(error, index) in authStore.validationErrors.name" :key="index" class="q-field__error">
                  {{ error }}
                </div>
              </div>
            </template>
          </q-input>

          <!-- Email -->
          <q-input
            v-model="email"
            for="email"
            class="mt-2"
            label="Email"
            aria-placeholder="Email"
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
              <div v-if="authStore.validationErrors?.email" >
                <ul>
                  <li v-for="(error, index) in authStore.validationErrors.email" :key="index" class="q-field__error">
                    {{ error }}
                  </li>
                </ul>
              </div>
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
            bottom-slots
            :error="authStore.validationErrors?.password ? true: false"
            :rules="[
              val => !!val || 'The password field is required',
              val => val.length == 8 || 'The password must be at least 8 characters long',
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
                <ul>
                  <li v-for="(error, index) in authStore.validationErrors.password" :key="index" class="q-field__error ">
                    {{ error }}
                  </li>
                </ul>
              </div>
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
            :rules="[
              val => !!val || 'The password confirmation field is required is required',
              val => val == password || 'The password confirmation must match the password',
              ]"
              :disable="authStore.loading"
          >
            <template v-slot:prepend>
              <q-icon name="lock" class="text-black" />
            </template>


          </q-input>

          <q-spinner
          v-if="authStore.loading"
          size="50px"
          color="primary"
          class="q-mt-md"
        />

          <!-- Register Button -->
          <q-btn
            label="Register"
            class="full-width mb-5 rounded-lg font-semibold submit-button-bg-color text-white"
            padding="10px"
            type="submit"
            :disable="authStore.loading"
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
import { useAuthStore } from '../stores/auth';

let email = ref('');
let password = ref('');
let visible = ref(false);
let name = ref('');
let password_confirmation = ref('');
let resp = ref('');

const authStore = useAuthStore();

const submitForm = async () => {
  authStore.loading = true;
  try {
    await authStore.register(
      name.value,
      email.value,
      password.value,
      password_confirmation.value
    );

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
