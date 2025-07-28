<!-- filepath: src/pages/EPharmacyPage.vue -->
<template>
  <q-page class="epharmacy-page">
    <!-- Header Section -->
    <div class="page-header q-pa-md">
      <h2 class="text-h4 text-weight-bold text-center q-mb-md">E-Pharmacy</h2>
      <p class="text-center text-grey-7 q-mb-lg">
        Order medications and health supplies online with home delivery
      </p>

      <!-- Search and Filter Controls -->
      <div class="row q-gutter-md q-mb-lg">
        <div class="col-12 col-md-6">
          <q-input
            v-model="searchQuery"
            placeholder="Search for medications..."
            dense
            outlined
            clearable
            @input="onSearchInput"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        
        <div class="col-12 col-md-3">
          <q-select
            v-model="selectedCategory"
            :options="categoryOptions"
            label="Category"
            dense
            outlined
            clearable
            emit-value
            map-options
          />
        </div>
        
        <div class="col-12 col-md-3">
          <q-btn
            color="primary"
            icon="refresh"
            label="Reset"
            outline
            @click="resetFilters"
            class="full-width"
          />
        </div>
      </div>
    </div>

    <!-- Debug Information (remove in production) -->
    <!-- <div v-if="true" class="debug-info q-pa-md bg-grey-2" style="position: fixed; top: 10px; right: 10px; z-index: 9999; font-size: 12px; max-width: 300px;">
      <div><strong>Debug Info:</strong></div>
      <div>Auth logged in: {{ authStore.loggedIn }}</div>
      <div>Pharmacy loading: {{ pharmacyStore.loading }}</div>
      <div>Pharmacy error: {{ pharmacyStore.error || 'none' }}</div>
      <div>Drugs count: {{ pharmacyStore.drugs?.length || 0 }}</div>
      <div>Filtered drugs: {{ pharmacyStore.filteredDrugs?.length || 0 }}</div>
      <div>Categories: {{ pharmacyStore.categories?.length || 0 }}</div>
    </div> -->

    <!-- Authentication Required State -->
    <div v-if="!authStore.loggedIn" class="text-center q-pa-xl">
      <q-icon name="lock" size="80px" color="grey-5" class="q-mb-md" />
      <h5 class="text-h5 text-grey-7 q-mb-md">Authentication Required</h5>
      <p class="text-body1 text-grey-6 q-mb-lg">
        Please log in to access the E-Pharmacy and browse medications.
      </p>
      <q-btn
        color="primary"
        label="Go to Login"
        size="lg"
        @click="router.push('/signin')"
        class="q-px-xl"
      />
    </div>

    <!-- Loading State -->
    <div v-else-if="pharmacyStore.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="50px" color="primary" />
      <p class="q-mt-md">Loading medications...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="pharmacyStore.error" class="text-center q-pa-xl">
      <q-icon name="error" size="50px" color="negative" />
      <p class="text-negative q-mt-md">{{ pharmacyStore.error }}</p>
      <q-btn color="primary" label="Retry" @click="pharmacyStore.loadDrugs()" />
    </div>

    <!-- Empty State -->
    <div v-else-if="pharmacyStore.filteredDrugs?.length === 0" class="text-center q-pa-xl">
      <q-icon name="medication" size="50px" color="grey-5" />
      <p class="text-grey-7 q-mt-md">No medications found</p>
      <q-btn color="primary" label="Clear Filters" outline @click="resetFilters" />
    </div>

    <!-- Drugs Grid -->
    <div v-else-if="authStore.loggedIn">
      <div class="grid grid-cols-3 gap-2">
        <q-card
          v-for="drug in (pharmacyStore.filteredDrugs || [])"
          :key="drug.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3 rounded-card cursor-pointer"
          @click.prevent="goToDetails(drug.slug)"
        >
          <q-img
            :src="drug.image || '/src/assets/flat-hand-drawn-patient-taking-medical-examination.png'"
            ratio="1"
            class="drug-image"
          >
            <div class="absolute-bottom-right q-pa-xs">
              <q-chip
                v-if="drug.stock > 0"
                color="positive"
                text-color="white"
                dense
                size="sm"
              >
                In Stock
              </q-chip>
              <q-chip
                v-else
                color="negative"
                text-color="white"
                dense
                size="sm"
              >
                Out of Stock
              </q-chip>
            </div>
          </q-img>

          <q-card-section>
            <h6 class="drug-name text-weight-bold q-ma-none">{{ drug.name }}</h6>
            <p class="drug-category text-caption text-grey-7 q-mb-sm">
              {{ drug.category || 'General' }}
            </p>
            <p class="drug-description text-body2 text-grey-8 q-mb-md">
              {{ truncateDescription(drug.description) }}
            </p>
            <div class="drug-price text-weight-bold text-primary text-h6">
              ${{ (drug.price || 0).toFixed(2) }}
            </div>
          </q-card-section>

          <q-card-actions align="between">
            <q-btn
              label="View Details"
              color="primary"
              outline
              dense
              @click.prevent="goToDetails(drug.slug)"
            />
            <q-btn
              label="Add to Cart"
              color="primary"
              dense
              :disable="drug.stock === 0"
              @click.stop="addToCart(drug)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Floating Action Button for Cart -->
    <q-page-sticky position="bottom-right" :offset="[18, 100]">
      <q-btn
        fab
        icon="shopping_cart"
        color="primary"
        @click="showCart = true"
        class="cart-fab"
      >
        <q-badge
          v-if="pharmacyStore.cartItemCount > 0"
          color="red"
          floating
          rounded
        >
          {{ pharmacyStore.cartItemCount }}
        </q-badge>
      </q-btn>
    </q-page-sticky>

    <!-- Cart Drawer -->
    <CartDrawer v-model="showCart" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { usePharmacyStore } from '../stores/pharmacy';
