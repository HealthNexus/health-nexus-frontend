import { ref, Ref } from 'vue';
// Record Store
import { defineStore } from 'pinia';
import axios from 'axios';

export interface RecDisease{
  id: number;
  disease_id: number;
  disease_name: string;
  symptoms: string[];
  modalDay: string[];
  modalMonth: string[];
  date: string;
}
export interface Records {
  patient_name: string;
  diseases: RecDisease[];
}

export const useRecordStore = defineStore('record', ()=>{
  const records: Ref<Records> = ref({patient_name: '', diseases: []});

  const fetchRecords = async () => {
     try{
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:8000/api/records', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        })
      console.log(response.data);
      records.value = response.data.records;

    }catch(error){
      console.error(error);
    }
  }

  return{
    fetchRecords,
    records
  }
})
