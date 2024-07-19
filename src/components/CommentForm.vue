<template>
  <!-- design comment form -->
  <div class="q-ml-auto mr-5" style="width: 100%; max-width: 400px">
      <form class="flex flex-col">

        <q-input
          v-model="comment"
          type="textarea"
          placeholder="Add your comment"
          dense
          autogrow
          counter
          color="black"
          clearable
        />
        <input type="submit" value="comment" @click="submitComment" class="bg-blue-700 w-fit self-end py-2 px-3 rounded-full text-white font-semibold hover:bg-blue-500 hover:font-bold" />
      </form>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { usePostStore } from 'src/stores/Posts';
import { useGlobalStore } from 'src/stores/global';
const postStore = usePostStore();
const globalStore = useGlobalStore();

//define props
const props = defineProps<{
  postId: number;
}>();

const comment = ref('');

//watch comment
watch(comment, (newVal) => {
  if (newVal.length > 0) {
    globalStore.typing = true;
  } else {
    globalStore.typing = false;
  }
});

const submitComment = async () => {
 try{
  const response = await postStore.postComment(props.postId, comment.value);
  postStore.fetchPost(props.postId);
  console.log(response);
  comment.value = '';
 }catch(error){
  console.log(error);
 }
};
</script>
