// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';
import { Notify } from 'quasar'
export interface Post {
  id: number;
 title: string;
 excerpt: string;
 body: string;
 thumbnail: string;
  created_at: string;
  updated_at: string;
  writer: {
    id: number;
    name: string;
    email: string;
    avatar: string|null;
  };
  category: {
    id: number;
    name: string;
  };
  comments: Comments[]|null;
  disease: {
    id: number;
    name: string;

    symptoms: {
      id: number;
      description: string;
    }[]

    drugs:{
      id: number;
      name: string;
    }[]

    categories:{
      id: number;
      name: string
    }[];
  };
  }

 export interface Comments{
    id: number
    writer: {
      id: number
      name: string
      avatar: string|null
    }
    body: string
    created_at: string
    updated_at: string
    replies: Replies[]|null
  }

  export interface Replies{
    id: number
    writer: {
      id: number
      name: string
      avatar: string|null
    }
    body: string
    created_at: string
    updated_at: string
  }


export const usePostStore = defineStore('post', () => {
  const authStore = useAuthStore();
  const post : Ref<Post|null> = ref(null);
  const posts : Ref<Post[]> = ref([]);

  const API_URL = 'http://localhost:8000/api';

  const fetchPost = async (id:number) => {

    try{
      const response = await axios.get(`${API_URL}/posts/${id}`);
      post.value = response.data.post;
      console.log('post', post.value)
      return post.value;
    }catch(error){
      console.log(error)
    }
  };

  const fetchPosts = async () => {
    try{
      const response = await axios.get(`${API_URL}/posts`);
     posts.value = response.data.posts;
    return posts;
    }catch(error){
      console.log(error)
    }
  };

  //post comment http://127.0.0.1:8000/api/posts/1/comments
  const postComment = async (postId: number, comment: string) => {
    try{
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await axios.post(`${API_URL}/posts/${postId}/comments`, {
        body: comment,
        user_id: authStore.user?.id,
      },
      {
        headers: {Authorization: `Bearer ${token}`},
      }
    );
      Notify.create({
        message: response.data.message,
        color: 'green'
      })
    }catch(error){
      console.log(error)
    }
  };

  // delete comment from this route /comments/22/destroy
  const deleteComment = async (commentId: number) => {
    try{
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await axios.delete(`${API_URL}/comments/${commentId}/destroy`, {
        headers: {Authorization: `Bearer ${token}`},
      }
    );
      Notify.create({
        message: response.data.message,
        color: 'green'
      })
    }catch(error){
      console.log(error)
    }
  };

// fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/diseases/categories`);
      return response.data.categories;
    } catch(error){
      console.log(error)
     }
  }



  return {
    post,
    posts,
    fetchPosts,
    fetchPost,
    postComment,
    deleteComment,
    fetchCategories
  };
});


