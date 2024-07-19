<template>
  <button
  @click="toggleRepliesShow"
  class="font-semibold hover:text-blue-500"
  >
    {{ showReplies ? 'Hide Replies' : 'Show Replies' }}
  </button>
<div v-if="showReplies">
  <q-chat-message
  bg-color="black"
  text-color="white"
  v-for="reply in replies" :key="reply.id"
  >
  <template v-slot:name>{{  reply.writer.name  }}</template>
  <template v-slot:avatar>
    <img
      class="q-message-avatar q-message-avatar--received"
      src="https://cdn.quasar.dev/img/avatar2.jpg"
    >
  </template>

  <div>
    {{  reply.body  }}
  </div>

  <!-- <q-spinner-dots size="2rem" /> -->
</q-chat-message>
</div>
</template>

<script lang="ts" setup>
import { Replies } from 'src/stores/Posts';
import { ref } from 'vue';

//define props
const props=defineProps<{
  replies: Replies[];
}>();

const showReplies = ref(false);

function toggleRepliesShow(){
  showReplies.value = !showReplies.value;
}

console.log('props', props.replies);

</script>
