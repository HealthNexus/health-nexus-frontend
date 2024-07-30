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

interface ChartTitleOptions {
  display: boolean;
  text: string;
  plugins?: {
    title?: ChartTitleOptions;
  };
  font?: {
    size: number;
  };
}

export interface graphData{
  data:CData;
   options: ChartTitleOptions;
}
export interface CData {
  labels: string[];
  datasets: Dataset[];
}

interface Dataset {
  label: string;
  backgroundColor: string;
  data: number[];
}

export const useRecordStore = defineStore('record', ()=>{
  const records: Ref<Records> = ref({patient_name: '', diseases: []});
  const data: Ref<graphData[]> = ref([]);

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

  const createRecords = async (userId:number|undefined, diseaseId: number|undefined, symptomIds: number[], drugIds:number[])=>{
    try{
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');
      const response = await axios.post(`http://localhost:8000/api/records/${userId}/store`, {
        disease_id: diseaseId,
        symptom_Ids: symptomIds,
        drug_Ids: drugIds
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      console.log(response.data);
    }catch(error){
      console.error(error);
    }

  }

  const monthDiseaseData = async () => {
     try{
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:8000/api/month-disease-data', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        })
      console.log('data', response.data);
      return response.data;
    }catch(error){
      console.log(error);
    }
  }

  const dayDiseaseData = async () => {
     try{
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:8000/api/day-disease-data', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        })
      console.log('data', response.data);
      return response.data;
    }catch(error){
      console.log(error);
    }
  }
  const yearDiseaseData = async () => {
     try{
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:8000/api/year-disease-data', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        })
      console.log('data', response.data);
     return response.data;
    }catch(error){
      console.log(error);
    }
  }

  const generalMonthVsDiseaseCount = async (year:number) => {
     try{
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`http://localhost:8000/api/records/analytics/general/${year}/months`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        })
      console.log('generalMonthYear', response.data);
     return response.data;
    }catch(error){
      console.log(error);
    }
  }
  const generalYearVsDiseaseCount = async (start:number, end:number) => {
     try{
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`http://localhost:8000/api/records/analytics/general/${start}/${end}/years`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        })
      console.log('generalMonthYear', response.data);
     return response.data;
    }catch(error){
      console.log(error);
    }
  }

  const fetchData = async ()=>{
    const daysData = await dayDiseaseData();
    const monthsData = await monthDiseaseData();
    const yearsData = await yearDiseaseData();
    data.value.push(daysData, monthsData, yearsData);
  }


  return{
    fetchRecords,
    records,
    fetchData,
    data,
    createRecords,
    generalMonthVsDiseaseCount,
    generalYearVsDiseaseCount
  }
})
