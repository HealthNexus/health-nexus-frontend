<!-- filepath: src/pages/OrderStatusPage.vue -->
<template>
  <q-page class="order-status-page">
    <div class="status-container">
      <!-- Header -->
      <div class="status-header q-pa-md">
        <h3 class="text-h4 text-weight-bold text-center q-mb-md">Order Status</h3>
        <p class="text-center text-grey-7">
          Track your medication delivery in real-time
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="pharmacyStore.loading" class="text-center q-pa-xl">
        <q-spinner-dots size="50px" color="primary" />
        <p class="q-mt-md">Loading order status...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="pharmacyStore.error" class="text-center q-pa-xl">
        <q-icon name="error" size="50px" color="negative" />
        <p class="text-negative q-mt-md">{{ pharmacyStore.error }}</p>
        <q-btn color="primary" label="Retry" @click="loadOrderStatus" />
      </div>

      <!-- Order Status Content -->
      <div v-else-if="orderStatus" class="status-content">
        <!-- Order Header -->
        <q-card class="order-header-card q-mb-lg">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <h5 class="text-weight-bold q-ma-none">Order #{{ orderStatus.order_number }}</h5>
                <p class="text-grey-7 q-ma-none">
                  Estimated Delivery: {{ formatDate(orderStatus.estimated_delivery || '') }}
                </p>
              </div>
              <q-chip
                :color="getStatusColor(orderStatus.status.value)"
                text-color="white"
                :icon="getStatusIcon(orderStatus.status.value)"
                size="lg"
              >
                {{ formatStatus(orderStatus.status.value) }}
              </q-chip>
            </div>
          </q-card-section>
        </q-card>

        <div class="row q-col-gutter-lg">
          <!-- Status Timeline -->
          <div class="col-12 col-lg-8">
            <q-card class="status-timeline-card">
              <q-card-section>
                <h6 class="text-weight-bold q-mb-md">Delivery Progress</h6>
                
                <q-timeline color="primary" class="status-timeline">
                  <q-timeline-entry
                    v-for="(step, index) in timelineSteps"
                    :key="index"
                    :title="step.title"
                    :subtitle="step.subtitle"
                    :icon="step.icon"
                    :color="step.completed ? 'positive' : (step.current ? 'primary' : 'grey-5')"
                  >
                    <div v-if="step.description" class="text-grey-7">
                      {{ step.description }}
                    </div>
                    <div v-if="step.timestamp" class="text-caption text-grey-6 q-mt-sm">
                      {{ formatDateTime(step.timestamp) }}
                    </div>
                  </q-timeline-entry>
                </q-timeline>
              </q-card-section>
            </q-card>

            <!-- Tracking Information -->
            <q-card v-if="orderStatus.tracking_number" class="tracking-card q-mt-lg">
              <q-card-section>
                <h6 class="text-weight-bold q-mb-md">Tracking Information</h6>
                
                <div class="tracking-info">
                  <div class="info-row">
                    <q-icon name="confirmation_number" color="primary" class="q-mr-sm" />
                    <span class="info-label">Tracking Number:</span>
                    <span class="info-value text-weight-bold">{{ orderStatus.tracking_number }}</span>
                  </div>
                  
                  <div v-if="orderStatus.current_location" class="info-row">
                    <q-icon name="place" color="primary" class="q-mr-sm" />
                    <span class="info-label">Current Location:</span>
                    <span class="info-value">{{ orderStatus.current_location }}</span>
                  </div>
                </div>

                <q-btn
                  color="primary"
                  outline
                  icon="refresh"
                  label="Refresh Status"
                  @click="loadOrderStatus"
                  class="q-mt-md"
                />
              </q-card-section>
            </q-card>
          </div>

          <!-- Order Details Sidebar -->
          <div class="col-12 col-lg-4">
            <!-- Order Summary -->
            <q-card class="order-summary-card q-mb-lg">
              <q-card-section>
                <h6 class="text-weight-bold q-mb-md">Order Summary</h6>
                
                <div v-if="currentOrder" class="order-items">
                  <div 
                    v-for="item in currentOrder.items" 
                    :key="item.drug_id"
                    class="order-item"
                  >
                    <div class="item-info">
                      <span class="item-name">{{ getDrugName(item.drug_id.toString()) }}</span>
                      <span class="item-quantity">× {{ item.quantity }}</span>
                    </div>
                    <span class="item-price">${{ (item.price??0 * item.quantity).toFixed(2) }}</span>
                  </div>
                  
                  <q-separator class="q-my-md" />
                  
                  <div class="total-row">
                    <span class="text-weight-bold">Total:</span>
                    <span class="text-weight-bold text-primary text-h6">
                      ${{ currentOrder.total.toFixed(2) }}
                    </span>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Contact Support -->
            <q-card class="support-card">
              <q-card-section>
                <h6 class="text-weight-bold q-mb-md">Need Help?</h6>
                <p class="text-body2 text-grey-7 q-mb-md">
                  Having issues with your order? Our support team is here to help.
                </p>
                
                <div class="support-actions q-gutter-sm">
                  <q-btn
                    color="primary"
                    outline
                    icon="phone"
                    label="Call Support"
                    size="sm"
                    class="full-width"
                    @click="callSupport"
                  />
                  <q-btn
                    color="secondary"
                    outline
                    icon="email"
                    label="Email Support"
                    size="sm"
                    class="full-width"
                    @click="emailSupport"
                  />
                  <q-btn
                    color="info"
                    outline
                    icon="chat"
                    label="Live Chat"
                    size="sm"
                    class="full-width"
                    @click="openLiveChat"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons text-center q-mt-xl">
          <q-btn
            color="primary"
            outline
            icon="arrow_back"
            label="Back to Pharmacy"
            :to="{ name: 'pharmacy' }"
            class="q-mr-md"
          />
          <q-btn
            v-if="canCancelOrder"
            color="negative"
            outline
            icon="cancel"
            label="Cancel Order"
            @click="confirmCancelOrder"
          />
        </div>
      </div>

      <!-- Order Not Found -->
      <div v-else class="not-found text-center q-pa-xl">
        <q-icon name="search_off" size="60px" color="grey-5" />
        <p class="text-grey-7 q-mt-md">Order not found</p>
        <q-btn
          color="primary"
          label="Go to Pharmacy"
          :to="{ name: 'pharmacy' }"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { usePharmacyStore } from '../stores/pharmacy';

