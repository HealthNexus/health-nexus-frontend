<!-- filepath: src/pages/PaymentCallbackPage.vue -->
<template>
  <q-page class="payment-callback-page">
    <div class="callback-container">
      <!-- Loading State -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner-dots size="80px" color="primary" />
        <h4 class="text-h5 q-mt-lg">Verifying Payment</h4>
        <p class="text-grey-7">Please wait while we confirm your payment...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="paymentStatus === 'success'" class="success-state text-center q-pa-xl">
        <q-icon name="check_circle" size="80px" color="positive" />
        <h4 class="text-h4 text-positive q-mt-lg">Payment Successful!</h4>
        <p class="text-body1 q-mt-md">
          Your payment has been processed successfully.
        </p>
        <p class="text-body2 text-grey-7">
          Order #{{ orderNumber }} is now confirmed and being processed.
        </p>
        
        <div class="action-buttons q-mt-xl q-gutter-md">
          <q-btn
            color="primary"
            size="lg"
            label="Track Order"
            icon="visibility"
            @click="goToOrderStatus"
          />
          <q-btn
            color="secondary"
            size="lg"
            outline
            label="Continue Shopping"
            icon="shopping_cart"
            :to="{ name: 'pharmacy' }"
          />
        </div>
      </div>

      <!-- Failed State -->
      <div v-else-if="paymentStatus === 'failed'" class="failed-state text-center q-pa-xl">
        <q-icon name="error" size="80px" color="negative" />
        <h4 class="text-h4 text-negative q-mt-lg">Payment Failed</h4>
        <p class="text-body1 q-mt-md">
          We couldn't process your payment.
        </p>
        <p class="text-body2 text-grey-7" v-if="errorMessage">
          {{ errorMessage }}
        </p>
        
        <div class="action-buttons q-mt-xl q-gutter-md">
          <q-btn
            color="primary"
            size="lg"
            label="Try Again"
            icon="refresh"
            @click="retryPayment"
          />
          <q-btn
            color="grey"
            size="lg"
            outline
            label="Back to Cart"
            icon="shopping_cart"
            :to="{ name: 'checkout' }"
          />
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="paymentStatus === 'error'" class="error-state text-center q-pa-xl">
        <q-icon name="warning" size="80px" color="orange" />
        <h4 class="text-h4 text-orange q-mt-lg">Something Went Wrong</h4>
        <p class="text-body1 q-mt-md">
          We encountered an error while verifying your payment.
        </p>
        <p class="text-body2 text-grey-7" v-if="errorMessage">
          {{ errorMessage }}
        </p>
        
        <div class="action-buttons q-mt-xl q-gutter-md">
          <q-btn
            color="primary"
            size="lg"
            label="Check Order Status"
            icon="search"
            @click="checkOrderStatus"
          />
          <q-btn
            color="secondary"
            size="lg"
            outline
            label="Contact Support"
            icon="support_agent"
            @click="contactSupport"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { usePharmacyStore } from '../stores/pharmacy';

// Composables
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const pharmacyStore = usePharmacyStore();

// State
const loading = ref(true);
const paymentStatus = ref<'success' | 'failed' | 'error'>('success');
const orderNumber = ref<string>('');
const orderId = ref<number>(0);
const errorMessage = ref<string>('');

// Methods
const verifyPayment = async () => {
  try {
    const reference = route.query.reference as string;
    const trxref = route.query.trxref as string;
    
    if (!reference && !trxref) {
      throw new Error('Payment reference not found');
    }

    const paymentRef = reference || trxref;
    console.log('Verifying payment with reference:', paymentRef);

    const result = await pharmacyStore.verifyPaymentProcess(paymentRef);
    
    if (result && result.status === 'success') {
      paymentStatus.value = 'success';
      // The order should already exist, but let's refresh the order status
      if (result.data.metadata && result.data.metadata.order_id) {
        orderId.value = result.data.metadata.order_id as number;
        await pharmacyStore.fetchOrderStatus(orderId.value);
        if (pharmacyStore.orderStatus) {
          orderNumber.value = pharmacyStore.orderStatus.order_number;
        }
      }
      
      $q.notify({
        type: 'positive',
        message: 'Payment verified successfully!',
        position: 'top',
        timeout: 3000,
        icon: 'check_circle'
      });
    } else {
      paymentStatus.value = 'failed';
      errorMessage.value = result?.message || 'Payment verification failed';
      
      $q.notify({
        type: 'negative',
        message: 'Payment verification failed',
        position: 'top',
        timeout: 3000,
        icon: 'error'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    paymentStatus.value = 'error';
    errorMessage.value = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    $q.notify({
      type: 'negative',
      message: 'Error verifying payment',
      position: 'top',
      timeout: 3000,
      icon: 'warning'
    });
  } finally {
    loading.value = false;
  }
};

const goToOrderStatus = () => {
  if (orderId.value) {
    router.push({ 
      name: 'orderStatus', 
      params: { id: orderId.value.toString() } 
    });
  } else {
    $q.notify({
      type: 'warning',
      message: 'Order details not available. Please check your orders.',
      position: 'top',
      timeout: 3000
    });
    router.push({ name: 'pharmacy' });
  }
};

const retryPayment = () => {
  router.push({ name: 'checkout' });
};

const checkOrderStatus = () => {
  if (orderId.value) {
    goToOrderStatus();
  } else {
    // Redirect to a page where they can search for their order
    $q.notify({
      type: 'info',
      message: 'Please check your email for order details or contact support.',
      position: 'top',
      timeout: 4000
    });
    router.push({ name: 'pharmacy' });
  }
};

const contactSupport = () => {
  const email = 'support@healthnexus.com';
  const subject = 'Payment Issue - Reference: ' + (route.query.reference || route.query.trxref);
  const body = `Hi,\n\nI encountered an issue with my payment verification.\n\nPayment Reference: ${route.query.reference || route.query.trxref}\nError: ${errorMessage.value}\n\nPlease help me resolve this issue.\n\nThank you.`;
  
  window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
};

// Lifecycle
onMounted(() => {
  verifyPayment();
});
</script>

<style scoped lang="scss">
.payment-callback-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.callback-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.success-state,
.failed-state,
.error-state {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.action-buttons {
  .q-btn {
    min-width: 150px;
  }
}

@media (max-width: 600px) {
  .callback-container {
    padding: 10px;
  }
  
  .action-buttons {
    .q-btn {
      display: block;
      width: 100%;
      margin: 8px 0;
    }
  }
}
</style>
