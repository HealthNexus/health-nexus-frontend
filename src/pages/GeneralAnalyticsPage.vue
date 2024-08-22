<template>
  <q-page padding>
    <div>
      <!-- select between Bar, Pie and Line -->
      <div class="q-gutter-sm">
        <q-radio v-model="chartType" val="bar" label="Bar" />
        <q-radio v-model="chartType" val="line" label="Line" />
        <q-radio v-model="chartType" val="pie" label="Pie" />
      </div>
      <div class="flex flex-col">
        <template
          v-for="(data, index) in dataSet"
          :key="data.options.plugins!.title!.text"
        >
          <q-radio
            v-model="displayChart"
            :val="index"
            :label="data.options.plugins?.title?.text"
          />
        </template>
        <label v-if="displayChart == 0">
          Year:
          <input
          type="number"
          min="2018"
          max="2024"
          v-model="year"
          class="border border-black py-2 px-3 rounded-xl w-1/12"
        />
      </label>

      <div v-if="displayChart==1">
        <label>
          Start:
          <input
          type="number"
          min="2018"
          max="2024"
          v-model="start"
          class="border border-black py-2 px-3 rounded-xl w-1/12"
        />
        </label>
        <label>
          End:
          <input
          type="number"
          min="2018"
          max="2024"
          v-model="end"
          class="border border-black py-2 px-3 rounded-xl w-1/12"
        />
        </label>
      </div>
      </div>
      <div v-for="(data,index) in dataSet" :key="data.data.datasets[0].label">
        <div v-if="index == displayChart">
          <Bar
          :data="data.data"
          :options="data.options"
          v-if="chartType == 'bar'"
          :style="{ height: '50vh', pointBorderColor: '#000' }"
        />
        <Line
          :data="data.data"
          :options="data.options"
          v-if="chartType == 'line'"
          :style="{ height: '50vh', pointBorderColor: '#000' }"
        />
        <Pie
          :data="data.data"
          :options="data.options"
          v-if="chartType == 'pie'"
          :style="{ height: '50vh', pointBorderColor: '#000' }"
        />
        </div>
      </div>
    </div>
    <center>
      <q-spinner-gears color="cyan" size="500" v-if="processing" />
    </center>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from 'vue';
import { graphData, useRecordStore } from 'src/stores/Record';
import { useGlobalStore } from 'src/stores/global';
import { Bar, Line, Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement
);

//initialising stores
const recordStore = useRecordStore();
const globalStore = useGlobalStore();

const processing = ref(false);
const dataSet: Ref<graphData[]> = ref([]);
const chartType = ref('bar');
const displayChart = ref(0);
const year = ref(2024);
const start = ref(2019);
const end = ref(2024);

watch(year, monthsVsDiseases);
watch([start, end], yearsVsDiseases);
async function monthsVsDiseases() {
  processing.value = true;
  const data = (await recordStore.generalMonthVsDiseaseCount(year.value)) as graphData;
  dataSet.value[0] = data; //I assume that the months dataset should be the first in the dataset array followed by year dataset
  processing.value = false;
}
async function yearsVsDiseases() {
  processing.value = true;
  const data = (await recordStore.generalYearVsDiseaseCount(start.value, end.value)) as graphData;
  console.log('data',data)
  dataSet.value[1] = data; //I assume that the months dataset should be the first in the dataset array followed by year dataset
  processing.value = false;
}

onMounted(() => {
  globalStore.showSearch = false;

  monthsVsDiseases();
  yearsVsDiseases();
});
</script>

<style>
.try {
  background-color: #413d3d81;
}
</style>
