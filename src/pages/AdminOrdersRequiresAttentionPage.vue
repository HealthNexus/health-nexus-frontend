<template>
  <q-page padding>
    <div class="q-pa-md">
      <h2>Orders Requiring Attention</h2>
      <q-banner v-if="error" class="bg-red-2 text-red-10 q-mb-md">{{ error }}</q-banner>
      <q-inner-loading :showing="loading" />
      <q-table
        v-if="orders.length > 0"
        :rows="orders"
        :columns="columns"
        row-key="id"
        dense
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        @row-click="goToOrderDetails"
      />
      <div v-else-if="!loading && !error" class="q-mt-md text-grey">No orders require attention.</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getOrdersRequiringAttention } from '../services/adminOrders';

interface OrderUser {
  id: number;
  name: string;
}

interface Order {
  id: number;
  user?: OrderUser;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
}

const orders = ref<Order[]>([]);
const loading = ref(false);
const error = ref('');
const router = useRouter();

interface QTableColumn {
  name: string;
  label: string;
  field: string | ((row: Order) => unknown);
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

const columns: QTableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'user', label: 'User', field: (row: Order) => row.user?.name || '-', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'payment_status', label: 'Payment', field: 'payment_status', align: 'left' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'created_at', label: 'Created', field: 'created_at', align: 'left' }
];

async function fetchOrders() {
  loading.value = true;
  error.value = '';
  try {
    const data = await getOrdersRequiringAttention();
    orders.value = data.data;
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null) {
      const e = err as { response?: { data?: { message?: string } }, message?: string };
      error.value = e?.response?.data?.message || e?.message || 'Failed to load orders.';
    } else {
      error.value = 'Failed to load orders.';
    }
  } finally {
    loading.value = false;
  }
}


function goToOrderDetails(evt: Event, row: Order) {
  router.push({ name: 'admin.order.details', params: { order: row.id } });
}

onMounted(() => {
  fetchOrders();
});
</script>
