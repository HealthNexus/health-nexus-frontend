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

  const API_URL = 'http://localhost:8000/api';

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const token = response.data.token;
      localStorage.setItem('auth_token', token);
      user.value = response.data.user;
    } finally {
      loading.value = false;
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    loading.value = true;
    try {
      await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation,
      });
      await login(email, password); // Log in the user after registration
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

  const logout = () => {
    localStorage.removeItem('auth_token');
    user.value = null;
  };

  return {
    user,
    loading,
    login,
    register,
    fetchUser,
    logout,
  };
});


