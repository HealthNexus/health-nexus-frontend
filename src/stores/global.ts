// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';







export const usePostStore = defineStore('global', () => {

  const value = ref('')




  return {
    value
  };
});


