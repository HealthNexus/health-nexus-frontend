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
    <div class="q-pa-md row justify-end">
      <div style="width: 100%; max-width: 400px">
        <q-chat-message
          :text="['Have you seen Quasar?']"
          sent
          text-color="white"
          bg-color="primary"
        >
          <template v-slot:name>me</template>
          <template v-slot:stamp>7 minutes ago</template>
          <template v-slot:avatar>
            <img
              class="q-message-avatar q-message-avatar--sent"
              src="https://cdn.quasar.dev/img/avatar4.jpg"
            >
          </template>
        </q-chat-message>

        <q-chat-message
          bg-color="amber"
        >
          <template v-slot:name>Mary</template>
          <template v-slot:avatar>
            <img
              class="q-message-avatar q-message-avatar--received"
              src="https://cdn.quasar.dev/img/avatar2.jpg"
            >
          </template>

          <div>
            Already building an app with it...
          </div>

          <q-spinner-dots size="2rem" />
        </q-chat-message>
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
