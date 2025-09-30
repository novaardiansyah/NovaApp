import APP_CONFIG from '@/config/app';

export interface PaymentType {
  id: number;
  name: string;
  type: string;
  description?: string;
  icon?: string;
}

export interface PaymentAccount {
  id: number;
  name: string;
  deposit: number;
  formatted_deposit: string;
  logo?: string;
  is_default: boolean;
}

export interface PaymentData {
  name: string;
  amount: number;
  type: string;
  type_id: number;
  date: string;
  payment_account_id: number;
  payment_account_to_id: number|null;
  has_items: boolean;
  has_charge: boolean;
  is_scheduled: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class PaymentService {
  private getHeaders(token: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getPaymentTypes(token: string): Promise<PaymentType[]> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payment-types`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data.data;
      }
      throw new Error(data.message || 'Failed to fetch payment types');
    } catch (error) {
      console.error('Error fetching payment types:', error);
      throw error;
    }
  }

  async getPaymentAccounts(token: string): Promise<PaymentAccount[]> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payment-accounts`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      }
      throw new Error('Failed to fetch payment accounts');
    } catch (error) {
      console.error('Error fetching payment accounts:', error);
      throw error;
    }
  }

  async createPayment(token: string, paymentData: PaymentData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }
}

export default new PaymentService();