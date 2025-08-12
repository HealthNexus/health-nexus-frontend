<template>
  <q-page class="product-details-page">
    <!-- Loading State -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots size="50px" color="primary" />
      <p class="q-mt-md">Loading product details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center q-pa-xl">
      <q-icon name="error" size="50px" color="negative" />
      <p class="text-negative q-mt-md">{{ error }}</p>
      <q-btn color="primary" label="Go Back" @click="$router.go(-1)" />
    </div>

    <!-- Product Details -->
    <div v-else-if="drug" class="product-content">
      <!-- Breadcrumb Navigation -->
      <q-breadcrumbs class="q-pa-md">
        <q-breadcrumbs-el label="E-Pharmacy" :to="{ name: 'pharmacy' }" />
        <q-breadcrumbs-el :label="drug.category || 'General'" />
        <q-breadcrumbs-el :label="drug.name" />
      </q-breadcrumbs>

      <div v-if="isAdminOrDoctor" class="q-mb-md" style="text-align: right;">
        <q-btn color="negative" icon="delete" label="Delete Drug" @click="deleteDrug" />
      </div>
      <div class="row q-col-gutter-lg q-pa-md">
        <!-- Product Image -->
        <div class="col-12 col-md-6">
          <q-card class="product-image-card">
            <q-img
              :src="drug.image || '/src/assets/flat-hand-drawn-patient-taking-medical-examination.png'"
              :alt="drug.name"
              class="product-image"
              spinner-color="primary"
              spinner-size="50px"
            >
              <div class="absolute-top-right q-pa-md">
                <q-chip
                  v-if="drug.stock > 0"
                  color="positive"
                  text-color="white"
                  icon="check_circle"
                >
                  In Stock ({{ drug.stock }})
                </q-chip>
                <q-chip
                  v-else
                  color="negative"
                  text-color="white"
                  icon="cancel"
                >
                  Out of Stock
                </q-chip>
              </div>
            </q-img>
          </q-card>
        </div>

        <!-- Product Information -->
        <div class="col-12 col-md-6">
          <div class="product-info q-pa-md">
            <!-- Product Header -->
            <div class="product-header q-mb-lg">
              <h3 class="product-title text-weight-bold q-mb-sm">{{ drug.name }}</h3>
              <div class="product-meta row items-center q-gutter-md q-mb-md">
                <q-chip
                  v-if="drug.category"
                  color="primary"
                  text-color="white"
                  icon="category"
                  dense
                >
                  {{ drug.category }}
                </q-chip>
              </div>
              <div class="product-price text-h4 text-weight-bold text-primary q-mb-md">
                ${{ typeof drug.price === 'number' ? drug.price.toFixed(2) : parseFloat(drug.price || '0').toFixed(2) }}
                <span class="text-body2 text-grey-6">per unit</span>
              </div>
            </div>

            <!-- Product Description -->
            <div class="product-description q-mb-lg">
              <h5 class="text-weight-bold q-mb-sm">Description</h5>
              <p class="text-body1 text-grey-8">{{ drug.description }}</p>
            </div>

            <!-- Quantity Selector -->
            <div class="quantity-section q-mb-lg">
              <h6 class="text-weight-bold q-mb-sm">Quantity</h6>
              <div class="row items-center q-gutter-md">
                <q-btn
                  round
                  icon="remove"
                  color="grey-6"
                  @click="decreaseQuantity"
                  :disable="quantity <= 1"
                />
                <q-input
                  v-model.number="quantity"
                  type="number"
                  :min="1"
                  :max="drug.stock"
                  dense
                  outlined
                  style="width: 80px"
                  class="text-center"
                />
                <q-btn
                  round
                  icon="add"
                  color="grey-6"
                  @click="increaseQuantity"
                  :disable="quantity >= drug.stock"
                />
                <span class="text-caption text-grey-7">
                  ({{ drug.stock }} available)
                </span>
              </div>
            </div>

            <!-- Total Price -->
            <div class="total-section q-mb-lg">
              <div class="row items-center justify-between bg-grey-1 q-pa-md rounded">
                <span class="text-h6 text-weight-bold">Total:</span>
                <span class="text-h5 text-weight-bold text-primary">
                  ${{ ((typeof drug.price === 'number' ? drug.price : parseFloat(drug.price || '0')) * quantity).toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons q-gutter-md">
              <q-btn
                color="primary"
                size="lg"
                icon="add_shopping_cart"
                label="Add to Cart"
                class="full-width"
                @click="addToCart"
                :disable="drug.stock === 0"
              />
              <div class="row q-gutter-sm">
                <q-btn
                  color="secondary"
                  outline
                  icon="shopping_cart"
                  label="View Cart"
                  class="col"
                  @click="showCart = true"
                />
                <q-btn
                  color="positive"
                  outline
                  icon="payment"
                  label="Buy Now"
                  class="col"
                  @click="buyNow"
                  :disable="drug.stock === 0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information Tabs -->
      <div class="additional-info q-pa-md q-mt-lg">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="details" label="Details" />
          <q-tab name="usage" label="Usage" />
          <q-tab name="warnings" label="Warnings" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated class="q-pa-lg">
          <q-tab-panel name="details">
            <div class="text-h6 q-mb-md">Product Details</div>
            <q-list>
              <q-item v-if="drug.category">
                <q-item-section avatar>
                  <q-icon name="category" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Category</q-item-label>
                  <q-item-label caption>{{ drug.category }}</q-item-label>
                </q-item-section>
              </q-item>
            
              
              <q-item>
                <q-item-section avatar>
                  <q-icon name="inventory" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Stock</q-item-label>
                  <q-item-label caption>{{ drug.stock }} units available</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>

          <q-tab-panel name="usage">
            <div class="text-h6 q-mb-md">Usage Instructions</div>
            <p class="text-body1">
              Please consult with your healthcare provider for proper usage instructions.
              Always follow the prescribed dosage and frequency as advised by your doctor.
            </p>
          </q-tab-panel>

          <q-tab-panel name="warnings">
            <div class="text-h6 q-mb-md">Important Warnings</div>
            <q-banner class="bg-orange-1 text-orange-9 q-mb-md" rounded>
              <template #avatar>
                <q-icon name="warning" color="orange" />
              </template>
              This is a prescription medication. Please consult with a healthcare professional before use.
            </q-banner>
            <p class="text-body1">
              Keep out of reach of children. Store in a cool, dry place.
              Do not exceed the recommended dosage.
            </p>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <!-- Cart Drawer -->
    <CartDrawer v-model="showCart" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { usePharmacyStore } from '../stores/pharmacy';
import { Drug } from '../services/pharmacyService';
import { CartDrawer } from '../components';
import axios from '../axios.js';
import { isAxiosError } from 'axios';
import { useAuthStore } from '../stores/auth';

// Composables
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const pharmacyStore = usePharmacyStore();
const authStore = useAuthStore();
const isAdminOrDoctor = computed(() => {
  const roleSlug = authStore.user?.role?.slug;
  return roleSlug === 'admin' || roleSlug === 'doctor';
});
// Delete Drug API call
const deleteDrug = async () => {
  if (!drug.value) return;
  const drugId = drug.value.id;
  $q.dialog({
    title: 'Delete Drug',
    message: `Are you sure you want to delete "${drug.value.name}"? This action cannot be undone.`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await axios.delete(`/api/admin/drugs/${drugId}`);
      $q.notify({ type: 'positive', message: 'Drug deleted successfully', position: 'top' });
      router.push({ name: 'pharmacy' });
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 403) {
        $q.notify({ type: 'negative', message: 'Unauthorized: You do not have permission to delete this drug.' });
      } else {
        $q.notify({ type: 'negative', message: 'Failed to delete drug.' });
      }
    }
  });
};

