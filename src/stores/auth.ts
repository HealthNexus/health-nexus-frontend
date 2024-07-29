// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'vue-router';

import { Notify } from 'quasar'





export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  avatar: string | null;
  hospital_id: number;
  role: Role;
}

interface Role{
  id: number;
  name: string;
  slug: string;
}

interface Data {
  message: string|null
  errors: string|null|Errors
}

interface Errors{
  name: string|null
  email: string|null
  password: string|null
  password_confirmation: string|null

}

interface Message{
  name: string
  success: boolean
}


export const useAuthStore = defineStore('auth', () => {
  const user : Ref<User|null> = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const loading = ref(false);
  const loggedIn = ref(JSON.parse(localStorage.getItem('loggedIn') || 'false'));
  const message: Ref<Message> = ref({name: '', success: true});
  const router = useRouter();
  const validationErrors: Ref<Errors|null> = ref(null)
  const patients: Ref<User[]> = ref(JSON.parse(localStorage.getItem('patients') || '[]'));


  const API_URL = 'http://localhost:8000/api';

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const token = response.data.token;
      localStorage.setItem('auth_token', token);
      user.value = response.data.user;
      localStorage.setItem('user', JSON.stringify(user.value));

      //Set success message
      message.value.name = response.data.message;
      message.value.success = true

      loggedIn.value = true;
      localStorage.setItem('loggedIn', JSON.stringify(loggedIn.value));
      router.push({name: 'Landing'});
    } catch(error){
      const axiosErr = error as AxiosError;
      const data = axiosErr.response?.data as Data
      const errors = data?.errors as Errors
      validationErrors.value = errors;
      if(data.message) {
        message.value.name = data.message;
        message.value.success = false;
      }

    }finally {
      loading.value = false;
      Notify.create({
        message: message.value.name,
        color: message.value.success? 'green':'red'
      })
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string, hospital_id: number) => {
    loading.value = true;
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation,
        hospital_id,
      });
      await login(email, password);

      message.value.name = response.data.message;
      message.value.success = true;
    }catch( error){
      const axiosErr = error as AxiosError;
      const data = axiosErr.response?.data as Data
      const errors = data?.errors as Errors
      validationErrors.value = errors;
      if(data.message) {
        message.value.name = data.message;
        message.value.success = false;
      }
    }
    finally {
      loading.value = false;
      Notify.create({
        message: message.value.name,
        color: message.value.success? 'green':'red'
      })
    }
  };

  const fetchUser = async () => {
   try{
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');

    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    user.value = response.data.user;

    loggedIn.value = true;
    localStorage.setItem('loggedIn', JSON.stringify(loggedIn.value));
   }catch(error){
    const axiosErr = error as AxiosError;
    const data = axiosErr.response?.data as Data
    const errors = data?.errors as Errors
    validationErrors.value = errors;
    if(data.message) {
      message.value.name = data.message;
      message.value.success = false;
    }
   } finally{
    Notify.create({
      message: message.value.name,
      color: message.value.success? 'green':'red'
    })
   }
  };

  const fetchPatients = async () => {
   try{
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');

    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    patients.value = response.data.patients;
    localStorage.setItem('patients', JSON.stringify(patients.value));
   }catch(error){
    const axiosErr = error as AxiosError;
    const data = axiosErr.response?.data as Data
    const errors = data?.errors as Errors
    validationErrors.value = errors;
    if(data.message) {
      message.value.name = data.message;
      message.value.success = false;
    }
   } finally{
    Notify.create({
      message: message.value.name,
      color: message.value.success? 'green':'red'
    })
   }
  };

  const logout = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        console.log(token)
        if (!token) throw new Error('No token found');

        const response = await axios.post(`${API_URL}/logout`, {},
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        user.value = null;

        message.value.name = response.data.message;
        message.value.success = true;

        localStorage.removeItem('auth_token');

        loggedIn.value = false;
        localStorage.setItem('loggedIn', JSON.stringify(loggedIn.value));
      } catch (error) {
        const axiosErr = error as AxiosError;
        const data = axiosErr.response?.data as Data
        const errors = data?.errors as Errors
        validationErrors.value = errors;
        if(data.message) {
          message.value.name = data.message;
          message.value.success = false;
        }
      } finally{
        loading.value = false;
        Notify.create({
          message: message.value.name,
          color: message.value.success? 'green':'red'
        })
      }
  };

  const fetchHospitals = async () => {
    try {
      loading.value = true
      const response = await axios.get(`${API_URL}/hospitals`);
      return response.data.hospitals;
    } catch(error){
      const axiosErr = error as AxiosError;
      const data = axiosErr.response?.data as Data
      const errors = data?.errors as Errors
      validationErrors.value = errors;
      if(data.message) {
        message.value.name = data.message;
        message.value.success = false;
      }
     }
     finally{
      loading.value = false;
      Notify.create({
        message: message.value.name,
        color: message.value.success? 'green':'red'
      })
     }
  }

  return {
    user,
    loading,
    login,
    register,
    fetchUser,
    logout,
    loggedIn,
    validationErrors,
    message,
    fetchHospitals,
    fetchPatients,
    patients

  };
});


