<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-btn flat icon="arrow_back" label="Back" @click="goBack" class="q-mb-md" />
      <q-banner v-if="error" class="bg-red-2 text-red-10 q-mb-md">{{ error }}</q-banner>
      <q-inner-loading :showing="loading" />
      <div v-if="order">
        <h2>Order #{{ order.order_number }}</h2>
        <!-- User removed as per resource -->
        <div class="q-mb-md">Status: <q-chip :color="order.status?.color || 'grey'" text-color="white">{{ order.status?.label || '-' }}</q-chip></div>
        <div class="q-mb-md">Payment: <b>{{ order.payment?.status || '-' }}</b> <span v-if="order.payment?.method">({{ order.payment.method }})</span></div>
        <div class="q-mb-md">Total: <b>{{ order.formatted_total_amount || '-' }}</b></div>
        <div class="q-mb-md">Created: <b>{{ order.created_at }}</b></div>
        <div class="q-mb-md">Phone: <b>{{ order.phone_number || '-' }}</b></div>
        <div class="q-mb-md">Delivery Address: <b>{{ order.delivery?.address || '-' }}</b></div>
        <q-separator class="q-my-md" />
        <h4>Items</h4>
        <q-table :rows="order.items || []" :columns="itemColumns" row-key="id" dense />
        <q-separator class="q-my-md" />
        <q-btn color="primary" label="Mark as Delivering" @click="markDelivering" :loading="actionLoading" v-if="order.status?.value === 'placed'" class="q-mr-md" />
        <q-btn color="secondary" label="Update Status" @click="showStatusDialog = true" :loading="actionLoading" />
      </div>
      <q-dialog v-model="showStatusDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Update Order Status</div>
            <q-select v-model="newStatus" :options="statusOptions" label="Status" dense option-value="value" option-label="label" emit-value map-options />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn color="primary" label="Update" @click="updateStatus" :loading="actionLoading" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getOrderDetails, updateOrderStatus, markOrderDelivering } from '../services/adminOrders';
import type { Order as BaseOrder, OrderItem } from '../services/adminOrders.types';

type Order = BaseOrder & {
  delivery?: {
    address?: string;
    area?: string;
    landmark?: string;
    fee?: number;
    formatted_fee?: string;
    notes?: string;
  };
};

const route = useRoute();
const router = useRouter();
const order = ref<Order | null>(null);
const loading = ref(false);
const error = ref('');
const actionLoading = ref(false);
const showStatusDialog = ref(false);
const newStatus = ref('');

const statusOptions = [
  { label: 'Placed', value: 'placed' },
  { label: 'Delivering', value: 'delivering' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' }
];

interface QTableColumn {
  name: string;
  label: string;
  field: string | ((row: OrderItem) => unknown);
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

const itemColumns: QTableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'order_id', label: 'Order ID', field: 'id', align: 'left' },
  { name: 'quantity', label: 'Qty', field: 'quantity', align: 'right' },
  { name: 'price', label: 'Price', field: 'formatted_unit_price', align: 'right' },
  { name: 'total', label: 'Total', field: 'formatted_total_price', align: 'right' }
];

function goBack() {
  router.back();
}

async function fetchOrder() {
  loading.value = true;
  error.value = '';
  try {
    let orderId = route.params.order;
    if (Array.isArray(orderId)) {
      orderId = orderId[0];
    }
    const data = await getOrderDetails(orderId as string | number);
    order.value = data;
    newStatus.value = data.status;
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null) {
      const e = err as { response?: { data?: { message?: string } }, message?: string };
      error.value = e?.response?.data?.message || e?.message || 'Failed to load order.';
    } else {
      error.value = 'Failed to load order.';
    }
  } finally {
    loading.value = false;
  }
}

async function updateStatus() {
  actionLoading.value = true;
  try {
    if (!order.value) return;
    const result = await updateOrderStatus(order.value.id, newStatus.value);
    if (result.status === 'success') {
      showStatusDialog.value = false;
      fetchOrder();
    } else {
      error.value = result.message || 'Failed to update status.';
    }
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null) {
      const e = err as { response?: { data?: { message?: string } }, message?: string };
      error.value = e?.response?.data?.message || e?.message || 'Failed to update status.';
    } else {
      error.value = 'Failed to update status.';
    }
  } finally {
    actionLoading.value = false;
  }
}

async function markDelivering() {
  actionLoading.value = true;
  try {
    if (!order.value) return;
    const result = await markOrderDelivering(order.value.id);
    if (result.status === 'success') {
      fetchOrder();
    } else {
      error.value = result.message || 'Failed to mark as delivering.';
    }
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null) {
      const e = err as { response?: { data?: { message?: string } }, message?: string };
      error.value = e?.response?.data?.message || e?.message || 'Failed to mark as delivering.';
    } else {
      error.value = 'Failed to mark as delivering.';
    }
  } finally {
    actionLoading.value = false;
  }
}

onMounted(() => {
  fetchOrder();
});
</script>
