<template>
  <q-page class="flex justify-around">

    <q-card class="my-card" style="max-width: 700px; height:fit-content">
      <q-img src="/icons/favicon-128x128.png">
        <q-btn flat class="bg-primary" @click="router.push('/')">
            back
        </q-btn>
        <div class="absolute-bottom text-h6">
          {{ postStore.post?.title }}
        </div>
      </q-img>

      <q-card-section>
        {{ postStore.post?.body }}
      </q-card-section>
    </q-card>

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
