<!-- filepath: src/pages/CheckoutPage.vue -->
<template>
  <q-page class="checkout-page">
    <div class="checkout-container">
      <!-- Header -->
      <div class="checkout-header q-pa-md">
        <h3 class="text-h4 text-weight-bold text-center q-mb-md">Checkout</h3>
        <q-stepper
          v-model="currentStep"
          ref="stepper"
          color="primary"
          animated
        >
          <q-step
            :name="1"
            title="Cart Review"
            icon="shopping_cart"
            :done="currentStep > 1"
          />
          <q-step
            :name="2"
            title="Delivery Details"
            icon="local_shipping"
            :done="currentStep > 2"
          />
          <q-step
            :name="3"
            title="Payment"
            icon="payment"
            :done="currentStep > 3"
          />
          <q-step
            :name="4"
            title="Confirmation"
            icon="check_circle"
          />
        </q-stepper>
      </div>

      <!-- Loading State -->
      <div v-if="pharmacyStore.loading" class="text-center q-pa-xl">
        <q-spinner-dots size="50px" color="primary" />
        <p class="q-mt-md">Processing your order...</p>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="pharmacyStore.cart.length === 0" class="empty-cart text-center q-pa-xl">
        <q-icon name="shopping_cart" size="60px" color="grey-5" />
        <p class="text-grey-7 q-mt-md">Your cart is empty</p>
        <q-btn
          color="primary"
          label="Continue Shopping"
          :to="{ name: 'pharmacy' }"
        />
      </div>

      <!-- Checkout Content -->
      <div v-else class="checkout-content">
        <div class="row q-col-gutter-lg">
          <!-- Main Content -->
          <div class="col-12 col-lg-8">
            <q-stepper
              v-model="currentStep"
              ref="stepper"
              vertical
              color="primary"
              animated
              class="checkout-stepper"
            >
              <!-- Step 1: Cart Review -->
              <q-step
                :name="1"
                title="Review Your Order"
                icon="shopping_cart"
                :done="currentStep > 1"
              >
                <div class="cart-review">
                  <q-list separator>
                    <q-item
                      v-for="item in pharmacyStore.cart"
                      :key="item.drug.id"
                      class="cart-item"
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
                        <q-item-label caption>{{ item.drug.category || 'General' }}</q-item-label>
                        <q-item-label caption>Quantity: {{ item.quantity }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-item-label class="text-weight-bold text-primary">
                          ${{ (item.drug.price * item.quantity).toFixed(2) }}
                        </q-item-label>
                        <q-item-label caption>
                          ${{ item.drug.price.toFixed(2) }} each
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <q-stepper-navigation>
                  <q-btn @click="currentStep = 2" color="primary" label="Continue to Delivery" />
                </q-stepper-navigation>
              </q-step>

              <!-- Step 2: Delivery Information -->
              <q-step
                :name="2"
                title="Delivery Information for KNUST Campus"
                icon="local_shipping"
                :done="currentStep > 2"
              >
                <q-form @submit="validateDelivery" class="q-gutter-md">
                  <q-banner class="bg-blue-1 text-blue-9 q-mb-md" rounded>
                    <template v-slot:avatar>
                      <q-icon name="info" color="blue" />
                    </template>
                    <div class="text-body1">
                      <strong>KNUST Campus Delivery Service</strong><br>
                      We deliver to all areas within and around KNUST campus. Free delivery on orders over ₵100!
                    </div>
                  </q-banner>

                  <!-- Phone Number (Required) -->
                  <q-input
                    v-model="deliveryForm.phoneNumber"
                    label="Phone Number *"
                    outlined
                    type="tel"
                    placeholder="+233241234567"
                    :rules="[rules.required, rules.phone]"
                    :error="!!deliveryErrors.phoneNumber"
                    :error-message="deliveryErrors.phoneNumber"
                    bottom-slots
                  >
                    <template v-slot:prepend>
                      <q-icon name="phone" />
                    </template>
                    <template v-slot:append>
                      <q-icon 
                        v-if="deliveryForm.phoneNumber && !deliveryErrors.phoneNumber" 
                        name="check_circle" 
                        color="positive" 
                      />
                    </template>
                  </q-input>

                  <!-- Delivery Address (Required) -->
                  <q-input
                    v-model="deliveryForm.address"
                    label="Full Delivery Address *"
                    type="textarea"
                    outlined
                    rows="3"
                    placeholder="e.g., Room 123, Unity Hall, KNUST Campus"
                    hint="Please provide detailed address including room number, hall/building name"
                    :rules="[rules.required, rules.address]"
                    :error="!!deliveryErrors.address"
                    :error-message="deliveryErrors.address"
                    bottom-slots
                  >
                    <template v-slot:append>
                      <q-icon 
                        v-if="deliveryForm.address && !deliveryErrors.address" 
                        name="check_circle" 
                        color="positive" 
                      />
                    </template>
                  </q-input>

                  <!-- Delivery Area Selection (Optional but recommended) -->
                  <q-select
                    v-model="deliveryForm.area"
                    :options="deliveryAreas"
                    option-label="name"
                    option-value="code"
                    label="Select Delivery Area (Optional)"
                    outlined
                    emit-value
                    map-options
                    @update:model-value="calculateDeliveryFee"
                    :loading="loadingAreas"
                  >
                    <template v-slot:prepend>
                      <q-icon name="location_on" />
                    </template>
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label>{{ scope.opt.name }}</q-item-label>
                          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label class="text-weight-bold text-primary">
                            {{ scope.opt.formatted_fee }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No delivery areas available
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <!-- Landmark (Optional) -->
                  <q-input
                    v-model="deliveryForm.landmark"
                    label="Nearby Landmark (Optional)"
                    outlined
                    placeholder="e.g., Near Unity Hall, Close to KNUST Main Gate"
                    hint="Help our delivery person find you easily"
                  >
                    <template v-slot:prepend>
                      <q-icon name="place" />
                    </template>
                  </q-input>

                  <!-- Delivery Notes (Optional) -->
                  <q-input
                    v-model="deliveryForm.notes"
                    label="Special Delivery Instructions (Optional)"
                    type="textarea"
                    outlined
                    rows="2"
                    placeholder="e.g., Call when you arrive at the hall"
                    hint="Any special instructions for the delivery person"
                  >
                    <template v-slot:prepend>
                      <q-icon name="note" />
                    </template>
                  </q-input>

                  <!-- Delivery Fee Display -->
                  <q-card v-if="deliveryFee !== null" class="bg-grey-1 q-pa-md">
                    <q-card-section class="text-center">
                      <div class="text-h6">Delivery Information</div>
                      <div class="q-mt-sm">
                        <div class="text-body1">
                          <strong>Delivery Fee: </strong>
                          <span v-if="deliveryFee === 0" class="text-positive text-weight-bold">
                            FREE ✨
                          </span>
                          <span v-else class="text-weight-bold">
                            ₵{{ deliveryFee.toFixed(2) }}
                          </span>
                        </div>
                        <div v-if="deliveryFee === 0" class="text-caption text-positive">
                          🎉 You qualify for free delivery!
                        </div>
                        <div v-else-if="cartTotal >= 50" class="text-caption text-warning">
                          💡 Add ₵{{ (100 - cartTotal).toFixed(2) }} more for free delivery
                        </div>
                        <div class="text-caption q-mt-sm">
                          Estimated delivery: 1-2 business days
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>

                  <q-stepper-navigation>
                    <q-btn 
                      type="submit" 
                      color="primary" 
                      label="Continue to Payment"
                      :disable="!formState.deliveryValid"
                      icon-right="arrow_forward"
                    />
                    <q-btn
                      flat
                      @click="currentStep = 1"
                      color="primary"
                      label="Back"
                      class="q-ml-sm"
                      icon="arrow_back"
                    />
                  </q-stepper-navigation>
                </q-form>
              </q-step>

              <!-- Step 3: Payment Information -->
              <q-step
                :name="3"
                title="Payment Information"
                icon="payment"
                :done="currentStep > 3"
              >
                <q-form @submit="validatePayment" class="q-gutter-md">
                  <q-card class="q-pa-md">
                    <q-card-section>
                      <div class="text-h6 q-mb-md">Choose Payment Method</div>
                      
                      <!-- Enhanced Payment Method Selection -->
                      <div class="payment-methods q-gutter-md">
                        <q-card 
                          v-for="option in paymentOptions" 
                          :key="option.value"
                          class="payment-option"
                          :class="{ 'selected': paymentForm.method === option.value }"
                          clickable
                          @click="paymentForm.method = option.value"
                        >
                          <q-card-section class="text-center q-pa-md">
                            <q-icon 
                              :name="option.icon || 'payment'" 
                              size="2rem" 
                              :color="paymentForm.method === option.value ? 'primary' : 'grey-6'"
                              class="q-mb-sm"
                            />
                            <div class="text-weight-bold">{{ option.label }}</div>
                            <div class="text-caption text-grey-7">{{ option.description }}</div>
                            <q-radio 
                              v-model="paymentForm.method" 
                              :val="option.value" 
                              color="primary"
                              class="q-mt-sm"
                            />
                          </q-card-section>
                        </q-card>
                      </div>

                      <!-- Paystack Info Banner -->
                      <q-banner 
                        v-if="paymentForm.method === 'paystack'" 
                        class="bg-primary text-white q-mt-md" 
                        rounded
                      >
                        <template v-slot:avatar>
                          <q-icon name="security" color="white" />
                        </template>
                        <div class="text-body1">
                          <strong>Secure Payment with Paystack</strong><br>
                          Pay with cards, bank transfers, or USSD. Your payment information is encrypted and secure.
                        </div>
                      </q-banner>
                    </q-card-section>
                  </q-card>

                  <q-card v-if="paymentForm.method === 'card'" class="q-pa-md">
                    <q-card-section>
                      <div class="text-h6 q-mb-md">Card Information</div>
                      <div class="q-gutter-md">
                        <q-input
                          v-model="paymentForm.cardNumber"
                          label="Card Number *"
                          outlined
                          mask="#### #### #### ####"
                          :rules="[rules.required, rules.cardNumber]"
                          :error="!!paymentErrors.cardNumber"
                          :error-message="paymentErrors.cardNumber"
                          bottom-slots
                        >
                          <template v-slot:append>
                            <q-icon 
                              v-if="paymentForm.cardNumber && !paymentErrors.cardNumber" 
                              name="check_circle" 
                              color="positive" 
                            />
                          </template>
                        </q-input>
                        <div class="row q-gutter-md">
                          <q-input
                            v-model="paymentForm.expiryDate"
                            label="MM/YY *"
                            outlined
                            mask="##/##"
                            class="col"
                            :rules="[rules.required, rules.expiryDate]"
                            :error="!!paymentErrors.expiryDate"
                            :error-message="paymentErrors.expiryDate"
                            bottom-slots
                          >
                            <template v-slot:append>
                              <q-icon 
                                v-if="paymentForm.expiryDate && !paymentErrors.expiryDate" 
                                name="check_circle" 
                                color="positive" 
                              />
                            </template>
                          </q-input>
                          <q-input
                            v-model="paymentForm.cvv"
                            label="CVV *"
                            outlined
                            mask="###"
                            class="col"
                            :rules="[rules.required, rules.cvv]"
                            :error="!!paymentErrors.cvv"
                            :error-message="paymentErrors.cvv"
                            bottom-slots
                          >
                            <template v-slot:append>
                              <q-icon 
                                v-if="paymentForm.cvv && !paymentErrors.cvv" 
                                name="check_circle" 
                                color="positive" 
                              />
                            </template>
                          </q-input>
                        </div>
                        <q-input
                          v-model="paymentForm.cardholderName"
                          label="Cardholder Name *"
                          outlined
                          :rules="[rules.required, rules.name]"
                          :error="!!paymentErrors.cardholderName"
                          :error-message="paymentErrors.cardholderName"
                          bottom-slots
                        >
                          <template v-slot:append>
                            <q-icon 
                              v-if="paymentForm.cardholderName && !paymentErrors.cardholderName" 
                              name="check_circle" 
                              color="positive" 
                            />
                          </template>
                        </q-input>
                      </div>
                    </q-card-section>
                  </q-card>

                  <q-stepper-navigation>
                    <q-btn 
                      type="submit" 
                      color="primary" 
                      label="Review Order"
                      :disable="paymentForm.method === 'card' && !formState.paymentValid"
                      icon-right="visibility"
                    />
                    <q-btn
                      flat
                      @click="currentStep = 2"
                      color="primary"
                      label="Back"
                      class="q-ml-sm"
                      icon="arrow_back"
                    />
                  </q-stepper-navigation>
                </q-form>
              </q-step>

              <!-- Step 4: Order Confirmation -->
              <q-step
                :name="4"
                title="Order Confirmation"
                icon="check_circle"
              >
                <div class="order-confirmation">
                  <q-card class="q-mb-md">
                    <q-card-section>
                      <div class="text-h6 q-mb-md">Order Summary</div>
                      <div class="q-gutter-sm">
                        <div v-for="item in pharmacyStore.cart" :key="item.drug.id" class="row justify-between">
                          <span>{{ item.drug.name }} × {{ item.quantity }}</span>
                          <span class="text-weight-bold">${{ (item.drug.price * item.quantity).toFixed(2) }}</span>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>

                  <q-card class="q-mb-md">
                    <q-card-section>
                      <div class="text-h6 q-mb-md">Delivery Address</div>
                      <p class="q-ma-none">
                        {{ deliveryForm.phoneNumber }}<br>
                        {{ deliveryForm.address }}<br>
                        <span v-if="deliveryForm.area">Area: {{ deliveryForm.area }}<br></span>
                        <span v-if="deliveryForm.landmark">Landmark: {{ deliveryForm.landmark }}<br></span>
                        <span v-if="deliveryForm.notes">Notes: {{ deliveryForm.notes }}</span>
                      </p>
                    </q-card-section>
                  </q-card>

                  <q-card class="q-mb-md">
                    <q-card-section>
                      <div class="text-h6 q-mb-md">Payment Method</div>
                      <p class="q-ma-none">
                        {{ paymentForm.method === 'card' ? 'Credit/Debit Card' : 'PayStack' }}
                        <span v-if="paymentForm.method === 'card' && paymentForm.cardNumber">
                          ending in {{ paymentForm.cardNumber.slice(-4) }}
                        </span>
                      </p>
                    </q-card-section>
                  </q-card>

                  <q-stepper-navigation>
                    <q-btn 
                      @click="placeOrder" 
                      color="positive" 
                      label="Place Order" 
                      size="lg"
                      :loading="formState.submitting"
                      :disable="formState.submitting"
                      icon-right="shopping_cart_checkout"
                    >
                      <template v-slot:loading>
                        <q-spinner-hourglass class="on-left" />
                        Processing...
                      </template>
                    </q-btn>
                    <q-btn
                      flat
                      @click="currentStep = 3"
                      color="primary"
                      label="Back"
                      class="q-ml-sm"
                      icon="arrow_back"
                      :disable="formState.submitting"
                    />
                  </q-stepper-navigation>
                </div>
              </q-step>
            </q-stepper>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="col-12 col-lg-4">
            <q-card class="order-summary sticky-top">
              <q-card-section>
                <div class="text-h6 q-mb-md">Order Summary</div>
                
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span class="text-weight-bold">${{ pharmacyStore.cartTotal.toFixed(2) }}</span>
                </div>
                
                <div class="summary-row">
                  <span>Delivery:</span>
                  <span v-if="!deliveryForm.area" class="text-grey">Select area for fee</span>
                  <span v-else-if="deliveryFee === 0" class="text-positive">FREE ✨</span>
                  <span v-else class="text-weight-bold">₵{{ deliveryFee.toFixed(2) }}</span>
                </div>
                
                <div class="summary-row">
                  <span>Tax:</span>
                  <span>${{ tax.toFixed(2) }}</span>
                </div>
                
                <q-separator class="q-my-md" />
                
                <div class="summary-row total-row">
                  <span class="text-h6 text-weight-bold">Total:</span>
                  <span class="text-h6 text-weight-bold text-primary">
                    ${{ total.toFixed(2) }}
                  </span>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { usePharmacyStore } from '../stores/pharmacy';
import { PharmacyValidator, ErrorHandler } from '../utils/validation';
import { 
  fetchDeliveryAreas, 
  calculateDeliveryFee as apiCalculateDeliveryFee,
  type DeliveryArea,
  type DeliveryFeeRequest 
} from '../services/pharmacyService';

// Debounce utility
function debounce(func: (...args: unknown[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Composables
const router = useRouter();
const $q = useQuasar();
const pharmacyStore = usePharmacyStore();

// Initialize validation utilities
const errorHandler = new ErrorHandler();

// Local state
const currentStep = ref(1);

// Form data
const deliveryForm = ref({
  phoneNumber: '',
  address: '',
  area: '',
  landmark: '',
  notes: ''
});

// Delivery-specific state
const deliveryAreas = ref<DeliveryArea[]>([]);
const deliveryFee = ref(0);
const loadingAreas = ref(false);
const cartTotal = computed(() => pharmacyStore.cartTotal);

const paymentForm = ref({
  method: 'paystack', // Default to Paystack since it's the primary option
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
});

// Form validation states
const deliveryErrors = reactive({
  phoneNumber: '',
  address: '',
  area: '',
  landmark: ''
});

const paymentErrors = reactive({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
});

// Form state tracking
const formState = reactive({
  deliveryValid: false,
  paymentValid: false,
  submitting: false
});

// Payment options
const paymentOptions = [
  { 
    label: 'Paystack (Card, Bank Transfer, USSD)', 
    value: 'paystack',
    icon: 'payment',
    description: 'Secure payment with multiple options'
  },
];

// Enhanced validation rules with real-time feedback
const rules = {
  required: (val: string) => !!val || 'This field is required',
  email: (val: string) => {
    if (!val) return true;
    const rule = PharmacyValidator.email();
    return rule.validator(val) || rule.message;
  },
  phone: (val: string) => {
    if (!val) return true;
    const rule = PharmacyValidator.phone();
    return rule.validator(val) || rule.message;
  },
  address: (val: string) => {
    if (!val) return true;
    const rule = PharmacyValidator.address();
    return rule.validator(val) || rule.message;
  },
  name: (val: string) => {
    if (!val) return true;
    const rule = PharmacyValidator.fullName();
    return rule.validator(val) || rule.message;
  },
  zipCode: (val: string) => {
    if (!val) return true;
    const rule = PharmacyValidator.zipCode();
    return rule.validator(val) || rule.message;
  },
  cardNumber: (val: string) => {
    if (!val) return true;
    const rule = PharmacyValidator.creditCard();
    return rule.validator(val) || rule.message;
  },
  expiryDate: (val: string) => {
    if (!val) return true;
    const rule = PharmacyValidator.expiryDate();
    return rule.validator(val) || rule.message;
  },
  cvv: (val: string) => {
    if (!val) return true;
    const rule = PharmacyValidator.cvv();
    return rule.validator(val) || rule.message;
  }
};

// Real-time validation watchers with debouncing
const debouncedPhoneValidation = debounce((newVal: unknown) => {
  if (typeof newVal === 'string' && newVal) {
    const rule = PharmacyValidator.phone();
    const isValid = rule.validator(newVal);
    deliveryErrors.phoneNumber = isValid ? '' : rule.message;
  }
}, 300);

const debouncedAddressValidation = debounce((newVal: unknown) => {
  if (typeof newVal === 'string' && newVal) {
    const rule = PharmacyValidator.address();
    const isValid = rule.validator(newVal);
    deliveryErrors.address = isValid ? '' : rule.message;
  }
}, 300);

const debouncedCardValidation = debounce((newVal: unknown) => {
  if (typeof newVal === 'string' && newVal) {
    const rule = PharmacyValidator.creditCard();
    const isValid = rule.validator(newVal);
    paymentErrors.cardNumber = isValid ? '' : rule.message;
  }
}, 300);

const debouncedExpiryValidation = debounce((newVal: unknown) => {
  if (typeof newVal === 'string' && newVal) {
    const rule = PharmacyValidator.expiryDate();
    const isValid = rule.validator(newVal);
    paymentErrors.expiryDate = isValid ? '' : rule.message;
  }
}, 300);

watch(() => deliveryForm.value.phoneNumber, debouncedPhoneValidation);
watch(() => deliveryForm.value.address, debouncedAddressValidation);
watch(() => paymentForm.value.cardNumber, debouncedCardValidation);
watch(() => paymentForm.value.expiryDate, debouncedExpiryValidation);

// Continuous form validation state updates
watch([deliveryForm, deliveryErrors], () => {
  const hasRequiredDeliveryFields = !!(deliveryForm.value.phoneNumber.trim() && 
                                       deliveryForm.value.address.trim());
  
  const hasNoDeliveryErrors = Object.values(deliveryErrors)
    .every(error => !error);
  
  formState.deliveryValid = hasRequiredDeliveryFields && hasNoDeliveryErrors;
}, { deep: true });

watch([paymentForm, paymentErrors], () => {
  // Paystack doesn't require card details to be entered upfront
  if (paymentForm.value.method === 'paystack') {
    formState.paymentValid = true;
    return;
  }
  
  const hasAllPaymentFields = Object.entries(paymentForm.value)
    .filter(([key]) => key !== 'method')
    .every(([, value]) => value.trim());
  
  const hasNoPaymentErrors = Object.values(paymentErrors)
    .every(error => !error);
  
  formState.paymentValid = hasAllPaymentFields && hasNoPaymentErrors;
}, { deep: true });

// Computed
const tax = computed(() => pharmacyStore.cartTotal * 0.08); // 8% tax
const total = computed(() => pharmacyStore.cartTotal + tax.value + (deliveryFee.value || 0));

// Enhanced validation methods
const validateDelivery = () => {
  const errors: string[] = [];
  
  // Comprehensive field validation for delivery
  const validations = [
    { field: 'phoneNumber', rule: PharmacyValidator.phone(), label: 'Phone number' },
    { field: 'address', rule: PharmacyValidator.address(), label: 'Delivery address' }
  ];

  validations.forEach(({ field, rule, label }) => {
    const value = deliveryForm.value[field as keyof typeof deliveryForm.value];
    const isValid = rule.validator(value);
    
    if (!isValid) {
      errors.push(`${label}: ${rule.message}`);
      deliveryErrors[field as keyof typeof deliveryErrors] = rule.message;
    } else {
      deliveryErrors[field as keyof typeof deliveryErrors] = '';
    }
  });

  if (errors.length > 0) {
    errorHandler.showFormErrors(errors, $q as unknown as { notify: (options: unknown) => void });
    formState.deliveryValid = false;
    return false;
  }

  formState.deliveryValid = true;
  
  // Move to next step
  currentStep.value = 3;
  $q.notify({
    type: 'positive',
    message: 'Delivery information verified ✓',
    position: 'bottom',
    timeout: 1500,
    icon: 'check_circle'
  });
  
  return true;
};

// Delivery fee calculation
// Delivery fee calculation using API
const calculateDeliveryFee = async () => {
  if (!cartTotal.value) {
    deliveryFee.value = 0;
    return;
  }

  // If no delivery area is selected, show a default fee or 0
  if (!deliveryForm.value.area) {
    // Set to 0 until user selects an area
    deliveryFee.value = 0;
    return;
  }

  try {
    const request: DeliveryFeeRequest = {
      delivery_area: deliveryForm.value.area,
      order_value: cartTotal.value
    };

    const response = await apiCalculateDeliveryFee(request);
    deliveryFee.value = response.delivery_fee;
    
    // Show notification for free delivery
    if (response.is_free_delivery) {
      $q.notify({
        type: 'positive',
        message: '🎉 You qualify for free delivery!',
        position: 'bottom-right',
        timeout: 2000,
        icon: 'local_shipping'
      });
    }
    
  } catch (error) {
    console.error('Error calculating delivery fee:', error);
    
    // Fallback to basic calculation
    const baseFee = 2.00;
    deliveryFee.value = cartTotal.value >= 100 ? 0 : baseFee;
    
    $q.notify({
      type: 'warning',
      message: 'Using default delivery fee calculation',
      position: 'bottom-right',
      timeout: 2000,
      icon: 'warning'
    });
  }
};

// Load delivery areas
// Load delivery areas from API
const loadDeliveryAreas = async () => {
  loadingAreas.value = true;
  try {
    const areas = await fetchDeliveryAreas();
    deliveryAreas.value = areas.filter(area => area.is_active);
    
    $q.notify({
      type: 'positive',
      message: `Loaded ${deliveryAreas.value.length} delivery areas`,
      position: 'bottom-right',
      timeout: 2000,
      icon: 'location_on'
    });
  } catch (error) {
    console.error('Error loading delivery areas:', error);
    
    $q.notify({
      type: 'negative',
      message: 'Failed to load delivery areas. Please try again.',
      position: 'center',
      timeout: 3000,
      icon: 'error'
    });
    
    // Fallback to empty array - user can still place order without area selection
    deliveryAreas.value = [];
  } finally {
    loadingAreas.value = false;
  }
};

const validatePaymentForm = () => {
  // Paystack doesn't require upfront validation - handled by Paystack
  if (paymentForm.value.method === 'paystack') {
    formState.paymentValid = true;
    return true;
  }

  const errors: string[] = [];
  
  // Card validation
  const cardValidations = [
    { field: 'cardNumber', rule: PharmacyValidator.creditCard(), label: 'Card number' },
    { field: 'expiryDate', rule: PharmacyValidator.expiryDate(), label: 'Expiry date' },
    { field: 'cvv', rule: PharmacyValidator.cvv(), label: 'CVV' },
    { field: 'cardholderName', rule: PharmacyValidator.fullName(), label: 'Cardholder name' }
  ];

  cardValidations.forEach(({ field, rule, label }) => {
    const value = paymentForm.value[field as keyof typeof paymentForm.value];
    const isValid = rule.validator(value);
    
    if (!isValid) {
      errors.push(`${label}: ${rule.message}`);
      paymentErrors[field as keyof typeof paymentErrors] = rule.message;
    } else {
      paymentErrors[field as keyof typeof paymentErrors] = '';
    }
  });

  if (errors.length > 0) {
    errorHandler.showFormErrors(errors, $q as unknown as { notify: (options: unknown) => void });
    formState.paymentValid = false;
    return false;
  }

  formState.paymentValid = true;
  return true;
};

const validatePayment = () => {
  if (!validatePaymentForm()) {
    return;
  }

  currentStep.value = 4;
  $q.notify({
    type: 'positive',
    message: 'Payment method verified ✓',
    position: 'bottom',
    timeout: 1500,
    icon: 'check_circle'
  });
};

const placeOrder = async () => {
  if (formState.submitting) return;

  // Final validation before submission
  if (!validateDelivery() || !validatePaymentForm()) {
    $q.notify({
      type: 'negative',
      message: 'Please fix all form errors before placing your order',
      position: 'center',
      timeout: 3000,
      icon: 'error'
    });
    return;
  }

  try {
    formState.submitting = true;
    
    $q.notify({
      type: 'ongoing',
      message: 'Processing your order...',
      position: 'center',
      timeout: 0,
      group: 'order-processing',
      spinner: true
    });

    const orderData = {
      phone_number: deliveryForm.value.phoneNumber,
      delivery_address: deliveryForm.value.address,
      delivery_area: deliveryForm.value.area,
      landmark: deliveryForm.value.landmark,
      delivery_fee: deliveryFee.value,
      delivery_notes: deliveryForm.value.notes,
      payment_method: paymentForm.value.method
    };

    // First, place the order to get order ID
    const order = await pharmacyStore.checkout(orderData);
    
    if (order && paymentForm.value.method === 'paystack') {
      // Initialize Paystack payment
      $q.notify({
        type: 'ongoing',
        message: 'Redirecting to payment...',
        position: 'center',
        timeout: 0,
        group: 'order-processing',
        spinner: true
      });

      const paymentResponse = await pharmacyStore.initializePaymentProcess(order.id);
      
      if (paymentResponse && paymentResponse.status === 'success') {
        // Clear notifications
        $q.notify({
          group: 'order-processing',
          timeout: 1
        });
        
        // Redirect to Paystack
        window.location.href = paymentResponse.data.authorization_url;
        return;
      } else {
        throw new Error(paymentResponse?.message || 'Failed to initialize payment');
      }
    } else if (order) {
      // For other payment methods (cash on delivery, etc.)
      $q.notify({
        type: 'positive',
        message: `Order ${order.order_number} placed successfully! 🎉`,
        position: 'center',
        timeout: 3000,
        group: 'order-processing',
        icon: 'celebration',
        actions: [
          {
            label: 'Track Order',
            color: 'white',
            handler: () => {
              router.push({ 
                name: 'orderStatus', 
                params: { id: order.id.toString() } 
              });
            }
          }
        ]
      });
      
      // Clear form data
      Object.keys(deliveryForm.value).forEach(key => {
        (deliveryForm.value as Record<string, string>)[key] = '';
      });
      Object.keys(paymentForm.value).forEach(key => {
        if (key !== 'method') {
          (paymentForm.value as Record<string, string>)[key] = '';
        }
      });
      
      // Redirect after delay
      setTimeout(() => {
        router.push({ 
          name: 'orderStatus', 
          params: { id: order.id.toString() } 
        });
      }, 2000);
    }
  } catch (error) {
    const handledError = errorHandler.handleAPIError(error);
    
    $q.notify({
      type: 'negative',
      message: handledError.message,
      position: 'center',
      timeout: 5000,
      group: 'order-processing',
      icon: 'error',
      actions: [
        {
          label: 'Retry',
          color: 'white',
          handler: () => placeOrder()
        },
        { icon: 'close', color: 'white', round: true }
      ]
    });
    
    // Log error for debugging
    console.error('Order placement failed:', handledError);
  } finally {
    formState.submitting = false;
  }
};

// Initialize delivery areas on component mount
onMounted(() => {
  loadDeliveryAreas();
  
  // Don't calculate delivery fee on mount - wait for user to select an area
  // The fee will be calculated when they select a delivery area
});
</script>

<style scoped lang="scss">
.checkout-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.checkout-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 20px;
}

.checkout-stepper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.cart-item {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
}

.order-summary {
  background: white;
  border-radius: 12px;
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    &.total-row {
      margin-bottom: 0;
    }
  }
}

.sticky-top {
  position: sticky;
  top: 20px;
}

.empty-cart {
  background: white;
  border-radius: 12px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.order-confirmation {
  .q-card {
    border-radius: 8px;
  }
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.payment-option {
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #e3f2fd;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &.selected {
    border-color: #1976d2;
    background-color: #f8fbff;
    box-shadow: 0 4px 16px rgba(25, 118, 210, 0.2);
  }
}

@media (max-width: 1024px) {
  .sticky-top {
    position: static;
  }
  
  .payment-methods {
    grid-template-columns: 1fr;
  }
}
</style>
