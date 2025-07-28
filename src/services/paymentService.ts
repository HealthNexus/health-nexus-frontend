// filepath: src/services/paymentService.ts
import axios from '../axios.js';

const API_URL = '/api';

// Payment interfaces
export interface PaymentInitializationRequest {
  order_id: number;
  amount?: number; // Optional, backend can calculate from order
}

export interface PaymentInitializationResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaymentVerificationRequest {
  reference: string;
}

export interface PaymentVerificationResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    id: number;
    domain: string;
    status: 'success' | 'failed' | 'pending';
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, unknown>;
    fees: number;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
  };
}

/**
 * Initialize payment with Paystack
 */
export const initializePayment = async (
  orderData: PaymentInitializationRequest
): Promise<PaymentInitializationResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Authentication required');

    console.log('Payment Service: Initializing payment for order:', orderData.order_id);

    const response = await axios.post(`${API_URL}/payments/initialize`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Payment Service: Initialization response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Payment Service: Initialize payment error:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    
    throw new Error('Failed to initialize payment. Please try again.');
  }
};

/**
 * Verify payment with Paystack
 */
export const verifyPayment = async (
  verificationData: PaymentVerificationRequest
): Promise<PaymentVerificationResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Authentication required');

    console.log('Payment Service: Verifying payment with reference:', verificationData.reference);

    const response = await axios.post(`${API_URL}/payments/verify`, verificationData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Payment Service: Verification response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Payment Service: Verify payment error:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    
    throw new Error('Failed to verify payment. Please try again.');
  }
};

/**
 * Calculate Paystack fees for an amount
 */
export const calculatePaymentFees = async (amount: number): Promise<{
  amount: number;
  fee: number;
  total: number;
}> => {
  try {
    const response = await axios.post(`${API_URL}/payments/calculate-fees`, { amount });
    return response.data;
  } catch (error: unknown) {
    console.error('Payment Service: Calculate fees error:', error);
    
    // Fallback calculation if API fails
    const feePercentage = 0.015; // 1.5%
    const fixedFee = amount > 2500 ? 100 : 0;
    const fee = (amount * feePercentage) + fixedFee;
    
    return {
      amount,
      fee: Math.round(fee * 100) / 100,
      total: Math.round((amount + fee) * 100) / 100
    };
  }
};

/**
 * Get user's payment history
 */
export const getPaymentHistory = async (): Promise<Record<string, unknown>[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Authentication required');

    const response = await axios.get(`${API_URL}/payments/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data || [];
  } catch (error: unknown) {
    console.error('Payment Service: Get payment history error:', error);
    throw new Error('Failed to fetch payment history');
  }
};
