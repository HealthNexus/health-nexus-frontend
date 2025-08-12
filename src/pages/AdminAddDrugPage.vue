<template>
  <q-page padding>
    <div class="q-pa-md" style="max-width: 600px; margin: auto;">
      <h2>Add Drug</h2>
      <q-form @submit.prevent="onSubmit" ref="formRef">
        <q-input v-model="form.name" label="Name" :error="!!errors.name" :error-message="errors.name?.[0]" required class="q-mb-md" />
        <q-input v-model="form.slug" label="Slug (optional)" :error="!!errors.slug" :error-message="errors.slug?.[0]" class="q-mb-md" />
        <q-input v-model="form.description" label="Description" type="textarea" :error="!!errors.description" :error-message="errors.description?.[0]" class="q-mb-md" />
        <q-input v-model.number="form.price" label="Price" type="number" :error="!!errors.price" :error-message="errors.price?.[0]" required class="q-mb-md" min="0" step="0.01" />
        <q-input v-model.number="form.stock" label="Stock" type="number" :error="!!errors.stock" :error-message="errors.stock?.[0]" required class="q-mb-md" min="0" />
        <q-input v-model="form.expiry_date" label="Expiry Date" type="date" :error="!!errors.expiry_date" :error-message="errors.expiry_date?.[0]" class="q-mb-md" />
        <q-select v-model="form.status" :options="statusOptions" label="Status" :error="!!errors.status" :error-message="errors.status?.[0]" required class="q-mb-md" emit-value map-options />
        <q-select v-model="form.category_ids" :options="categoryOptions" label="Categories" multiple :error="!!errors.category_ids" :error-message="errors.category_ids?.[0]" required class="q-mb-md" emit-value map-options />
        <q-select v-model="form.disease_ids" :options="diseaseOptions" label="Diseases" multiple :error="!!errors.disease_ids" :error-message="errors.disease_ids?.[0]" class="q-mb-md" emit-value map-options />
        <q-file
          v-model="form.image"
          label="Upload Image"
          accept="image/*"
          :error="!!errors.image"
          :error-message="errors.image?.[0]"
          class="q-mb-md"
          @rejected="onRejected"
        >
          <template v-slot:prepend>
            <q-icon name="image" />
          </template>
        </q-file>
        <div v-if="imageSrc" class="q-mb-md">
          <q-img :src="imageSrc" :ratio="16/9" class="block max-w-md" />
        </div>
        <div class="q-mt-md">
          <q-btn type="submit" color="primary" label="Add Drug" :loading="loading" />
          <q-btn flat label="Reset" @click="onReset" class="q-ml-sm" />
        </div>
      </q-form>
      <q-banner v-if="successMessage" class="bg-green-2 text-green-10 q-mt-md">{{ successMessage }}</q-banner>
      <q-banner v-if="errorMessage" class="bg-red-2 text-red-10 q-mt-md">{{ errorMessage }}</q-banner>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useQuasar, QRejectedEntry } from 'quasar';
const $q = useQuasar();
import { addDrug, fetchDrugCategories, fetchDiseases, Category, Disease } from '../services/drugs';

const formRef = ref();
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const errors = reactive<Record<string, string[]>>({});

const form = reactive({
  name: '',
  slug: '',
  description: '',
  price: null as number|null,
  stock: null as number|null,
  expiry_date: '',
  status: '',
  category_ids: [] as number[],
  disease_ids: [] as number[],
  image: null as File|null,
});

const imageSrc = ref('');
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];
const categoryOptions = ref<{ label: string; value: number }[]>([]);
const diseaseOptions = ref<{ label: string; value: number }[]>([]);

onMounted(async () => {
  loading.value = true;
  try {
    // Fetch categories and use .data property
    const categoriesResponse = await fetchDrugCategories();
    categoryOptions.value = categoriesResponse.data.map((c: Category) => ({ label: c.name, value: c.id }));

    // Fetch diseases and use .disease property
    const diseasesResponse = await fetchDiseases();
    diseaseOptions.value = (diseasesResponse.disease ?? []).map((d: Disease) => ({ label: d.name, value: d.id }));
  } catch (e: unknown) {
    let msg = '';
    if (typeof e === 'object' && e && 'message' in e) {
      msg = (e as { message?: string }).message || '';
    }
    errorMessage.value = 'Failed to load categories or diseases.' + (msg ? ' ' + msg : '');
  } finally {
    loading.value = false;
  }
});

function onRejected(rejectedEntries: QRejectedEntry[]) {
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
  });
}

watch(() => form.image, (file: File | null) => {
  if (file) {
    imageSrc.value = URL.createObjectURL(file);
  } else {
    imageSrc.value = '';
  }
});

function onReset() {
  Object.assign(form, {
    name: '', slug: '', description: '', price: null, stock: null, expiry_date: '', status: '', category_ids: [], disease_ids: [], image: null
  });
  Object.keys(errors).forEach(k => delete errors[k]);
  successMessage.value = '';
  errorMessage.value = '';
  formRef.value?.resetValidation?.();
}

async function onSubmit() {
  successMessage.value = '';
  errorMessage.value = '';
  Object.keys(errors).forEach(k => delete errors[k]);
  // Validation
  if (!form.name || !form.price || !form.stock || !form.status || !form.category_ids.length) {
    errorMessage.value = 'Please fill all required fields.';
    return;
  }
  loading.value = true;
  try {
    const fd = new FormData();
    fd.append('name', form.name);
    if (form.slug) fd.append('slug', form.slug);
    if (form.description) fd.append('description', form.description);
    fd.append('price', String(form.price));
    fd.append('stock', String(form.stock));
    if (form.expiry_date) fd.append('expiry_date', form.expiry_date);
    fd.append('status', form.status);
    form.category_ids.forEach(id => fd.append('category_ids[]', String(id)));
    form.disease_ids.forEach(id => fd.append('disease_ids[]', String(id)));
    if (form.image) fd.append('image', form.image);
    await addDrug(fd);
    successMessage.value = 'Drug added successfully!';
    onReset();
  } catch (err: unknown) {
    interface ApiError {
      response?: {
        status?: number;
        data?: { message?: string; errors?: Record<string, string[]> };
      };
      message?: string;
    }
    const apiErr = err as ApiError;
    if (typeof err === 'object' && err !== null && 'response' in apiErr && apiErr.response?.status === 422) {
      const data = apiErr.response?.data;
      errorMessage.value = data?.message || 'Validation failed.';
      Object.assign(errors, data?.errors || {});
    } else {
      errorMessage.value = apiErr.message || 'Failed to add drug.';
    }
  } finally {
    loading.value = false;
  }
}
</script>
