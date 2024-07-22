<template>
  <q-page class="flex justify-between">
    <div class="mr-auto ml-auto mt-4">
      <!-- add a toolbar for searching and selecting post via a drop down menu-->
      <q-toolbar class="grid grid-flow-col gap-5">
        <button
        class="underline hover:text-blue-500"
        @click="fetchPosts"
        >All</button>
        <q-select
          v-model="select"
          :options="
            [
              {label: 'All Posts', value:'all'},
              {label: 'viral', value:'virus'},
              {label: 'bacterial', value:'bacteria'},
              {label: 'fungal', value:'fungi'},
              {label: 'chronic', value:'chronic'},
              {label: 'genetic', value:'genetic'},
            ]
          "
          label="Select a post"
          dense
          outlined
          class="sm:w-44 w-32"

        />
      </q-toolbar>

    </div>

    <div
      class="grid sm:grid-flow-row sm:grid-cols-3 gap-5 mt-5 ml-auto mr-auto p-5"
      style="max-width: 100vw" v-if="postStore.posts.length > 0">
      <q-card
        class=""
        style="max-width: 400px"
        v-for="post in postStore.posts"
        :key="post.id"
      >
        <q-img :src="post?.thumbnail ?? `https://picsum.photos/id/${post.id + 10}/800/400`" :ratio="16 / 9">
          <div class="absolute-bottom text-h6">
            {{ post.title }}
          </div>
        </q-img>
        <q-card-section>
          {{ post.excerpt }}
        </q-card-section>
        <div class="flex justify-end">
          <q-btn flat>
            <q-icon name="keyboard_double_arrow_right" @click="viewPost(post.id)" />
          </q-btn>
        </div>
      </q-card>
    </div>
    <!-- Else show No Post found that matches the search -->
    <div class="grid grid-flow-row q-mx-auto content-center text-xl font-bold " v-else>
      <!-- Big Search Icon -->
      <h1>
        No Post found
        <q-icon name="search" size="100" />
        <q-spinner />
      </h1>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, watch} from 'vue';
// import axiosInstance from 'src/axios';
import { usePostStore } from 'src/stores/Posts';

import { useGlobalStore } from 'src/stores/global';

import { useRouter } from 'vue-router';

const router = useRouter();
const globalStore = useGlobalStore();

const postStore = usePostStore();
let search = ref(inject('search') as string);
let select = ref({label: '', value: ''});


//a watcher to watch changes in search
watch([() => search.value, () => select.value.value], async ([newSearch, newSelect]) => {
  console.log('watch triggered:', newSearch, newSelect);
  postStore.searchPosts(newSearch, newSelect);
});



async function viewPost(id: number) {
  router.push({ name: 'post', params: { id } });
}

async function fetchPosts() {
  postStore.fetchPosts();
  search.value = '';
}

onMounted(() => {
  postStore.fetchPosts();
  globalStore.showSearch = true;

});
</script>

<style>
.card {
  max-width: 30vw;
}
</style>
