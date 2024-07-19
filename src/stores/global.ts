// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';







export const usePostStore = defineStore('global', () => {

  const showSearch = ref(false);




  return {
    showSearch
  };
});


