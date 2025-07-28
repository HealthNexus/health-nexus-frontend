// filepath: src/services/pharmacyService.ts
import axios from '../axios.js';
import { AxiosError } from 'axios';

const API_URL = '/api';

// Updated Drug interface to match existing Disease store pattern
export interface Drug {
  id: number; // Backend uses numeric IDs
  name: string;
  price: number; // Price as number
  description: string;
  stock: number;
  slug: string; // Backend uses slugs (matching Disease store)
  image?: string;
  category?: string;
}

// Order related interfaces - updated for backend compatibility
export interface OrderItem {
  drug_id: number; // Backend expects snake_case
  quantity: number;
  price?: number;
}

// Updated OrderPayload to match backend expectations (with items array)
export interface OrderPayload {
  items: Array<{ drug_id: number; quantity: number }>; // Required - Items to order
  phone_number: string;           // Required - Customer contact  
  delivery_address: string;       // Required - Full street address
  delivery_area?: string;         // Optional - Area code from delivery_areas table
  landmark?: string;              // Optional - Nearby landmark for easy location
  delivery_fee?: number;          // Calculated delivery charge
  delivery_notes?: string;        // Optional - Special delivery instructions
  payment_method?: string;        // Backend expects snake_case
}

// Cart item interface for frontend localStorage storage
export interface CartItem {
  drug_id: number;
  quantity: number;
  drug: Drug; // Full drug object stored locally
}

export interface OrderResponse {
  id: number; // Backend uses numeric IDs
  order_number: string;
  status: 'placed' | 'delivering' | 'delivered';
  total: number;
  estimated_delivery?: string;
  tracking_number?: string;
  items: Array<{ 
    id: number;
    drug_id: number; 
    quantity: number; 
    price: number;
    drug: Drug;
  }>;
  created_at: string;
  updated_at: string;
}

export interface OrderStatus {
  id: number;
  order_number: string;
  status: {
    value: 'placed' | 'delivering' | 'delivered';
    label: string;
    description: string;
    color: string;
  };
  estimated_delivery?: string;
  tracking_number?: string;
  current_location?: string;
  totals: {
    subtotal: string;
    tax_amount: string;
    total_amount: string;
    total_items: number;
    formatted_subtotal: string;
    formatted_tax_amount: string;
    formatted_total_amount: string;
  };
  delivery: {
    area: string;
    address: string;
    landmark?: string;
    fee: string;
    formatted_fee: string;
    notes?: string;
  };
  phone_number: string;
  payment: {
    status: string;
    method?: string;
    reference?: string;
  };
  dates: {
    placed_at: string;
    delivered_at?: string;
    status_updated_at?: string;
    days_old: number;
  };
  created_at: string;
  updated_at: string;
  items: Array<{ 
    id: number;
    drug: {
      id: number;
      name: string;
      slug: string;
      description: string;
      current_drug?: Drug;
    };
    quantity: number; 
    unit_price: string;
    total_price: string;
    formatted_unit_price: string;
    formatted_total_price: string;
    created_at: string;
    updated_at: string;
  }>;
  status_history?: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
}

// Delivery area interfaces for KNUST campus delivery
export interface DeliveryArea {
  id: number;
  name: string;
  code: string;
  description?: string;
  base_fee: number;
  formatted_fee: string;
  is_active: boolean;
}

export interface DeliveryFeeRequest {
  delivery_area?: string;  // Backend expects "delivery_area" not "area_code"
  order_value: number;     // Backend expects "order_value" not "total_amount"
}

export interface DeliveryFeeResponse {
  delivery_fee: number;
  is_free_delivery: boolean;
  free_delivery_threshold: number;
  message?: string;
}

/**
 * Fetch all available drugs from the pharmacy
 * Following existing codebase pattern with Bearer token auth
 */
