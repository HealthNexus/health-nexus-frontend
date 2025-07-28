// filepath: src/stores/pharmacy.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Notify } from 'quasar';
import {
  fetchDrugs,
  fetchDrugBySlug,
  placeOrder,
  trackOrder,
  searchDrugs,
  fetchDrugCategories,
  Drug,
  OrderPayload,
  OrderResponse,
  OrderStatus,
  CartItem
} from 'src/services/pharmacyService';
import {
  initializePayment,
  verifyPayment,
  calculatePaymentFees,
  PaymentInitializationResponse,
  PaymentVerificationResponse
} from 'src/services/paymentService';

export const usePharmacyStore = defineStore('pharmacy', () => {
  // State
  const drugs = ref<Drug[]>([]);
  const cart = ref<CartItem[]>([]);
  const orders = ref<OrderResponse[]>([]);
  const orderStatus = ref<OrderStatus | null>(null);
  const categories = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string>('');
  const searchQuery = ref<string>('');
  const selectedCategory = ref<string>('');

  // Payment-related state
  const paymentLoading = ref(false);
  const paymentError = ref<string>('');
  const currentPaymentReference = ref<string>('');
  const paymentFees = ref<{ amount: number; fee: number; total: number } | null>(null);

  // Cart will be loaded from database, not localStorage

  // Computed properties
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => {
      return total + (item.drug.price * item.quantity);
    }, 0);
  });

  const cartItemCount = computed(() => {
    return cart.value.reduce((count, item) => count + item.quantity, 0);
  });

  const filteredDrugs = computed(() => {
    let filtered = drugs.value;

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(drug =>
        drug.name.toLowerCase().includes(query) ||
        drug.description.toLowerCase().includes(query) ||
        drug.category?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory.value) {
      filtered = filtered.filter(drug => drug.category === selectedCategory.value);
    }

    return filtered;
  });

  // Actions
  const loadDrugs = async () => {
    loading.value = true;
    error.value = '';
    try {
      const fetchedDrugs = await fetchDrugs();
      // Price is already converted to number in the service
      drugs.value = fetchedDrugs.map(drug => ({
        ...drug,
        image: drug.image && !drug.image.includes('via.placeholder.com') ? drug.image : undefined,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load drugs';
      error.value = errorMessage;
      Notify.create({
        type: 'negative',
        message: error.value,
      });
    } finally {
      loading.value = false;
    }
  };

  const loadCategories = async () => {
    try {
      categories.value = await fetchDrugCategories();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load categories';
      console.warn('Failed to load categories:', errorMessage);
    }
  };

  const searchForDrugs = async (query: string) => {
    if (!query.trim()) {
      await loadDrugs();
      return;
    }

    loading.value = true;
    error.value = '';
    try {
      const fetchedDrugs = await searchDrugs(query);
      drugs.value = fetchedDrugs.map(drug => ({
        ...drug,
        image: drug.image && !drug.image.includes('via.placeholder.com') ? drug.image : undefined,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search drugs';
      error.value = errorMessage;
      Notify.create({
        type: 'negative',
        message: error.value,
      });
    } finally {
      loading.value = false;
    }
  };

  // Local storage management
  const storageKey = 'healthnexus_cart';

  const saveCartToStorage = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart.value));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  };

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem(storageKey);
      if (savedCart) {
        cart.value = JSON.parse(savedCart);
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
      cart.value = []; // Reset to empty on error
    }
  };

  // Load cart from localStorage
  const loadCart = () => {
    loadCartFromStorage();
  };

  const addToCart = (drug: Drug, quantity = 1) => {
    if (drug.stock < quantity) {
      Notify.create({
        type: 'negative',
        message: 'Insufficient stock available',
      });
      return;
    }

    // Check if item already exists in cart
    const existingItem = cart.value.find(item => item.drug.id === drug.id);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > drug.stock) {
        Notify.create({
          type: 'negative',
          message: 'Cannot add more items. Exceeds available stock.',
        });
        return;
      }
      
      existingItem.quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.value.push({
        drug_id: drug.id,
        drug: drug,
        quantity: quantity
      });
    }

    saveCartToStorage();
    Notify.create({
      type: 'positive',
      message: `${drug.name} added to cart`,
    });
  };

  const removeFromCart = (drugId: number) => {
    const itemIndex = cart.value.findIndex(item => item.drug.id === drugId);
    if (itemIndex > -1) {
      const removedItem = cart.value.splice(itemIndex, 1)[0];
      saveCartToStorage();
      Notify.create({
        type: 'info',
        message: `${removedItem.drug.name} removed from cart`,
      });
    }
  };

  const updateCartItemQuantity = (drugId: number, quantity: number) => {
    const item = cart.value.find(item => item.drug.id === drugId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(drugId);
        return;
      }
      
      if (quantity > item.drug.stock) {
        Notify.create({
          type: 'negative',
          message: 'Quantity exceeds available stock',
        });
        return;
      }

      item.quantity = quantity;
      saveCartToStorage();
      Notify.create({
        type: 'positive',
        message: 'Cart updated',
      });
    }
  };

  const clearCart = () => {
    cart.value = [];
    saveCartToStorage();
    Notify.create({
      type: 'info',
      message: 'Cart cleared',
    });
  };

  const checkout = async (orderData: Partial<OrderPayload> = {}) => {
    // Check if cart has items
    if (cart.value.length === 0) {
      Notify.create({
        type: 'negative',
        message: 'Cannot place an order with an empty cart',
      });
      return;
    }

    loading.value = true;
    error.value = '';

    try {
      // Prepare items array from cart
      const items = cart.value.map(item => ({
        drug_id: item.drug_id,
        quantity: item.quantity
      }));

      // Backend expects items array + delivery information
      const payload: OrderPayload = {
        items: items,
        phone_number: orderData.phone_number || '',
        delivery_address: orderData.delivery_address || '',
        delivery_area: orderData.delivery_area,
        landmark: orderData.landmark,
        delivery_fee: orderData.delivery_fee,
        delivery_notes: orderData.delivery_notes,
        payment_method: orderData.payment_method || 'paystack',
      };

      const order = await placeOrder(payload);
      orders.value.push(order);
      
      // Clear local cart after successful order
      clearCart();

      Notify.create({
        type: 'positive',
        message: `Order ${order.order_number} placed successfully!`,
      });

      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place order';
      error.value = errorMessage;
      Notify.create({
        type: 'negative',
        message: error.value,
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchOrderStatus = async (orderId: number) => {
    loading.value = true;
    error.value = '';

    try {
      orderStatus.value = await trackOrder(orderId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order status';
      error.value = errorMessage;
      Notify.create({
        type: 'negative',
        message: error.value,
      });
    } finally {
      loading.value = false;
    }
  };

  const getDrugBySlug = async (slug: string): Promise<Drug | null> => {
    console.log('Store: getDrugBySlug called with slug:', slug);
    try {
      console.log('Store: fetching drug...');
      const result = await fetchDrugBySlug(slug);
      console.log('Store: drug fetched successfully:', result);
      return result;
    } catch (err) {
      console.error('Store: error in getDrugBySlug:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch drug details';
      Notify.create({
        type: 'negative',
        message: errorMessage,
      });
      return null;
    }
  };

  // Search and filter actions
  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const setSelectedCategory = (category: string) => {
    selectedCategory.value = category;
  };

  const resetFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = '';
  };

  // Initialize store
  const initialize = async () => {
    await Promise.all([
      loadDrugs(),
      loadCategories(),
    ]);
  };

  // Initialize cart from localStorage when store is created
  loadCartFromStorage();

  // Payment-related actions
  const calculateFees = async (amount: number) => {
    try {
      paymentFees.value = await calculatePaymentFees(amount);
      return paymentFees.value;
    } catch (err) {
      console.error('Failed to calculate payment fees:', err);
      return null;
    }
  };

  const initializePaymentProcess = async (orderId: number): Promise<PaymentInitializationResponse | null> => {
    paymentLoading.value = true;
    paymentError.value = '';

    try {
      const response = await initializePayment({ order_id: orderId });
      
      if (response.status === 'success') {
        currentPaymentReference.value = response.data.reference;
        
        Notify.create({
          type: 'positive',
          message: 'Payment initialized successfully',
          timeout: 2000,
        });
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to initialize payment');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
      paymentError.value = errorMessage;
      
      Notify.create({
        type: 'negative',
        message: errorMessage,
        timeout: 4000,
      });
      
      return null;
    } finally {
      paymentLoading.value = false;
    }
  };

  const verifyPaymentProcess = async (reference?: string): Promise<PaymentVerificationResponse | null> => {
    const paymentRef = reference || currentPaymentReference.value;
    
    if (!paymentRef) {
      Notify.create({
        type: 'negative',
        message: 'No payment reference found',
      });
      return null;
    }

    paymentLoading.value = true;
    paymentError.value = '';

    try {
      const response = await verifyPayment({ reference: paymentRef });
      
      if (response.status === 'success' && response.data.status === 'success') {
        Notify.create({
          type: 'positive',
          message: 'Payment verified successfully! 🎉',
          timeout: 3000,
          icon: 'check_circle',
        });
        
        // Clear payment reference after successful verification
        currentPaymentReference.value = '';
        
        return response;
      } else {
        throw new Error(response.message || 'Payment verification failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify payment';
      paymentError.value = errorMessage;
      
      Notify.create({
        type: 'negative',
        message: errorMessage,
        timeout: 4000,
      });
      
      return null;
    } finally {
      paymentLoading.value = false;
    }
  };

  const clearPaymentState = () => {
    paymentError.value = '';
    currentPaymentReference.value = '';
    paymentFees.value = null;
  };

  return {
    // State
    drugs,
    cart,
    orders,
    orderStatus,
    categories,
    loading,
    error,
    searchQuery,
    selectedCategory,
    
    // Payment state
    paymentLoading,
    paymentError,
    currentPaymentReference,
    paymentFees,

    // Computed
    cartTotal,
    cartItemCount,
    filteredDrugs,

    // Actions
    loadDrugs,
    loadCategories,
    searchForDrugs,
    loadCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    checkout,
    fetchOrderStatus,
    getDrugBySlug,
    setSearchQuery,
    setSelectedCategory,
    resetFilters,
    initialize,
    
    // Payment actions
    calculateFees,
    initializePaymentProcess,
    verifyPaymentProcess,
    clearPaymentState,
  };
});
