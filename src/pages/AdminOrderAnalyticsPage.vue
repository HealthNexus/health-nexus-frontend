<template>
  <q-page padding>
    <div class="q-pa-md">
      <h2>Order Analytics</h2>
      <q-banner v-if="error" class="bg-red-2 text-red-10 q-mb-md">{{ error }}</q-banner>
      <q-inner-loading :showing="loading" />
      <div v-if="analytics">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-card class="q-mb-md">
              <q-card-section>
                <div class="text-h6">Total Orders</div>
                <div class="text-h4">{{ analytics.total_orders }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card class="q-mb-md">
              <q-card-section>
                <div class="text-h6">Total Revenue</div>
                <div class="text-h4">{{ analytics.total_revenue }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card class="q-mb-md">
              <q-card-section>
                <div class="text-h6">Orders by Status</div>
                <q-list dense>
                  <q-item v-for="(count, status) in analytics.orders_by_status" :key="status">
                    <q-item-section>{{ status }}</q-item-section>
                    <q-item-section side>{{ count }}</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <q-separator class="q-my-md" />
        <div>
          <div class="text-h6 q-mb-sm">Orders Over Time</div>
          <q-table :rows="(analytics && Array.isArray(analytics.orders_over_time) ? analytics.orders_over_time : [])" :columns="orderTimeColumns" row-key="date" dense />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getOrderAnalytics } from '../services/adminOrders';

interface Analytics {
  total_orders: number;
  total_revenue: number;
  orders_by_status: Record<string, number>;
  orders_over_time: { date: string; count: number }[];
}

const analytics = ref<Analytics | null>(null);
const loading = ref(false);
const error = ref('');

interface QTableColumn {
  name: string;
  label: string;
  field: string | ((row: { date: string; count: number }) => unknown);
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

const orderTimeColumns: QTableColumn[] = [
  { name: 'date', label: 'Date', field: 'date', align: 'left' },
  { name: 'count', label: 'Orders', field: 'count', align: 'right' }
];

async function fetchAnalytics() {
  loading.value = true;
  error.value = '';
  try {
    const data = await getOrderAnalytics();
    analytics.value = data;
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null) {
      const e = err as { response?: { data?: { message?: string } }, message?: string };
      error.value = e?.response?.data?.message || e?.message || 'Failed to load analytics.';
    } else {
      error.value = 'Failed to load analytics.';
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchAnalytics();
});
</script>
