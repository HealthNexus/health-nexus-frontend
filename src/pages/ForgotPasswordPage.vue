<template>
  <q-page padding class="flex content-center justify-center">
    <div class="w-full max-w-md mx-auto mt-10 p-8 bg-white rounded shadow">
      <h2 class="text-center font-semibold text-xl mb-6">Forgot Password</h2>
      <q-form @submit.prevent="submitForgotPassword">
        <q-input
          v-model="email"
          type="email"
          label="Email"
          :rules="[(val: string) => !!val || 'Email is required']"
          :disable="loading"
          bottom-slots
          class="mb-4"
        >
          <template v-slot:prepend>
            <q-icon name="email" class="text-black" />
          </template>
        </q-input>
        <div v-if="error" class="text-red-600 text-sm mb-2">{{ error }}</div>
        <div v-if="success" class="text-green-700 text-sm mb-2">{{ success }}</div>
        <q-btn
          label="Send Reset Link"
          type="submit"
          color="primary"
          class="full-width mt-2"
          :loading="loading"
        />
      </q-form>
      <div class="mt-4 text-center">
        <router-link :to="{ name: 'signin' }" class="text-blue-700 hover:text-blue-900">Back to Login</router-link>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const authStore = useAuthStore();

const submitForgotPassword = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    if (typeof authStore.forgotPassword === 'function') {
      await authStore.forgotPassword(email.value);
    } else {
      throw new Error('Forgot password method not implemented.');
    }
    success.value = 'If your email exists in our system, a reset link has been sent.';
  } catch (e: unknown) {
    // Type guard for error with response property
    function isAxiosErrorWithMessage(err: unknown): err is { response: { data: { message: string } } } {
      return (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: unknown }).response === 'object' &&
        (err as { response: { data?: unknown } }).response !== null &&
        'data' in (err as { response: { data?: unknown } }).response &&
        typeof (err as { response: { data: { message?: unknown } } }).response.data === 'object' &&
        (err as { response: { data: { message?: unknown } } }).response.data !== null &&
        'message' in (err as { response: { data: { message?: unknown } } }).response.data
      );
    }
    if (isAxiosErrorWithMessage(e)) {
      error.value = String(e.response.data.message);
    } else if (e instanceof Error) {
      error.value = e.message;
    } else {
      error.value = 'Failed to send reset link.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.bg-white {
  background: #fff;
}
</style>
