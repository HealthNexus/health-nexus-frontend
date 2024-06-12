<template>
  <q-page>
     <div class="grid justify-around mt-5 gap-3 sm:grid-flow-col">
      <div class="bg-red-500 ">
        <img src="/icons/favicon-128x128.png" class="self-center"/>
      </div>
      <div class="bg-green">
        <h1 class="font-semibold text-center text-xl"> {{ postStore.post?.title }}</h1>
        <div>{{ postStore.post?.body }}</div>
      </div>
     </div>
   </q-page>
</template>

<script setup lang="ts">
import { onMounted} from 'vue';
// import axiosInstance from 'src/axios';
import { usePostStore } from 'src/stores/Posts';

import { useRouter } from 'vue-router';

const router = useRouter();
const postStore = usePostStore();

onMounted(()=>{
  postStore.fetchPost(Number(router.currentRoute.value.params.id))
  console.log('id', router.currentRoute.value.params.id)
  console.log('post', postStore.posts)
})

</script>
