export interface Payment {
  status: string;
  method?: string;
  reference?: string;
}
// src/services/adminOrders.types.ts
// TypeScript interfaces for admin order management

export interface OrderStatus {
  value: 'placed' | 'delivering' | 'delivered';
  label: string;
  description: string;
  color: string;
}
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  drug_id: number;
  drug_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  formatted_unit_price: string;
  formatted_total_price: string;
  current_drug?: unknown;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  formatted_subtotal: string;
  formatted_tax_amount: string;
  formatted_total_amount: string;
  shipping_address: ShippingAddress;
  phone_number: string;
  delivery_notes: string | null;
  payment_status: PaymentStatus;
  payment: Payment;
  placed_at: string;
  delivering_at: string | null;
  delivered_at: string | null;
  items: OrderItem[];
  user: User;
  status_updated_by: User | null;
  created_at: string;
  updated_at: string;
}
