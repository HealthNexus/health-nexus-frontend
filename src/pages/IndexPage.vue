<template>
  <q-page class="flex justify-between">
    <div class="mr-auto ml-auto mt-4">
      <!-- add a toolbar for searching and selecting post via a drop down menu-->
      <q-toolbar class="grid grid-flow-col gap-5">       <!-- Select Categories -->
          <q-select
            v-model="category"
            :loading="processing"
            :options="categories"
            option-label="name"
            label="Select Category"
            class="mb-8"
            style="width: 200px"
            outlined
            />

      </q-toolbar>

    </div>

    <div
      class="grid sm:grid-flow-row sm:grid-cols-3 gap-5 mt-5 ml-auto mr-auto p-5"
      style="max-width: 100vw" v-if="posts.length > 0">
      <q-card
        class=""
        style="max-width: 400px"
        v-for="post in searchPosts"
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
        <!-- show categories -->
        <q-card-actions>
          <q-chip
            v-for="category in post.disease.categories"
            :key="category.id"
            :label="category.name"
            class="q-mr-sm"
          />
        </q-card-actions>
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
import { computed, inject, onMounted, Ref, ref, watch} from 'vue';
// import axiosInstance from 'src/axios';
import { usePostStore } from 'src/stores/Posts';

import { useGlobalStore } from 'src/stores/global';

import { useRouter } from 'vue-router';
import { Post } from 'src/stores/Posts';

const router = useRouter();
const globalStore = useGlobalStore();

const postStore = usePostStore();
let search = ref(inject('search') as string);
const category: Ref<{id: number, name: string}> = ref({id: 0, name: 'All'});
const categories: Ref<{id: number, name: string}[]> = ref([]);
const processing = ref(false);

const posts: Ref<Post[]> = ref([]);


// watch changes in category
watch([() => category.value.name], async ([selectedCategory]) => {
  console.log('watch triggered:', selectedCategory);
  filterPostsByCategory(selectedCategory);
});

  //search through posts on the client side, utilise regex for complex searches
  const searchPosts = computed(()=>{
    const trimmedQuery = search.value.trim().toLowerCase();
    if(trimmedQuery == ''){
      return posts.value;
    }else {
      return posts.value.filter((post) => {
        return post.title.toLowerCase().includes(trimmedQuery) ||
             post.excerpt.toLowerCase().includes(trimmedQuery)||
             post.body.toLowerCase().includes(trimmedQuery)
      });
    }
  })
function filterPostsByCategory(selectedCategory: string) {
  // logic to filter posts without using postStore
  return posts.value.filter((post) => {
    return post.disease.categories.filter((category) => category.name === selectedCategory)
    })
  }



async function viewPost(id: number) {
  router.push({ name: 'post', params: { id } });
}

async function fetchCategories(){
  processing.value = true;

  categories.value = await postStore.fetchCategories();

  processing.value = false;

}

fetchCategories();

onMounted(() => {
  async function fetchData() {
    await postStore.fetchPosts();
    posts.value =postStore.posts;
    console.log(posts.value)
  }
  fetchData();
  globalStore.showSearch = true;

});
</script>

<style>
.card {
  max-width: 30vw;
}
</style>
