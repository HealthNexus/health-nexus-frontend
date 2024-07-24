<template>
  <q-page padding>
    <button class="font-semibold text-black my-10" @click="showAnalytics = !showAnalytics">{{  showAnalytics?'Hide Analytics' : 'Show Analytics'  }}</button>
    <div class="grid sm:grid-cols-3 gap-3" v-if="!processing && !showAnalytics">
      <q-card class="my-card" flat bordered v-for="disease in searchRecords" :key="disease.id">
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

    <div v-if="showAnalytics">
      <!-- select between Bar, Pie and Line -->
      <div class="q-gutter-sm">
        <q-radio v-model="chartType" val="bar" label="Bar" />
        <q-radio v-model="chartType" val="line" label="Line" />
        <q-radio v-model="chartType" val="pie" label="Pie" />
      </div>
      <div v-for="data in dataSet" :key="data.data.datasets[0].label">
        <Bar :data="data.data" :options="data.options" v-if="chartType == 'bar'"/>
        <Line :data="data.data" :options="data.options" v-if="chartType == 'line'"/>
        <Pie :data="data.data" :options="data.options" v-if="chartType == 'pie'"/>
      </div>
    </div>
    <center>
      <q-spinner-gears color="cyan" size="500" v-if="processing"/>
    </center>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from 'vue';
import { graphData, useRecordStore } from 'src/stores/Record';
import { Records } from 'src/stores/Record';
import { useGlobalStore } from 'src/stores/global';
import { inject } from 'vue';
import { Bar, Line, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement)

//initialising stores
const recordStore = useRecordStore();
const globalStore = useGlobalStore();

const processing = ref(false);
const records: Ref<Records> = ref({patient_name: '', diseases: []});
const search = ref(inject('search') as string);
const showAnalytics = ref(false);
const dataSet: Ref<graphData[]> = ref([]);
const chartType = ref('bar');



  const searchRecords = computed(()=>{
    const trimmedQuery = search.value.trim().toLowerCase();
    const searchTerms = trimmedQuery.split(' ');
    // Create regex patterns for each search term
    const regexes = searchTerms.map(term => new RegExp(term, 'i'));
    if(trimmedQuery == ''){
      return records.value.diseases;
    }else {
      return records.value.diseases.filter((disease) => {
        return regexes.some(regex=> regex.test(disease.disease_name))||
              disease.symptoms.filter(symptom=>regexes.some(regex=>regex.test(symptom))).length > 0||
              disease.modalDay.filter(day=>regexes.some(regex=>regex.test(day))).length>0||
              disease.modalMonth.filter(month=>regexes.some(regex=>regex.test(month))).length>0||
              regexes.some(regex=>regex.test(disease.date))
      });
    }
  })


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
  async function fetchData(){
    try{
      processing.value = true;
      await recordStore.fetchData();
      dataSet.value = recordStore.data;
    }catch(e){
      console.log(e);
    }finally{
      processing.value = false;
    }
  }

  globalStore.showSearch = true;

  fetchRecords();
  fetchData();

});

</script>