// Local state
const drug = ref<Drug | null>(null);
const loading = ref(true);
const error = ref('');
const quantity = ref(1);
const activeTab = ref('details');
const showCart = ref(false);

// Methods
const loadDrug = async () => {
  // Handle both string and array cases
  let slug = route.params.slug;
  slug = Array.isArray(slug) ? slug[0] : slug;
  
  if (!slug) {
    error.value = 'Product ID not provided';
    loading.value = false;
    return;
  }


  try {
    loading.value = true;
    console.log('Component: Drug loading with slug:', slug);
    console.log('Component: Store instance:', pharmacyStore);
    console.log('Component: getDrugBySlug function type:', typeof pharmacyStore.getDrugBySlug);
    
    drug.value = await pharmacyStore.getDrugBySlug(slug);
    console.log('Component: Drug loaded:', drug.value);
    if (!drug.value) {
      error.value = 'Product not found';
    }
  } catch (err) {
    console.error('Component: Error loading drug:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load product';
  } finally {
    loading.value = false;
  }
};

const increaseQuantity = () => {
  if (drug.value && quantity.value < drug.value.stock) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = async () => {
  if (drug.value) {
    pharmacyStore.addToCart(drug.value, quantity.value);
    
    $q.notify({
      type: 'positive',
      message: `${drug.value.name} added to cart`,
      position: 'bottom',
      timeout: 2000,
      actions: [
        {
          label: 'View Cart',
          color: 'white',
          handler: () => {
            showCart.value = true;
          }
        },
        {
          label: 'Checkout',
          color: 'white',
          handler: () => {
            router.push({ name: 'checkout' });
          }
        }
      ]
    });
  }
};

const buyNow = () => {
  if (drug.value) {
    pharmacyStore.addToCart(drug.value, quantity.value);
    
    $q.notify({
      type: 'info',
      message: 'Redirecting to checkout...',
      position: 'center',
      timeout: 1500
    });
    
    setTimeout(() => {
      router.push({ name: 'checkout' });
    }, 1000);
  }
};

// Lifecycle
onMounted(() => {
  loadDrug();
});
</script>

<style scoped lang="scss">
.product-details-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.product-content {
  max-width: 1400px;
  margin: 0 auto;
  background-color: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.product-image-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
    pointer-events: none;
  }
}

.product-image {
  border-radius: 0;
  max-height: 500px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    max-height: 300px;
  }
}

