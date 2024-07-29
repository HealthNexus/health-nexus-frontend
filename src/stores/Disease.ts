import { Ref } from 'vue';
// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref} from 'vue';
import axios from 'axios';


export interface Disease{
  id: 1,
  name: string,
  slug: string
}


export interface Symptom{
  id: number;
  description: string;
}

export interface Drug{
  id: number;
  name: string;
  slug: string;
}
  export const useDiseaseStore = defineStore('disease', () => {

  const API_URL = 'http://localhost:8000/api';
  const diseases: Ref<Disease[]> = ref([]);
  const symptoms: Ref<Symptom[]> = ref([]);
  const drugs: Ref<Drug[]> = ref([]);

  const fetchDiseases = async () => {
    try{
      const response = await axios.get(`${API_URL}/diseases`);
    diseases.value = response.data.disease;
      return diseases.value;
    }catch(error){
      console.log(error)
    }
  }

  const fetchSymptoms = async () => {
    try{
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');
      const response = await axios.get(`${API_URL}/symptoms`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      symptoms.value = response.data.symptoms;
    }catch(error){
      console.log(error)
    }
  }

  const fetchDrugs = async () => {
    try{
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');
      const response = await axios.get(`${API_URL}/drugs`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      drugs.value = response.data.drugs;
    }catch(error){
      console.log(error)
    }
  }





  return {
    fetchDiseases,
    fetchSymptoms,
    diseases,
    symptoms,
    drugs,
    fetchDrugs
  };
});


