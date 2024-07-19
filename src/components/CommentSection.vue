<template>
  <div class="q-pa-md grid gap-3 justify-end">

      <div
        style="width: 100%; max-width: 400px"
        class="border border-green-100 p-5 bg-green-50 rounded-lg mb-3"
        v-for="comment in comments" :key="comment.id"

      >
        <q-chat-message
          :text="[comment.body]"
          sent
          text-color="white"
          :bg-color="authStore.user?.id == comment.writer.id?'green':'black'"
          :name="comment.writer.name"
          :stamp="new Date(comment.created_at).toDateString()"
        >
          <template v-slot:avatar>
            <img
              class="q-message-avatar q-message-avatar--sent"
              src="https://cdn.quasar.dev/img/avatar4.jpg"
            />
          </template>
        </q-chat-message>
        <div class="flex justify-end content-center" v-if="authStore?.user?.id == comment.writer.id">
          <button @click="deleteComment(comment.id)" >
            <q-icon name="delete" class="cursor-pointer"/>
            <span class="font-semibold text-red-500 hover:font-bold hover:text-red-700">Delete</span>
          </button>
        </div>
        <replies-component :replies="comment.replies as Replies[]"/>
      </div>
  </div>
</template>

<script lang="ts" setup>
import RepliesComponent from './RepliesComponent.vue';
import { Replies } from 'src/stores/Posts';
import { Comments } from 'src/stores/Posts';
import { useAuthStore } from 'src/stores/auth';
import { usePostStore } from 'src/stores/Posts';


const authStore = useAuthStore();
const postStore = usePostStore();

//delete comment
const deleteComment = async (id: number) => {
 try{
  const response = await postStore.deleteComment(id);
  postStore.fetchPost(postStore.post?.id as number);
  console.log(response);
 }catch(error){
  console.log(error);
 }
};

//define props
defineProps<{
  comments: Comments[];
}>();

</script>
