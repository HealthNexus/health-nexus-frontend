<template>
  <q-page class="flex flex-center">
    <q-card style="max-width: 500px;">
     <q-card-section horizontal>
       <q-image>
          <img src="https://b" alt="My name">
       </q-image>
       <q-card-section>
        {{name}} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam placeat molestias doloribus reprehenderit tempora enim praesentium consectetur deleniti sunt reiciendis accusantium atque beatae eligendi, ratione quos officiis aut labore ad.
       </q-card-section>
     </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
//import centeredContainer from '../components/CenteredContainer.vue';

let name = ref('My name');
</script>