export const fetchDrugs = async (): Promise<Drug[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    
    const response = await axios.get(`${API_URL}/drugs`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    
    // API returns { data: [...] } structure
    // Ensure price is converted to number if it comes as string
    return response.data.data.map((drug: Omit<Drug, 'price'> & { price: string | number }) => ({
      ...drug,
      price: typeof drug.price === 'string' ? parseFloat(drug.price) : drug.price
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Fetch a specific drug by ID
 */
export const fetchDrugBySlug = async (slug: string): Promise<Drug> => {
  console.log('Service: fetchDrugBySlug called with slug:', slug);
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    
    console.log('Service: Making API request to:', `${API_URL}/drugs/${slug}`);
    const response = await axios.get(`${API_URL}/drugs/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    
    console.log('Service: API response received:', response.data);
    console.log('Service: Full response structure:', JSON.stringify(response.data, null, 2));
    
    // Try different possible response structures
    let drug = null;
    if (response.data.drug) {
      drug = response.data.drug;
      console.log('Service: Found drug in response.data.drug');
    } else if (response.data.data) {
      drug = response.data.data;
      console.log('Service: Found drug in response.data.data');
    } else if (response.data.id) {
      // Direct drug object
      drug = response.data;
      console.log('Service: Found drug as direct response.data');
    }
    
    console.log('Service: Drug extracted:', drug);
    
    if (!drug) {
      throw new Error('Drug not found in response');
    }
    
    // Convert price to number if it comes as string
    const processedDrug = {
      ...drug,
      price: typeof drug.price === 'string' ? parseFloat(drug.price) : drug.price
    };
    
    console.log('Service: Processed drug with number price:', processedDrug);
    
    return processedDrug;
  } catch (error) {
    console.error('Service: fetchDrugBySlug error:', error);
    throw error;
  }
};

/**
 * Place a new order
 */
export const placeOrder = async (orderData: OrderPayload): Promise<OrderResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    
    console.log('Service: Placing order with data:', orderData);
    console.log('Service: Using token:', token ? `${token.substring(0, 20)}...` : 'none');
    console.log('Service: Making request to:', `${axios.defaults.baseURL}${API_URL}/orders`);
    
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
    });
    
    console.log('Service: Order API response received:', response.data);
    console.log('Service: Full order response structure:', JSON.stringify(response.data, null, 2));
    
    // ✅ CORRECT: Access order from response.data.data.order based on backend documentation
    if (response.data.status === 'success' && response.data.data?.order) {
      const order = response.data.data.order;
      console.log('Service: Order extracted successfully:', order);
      console.log('Service: Order number:', order.order_number);
      return order;
    } else {
      console.error('Service: Invalid response structure:', response.data);
      throw new Error('Order not found in response or request failed');
    }
    
    return response.data.data.order;
  } catch (error) {
    console.error('Service: placeOrder error:', error);
    
    if (error instanceof AxiosError) {
      console.error('Service: Axios error details:');
      console.error('- Status:', error.response?.status);
      console.error('- Status Text:', error.response?.statusText);
      console.error('- Response Data:', error.response?.data);
      console.error('- Request URL:', error.config?.url);
      console.error('- Request Method:', error.config?.method);
      console.error('- Request Headers:', error.config?.headers);
      
      // Provide more specific error messages
      if (error.code === 'NETWORK_ERROR' || error.message.includes('ERR_FAILED')) {
        throw new Error('Network connection failed. Please check if the backend server is running and accessible.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 404) {
        throw new Error('Order endpoint not found. Please check if the API route exists.');
      } else if (error.response?.status === 422) {
        throw new Error(`Validation error: ${JSON.stringify(error.response.data)}`);
      } else if (error.response && error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    
    throw error;
  }
};

/**
 * Track an order by ID
 */
export const trackOrder = async (orderId: number): Promise<OrderStatus> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    
    console.log('Service: trackOrder called with orderId:', orderId);
    console.log('Service: Making API request to:', `${API_URL}/orders/${orderId}`);
    
    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    
    console.log('Service: Track order API response received:', response.data);
    console.log('Service: Full track order response structure:', JSON.stringify(response.data, null, 2));
    
    // Try different possible response structures similar to placeOrder
    let order = null;
    if (response.data.status === 'success' && response.data.data?.order) {
      order = response.data.data.order;
      console.log('Service: Order found in response.data.data.order');
    } else if (response.data.order) {
      order = response.data.order;
      console.log('Service: Order found in response.data.order');
    } else if (response.data.data) {
      order = response.data.data;
      console.log('Service: Order found in response.data.data');
    } else if (response.data.id) {
      order = response.data;
      console.log('Service: Order found as direct response.data');
    }
    
    console.log('Service: Final order extracted:', order);
    
    if (!order) {
      throw new Error('Order not found in response');
    }
    
    return order;
  } catch (error) {
    console.error('Service: trackOrder error:', error);
    if (error instanceof AxiosError) {
      console.error('Service: Track order Axios error response:', error.response?.data);
      console.error('Service: Track order Axios error status:', error.response?.status);
    }
    throw error;
  }
};

/**
 * Search drugs by query
 */
export const searchDrugs = async (query: string): Promise<Drug[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    
    const response = await axios.get(`${API_URL}/drugs/search`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { query }
    });
    
    // Ensure price is converted to number if it comes as string
    return response.data.drugs.map((drug: Omit<Drug, 'price'> & { price: string | number }) => ({
      ...drug,
      price: typeof drug.price === 'string' ? parseFloat(drug.price) : drug.price
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Fetch drug categories
 */
export const fetchDrugCategories = async (): Promise<string[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    
    const response = await axios.get(`${API_URL}/drugs/categories`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Fetch available delivery areas for KNUST campus
 */
export const fetchDeliveryAreas = async (): Promise<DeliveryArea[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    
    const response = await axios.get(`${API_URL}/delivery/areas`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching delivery areas:', error);
    throw error;
  }
};

/**
 * Calculate delivery fee based on area and order total
 */
export const calculateDeliveryFee = async (request: DeliveryFeeRequest): Promise<DeliveryFeeResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    
    const response = await axios.post(`${API_URL}/delivery/calculate-fee`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error calculating delivery fee:', error);
    throw error;
  }
};
