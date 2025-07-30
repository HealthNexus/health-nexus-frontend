<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row items-center q-mb-md">
        <div class="col">
          <h2>Admin Orders</h2>
        </div>
        <div class="col-auto">
          <q-btn color="primary" label="Refresh" @click="fetchOrders" :loading="loading" />
        </div>
      </div>
      <div class="row q-mb-md">
        <div class="col-12 col-md-2 q-mr-md">
          <q-select
            v-model="filters.status"
            :options="statusOptions"
            label="Status"
            clearable
            dense
            option-value="value"
            option-label="label"
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-md-2 q-mr-md">
          <q-select
            v-model="filters.payment_status"
            :options="paymentStatusOptions"
            label="Payment"
            clearable
            dense
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-md-2 q-mr-md">
          <q-input v-model="filters.search" label="Search" dense clearable />
        </div>
        <!-- Date filters removed -->
        <!-- Filter button removed: filtering is now reactive -->
      </div>
      <q-table
        :rows="filteredOrders"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
        :rows-per-page-options="[10, 20, 50]"
        @request="onRequest"
      >
        <template v-slot:body-cell-status="props">
          <q-chip :color="props.row.status?.color || 'grey'" text-color="white">{{ props.row.status?.label || '-' }}</q-chip>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-btn dense flat icon="visibility" @click="viewOrder(props.row.id)" />
        </template>
      </q-table>
      <q-inner-loading :showing="loading" />
      <q-banner v-if="error" class="bg-red-2 text-red-10 q-mt-md">{{ error }}</q-banner>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const filters = ref({
  status: '', // should match status.value from API (e.g. 'placed', 'delivering', ...)
  payment_status: '', // should match payment.status from API (e.g. 'PAID', ...)
  search: ''
});

const statusOptions = [
  { label: 'Placed', value: 'placed' },
  { label: 'Delivering', value: 'delivering' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' }
];
const paymentStatusOptions = [
  { label: 'Paid', value: 'PAID' },
  { label: 'Unpaid', value: 'UNPAID' },
  { label: 'Refunded', value: 'REFUNDED' }
];
import { ref, onMounted } from 'vue';
import { listOrders } from '../services/adminOrders';
import { useRouter } from 'vue-router';

const allOrders = ref<Order[]>([]); // Store all fetched orders
const loading = ref(false);
const error = ref('');
const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 });
const router = useRouter();

import type { Order as BaseOrder } from '../services/adminOrders.types';

type Order = BaseOrder & {
  delivery_address?: string;
};

interface QTableColumn {
  name: string;
  label: string;
  field: string | ((row: Order) => unknown);
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

const columns: QTableColumn[] = [
  { name: 'id', label: 'Order ID', field: 'id', align: 'left', sortable: true },
  { name: 'order_number', label: 'Order Number', field: 'order_number', align: 'left' },
  { name: 'status', label: 'Status', field: (row: Order) => row.status?.label || '-', align: 'left', sortable: true },
  { name: 'payment_status', label: 'Payment', field: (row: Order) => row.payment?.status || '-', align: 'left' },
  { name: 'created_at', label: 'Created', field: 'created_at', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'left' }
];


async function fetchOrders() {
  loading.value = true;
  error.value = '';
  try {
    // Fetch all orders (no filters, no pagination)
    const data = await listOrders({});
    allOrders.value = data.data;
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


import { computed, watch } from 'vue';

const filteredOrders = computed(() => {
  let filtered = allOrders.value;
  if (filters.value.status) {
    filtered = filtered.filter(order =>
      typeof order.status?.value === 'string' &&
      order.status.value.toLowerCase() === filters.value.status.toLowerCase()
    );
  }
  if (filters.value.payment_status) {
    filtered = filtered.filter(order =>
      typeof order.payment?.status === 'string' &&
      order.payment.status.toLowerCase() === filters.value.payment_status.toLowerCase()
    );
  }
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(order => {
      return (
        String(order.id).toLowerCase().includes(search) ||
        (order.order_number && order.order_number.toLowerCase().includes(search)) ||
        (order.status?.value && order.status.value.toLowerCase().includes(search)) ||
        (order.status?.label && order.status.label.toLowerCase().includes(search)) ||
        (order.payment?.status && order.payment.status.toLowerCase().includes(search)) ||
        (order.phone_number && order.phone_number.toLowerCase().includes(search)) ||
        (order.delivery_address && order.delivery_address.toLowerCase().includes(search))
      );
    });
  }
  // Date filtering removed

  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage;
  const end = start + pagination.value.rowsPerPage;
  return filtered.slice(start, end);
});

// Reset to first page and update rowsNumber when filters change
watch(filters, () => {
  pagination.value.page = 1;
  pagination.value.rowsNumber = filteredOrdersUnpaginated.value.length;
});

// Compute unpaginated filtered orders for rowsNumber
const filteredOrdersUnpaginated = computed(() => {
  let filtered = allOrders.value;
  if (filters.value.status) {
    filtered = filtered.filter(order =>
      typeof order.status?.value === 'string' &&
      order.status.value.toLowerCase() === filters.value.status.toLowerCase()
    );
  }
  if (filters.value.payment_status) {
    filtered = filtered.filter(order =>
      typeof order.payment?.status === 'string' &&
      order.payment.status.toLowerCase() === filters.value.payment_status.toLowerCase()
    );
  }
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(order => {
      return (
        String(order.id).toLowerCase().includes(search) ||
        (order.order_number && order.order_number.toLowerCase().includes(search)) ||
        (order.status?.value && order.status.value.toLowerCase().includes(search)) ||
        (order.status?.label && order.status.label.toLowerCase().includes(search)) ||
        (order.payment?.status && order.payment.status.toLowerCase().includes(search)) ||
        (order.phone_number && order.phone_number.toLowerCase().includes(search)) ||
        (order.delivery_address && order.delivery_address.toLowerCase().includes(search))
      );
    });
  }
  // Date filtering removed
  return filtered;
});



function onRequest(request: {
  pagination: { sortBy: string; descending: boolean; page: number; rowsPerPage: number };
  filter?: unknown;
  getCellValue: (col: unknown, row: unknown) => unknown;
}) {
  pagination.value.page = request.pagination.page;
  pagination.value.rowsPerPage = request.pagination.rowsPerPage;
  pagination.value.rowsNumber = filteredOrdersUnpaginated.value.length;
}

function viewOrder(orderId: number) {
  router.push({ name: 'admin.order.details', params: { order: orderId } });
}

onMounted(() => {
  fetchOrders();
});
</script>
