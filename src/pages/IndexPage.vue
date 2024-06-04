<template>
  Name: <input type="text" name="name" v-model="name" placeholder="Enter your name" />
</template>

<script setup lang="ts">
import { ref } from "vue";
let name = ref("");
</script>