import { useAuthStore } from '../stores/auth';
import { Drug } from '../services/pharmacyService';
import { CartDrawer } from '../components';

const router = useRouter();
const $q = useQuasar();
const pharmacyStore = usePharmacyStore();
const authStore = useAuthStore();

// Local state
const showCart = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('');

// Computed properties
const categoryOptions = computed(() => [
  { label: 'All Categories', value: '' },
  ...(pharmacyStore.categories || []).map(cat => ({ label: cat, value: cat }))
]);

// Enhanced notification methods
const notifySuccess = (message: string) => {
  $q.notify({
    type: 'positive',
    message,
    position: 'top-right',
    timeout: 2000,
    actions: [{ icon: 'close', color: 'white', round: true }]
  });
};

const notifyError = (message: string) => {
  $q.notify({
    type: 'negative',
    message,
    position: 'top-right',
    timeout: 3000,
    actions: [{ icon: 'close', color: 'white', round: true }]
  });
};

const notifyInfo = (message: string) => {
  $q.notify({
    type: 'info',
    message,
    position: 'top-right',
    timeout: 2000,
    actions: [{ icon: 'close', color: 'white', round: true }]
  });
};

// Methods
const goToDetails = (slug: string) => {
  router.push({ name: 'productDetails', params: { slug } });
};

const addToCart = async (drug: Drug) => {
  try {
    pharmacyStore.addToCart(drug);
    
    // Show quick action in notification
    $q.notify({
      type: 'positive',
      message: `${drug.name} added to cart`,
      position: 'bottom-right',
      timeout: 3000,
      actions: [
        {
          label: 'View Cart',
          color: 'white',
          handler: () => { showCart.value = true; }
        },
        {
          label: 'Checkout',
          color: 'white',
          handler: () => { router.push({ name: 'checkout' }); }
        },
        { icon: 'close', color: 'white', round: true }
      ]
    });
  } catch (error) {
    notifyError('Failed to add item to cart');
  }
};

const onSearchInput = () => {
  pharmacyStore.setSearchQuery(searchQuery.value);
  
  // Provide feedback for search
  if (searchQuery.value.length > 2) {
    notifyInfo(`Searching for "${searchQuery.value}"...`);
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  pharmacyStore.resetFilters();
  notifyInfo('Filters cleared');
};

const truncateDescription = (description: string, maxLength = 100) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
};

// Watchers for better UX
watch(selectedCategory, (newCategory) => {
  pharmacyStore.setSelectedCategory(newCategory);
  if (newCategory) {
    notifyInfo(`Filtering by ${newCategory}`);
  }
});

// Watch for store errors and show notifications
watch(() => pharmacyStore.error, (newError) => {
  if (newError) {
    notifyError(newError);
  }
});

// Watch cart count for feedback
watch(() => pharmacyStore.cartItemCount, (newCount, oldCount) => {
  if (newCount > oldCount && oldCount !== undefined) {
    // Cart increased, item was added (already handled in addToCart)
  } else if (newCount < oldCount && oldCount !== undefined) {
    notifyInfo('Item removed from cart');
  }
});

