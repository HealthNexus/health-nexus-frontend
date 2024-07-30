<template>
  <q-page padding>
    <div>
      <!-- select between Bar, Pie and Line -->
      <div class="q-gutter-sm">
        <q-radio v-model="chartType" val="bar" label="Bar" />
        <q-radio v-model="chartType" val="line" label="Line" />
        <q-radio v-model="chartType" val="pie" label="Pie" />
      </div>
      <div v-for="data in dataSet" :key="data.data.datasets[0].label">
        <Bar :data="data.data" :options="data.options" v-if="chartType == 'bar'"/>
        <Line :data="data.data" :options="data.options" v-if="chartType == 'line'" :style="{height: '50vh', pointBorderColor:'#000'}"/>
        <Pie :data="data.data" :options="data.options" v-if="chartType == 'pie'"/>
      </div>
    </div>
    <center>
      <q-spinner-gears color="cyan" size="500" v-if="processing"/>
    </center>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { graphData, useRecordStore } from 'src/stores/Record';
import { useGlobalStore } from 'src/stores/global';
import { Bar, Line, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement)

//initialising stores
const recordStore = useRecordStore();
const globalStore = useGlobalStore();

const processing = ref(false);
const dataSet: Ref<graphData[]> = ref([]);
const chartType = ref('bar');



onMounted(() => {


  async function monthsVsDiseases() {
    processing.value = true;
    const data = await recordStore.generalMonthVsDiseaseCount(2019) as graphData;
    dataSet.value.push(data);
    processing.value = false;
  }
  globalStore.showSearch = false;

  monthsVsDiseases();


});

</script>

<style>
.try{
  background-color: #413d3d81;
}
</style>
