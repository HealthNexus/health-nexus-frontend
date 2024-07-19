// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';







export const useGlobalStore = defineStore('global', () => {

  const showSearch = ref(false);
  const typing = ref(false);




  return {
    showSearch,
    typing
  };
});


