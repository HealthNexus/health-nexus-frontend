// src/services/adminOrders.ts
// All admin order management API calls in one file
import axios from '../axios.js';

// Helper to get auth token
function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    Authorization: `Bearer ${token}`,
  };
}

// 1. List All Orders
export async function listOrders(params = {}) {
  const response = await axios.get('/api/admin/orders', {
    headers: getAuthHeaders(),
    params,
  });
  // Return paginated data, links, meta
  return {
    data: response.data.data,
    links: response.data.links,
    meta: response.data.meta
  };
}

// 2. View Order Details
export async function getOrderDetails(orderId: number|string) {
  const response = await axios.get(`/api/admin/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });
  // Return the order object only
  return response.data.data;
}

// 3. Update Order Status
export async function updateOrderStatus(orderId: number|string, status: string) {
  const response = await axios.put(
    `/api/admin/orders/${orderId}/status`,
    { status },
    { headers: getAuthHeaders() }
  );
  // Return status, message, and updated order
  return {
    status: response.data.status,
    message: response.data.message,
    order: response.data.data?.order
  };
}

// 4. Mark Order as Delivering
export async function markOrderDelivering(orderId: number|string) {
  const response = await axios.post(
    `/api/admin/orders/${orderId}/mark-delivering`,
    {},
    { headers: getAuthHeaders() }
  );
  // Return status, message, and updated order
  return {
    status: response.data.status,
    message: response.data.message,
    order: response.data.data?.order
  };
}

// 5. Order Analytics
export async function getOrderAnalytics() {
  const response = await axios.get('/api/admin/orders/analytics', {
    headers: getAuthHeaders(),
  });
  // Return analytics data only
  return response.data.data;
}

// 6. Orders Requiring Attention
export async function getOrdersRequiringAttention(params = {}) {
  const response = await axios.get('/api/admin/orders/requires-attention', {
    headers: getAuthHeaders(),
    params,
  });
  // Return paginated data, links, meta
  return {
    data: response.data.data,
    links: response.data.links,
    meta: response.data.meta
  };
}
