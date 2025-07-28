<!-- filepath: src/components/QuantitySelector.vue -->
<template>
  <div class="quantity-selector">
    <div class="quantity-input-group">
      <q-btn
        round
        dense
        icon="remove"
        color="grey-5"
        :disable="quantity <= min || loading"
        @click="decreaseQuantity"
        size="sm"
        class="quantity-btn"
      />
      
      <q-input
        v-model.number="quantity"
        type="number"
        :min="min"
        :max="max"
        outlined
        dense
        class="quantity-input"
        :rules="quantityRules"
        :error="!!error"
        :error-message="error"
        @update:model-value="validateAndEmit"
        @blur="validateOnBlur"
        input-class="text-center text-weight-bold"
        hide-bottom-space
      />
      
      <q-btn
        round
        dense
        icon="add"
        color="primary"
        :disable="quantity >= max || loading"
        @click="increaseQuantity"
        size="sm"
        class="quantity-btn"
      />
    </div>
    
    <!-- Stock Information -->
    <div v-if="showStock" class="stock-info q-mt-sm">
      <div class="row items-center q-gutter-xs">
        <q-icon 
          :name="stockIcon" 
          :color="stockColor" 
          size="16px"
        />
        <span 
          :class="`text-caption text-${stockColor}`"
        >
          {{ stockMessage }}
        </span>
      </div>
    </div>
    
    <!-- Validation Messages -->
    <div v-if="validationMessage" class="validation-message q-mt-xs">
      <div class="row items-center q-gutter-xs">
        <q-icon 
          :name="validationIcon" 
          :color="validationColor" 
          size="14px"
        />
        <span 
          :class="`text-caption text-${validationColor}`"
        >
          {{ validationMessage }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PharmacyValidator } from '../utils/validation';

interface Props {
  modelValue: number;
  min?: number;
  max?: number;
  stock?: number;
  loading?: boolean;
  showStock?: boolean;
  allowDecimal?: boolean;
  step?: number;
}

interface Emits {
  (e: 'update:modelValue', value: number): void;
  (e: 'validation-change', isValid: boolean): void;
  (e: 'stock-warning', message: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 999,
  stock: 999,
  loading: false,
  showStock: true,
  allowDecimal: false,
  step: 1
});

const emit = defineEmits<Emits>();

// Local state
const quantity = ref(props.modelValue);
const error = ref('');
const validationMessage = ref('');

// Computed properties
const effectiveMax = computed(() => Math.min(props.max, props.stock));

const stockIcon = computed(() => {
  if (props.stock === 0) return 'cancel';
  if (props.stock <= 5) return 'warning';
  if (props.stock <= 10) return 'info';
  return 'check_circle';
});

const stockColor = computed(() => {
  if (props.stock === 0) return 'negative';
  if (props.stock <= 5) return 'warning';
  if (props.stock <= 10) return 'orange';
  return 'positive';
});

const stockMessage = computed(() => {
  if (props.stock === 0) return 'Out of stock';
  if (props.stock <= 5) return `Only ${props.stock} left in stock`;
  if (props.stock <= 10) return `${props.stock} available`;
  return `${props.stock} in stock`;
});

const validationIcon = computed(() => {
  if (error.value) return 'error';
  if (validationMessage.value.includes('warning')) return 'warning';
  if (validationMessage.value.includes('maximum')) return 'info';
  return 'check_circle';
});

const validationColor = computed(() => {
  if (error.value) return 'negative';
  if (validationMessage.value.includes('warning')) return 'warning';
  if (validationMessage.value.includes('maximum')) return 'orange';
  return 'positive';
});

// Validation rules
const quantityRules = [
  (val: number) => {
    const result = PharmacyValidator.validateQuantity(val, props.min, effectiveMax.value);
    return result.isValid || result.error;
  }
];

// Methods
const validateQuantity = (value: number): boolean => {
  error.value = '';
  validationMessage.value = '';
  
  const result = PharmacyValidator.validateQuantity(value, props.min, effectiveMax.value);
  
  if (!result.isValid) {
    error.value = result.error;
    emit('validation-change', false);
    return false;
  }
  
  // Additional stock warnings
  if (value > props.stock * 0.8) {
    validationMessage.value = 'Large quantity - verify stock availability';
    emit('stock-warning', 'Large quantity selected');
  } else if (value === effectiveMax.value) {
    validationMessage.value = 'Maximum quantity selected';
  }
  
  emit('validation-change', true);
  return true;
};

const validateAndEmit = (value: string | number | null) => {
  // Convert to number and ensure it's valid
  const numValue = typeof value === 'number' ? value : Number(value);
  
  // Handle invalid numbers
  if (isNaN(numValue) || value === null) {
    quantity.value = props.min;
    return;
  }
  
  // Ensure value is within bounds
  const clampedValue = Math.max(props.min, Math.min(effectiveMax.value, numValue));
  
  if (numValue !== clampedValue) {
    quantity.value = clampedValue;
    return;
  }
  
  if (validateQuantity(clampedValue)) {
    emit('update:modelValue', clampedValue);
  }
};

const validateOnBlur = () => {
  // Ensure quantity is valid when user finishes editing
  if (quantity.value < props.min) {
    quantity.value = props.min;
  } else if (quantity.value > effectiveMax.value) {
    quantity.value = effectiveMax.value;
  }
  
  validateAndEmit(quantity.value);
};

const increaseQuantity = () => {
  if (quantity.value < effectiveMax.value) {
    quantity.value += props.step;
    validateAndEmit(quantity.value);
  }
};

const decreaseQuantity = () => {
  if (quantity.value > props.min) {
    quantity.value -= props.step;
    validateAndEmit(quantity.value);
  }
};

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  quantity.value = newValue;
  validateQuantity(newValue);
});

watch(() => props.stock, () => {
  // Re-validate when stock changes
  validateQuantity(quantity.value);
});

// Initial validation
validateQuantity(quantity.value);
</script>

<style scoped>
.quantity-selector {
  max-width: 200px;
}

.quantity-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-input {
  flex: 1;
  min-width: 80px;
}

.quantity-input :deep(.q-field__control) {
  min-height: 32px;
}

.quantity-input :deep(input) {
  text-align: center;
  font-weight: bold;
}

.quantity-btn {
  width: 32px;
  height: 32px;
}

.stock-info,
.validation-message {
  font-size: 0.75rem;
  line-height: 1.2;
}

.validation-message {
  min-height: 18px;
}
</style>
