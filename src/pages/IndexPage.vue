<template>
  <q-page class="flex justify-between">

    <div class="flex justify-center gap-5 mt-5" style="max-width: 100vw">
      <q-card class="" style="max-width: 400px;"
        v-for="post in postStore.posts"
        :key="post.id"
      >
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg"
          :ratio="16/9"
        >
          <div class="absolute-bottom text-h6">
            {{ post.title }}
          </div>
        </q-img>
        <q-card-section>
          {{ post.body }}
        </q-card-section>
       <div class="flex justify-end">
        <q-btn flat>
          <q-icon name="keyboard_double_arrow_right" @click="viewPost(post.id)"/>
        </q-btn>
       </div>
      </q-card>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
// import axiosInstance from 'src/axios';
import { usePostStore } from 'src/stores/Posts';

import { useRouter } from 'vue-router';

const router = useRouter();


const postStore = usePostStore();

const viewPost = async (id: number)=>{
  router.push(`posts/${id}`)
}

onMounted(() => {
  postStore.fetchPosts();

});
</script>

<style>
 .card{
  max-width: 30vw;
 }
</style>