// Lifecycle
onMounted(async () => {
  // Debug logging
  console.log('EPharmacy onMounted - Auth status:', authStore.loggedIn);
  console.log('EPharmacy onMounted - Auth token:', localStorage.getItem('auth_token'));
  console.log('EPharmacy onMounted - Pharmacy store:', pharmacyStore);

  // Check authentication first
  if (!authStore.loggedIn) {
    console.log('EPharmacy: User not logged in, redirecting to signin');
    notifyError('Please log in to access the E-Pharmacy');
    router.push('/signin');
    return;
  }

  console.log('EPharmacy: User authenticated, initializing pharmacy store');
  try {
    await pharmacyStore.initialize();
    console.log('EPharmacy: Pharmacy initialized successfully');
    console.log('EPharmacy: Drugs loaded:', pharmacyStore.drugs.length);
    console.log('EPharmacy: Categories loaded:', pharmacyStore.categories.length);
    notifySuccess('Pharmacy loaded successfully!');
  } catch (error) {
    console.error('EPharmacy: Failed to initialize pharmacy:', error);
    notifyError('Failed to load pharmacy. Please refresh the page.');
  }
});
</script>

<style scoped lang="scss">
.epharmacy-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  background: white;
  color: black;
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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="80" cy="80" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
  
  .q-card-section {
    position: relative;
    z-index: 1;
  }
  
  .q-input, .q-select {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: white;
    }
    
    .q-field__control {
      border-radius: 12px;
    }
  }
}

.drug-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    
    .drug-image {
      transform: scale(1.05);
    }
  }
}

.drug-image {
  border-radius: 0;
  height: 200px;
  transition: transform 0.3s ease;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  
  @media (max-width: 600px) {
    height: 160px;
  }
}

.drug-name {
  font-size: 1.1rem;
  line-height: 1.3;
  max-height: 2.6rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.drug-description {
  line-height: 1.4;
  max-height: 2.8rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.drug-price {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1976d2, #26a69a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
}

.drug-category {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.drug-stock {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
  
  .stock-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    
    &.in-stock {
      background: #10b981;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    }
    
    &.low-stock {
      background: #f59e0b;
      box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
    }
    
    &.out-of-stock {
      background: #ef4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
    }
  }
}

.q-card-actions {
  padding: 1rem 1.5rem 1.5rem;
  
  .q-btn {
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &.q-btn--unelevated {
      background: linear-gradient(135deg, #1976d2, #1565c0);
      
      &:hover {
        background: linear-gradient(135deg, #1565c0, #0d47a1);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
      }
    }
    
    &.q-btn--outline {
      border: 2px solid #1976d2;
      color: #1976d2;
      
      &:hover {
        background: #1976d2;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(25, 118, 210, 0.2);
      }
    }
    
    &:disabled {
      background: #e2e8f0;
      color: #94a3b8;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }
  
  @media (max-width: 600px) {
    padding: 1rem;
    
    .q-btn {
      width: 100%;
      margin-bottom: 0.5rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.cart-fab {
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.3);
  background: linear-gradient(135deg, #1976d2, #1565c0);
  
  &:hover {
    box-shadow: 0 12px 40px rgba(25, 118, 210, 0.4);
    transform: scale(1.05);
  }
}

.rounded-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

// Loading states
.loading-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  .loading-shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
    height: 1rem;
    margin-bottom: 0.5rem;
    
    &.image {
      height: 160px;
      margin-bottom: 1rem;
    }
    
    &.short {
      width: 60%;
    }
    
    &.medium {
      width: 80%;
    }
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

// Mobile optimizations
@media (max-width: 600px) {
  
  .drug-card {
    margin-bottom: 0;
  }
  
  .page-header {
    border-radius: 12px;
    margin: 1rem 0.75rem 1.5rem;
    
    .q-card-section {
      padding: 1rem;
    }
    
    .q-input, .q-select {
      margin-bottom: 1rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// Search controls enhancement
.search-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 1rem;
  
  @media (min-width: 768px) {
    margin: 1.5rem;
  }
  
  .q-input {
    .q-field__control {
      border-radius: 12px;
      background: #f8fafc;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      
      &:hover {
        background: #f1f5f9;
      }
      
      &.q-field__control--focused {
        border-color: #1976d2;
        background: white;
        box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.1);
      }
    }
  }
  
  .q-select {
    .q-field__control {
      border-radius: 12px;
      background: #f8fafc;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      
      &:hover {
        background: #f1f5f9;
      }
    }
  }
}

// No results state
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  
  .q-icon {
    font-size: 4rem;
    color: #cbd5e1;
    margin-bottom: 1rem;
  }
  
  h5 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #64748b;
    margin-bottom: 2rem;
  }
  
  .q-btn {
    border-radius: 12px;
    font-weight: 600;
  }
}

// Accessibility improvements
.drug-card:focus-within {
  outline: 3px solid #1976d2;
  outline-offset: 2px;
}

// High contrast support
@media (prefers-contrast: high) {
  .drug-card {
    border: 2px solid #000;
    
    &:hover {
      border-color: #1976d2;
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
