<template>
  <div class="q-pa-md grid gap-3 justify-end">
    <button
    @click="toggleCommentShow"
    class="font-semibold  text-blue-500 p-2 rounded-lg hover:text-blue-700"
    style="width: fit-content; margin-left: auto;"
    >
   {{ showComments ? 'Hide Comments' : 'Show Comments' }}
  </button>
    <div  v-show="showComments">
      <div
        style="width: 100%; max-width: 400px"
        class="border border-green-100 p-5 bg-green-50 rounded-lg mb-3"
        v-for="comment in comments" :key="comment.id"

      >
        <q-chat-message
          :text="[comment.body]"
          sent
          text-color="white"
          bg-color="green"
        >
          <template v-slot:name>{{comment.writer.name}}</template>
          <template v-slot:stamp>{{new Date(comment.created_at).toDateString()}}</template>
          <template v-slot:avatar>
            <img
              class="q-message-avatar q-message-avatar--sent"
              src="https://cdn.quasar.dev/img/avatar4.jpg"
            />
          </template>
        </q-chat-message>
        <replies-component :replies="comment.replies as Replies[]"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import RepliesComponent from './RepliesComponent.vue';
import { Replies } from 'src/stores/Posts';
import { Comments } from 'src/stores/Posts';
import { ref } from 'vue';

//define props
defineProps<{
  comments: Comments[];
}>();

const showComments = ref(false);
function toggleCommentShow(){
  showComments.value = !showComments.value;
}
</script>
