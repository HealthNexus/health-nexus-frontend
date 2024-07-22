import { Ref } from 'vue';
// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref} from 'vue';
import axios from 'axios';


interface Disease{
  id: 1,
  name: string,
  slug: string
}




  export const useDiseaseStore = defineStore('disease', () => {

  const API_URL = 'http://localhost:8000/api';
  const diseases: Ref<Disease[]> = ref([]);

  const fetchDiseases = async () => {
    try{
      const response = await axios.get(`${API_URL}/diseases`);
    diseases.value = response.data.disease;
      return diseases.value;
    }catch(error){
      console.log(error)
    }
  }





  return {
    fetchDiseases
  };
});


