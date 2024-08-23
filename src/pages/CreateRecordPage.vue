<template>
  <q-page padding>
    <form @submit.prevent="createRecord">
      <center>
        <h1 class="text-xl mt-5 font-bold">Create Patient Record</h1>
        <div class="max-w-md mt-10">
          <!-- Select patients -->
          <q-select
            v-model="selectedUser"
            :options="filteredUsers"
            option-label="name"
            option-value="id"
            use-input
            input-debounce="300"
            clearable
            label="Select a patient"
            :loading="loading"
            @input-value="userSearch = $event"
            :rules="[(val) => !!val || 'Please select a patient']"
          >
            <template v-slot:no-option> No users found </template>
          </q-select>

          <!-- Select Disease -->
          <q-select
            v-model="selectedDisease"
            :options="filteredDiseases"
            option-label="name"
            option-value="id"
            use-input
            input-debounce="300"
            clearable
            label="Select a disease"
            :loading="loading"
            @input-value="diseaseSearch = $event"
            :rules="[(val) => !!val || 'Please select a disease']"
          >
            <template v-slot:no-option> No disease found </template>
          </q-select>

          <!-- Select Symptom -->
          <q-select
            v-model="selectedSymptoms"
            :options="filteredSymptoms"
            option-label="description"
            option-value="id"
            use-input
            input-debounce="300"
            clearable
            multiple
            label="Select a symptoms"
            :loading="loading"
            @input-value="symptomSearch = $event"
            :rules="[(val) => !!val || 'Please select a symptom']"
          >
            <template v-slot:no-option> No symptom found </template>
          </q-select>

          <!-- Select Drug -->
          <q-select
            v-model="selectedDrugs"
            :options="filteredDrugs"
            option-label="name"
            option-value="id"
            use-input
            input-debounce="300"
            clearable
            multiple
            label="Select a drugs"
            :loading="loading"
            @input-value="drugSearch = $event"
            :rules="[(val) => !!val || 'Please select a drug']"
          >
            <template v-slot:no-option> No drug found </template>
          </q-select>

          <center>
            <button
              type="submit"
              class="font-semibold outline-1 bg-blue-500 text-white outline py-2 px-3 outline-blue-500 hover:bg-blue-800 hover:text-white rounded"
            >
              Submit
            </button>
          </center>
        </div>
      </center>
    </form>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from 'vue';
// import { useQuasar } from 'quasar';
import { useAuthStore, User } from 'src/stores/auth';
import { Disease, Drug, Symptom, useDiseaseStore } from 'src/stores/Disease';
import { useRecordStore } from 'src/stores/Record';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

// register stores
const authStore = useAuthStore();
const diseaseStore = useDiseaseStore();
const recordStore = useRecordStore();
const $q = useQuasar();
const router = useRouter();
// const $q = useQuasar();
const userSearch = ref('');
const diseaseSearch = ref('');
const symptomSearch = ref('');
const drugSearch = ref('');
const selectedUser: Ref<User | null> = ref(null);
const selectedDisease: Ref<Disease | null> = ref(null);
const selectedSymptoms: Ref<Symptom[]> = ref([]);
const selectedDrugs: Ref<Drug[]> = ref([]);
const patients: Ref<User[]> = ref([]);
const diseases: Ref<Disease[]> = ref([]);
const symptoms: Ref<Symptom[]> = ref([]);
const drugs: Ref<Drug[]> = ref([]);
const loading = ref(false);

const filteredUsers = computed(() => {
  const regex = new RegExp(userSearch.value, 'i');
  return patients.value.filter((patient) => regex.test(patient.name));
});

const filteredDiseases = computed(() => {
  const regex = new RegExp(diseaseSearch.value, 'i');
  return diseases.value.filter((disease) => regex.test(disease.name));
});

const filteredSymptoms = computed(() => {
  const regex = new RegExp(symptomSearch.value, 'i');
  return symptoms.value.filter((symptom) => regex.test(symptom.description));
});

const filteredDrugs = computed(() => {
  const regex = new RegExp(drugSearch.value, 'i');
  return drugs.value.filter((drug) => regex.test(drug.name));
});

// log form data
const createRecord = async () => {
  try {
    const patientId = selectedUser.value?.id;
    const diseaseId = selectedDisease.value?.id;
    const symptomIds = selectedSymptoms.value.map((s) => s.id);
    const drugIds = selectedDrugs.value.map((d) => d.id);
    await recordStore.createRecords(patientId, diseaseId, symptomIds, drugIds);

    console.log('Patient:', patientId);
    console.log('Disease:', diseaseId);
    console.log(
      'Symptoms:',
      selectedSymptoms.value.map((s) => s.id)
    );
    console.log(
      'Drugs:',
      selectedDrugs.value.map((d) => d.id)
    );
    $q.notify({
      type: 'positive',
      message: 'Record created successfully',
    });
    router.push('/records');
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  loading.value = true;
  await authStore.fetchPatients();
  patients.value = authStore.patients;
  await diseaseStore.fetchDiseases();
  diseases.value = diseaseStore.diseases;

  await diseaseStore.fetchSymptoms();
  symptoms.value = diseaseStore.symptoms;
  await diseaseStore.fetchDrugs();
  drugs.value = diseaseStore.drugs;
  loading.value = false;
});
</script>
