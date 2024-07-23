<template>
  <q-page>
    <div class="grid justify-around mt-5 gap-3 sm:grid-flow-col">
      <div class="col-span-4 sm:ml-5 w-full">
        <q-img :src="postStore.post?.thumbnail ?? 'https://picsum.photos/800/400'" :ratio="16 / 9" class="rounded-2xl w-full"/>
      </div>
      <div class="col-span-8">
        <q-btn
          class="self-center"
          @click="router.push('/posts')"
          icon="arrow_back"
          flat
          round
        />
        <h1 class="font-semibold text-2xl uppercase mb-10">{{ postStore.post?.title }}</h1>
        <div v-html="postStore.post?.body"  class="max-w-md "></div>

        <div class="mt-10">
          <h1 class="text-xl font-bold mb-10">Symptoms</h1>
          <div>
            <ul>
              <li v-for="symptom in postStore.post?.disease.symptoms" :key="symptom.id" class="list-disc">
                {{ symptom.description }}
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-10">
          <h1 class="text-xl font-bold mb-10">Related Drugs</h1>
          <div>
            <ul>
              <li v-for="drug in postStore.post?.disease.drugs" :key="drug.id" class="list-disc">
                {{ drug.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>



    <div class="mt-20">
      <!-- Comment form -->
      <comment-form :postId="postStore.post?.id as number" />

      <!-- Comment section -->
      <!-- show first two comments -->
      <q-spinner-dots size="2rem" class="q-ml-auto q-mr-xl" v-if="globalStore.typing" />
      <comment-section
        :comments="postStore.post?.comments?.slice(0, 2) as Comments[]"
        v-if="!showComments"
      />
      <div class="flex mr-5">
        <button
          @click="toggleCommentShow"
          class="font-semibold text-blue-500 p-2 rounded-lg hover:text-blue-700 q-ml-auto"
          style="width: fit-content"
          v-if="postStore.post?.comments?.length! > 2"
        >
          {{ showComments ? 'Hide Comments' : 'Show more' }}
        </button>
      </div>
      <comment-section
        :comments="postStore.post?.comments as Comments[]"
        v-if="showComments"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Comments } from 'src/stores/Posts';
import { usePostStore } from 'src/stores/Posts';
import CommentForm from 'src/components/CommentForm.vue';
import { useGlobalStore } from 'src/stores/global';

import { useRouter } from 'vue-router';
import CommentSection from 'src/components/CommentSection.vue';

const router = useRouter();
const postStore = usePostStore();
const globalStore = useGlobalStore();

const showComments = ref(false);
function toggleCommentShow() {
  showComments.value = !showComments.value;
}

onMounted(() => {
  postStore.fetchPost(Number(router.currentRoute.value.params.id));
  console.log('id', router.currentRoute.value.params.id);
  console.log('post', postStore.posts);
});
</script>