.product-info {
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.product-title {
  font-size: 2.5rem;
  line-height: 1.2;
  color: #1e293b;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
}

.product-meta {
  margin-bottom: 1.5rem;
  
  .q-chip {
    border-radius: 20px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &:first-child {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }
    
    &:last-child {
      background: linear-gradient(135deg, #f093fb, #f5576c);
    }
  }
}

.product-price {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="price-pattern" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23price-pattern)"/>'),
  }
  
  .text-h4 {
    position: relative;
    z-index: 1;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .text-body2 {
    position: relative;
    z-index: 1;
    opacity: 0.9;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    
    .text-h4 {
      font-size: 1.8rem;
    }
  }
}

.product-description {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border-left: 4px solid #1976d2;
  
  h5 {
    color: #1e293b;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  p {
    color: #475569;
    line-height: 1.6;
  }
}

.quantity-section {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #1976d2;
    box-shadow: 0 4px 20px rgba(25, 118, 210, 0.1);
  }
  
  h6 {
    color: #1e293b;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .q-btn {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  .q-input {
    .q-field__control {
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      background: #f8fafc;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #cbd5e1;
      }
      
      &.q-field__control--focused {
        border-color: #1976d2;
        background: white;
        box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.1);
      }
    }
  }
  
  .text-caption {
    font-weight: 500;
  }
}

