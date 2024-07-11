// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import axios from 'axios';


interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}


export const useAuthStore = defineStore('auth', () => {
  const user : Ref<User|null> = ref(null);
  const loading = ref(false);
  const loggedIn = ref(false);
  const message = ref('');


  const API_URL = 'http://localhost:8000/api';

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const token = response.data.token;
      localStorage.setItem('auth_token', token);
      user.value = response.data.user;
      message.value = response.data.message;
    } finally {
      loading.value = false;
      loggedIn.value = true;
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
      message.value = response.data.message;
    } finally {
      loading.value = false;
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');

    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    user.value = response.data.user;
  };

  const logout = async () => {
      try {
        const token = localStorage.getItem('auth_token');
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

        loading.value = false;
        loggedIn.value = false;
      } catch (error) {
        console.log(error);
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
  };
});


