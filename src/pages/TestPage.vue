<template>
  <q-page padding>
    <!-- content -->
     <div class="md:grid md:grid-cols-2 content-center" style="height:80vh;">
        <form @click.prevent="login">
          <h2 class="text-center font-semibold text-xl">Create an account</h2>
          <!-- Name -->
          <q-input v-model="name" for="name" label="Name" aria-placeholder="Name" color="black" >
            <template v-slot:prepend>
              <q-icon name="person" class="text-black" />
            </template>
          </q-input>

          <!-- Email -->
          <q-input v-model="email" for="email" class="mt-5" label="Email" aria-placeholder="Email">
            <template v-slot:prepend>
              <q-icon name="email" class="text-black" />
            </template>
          </q-input>

          <!-- Password -->
          <q-input v-model="password" for="password"  class="mt-5" :type="visible?'text':'password'" label="Password" aria-placeholder="Password">
            <template v-slot:prepend>
              <q-icon name="lock" class="text-black" />
            </template>
            <template #append>
              <q-icon name="visibility_off" class="text-black" />
            </template>
          </q-input>

          <!-- Password Confirmation -->
          <q-input v-model="password_confirmation"  for="password_confirmation" class="mt-5 mb-10" label="Password Confirmation" aria-placeholder="Password Confirmation">
            <template v-slot:prepend>
              <q-icon name="lock" class="text-black" />
            </template>
          </q-input>

          <!-- Register Button -->
          <q-btn label="Register" class="full-width mt-10 mb-5 rounded-lg font-semibold" color="blue-10" padding="10px"/>

          <!-- aready have an account? -->
          <div class="flex justify-between font-bold">
            <span>Don't have an account?</span>
            <a href="#" class="text-primary">Sign Up</a>
          </div>

        </form>


        <div id="login_image">
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
let name = ref('');
let password_confirmation = ref('');
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
@media screen and (min-width: 640px){
#login_image{
  display: block;
}
}
@media screen and (max-width: 639px){
#login_image{
  display: none;
}
}

.input_style{
  border-bottom: solid 1px black;
}
</style>


<!-- <template>
  <q-page padding class="column flex-center">
    <form @submit.prevent="submitForm">
      <q-input
        v-model="name"
        type="text"
        for="name"
        hide-hint
        hint="Enter your name"
        label="name"
        filled
        clearable
        clear-icon="backspace"
        dense
        square
      >
        <template #prepend>
          <q-icon name="person" />
        </template>
      </q-input>
      <q-input
        v-model="email"
        type="email"
        for="email"
        hide-hint
        hint="Enter your email"
        label="Email"
        filled
        clearable
        clear-icon="backspace"
        dense
        square
      >
        <template #prepend>
          <q-icon name="email" />
        </template>
      </q-input>
      <q-input
        v-model="password"
        :type="visible ? 'text' : 'password'"
        for="password"
        hint="Enter your password"
        label="password"
        filled
        dense
        square
      >
        <template #prepend>
          <q-icon name="lock" />
        </template>
        <template #append>
          <q-btn @click="visible = !visible" flat dense>
            <q-icon v-if="visible" name="visibility" />
            <q-icon v-else name="visibility_off" />
          </q-btn>
        </template>
      </q-input>
      <q-input
        v-model="password_confirmation"
        type="password"
        for="password"
        hint="Enter your password again"
        label="password confirmation"
        filled
        dense
        square
      >
        <template #prepend>
          <q-icon name="lock" />
        </template>
        <template #append>
          <q-btn @click="visible = !visible" flat dense>
            <q-icon v-if="visible" name="visibility" />
            <q-icon v-else name="visibility_off" />
          </q-btn>
        </template>
      </q-input>
      <q-btn type="submit" label="Submit" color="primary" />
      <q-spinner v-if="loading" color="primary" />
    </form>
  </q-page>
  <pre>
      {{ resp }}
    </pre
  >
</template> -->
