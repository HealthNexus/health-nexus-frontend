<template>
  <h1 class="text-center font-bold text-2xl mt-10">Create Your Post</h1>
<center>
  <form class="p-5 gap-5 grid" style="height: 90vh; width: 70vw" v-if="!processing">
    <q-input v-model="title" label="Title" hint="Your title should be unique" counter
    :rules="[
      val => !!val ||'The excerpt is required',
      val => val.length >5 || 'The title must be more than 5 characters',
      ]"
    />
    <q-input
      v-model="excerpt"
      label="Excerpt"
      hint="It is a short description of your post"
      counter
      :rules="[
        val => !!val ||'The excerpt is required',
        val => val.length >= 30 || 'The excerpt must be more than 30 characters',
        ]"
    />

    <q-editor
      style="width: 100%"
      v-model="qeditor"
      :rules="[
        val => !!val ||'The body is required',
        val => val.length > 100 || 'The body must be more than 100 characters',
        ]"
      :dense="$q.screen.lt.md"
      :toolbar="[
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify'],
          },
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify'],
          },
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7',
            ],
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana',
            ],
          },
          'removeFormat',
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

        ['undo', 'redo'],
        ['viewsource'],
      ]"
      :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana',
      }"
    />

    <q-select
      v-model="disease"
      :options="diseases"
      option-label="name"
      label="Select Disease"
      class="mb-8"
      outlined
      :rules="[
        val => !!val ||'Please select a disease',
        ]"
    />

    <center>
      <q-file
        style="max-width: 300px"
        v-model="thumbnail"
        label="upload thumbnails"
        accept=".jpg, image/*"
        @rejected="onRejected"
          >
        <!-- image icon -->
        <template v-slot:prepend>
          <q-icon name="image" />
        </template>
      </q-file>
      <q-btn class="self-center" color="primary mt-5 mb-5" label="Submit" @click="submitPost" />
      <div>
        <q-img :src="imageSrc" :ratio="16 / 9" class="block max-w-md" />
      </div>
    </center>
  </form>
  <q-spinner-gears color="cyan" size="500" v-if="processing"/>
</center>
</template>

<script setup lan="ts">
import { ref } from 'vue';
import { useGlobalStore } from 'src/stores/global';
import { useDiseaseStore } from 'src/stores/Disease';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { useRouter } from 'vue-router';



const globalStore = useGlobalStore();
const diseaseStore = useDiseaseStore();
const $q = useQuasar();

const diseases = ref([]);
const imageSrc = ref('https://cdn.quasar.dev/img/parallax1.jpg');
globalStore.showSearch = false;
const qeditor = ref('default text');
const title = ref('');
const excerpt = ref('');
const disease = ref('');
const thumbnail = ref(null);
const processing = ref(false);
const router = useRouter();



const fetchDiseases = async () => {
  diseases.value = await diseaseStore.fetchDiseases();
  console.log(diseases.value);
};
fetchDiseases();

const submitPost = async () => {
  processing.value = true
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('excerpt', excerpt.value);
  formData.append('body', qeditor.value);
  formData.append('disease', disease.value);
  formData.append('disease_id', Number(disease.value.id));
  formData.append('thumbnail', thumbnail.value);
  console.log(formData);

  try{
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');

    const response = await axios.post('http://localhost:8000/api/posts/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      })

      router.push({ name: 'post', params: { id: response.data.post.id } });
      console.log('Form submitted:', response.data);
      $q.notify({
        type: 'positive',
        message: 'Post created successfully',
      });

  }catch(error){
    //if it is axios error, log error message
    if (error.response) {
      $q.notify({
        type: 'negative',
        message: error.response.data.message,
      });
      console.log(error.response.data);
    } else {
      $q.notify({
        type: 'negative',
        message: error.message,
      });
      console.log(error.message);
    }
  }finally{
    processing.value = false
  }
}


const onRejected = (rejectedEntries) => {
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
  });
};
</script>
