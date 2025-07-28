<!-- filepath: src/components/ErrorBoundary.vue -->
<template>
  <div class="error-boundary">
    <slot v-if="!hasError" />
    
    <!-- Error State -->
    <div v-else class="error-state q-pa-xl text-center">
      <q-icon 
        name="error_outline" 
        size="80px" 
        color="negative" 
        class="q-mb-md"
      />
      
      <h4 class="text-h5 q-mb-md text-negative">
        {{ errorTitle }}
      </h4>
      
      <p class="text-body1 text-grey-7 q-mb-lg max-width-md">
        {{ errorMessage }}
      </p>
      
      <div class="q-gutter-md">
        <q-btn
          color="primary"
          label="Try Again"
          icon="refresh"
          @click="retry"
          :loading="retrying"
        />
        
        <q-btn
          flat
          color="grey-7"
          label="Report Issue"
          icon="bug_report"
          @click="reportError"
        />
      </div>
      
      <!-- Error Details (Development Mode) -->
      <q-expansion-item
        v-if="isDevelopment && errorDetails"
        icon="code"
        label="Error Details"
        class="q-mt-lg"
      >
        <q-card class="text-left">
          <q-card-section>
            <pre class="text-caption">{{ errorDetails }}</pre>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured } from 'vue';
import { useQuasar } from 'quasar';

interface Props {
  fallbackTitle?: string;
  fallbackMessage?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  onError?: (error: Error, instance: unknown, info: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  fallbackTitle: 'Something went wrong',
  fallbackMessage: 'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.',
  showRetry: true
});

const $q = useQuasar();

// State
const hasError = ref(false);
const errorDetails = ref<string>('');
const retrying = ref(false);

// Computed
const isDevelopment = computed(() => process.env.NODE_ENV === 'development');

const errorTitle = computed(() => {
  return hasError.value ? props.fallbackTitle : '';
});

const errorMessage = computed(() => {
  return hasError.value ? props.fallbackMessage : '';
});

// Error handling
onErrorCaptured((error: Error, instance: unknown, info: string) => {
  console.error('ErrorBoundary caught error:', error, info);
  
  hasError.value = true;
  errorDetails.value = `${error.message}\n\nStack Trace:\n${error.stack}\n\nVue Info: ${info}`;
  
  // Call custom error handler if provided
  if (props.onError) {
    props.onError(error, instance, info);
  }
  
  // Log to error reporting service (in production)
  if (!isDevelopment.value) {
    logErrorToService(error, info);
  }
  
  return false; // Prevent error from propagating
});

// Methods
const retry = async () => {
  retrying.value = true;
  
  try {
    // Reset error state
    hasError.value = false;
    errorDetails.value = '';
    
    // Call custom retry handler if provided
    if (props.onRetry) {
      await props.onRetry();
    }
    
    $q.notify({
      type: 'positive',
      message: 'Refreshed successfully',
      timeout: 2000,
      icon: 'check_circle'
    });
  } catch (error) {
    console.error('Retry failed:', error);
    hasError.value = true;
    
    $q.notify({
      type: 'negative',
      message: 'Retry failed. Please refresh the page manually.',
      timeout: 3000,
      icon: 'error'
    });
  } finally {
    retrying.value = false;
  }
};

const reportError = () => {
  const errorReport = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    error: errorDetails.value
  };
  
  // Copy error details to clipboard
  navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
    .then(() => {
      $q.notify({
        type: 'positive',
        message: 'Error details copied to clipboard. Please send this to support.',
        timeout: 4000,
        icon: 'content_copy'
      });
    })
    .catch(() => {
      $q.notify({
        type: 'warning',
        message: 'Unable to copy error details. Please take a screenshot.',
        timeout: 3000,
        icon: 'warning'
      });
    });
};

const logErrorToService = (error: Error, info: string) => {
  // In a real application, you would send this to your error reporting service
  // Examples: Sentry, LogRocket, Bugsnag, etc.
  const errorData = {
    message: error.message,
    stack: error.stack,
    vueInfo: info,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.log('Error logged to service:', errorData);
  
  // Example service call:
  // errorReportingService.captureException(error, {
  //   extra: errorData
  // });
};
</script>

<style scoped>
.error-boundary {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-state {
  max-width: 600px;
  margin: 0 auto;
}

.max-width-md {
  max-width: 400px;
  margin: 0 auto;
}

pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.4;
}
</style>