// Composables
const route = useRoute();
const $q = useQuasar();
const pharmacyStore = usePharmacyStore();

// Local state
const refreshInterval = ref<NodeJS.Timeout | null>(null);

// Computed
const orderStatus = computed(() => pharmacyStore.orderStatus);
const currentOrder = computed(() => {
  const orderId = route.params.id as string;
  return pharmacyStore.orders.find(order => order.order_number === orderId);
});

const canCancelOrder = computed(() => {
  if (!orderStatus.value) return false;
  const cancelableStatuses = ['pending', 'confirmed', 'processing'];
  const statusValue = typeof orderStatus.value.status === 'object' 
    ? orderStatus.value.status.value 
    : orderStatus.value.status;
  return cancelableStatuses.includes(statusValue.toLowerCase());
});

const timelineSteps = computed(() => {
  if (!orderStatus.value) return [];
  
  const statusValue = typeof orderStatus.value.status === 'object' 
    ? orderStatus.value.status.value 
    : orderStatus.value.status;
  const status = statusValue.toLowerCase();
  
  return [
    {
      title: 'Order Confirmed',
      subtitle: 'Your order has been received',
      icon: 'check_circle',
      completed: true,
      current: ['pending', 'confirmed'].includes(status),
      description: 'Order received and confirmed',
      timestamp: currentOrder.value?.created_at
    },
    {
      title: 'Delivering',
      subtitle: 'Your order is on the way',
      icon: 'local_shipping',
      completed: ['shipped', 'out_for_delivery', 'delivered'].includes(status),
      current: ['processing', 'shipped', 'out_for_delivery'].includes(status),
      description: 'Your medications are being prepared and delivered'
    },
    {
      title: 'Delivered',
      subtitle: 'Package has been delivered',
      icon: 'done_all',
      completed: status === 'delivered',
      current: status === 'delivered',
      description: 'Package has been successfully delivered'
    }
  ];
});

// Methods
const loadOrderStatus = async () => {
  const orderId = route.params.id as string;
  if (orderId) {
    try {
      await pharmacyStore.fetchOrderStatus(parseInt(orderId));
      
      if (orderStatus.value) {
        $q.notify({
          type: 'positive',
          message: 'Order status updated',
          position: 'bottom',
          timeout: 1500
        });
      }
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to load order status',
        position: 'bottom',
        timeout: 2500,
        actions: [
          {
            label: 'Retry',
            color: 'white',
            handler: () => loadOrderStatus()
          }
        ]
      });
    }
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    pending: 'orange',
    confirmed: 'blue',
    processing: 'purple',
    shipped: 'teal',
    out_for_delivery: 'indigo',
    delivered: 'positive',
    cancelled: 'negative'
  };
  return statusColors[status.toLowerCase()] || 'grey';
};

const getStatusIcon = (status: string) => {
  const statusIcons: Record<string, string> = {
    pending: 'schedule',
    confirmed: 'check_circle',
    processing: 'inventory',
    shipped: 'local_shipping',
    out_for_delivery: 'delivery_dining',
    delivered: 'done_all',
    cancelled: 'cancel'
  };
  return statusIcons[status.toLowerCase()] || 'help';
};

