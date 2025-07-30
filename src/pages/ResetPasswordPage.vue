<template>
  <q-page padding class="flex content-center justify-center">
    <div class="w-full max-w-md mx-auto mt-10 p-8 bg-white rounded shadow">
      <h2 class="text-center font-semibold text-xl mb-6">Reset Password</h2>
      <q-form @submit.prevent="submitResetPassword">
        <q-input
          v-model="email"
          type="email"
          label="Email"
          :disable="true"
          class="mb-4"
        />
        <q-input
          v-model="password"
          type="password"
          label="New Password"
          :rules="[(val: string) => !!val || 'Password is required']"
          :disable="loading"
          class="mb-4"
        />
        <q-input
          v-model="password_confirmation"
          type="password"
          label="Confirm Password"
          :rules="[(val: string) => val === password || 'Passwords do not match']"
          :disable="loading"
          class="mb-4"
        />
        <div v-if="error" class="text-red-600 text-sm mb-2">{{ error }}</div>
        <div v-if="success" class="text-green-700 text-sm mb-2">{{ success }}</div>
        <q-btn
          label="Reset Password"
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const token = ref('');
const password = ref('');
const password_confirmation = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

onMounted(() => {
  // Get token and email from query params
  token.value = String(route.query.token || '');
  email.value = String(route.query.email || '');
  if (!token.value || !email.value) {
    error.value = 'Invalid or missing reset token/email.';
  }
});

const submitResetPassword = async () => {
  error.value = '';
  success.value = '';
  if (!token.value || !email.value) {
    error.value = 'Invalid or missing reset token/email.';
    return;
  }
  if (!password.value || !password_confirmation.value) {
    error.value = 'Please fill in all fields.';
    return;
  }
  if (password.value !== password_confirmation.value) {
    error.value = 'Passwords do not match.';
    return;
  }
  loading.value = true;
  try {
    // Call your auth store or axios directly
    await authStore.resetPassword(token.value, email.value, password.value, password_confirmation.value);
    success.value = 'Your password has been reset. You can now log in.';
    setTimeout(() => router.push({ name: 'signin' }), 2000);
  } catch (e: unknown) {
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
      error.value = 'Failed to reset password.';
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
