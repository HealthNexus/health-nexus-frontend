<template>
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
          :type="visible? 'text': 'password'"
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
    </pre>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'vue-router';

let email = ref('');
let password = ref('');
let visible = ref(false);
let name = ref('My name');
let password_confirmation = ref('');
let resp = ref('');
let loading = ref(false);
const router = useRouter();

const submitForm = async () => {
  try {
    loading.value = true;
    const response = await axios.post('http://localhost:8000/api/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    });
    console.log('Form submitted successfully:', response.data);
    router.push('/signin');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Error submitting form:', axiosError.response?.data);
    } else {
      console.error('Error submitting form:', error);
    }
  }
  loading.value = false;
};

</script>
