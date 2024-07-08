// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import axios from 'axios';


interface Post {
  id: number;
 title: string;
 excerpt: string;
 body: string;
 thumbnail: string|null;
  created_at: string;
  updated_at: string;
}


export const usePostStore = defineStore('post', () => {
  const post : Ref<Post|null> = ref(null);
  const posts : Ref<Post[]|undefined> = ref([]);

  const API_URL = 'http://localhost:8000/api';

  const fetchPost = async (id:number) => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');

    const response = await axios.get(`${API_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    post.value = response.data.post;
    console.log('post', post.value)
    return post.value;
  };

  const fetchPosts = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');

    const response = await axios.get(`${API_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    posts.value = response.data.posts;
    return posts;
  };

  // // search for posts
  // const searchPosts = async (query: string) => {
  //   const token = localStorage.getItem('auth_token');
  //   if (!token) throw new Error('No token found');

  //   const response = await axios.get(`${API_URL}/posts/search?q=${query}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   posts.value = response.data.posts;
  //   return posts;
  // };

  //search through posts on the client side, utilise regex for complex searches
  const searchPosts = (query: string, category: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    const filteredPosts = posts.value?.filter((post) => {
      return post.title.toLowerCase().includes(trimmedQuery) ||
             post.excerpt.toLowerCase().includes(trimmedQuery)||
             post.body.toLowerCase().includes(trimmedQuery);
    });
  // handle epty search to return all posts
    if(category === 'all'){
      
      fetchPosts();
      category = '';
    }
    else if (filteredPosts === undefined) {
      posts.value = [];
    }
    else {
      posts.value = filteredPosts;
    }
    return posts;
  };





  return {
    post,
    posts,
    fetchPosts,
    fetchPost,
    searchPosts,
  };
});


