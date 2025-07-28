// filepath: src/services/pharmacyService.ts
import axios from '../axios.js';

const API_URL = 'http://localhost:8000/api';

// Updated Drug interface to match existing Disease store pattern
export interface Drug {
  id: number; // Backend uses numeric IDs (matching Disease store)
  name: string;
  price: number;
  description: string;
  stock: number;
  slug: string; // Backend uses slugs (matching Disease store)
  image?: string;
  category?: string;
  manufacturer?: string;
}

// Order related interfaces - updated for backend compatibility
export interface OrderItem {
  drug_id: number; // Backend expects snake_case
  quantity: number;
  price?: number;
}

export interface OrderPayload {
  items: OrderItem[];
  address: string;
  phone?: string;
  payment_method: string; // Backend expects snake_case
  notes?: string;
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
  status: 'placed' | 'delivering' | 'delivered';
  estimated_delivery?: string;
  tracking_number?: string;
  current_location?: string;
  total: number;
  created_at: string;
  items: Array<{ 
    id: number;
    drug_id: number; 
    quantity: number; 
    price: number;
    drug: Drug;
  }>;
  status_history?: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
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
    
    // Following existing pattern: response.data.drugs
    return response.data.drugs;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Fetch a specific drug by ID
 */
export const fetchDrugById = async (drugId: number): Promise<Drug> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    
    const response = await axios.get(`${API_URL}/drugs/${drugId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    
    return response.data.drug;
  } catch (error) {
    console.log(error);
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
    
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    
    return response.data.order;
  } catch (error) {
    console.log(error);
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
    
    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    
    return response.data.order;
  } catch (error) {
    console.log(error);
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
    
    return response.data.drugs;
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
    
    return response.data.categories;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
