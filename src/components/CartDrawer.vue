<!-- filepath: src/components/CartDrawer.vue -->
<template>
  <q-drawer
    v-model="showDrawer"
    side="right"
    overlay
    bordered
    class="cart-drawer"
    :width="400"
  >
    <div class="cart-header q-pa-md bg-primary text-white">
      <div class="row items-center">
        <div class="col">
          <h6 class="q-ma-none text-weight-bold">Shopping Cart</h6>
          <p class="q-ma-none text-caption">
            {{ pharmacyStore.cartItemCount }} item{{ pharmacyStore.cartItemCount !== 1 ? 's' : '' }}
          </p>
        </div>
        <div class="col-auto">
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="showDrawer = false"
            class="text-white"
          />
        </div>
      </div>
    </div>

    <div class="cart-content">
      <!-- Empty Cart State -->
      <div v-if="pharmacyStore.cart.length === 0" class="empty-cart text-center q-pa-xl">
        <q-icon name="shopping_cart" size="60px" color="grey-5" />
        <p class="text-grey-7 q-mt-md">Your cart is empty</p>
        <q-btn
          color="primary"
          label="Start Shopping"
          outline
          @click="goToPharmacy"
        />
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-items">
        <q-list separator>
          <q-item
            v-for="item in pharmacyStore.cart"
            :key="item.drug.id"
            class="cart-item q-pa-md"
          >
            <q-item-section avatar>
              <q-avatar size="60px" square>
                <q-img
                  :src="item.drug.image || '/src/assets/flat-hand-drawn-patient-taking-medical-examination.png'"
                  :alt="item.drug.name"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">{{ item.drug.name }}</q-item-label>
              <q-item-label caption class="text-grey-7">
                {{ item.drug.category || 'General' }}
              </q-item-label>
              <q-item-label caption class="text-primary text-weight-bold">
                ₵{{ Number(item.drug.price).toFixed(2) }} each
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="quantity-controls column items-center q-gutter-xs">
                <!-- Quantity Controls -->
                <div class="row items-center q-gutter-xs">
                  <q-btn
                    round
                    dense
                    size="sm"
                    icon="remove"
                    color="grey-6"
                    @click="decreaseQuantity(item)"
                    :disable="item.quantity <= 1"
                  />
                  <span class="quantity-display text-weight-bold text-center" style="min-width: 30px">
                    {{ item.quantity }}
                  </span>
                  <q-btn
                    round
                    dense
                    size="sm"
                    icon="add"
                    color="grey-6"
                    @click="increaseQuantity(item)"
                    :disable="item.quantity >= item.drug.stock"
                  />
                </div>
                
                <!-- Item Total -->
                <div class="text-weight-bold text-primary">
                  ₵{{ (Number(item.drug.price) * item.quantity).toFixed(2) }}
                </div>
                
                <!-- Remove Button -->
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="delete"
                  color="negative"
                  @click="removeItem(item.drug.id)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Cart Summary -->
        <div class="cart-summary q-pa-md bg-grey-1">
          <div class="row justify-between items-center q-mb-md">
            <span class="text-weight-bold">Subtotal:</span>
            <span class="text-h6 text-weight-bold text-primary">
              ₵{{ pharmacyStore.cartTotal.toFixed(2) }}
            </span>
          </div>
          
          <div class="row justify-between items-center q-mb-md text-caption text-grey-7">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          
          <q-separator class="q-mb-md" />
          
          <div class="row justify-between items-center q-mb-lg">
            <span class="text-h6 text-weight-bold">Total:</span>
            <span class="text-h5 text-weight-bold text-primary">
              ₵{{ pharmacyStore.cartTotal.toFixed(2) }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="cart-actions q-gutter-sm">
            <q-btn
              color="primary"
              label="Proceed to Checkout"
              class="full-width"
              size="md"
              @click="goToCheckout"
              :disable="pharmacyStore.cart.length === 0"
            />
            <q-btn
              color="grey-6"
              label="Clear Cart"
              outline
              class="full-width"
              size="sm"
              @click="clearCart"
            />
          </div>
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { usePharmacyStore } from '../stores/pharmacy';
import { CartItem } from '../services/pharmacyService';

// Props
interface Props {
  modelValue: boolean;
}

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Composables
const router = useRouter();
const $q = useQuasar();
const pharmacyStore = usePharmacyStore();

// Computed
const showDrawer = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

// Methods
const goToPharmacy = () => {
  showDrawer.value = false;
  router.push({ name: 'pharmacy' });
};

const goToCheckout = () => {
  showDrawer.value = false;
  router.push({ name: 'checkout' });
};

const increaseQuantity = (item: CartItem) => {
  const newQuantity = item.quantity + 1;
  if (newQuantity <= item.drug.stock) {
    pharmacyStore.updateCartItemQuantity(item.drug.id, newQuantity);
    $q.notify({
      type: 'positive',
      message: `Updated ${item.drug.name} quantity`,
      position: 'bottom',
      timeout: 1500
    });
  } else {
    $q.notify({
      type: 'warning',
      message: 'Maximum stock limit reached',
      position: 'bottom',
      timeout: 2000
    });
  }
};

const decreaseQuantity = (item: CartItem) => {
  const newQuantity = item.quantity - 1;
  if (newQuantity > 0) {
    pharmacyStore.updateCartItemQuantity(item.drug.id, newQuantity);
    $q.notify({
      type: 'info',
      message: `Updated ${item.drug.name} quantity`,
      position: 'bottom',
      timeout: 1500
    });
  } else {
    removeItem(item.drug.id);
  }
};

const removeItem = (drugId: number) => {
  const item = pharmacyStore.cart.find(item => item.drug.id === drugId);
  const drugName = item?.drug.name || 'Item';
  
  $q.dialog({
    title: 'Remove Item',
    message: `Are you sure you want to remove "${drugName}" from your cart?`,
    cancel: true,
    persistent: true,
    ok: {
      color: 'negative',
      label: 'Remove'
    }
  }).onOk(() => {
    pharmacyStore.removeFromCart(drugId);
    $q.notify({
      type: 'negative',
      message: `${drugName} removed from cart`,
      position: 'bottom',
      timeout: 2000,
      actions: [
        {
          label: 'Undo',
          color: 'white',
          handler: () => {
            if (item) {
              pharmacyStore.addToCart(item.drug, item.quantity);
              $q.notify({
                type: 'positive',
                message: `${drugName} restored to cart`,
                position: 'bottom',
                timeout: 1500
              });
            }
          }
        },
        { icon: 'close', color: 'white', round: true }
      ]
    });
  });
};

const clearCart = () => {
  const itemCount = pharmacyStore.cartItemCount;
  
  $q.dialog({
    title: 'Clear Cart',
    message: `Are you sure you want to remove all ${itemCount} item${itemCount !== 1 ? 's' : ''} from your cart?`,
    cancel: true,
    persistent: true,
    ok: {
      color: 'negative',
      label: 'Clear All'
    }
  }).onOk(() => {
    const cartBackup = [...pharmacyStore.cart];
    pharmacyStore.clearCart();
    
    $q.notify({
      type: 'warning',
      message: `Cart cleared (${itemCount} items removed)`,
      position: 'bottom',
      timeout: 3000,
      actions: [
        {
          label: 'Undo',
          color: 'white',
          handler: () => {
            cartBackup.forEach(item => {
              pharmacyStore.addToCart(item.drug, item.quantity);
            });
            $q.notify({
              type: 'positive',
              message: 'Cart restored',
              position: 'bottom',
              timeout: 1500
            });
          }
        },
        { icon: 'close', color: 'white', round: true }
      ]
    });
  });
};
</script>

<style scoped lang="scss">
.cart-drawer {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  
  .cart-header {
    position: sticky;
    top: 0;
    z-index: 1;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 0 0 20px 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    
    h6 {
      font-size: 1.25rem;
      letter-spacing: 0.5px;
    }
    
    .text-caption {
      opacity: 0.9;
      font-weight: 500;
    }
    
    .q-btn {
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
      }
    }
  }

  .cart-content {
    height: calc(100vh - 100px);
    overflow-y: auto;
    padding: 1rem 0;
    
    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #1976d2, #26a69a);
      border-radius: 3px;
      
      &:hover {
        background: linear-gradient(135deg, #1565c0, #00897b);
      }
    }
  }

  .cart-item {
    background: white;
    border-radius: 16px;
    margin: 0.5rem 1rem;
    padding: 1rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid transparent;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
      border-color: #e2e8f0;
    }
    
    .q-item-section--avatar {
      .q-avatar {
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        
        .q-img {
          border-radius: 12px;
        }
      }
    }
    
    .q-item-section {
      .q-item-label {
        font-weight: 600;
        color: #1e293b;
        font-size: 1rem;
        line-height: 1.3;
        margin-bottom: 0.25rem;
      }
      
      .q-item-label--caption {
        color: #64748b;
        font-weight: 500;
        font-size: 0.875rem;
      }
    }
    
    .q-item-section--side {
      .q-item-label {
        font-weight: 700;
        background: linear-gradient(135deg, #1976d2, #26a69a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 1.1rem;
      }
    }
  }

  .quantity-controls {
    min-width: 120px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f8fafc;
    border-radius: 12px;
    padding: 0.5rem;
    margin: 0.5rem 0;
    
    .q-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: white;
      color: #1976d2;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
      transition: all 0.3s ease;
      
      &:hover {
        background: #1976d2;
        color: white;
        transform: scale(1.1);
        box-shadow: 0 4px 16px rgba(25, 118, 210, 0.3);
      }
      
      &:disabled {
        background: #e2e8f0;
        color: #94a3b8;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    }
  }

  .quantity-display {
    font-size: 1rem;
    line-height: 1;
    font-weight: 600;
    color: #1e293b;
    min-width: 32px;
    text-align: center;
    background: white;
    border-radius: 6px;
    padding: 0.5rem;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .item-actions {
    margin-top: 0.75rem;
    display: flex;
    gap: 0.5rem;
    
    .q-btn {
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.75rem;
      transition: all 0.3s ease;
      
      &.remove-btn {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        
        &:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
        }
      }
    }
  }

  .cart-summary {
    position: sticky;
    bottom: 0;
    background: white;
    border-radius: 20px 20px 0 0;
    border-top: none;
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-top: 1rem;
    
    .summary-section {
      margin-bottom: 1.5rem;
      
      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        padding: 0.5rem 0;
        
        &.total-row {
          border-top: 2px solid #e2e8f0;
          padding-top: 1rem;
          margin-top: 1rem;
          margin-bottom: 0;
          
          .text-h6 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
          }
          
          .text-primary {
            background: linear-gradient(135deg, #1976d2, #26a69a);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 1.5rem;
            font-weight: 700;
          }
        }
        
        .text-body2 {
          color: #64748b;
          font-weight: 500;
        }
        
        .text-weight-medium {
          color: #475569;
          font-weight: 600;
        }
      }
    }
    
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      
      .q-btn {
        border-radius: 12px;
        font-weight: 600;
        font-size: 1rem;
        padding: 1rem;
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
        
        &.checkout-btn {
          background: linear-gradient(135deg, #1976d2, #1565c0);
          box-shadow: 0 8px 32px rgba(25, 118, 210, 0.3);
          
          &:hover {
            background: linear-gradient(135deg, #1565c0, #0d47a1);
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(25, 118, 210, 0.4);
          }
        }
        
        &.clear-btn {
          border: 2px solid #ef4444;
          color: #ef4444;
          background: transparent;
          
          &:hover {
            background: #ef4444;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
          }
        }
        
        &.continue-btn {
          border: 2px solid #1976d2;
          color: #1976d2;
          background: transparent;
          
          &:hover {
            background: #1976d2;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(25, 118, 210, 0.3);
          }
        }
      }
    }
  }

  .empty-cart {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    text-align: center;
    
    .q-icon {
      color: #cbd5e1;
      margin-bottom: 1rem;
      opacity: 0.8;
    }
    
    p {
      color: #64748b;
      font-size: 1.1rem;
      margin-bottom: 2rem;
      font-weight: 500;
    }
    
    .q-btn {
      border-radius: 12px;
      font-weight: 600;
      padding: 1rem 2rem;
      border: 2px solid #1976d2;
      transition: all 0.3s ease;
      
      &:hover {
        background: #1976d2;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
      }
    }
  }
}

// Mobile optimizations
@media (max-width: 480px) {
  .cart-drawer {
    width: 100vw !important;
    
    .cart-header {
      border-radius: 0;
      padding: 1rem;
    }
    
    .cart-item {
      margin: 0.5rem 0.75rem;
      padding: 1rem 0.75rem;
      
      .q-item-section--avatar {
        .q-avatar {
          width: 50px;
          height: 50px;
        }
      }
      
      .quantity-controls {
        min-width: 100px;
        
        .q-btn {
          width: 28px;
          height: 28px;
        }
      }
    }
    
    .cart-summary {
      padding: 1rem;
      border-radius: 16px 16px 0 0;
      
      .action-buttons {
        gap: 0.5rem;
        
        .q-btn {
          padding: 0.875rem;
          font-size: 0.9rem;
        }
      }
    }
  }
}

// Accessibility improvements
.cart-drawer {
  .q-btn:focus-visible {
    outline: 3px solid #1976d2;
    outline-offset: 2px;
  }
  
  .quantity-display:focus {
    outline: 2px solid #1976d2;
    outline-offset: 1px;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .cart-drawer {
    .cart-item {
      border: 2px solid #000;
      
      &:hover {
        border-color: #1976d2;
      }
    }
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .cart-drawer * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Loading state for cart items
.cart-item-loading {
  background: white;
  border-radius: 16px;
  margin: 0.5rem 1rem;
  padding: 1rem;
  
  .loading-shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
    height: 1rem;
    margin-bottom: 0.5rem;
    
    &.avatar {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      margin-bottom: 0;
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
</style>