const getDrugName = (drugId: string) => {
  const drug = pharmacyStore.drugs.find(d => d.id === parseInt(drugId));
  return drug?.name || `Drug ID: ${drugId}`;
};

const confirmCancelOrder = () => {
  $q.dialog({
    title: 'Cancel Order',
    message: 'Are you sure you want to cancel this order? This action cannot be undone.',
    cancel: true,
    persistent: true
  }).onOk(() => {
    cancelOrder();
  });
};

const cancelOrder = async () => {
  try {
    $q.notify({
      type: 'ongoing',
      message: 'Processing cancellation request...',
      position: 'center',
      timeout: 0,
      group: 'order-cancellation'
    });

    // Implementation would call API to cancel order
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    
    $q.notify({
      type: 'warning',
      message: 'Order cancellation request submitted',
      position: 'center',
      timeout: 3000,
      group: 'order-cancellation',
      actions: [
        {
          label: 'View Status',
          color: 'white',
          handler: () => loadOrderStatus()
        }
      ]
    });
    
    // Refresh order status
    await loadOrderStatus();
    
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to cancel order. Please contact support.',
      position: 'center',
      timeout: 4000,
      group: 'order-cancellation',
      actions: [
        {
          label: 'Contact Support',
          color: 'white',
          handler: () => callSupport()
        },
        { icon: 'close', color: 'white', round: true }
      ]
    });
  }
};

const callSupport = () => {
  window.open('tel:+1-800-PHARMACY', '_self');
};

const emailSupport = () => {
  window.open('mailto:support@healthnexus.com?subject=Order Support - ' + route.params.id, '_blank');
};

const openLiveChat = () => {
  $q.notify({
    type: 'info',
    message: 'Live chat feature coming soon!',
    timeout: 2000
  });
};

// Auto-refresh status every 30 seconds
const startAutoRefresh = () => {
  refreshInterval.value = setInterval(async () => {
    if (orderStatus.value && !['delivered', 'cancelled'].includes(orderStatus.value.status.value.toLowerCase())) {
      const previousStatus = orderStatus.value.status.value;
      await loadOrderStatus();
      
      // Notify if status changed
      if (orderStatus.value && orderStatus.value.status.value !== previousStatus) {
        const newStatus = formatStatus(orderStatus.value.status.value);
        $q.notify({
          type: 'info',
          message: `Order status updated to: ${newStatus}`,
          position: 'top',
          timeout: 4000,
          icon: getStatusIcon(orderStatus.value.status.value),
          actions: [
            { icon: 'close', color: 'white', round: true }
          ]
        });
        
        // Special notification for final states
        if (orderStatus.value.status.value === 'delivered') {
          setTimeout(() => {
            $q.notify({
              type: 'positive',
              message: 'Your order has been delivered! 🎉',
              position: 'center',
              timeout: 5000,
              actions: [
                {
                  label: 'Rate Order',
                  color: 'white',
                  handler: () => {
                    $q.notify({
                      type: 'info',
                      message: 'Rating feature coming soon',
                      position: 'bottom',
                      timeout: 2000
                    });
                  }
                }
              ]
            });
          }, 1000);
        }
      }
    } else if (orderStatus.value && ['delivered', 'cancelled'].includes(orderStatus.value.status.value.toLowerCase())) {
      // Stop auto-refresh for final states
      stopAutoRefresh();
    }
  }, 30000); // 30 seconds
};

const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
    refreshInterval.value = null;
  }
};

// Lifecycle
onMounted(async () => {
  await loadOrderStatus();
  startAutoRefresh();
});

// Cleanup
onBeforeUnmount(() => {
  stopAutoRefresh();
});
</script>

<style scoped lang="scss">
.order-status-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.status-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.status-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 20px;
}

.order-header-card {
  border-radius: 12px;
  border-left: 4px solid #1976d2;
}

.status-timeline-card,
.tracking-card,
.order-summary-card,
.support-card {
  border-radius: 12px;
}

.status-timeline {
  .q-timeline__entry {
    margin-bottom: 20px;
  }
}

.tracking-info {
  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    
    .info-label {
      margin-right: 8px;
      min-width: 120px;
      color: #666;
    }
    
    .info-value {
      flex: 1;
    }
  }
}

.order-items {
  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .item-info {
      display: flex;
      flex-direction: column;
      
      .item-name {
        font-weight: 500;
      }
      
      .item-quantity {
        font-size: 0.85rem;
        color: #666;
      }
    }
    
    .item-price {
      font-weight: bold;
      color: #1976d2;
    }
  }
  
  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.support-actions {
  .q-btn {
    margin-bottom: 8px;
  }
}

.not-found {
  background: white;
  border-radius: 12px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .action-buttons {
    .q-btn {
      display: block;
      width: 100%;
      margin: 8px 0;
    }
  }
}
</style>
