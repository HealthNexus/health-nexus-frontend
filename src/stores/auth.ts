// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'vue-router';



interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
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


export const useAuthStore = defineStore('auth', () => {
  const user : Ref<User|null> = ref(null);
  const loading = ref(false);
  const loggedIn = ref(JSON.parse(localStorage.getItem('loggedIn') || 'false'));
  const message = ref('');
  const router = useRouter();
  const validationErrors: Ref<Errors|null> = ref(null)


  const API_URL = 'http://localhost:8000/api';

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const token = response.data.token;
      localStorage.setItem('auth_token', token);
      user.value = response.data.user;
      message.value = response.data.message;
      loggedIn.value = true;
      localStorage.setItem('loggedIn', JSON.stringify(loggedIn.value));
    } catch(error){
      const axiosErr = error as AxiosError;
      const data = axiosErr.response?.data as Data
      const errors = data?.errors as Errors
      validationErrors.value = errors;
      if(data.message) message.value = data.message;
    }finally {
      loading.value = false;
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    loading.value = true;
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation,
      });
      await login(email, password);

      message.value = response.data.message;
      router.push({name: 'dashboard'});
    }catch( error){
      const axiosErr = error as AxiosError;
      const data = axiosErr.response?.data as Data
      const errors = data?.errors as Errors
      validationErrors.value = errors;
      if(data.message) message.value = data.message;
    }
    finally {
      loading.value = false;
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
    console.log(error);
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
        message.value = response.data.message;
        localStorage.removeItem('auth_token');

        loggedIn.value = false;
        localStorage.setItem('loggedIn', JSON.stringify(loggedIn.value));
      } catch (error) {
        console.log(error);
      } finally{
        loading.value = false;
      }
  };

  return {
    user,
    loading,
    login,
    register,
    fetchUser,
    logout,
    loggedIn,
    validationErrors,
    message
  };
});


