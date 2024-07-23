<template>
  <q-page padding>
    <div class="grid sm:grid-cols-3 gap-3" v-if="!processing">
      <q-card class="my-card" flat bordered v-for="disease in records.diseases" :key="disease.id">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{  disease.disease_name  }}</q-item-label>
            <q-item-label caption>
              {{  disease.date  }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-card-section horizontal>
          <q-card-section>
            <span class="font-bold uppercase text-green-500 text-center">MODOW</span>
            <ul>
              <li v-for="day in disease.modalDay" :key="day" class="list-item list-outside">
                {{  day }}
              </li>
            </ul>
            <ul>
              <span class="font-bold uppercase list-item list-outside text-green-500">MOMOY</span>
              <li v-for="month in disease.modalMonth" :key="month">
                {{  month }}
              </li>
            </ul>
        </q-card-section>

        <q-separator vertical />

          <q-card-section class="col-5">
            <ul>
                <li v-for="symptom in disease.symptoms" :key="symptom" class="list-disc ml-5">
                  {{  symptom }}
                </li>
            </ul>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>

    <center>
      <q-spinner-gears color="cyan" size="500" v-if="processing"/>
    </center>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { useRecordStore } from 'src/stores/Record';
import { Records } from 'src/stores/Record';

//initialising stores
const recordStore = useRecordStore();

const processing = ref(false);
const records: Ref<Records> = ref({patient_name: '', diseases: []});

onMounted(() => {

  async function fetchRecords() {
   try{
    processing.value = true;
    await recordStore.fetchRecords();
    records.value = recordStore.records;

   }catch(e){
    console.log(e);
  }finally{
    processing.value = false;
  }
}

  fetchRecords();

});

</script>
