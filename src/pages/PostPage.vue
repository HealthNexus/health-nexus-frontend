<template>
  <q-page>
    <div class="grid justify-around mt-5 gap-3 sm:grid-flow-col">
      <div class="col-span-4 sm:ml-5">
        <img
          src="https://cdn.quasar.dev/img/parallax2.jpg"
          class="self-center rounded-xl"
        />
      </div>
      <div class="col-span-8">
        <q-btn
          class="self-center"
          @click="router.push('/posts')"
          icon="arrow_back"
          flat
          round
        />
        <h1 class="font-semibold text-center text-sm">{{ postStore.post?.title }}</h1>
        <div>{{ postStore.post?.body }}</div>
      </div>
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

onMounted(() => {
  postStore.fetchPost(Number(router.currentRoute.value.params.id));
  console.log('id', router.currentRoute.value.params.id);
  console.log('post', postStore.posts);
});
</script>
