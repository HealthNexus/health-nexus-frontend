<template>
  <q-page class="flex justify-between">
    <div class="mr-auto ml-auto mt-4">
      <!-- add a toolbar for searching and selecting post via a drop down menu-->
      <q-toolbar class="grid grid-flow-col gap-5">

        {{ select.value }}
        {{ search }}
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
      class="grid sm:grid-flow-row sm:grid-cols-3 gap-5 mt-5 ml-auto mr-auto"
      style="max-width: 100vw"
    >
      <q-card
        class=""
        style="max-width: 400px"
        v-for="post in postStore.posts"
        :key="post.id"
      >
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" :ratio="16 / 9">
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
  </q-page>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, watch} from 'vue';
// import axiosInstance from 'src/axios';
import { usePostStore } from 'src/stores/Posts';

import { useRouter } from 'vue-router';

const router = useRouter();

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

onMounted(() => {
  postStore.fetchPosts();
});
</script>

<style>
.card {
  max-width: 30vw;
}
</style>
