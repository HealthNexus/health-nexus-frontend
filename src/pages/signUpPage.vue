<template>
    <q-page padding class="column flex-center">
      <form action="">
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
      </form>
    </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
let email = ref('');
let password = ref('');
let visible = ref(false);
let name = ref('My name');
let password_confirmation = ref('');
</script>
