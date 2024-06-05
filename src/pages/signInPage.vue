<template>
  <q-page padding class="column flex-center">
    <form action="">
      <q-input
        v-model="email"
        type="email"
        for="email"
        hide-hint
        hint="Enter your email"
        label="Email"
        outlined
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
        outlined
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
    </form>

    <pre>
    email: {{ email }}
    password: {{ password }}
  </pre
    >
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
let email = ref('');
let password = ref('');
let visible = ref(false);
</script>