.total-section {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 1px solid #bae6fd;
  
  .rounded {
    border-radius: 12px;
  }
  
  .text-h6, .text-h5 {
    font-weight: 700;
  }
  
  .text-primary {
    background: linear-gradient(135deg, #1976d2, #26a69a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.action-buttons {
  .q-btn {
    border-radius: 16px;
    font-weight: 600;
    font-size: 1rem;
    padding: 1rem 2rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      transform: translate(-50%, -50%);
    }
    
    &:hover::before {
      width: 300px;
      height: 300px;
    }
    
    &.q-btn--unelevated {
      background: linear-gradient(135deg, #1976d2, #1565c0);
      box-shadow: 0 8px 32px rgba(25, 118, 210, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #1565c0, #0d47a1);
        transform: translateY(-3px);
        box-shadow: 0 12px 40px rgba(25, 118, 210, 0.4);
      }
    }
    
    &.q-btn--outline {
      border: 2px solid #1976d2;
      color: #1976d2;
      
      &:hover {
        background: #1976d2;
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 8px 32px rgba(25, 118, 210, 0.3);
      }
    }
    
    &:disabled {
      background: #e2e8f0 !important;
      color: #94a3b8 !important;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
      
      &::before {
        display: none;
      }
    }
  }
  
  @media (max-width: 768px) {
    .row {
      flex-direction: column;
      gap: 1rem;
    }
    
    .q-btn {
      width: 100%;
      padding: 1rem;
    }
  }
}

.additional-info {
  background-color: white;
  border-radius: 20px;
  margin-top: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  
  .q-tabs {
    background: #f8fafc;
    
    .q-tab {
      font-weight: 600;
      border-radius: 12px 12px 0 0;
      transition: all 0.3s ease;
      
      &.q-tab--active {
        background: white;
        color: #1976d2;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
  
  .q-tab-panels {
    .q-tab-panel {
      padding: 2rem;
      
      @media (max-width: 768px) {
        padding: 1.5rem;
      }
    }
    
    .text-h6 {
      color: #1e293b;
      font-weight: 700;
      margin-bottom: 1.5rem;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -0.5rem;
        left: 0;
        width: 50px;
        height: 3px;
        background: linear-gradient(135deg, #1976d2, #26a69a);
        border-radius: 2px;
      }
    }
    
    .q-list {
      .q-item {
        border-radius: 12px;
        margin-bottom: 0.5rem;
        transition: all 0.3s ease;
        
        &:hover {
          background: #f8fafc;
          transform: translateX(8px);
        }
        
        .q-item-section--avatar {
          .q-icon {
            background: linear-gradient(135deg, #1976d2, #26a69a);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 1.5rem;
          }
        }
        
        .q-item-label {
          font-weight: 600;
          color: #1e293b;
        }
        
        .q-item-label--caption {
          color: #64748b;
          font-weight: 500;
        }
      }
    }
    
    .q-banner {
      border-radius: 12px;
      border-left: 4px solid #f59e0b;
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.1);
      
      .q-icon {
        font-size: 1.5rem;
      }
    }
  }
}

// Breadcrumb styling
.q-breadcrumbs {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  
  .q-breadcrumbs-el {
    color: #64748b;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      color: #1976d2;
    }
    
    &:last-child {
      color: #1e293b;
      font-weight: 600;
    }
  }
}

// Loading and error states
.text-center {
  .q-spinner-dots {
    margin-bottom: 1rem;
  }
  
  .q-icon[name="error"] {
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    color: #64748b;
    margin-bottom: 1.5rem;
  }
  
  .q-btn {
    border-radius: 12px;
    font-weight: 600;
    padding: 0.75rem 2rem;
  }
}

// Stock status chips
.q-chip {
  font-weight: 600;
  border-radius: 20px;
  
  &[color="positive"] {
    background: linear-gradient(135deg, #10b981, #059669);
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  }
  
  &[color="negative"] {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
  }
}

// Mobile optimizations
@media (max-width: 768px) {
  .product-content {
    margin: 1rem;
    border-radius: 16px;
  }
  
  .row.q-col-gutter-lg {
    margin: 0;
    
    > div {
      padding: 0;
      margin-bottom: 1.5rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .product-image-card {
    margin-bottom: 1.5rem;
  }
  
  .additional-info {
    margin-top: 2rem;
    border-radius: 16px;
  }
  
  .q-breadcrumbs {
    margin: 0.5rem;
    padding: 0.75rem 1rem;
    
    .q-breadcrumbs-el {
      font-size: 0.875rem;
    }
  }
}

// Accessibility improvements
.product-details-page {
  *:focus-visible {
    outline: 3px solid #1976d2;
    outline-offset: 2px;
    border-radius: 4px;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .product-content {
    border: 2px solid #000;
  }
  
  .q-btn {
    border: 2px solid currentColor !important;
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Print styles
@media print {
  .action-buttons,
  .q-breadcrumbs {
    display: none;
  }
  
  .product-content {
    box-shadow: none;
    border: 1px solid #ccc;
  }
}
</style>
