import APP_CONFIG from '@/config/app';

export interface PaymentType {
  id: number;
  name: string;
  is_default: boolean,
  created_at?: string;
  updated_at?: string;
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
  type_id: number;
  date: string;
  payment_account_id: number;
  payment_account_to_id: number|null;
  has_items: boolean;
  has_charge: boolean;
  is_scheduled: boolean;
}

export interface PaymentItemData {
  name: string;
  amount: number;
  qty: number;
  item_id?: number | null;
}

export interface PaymentItemsSummary {
  payment_id: number;
  payment_code: string;
  total_items: number;
  total_qty: number;
  total_amount: number;
  formatted_amount: string;
}

export interface PaymentItem {
  id: number;
  name: string;
  type_id: number;
  type: string;
  code: string;
  price: number;
  quantity: number;
  total: number;
  formatted_price: string;
  formatted_total: string;
  updated_at: string;
}

export interface Pagination {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface PaymentItemsResponse {
  success: boolean;
  data: PaymentItem[];
  pagination: Pagination;
}

export interface AttachMultipleItemsData {
  items: PaymentItemData[];
  totalAmount: number;
}

export interface SearchItem {
  id: number;
  name: string;
  code: string;
  amount: number;
  formatted_amount: string;
  type: string;
  type_id: number;
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

      if (response.ok) {
        return data;
      }

      throw new Error('Failed to fetch payment types');
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

  async getPaymentAccount(token: string, accountId: number): Promise<ApiResponse<PaymentAccount>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payment-accounts/${accountId}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payment account:', error);
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

  async getNotAttachedItems(token: string, paymentId: number, limit: number = 10): Promise<SearchItem[]> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/items/not-attached?limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data.data;
      }

      throw new Error('Failed to fetch items');
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async searchNotAttachedItems(token: string, paymentId: number, searchQuery: string, limit: number = 10): Promise<SearchItem[]> {
    try {
      const url = searchQuery.trim()
        ? `${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/items/not-attached?limit=${limit}&search=${encodeURIComponent(searchQuery)}`
        : `${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/items/not-attached?limit=${limit}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data.data;
      }

      throw new Error('Failed to search items');
    } catch (error) {
      console.error('Error searching items:', error);
      throw error;
    }
  }

  async attachMultipleItems(token: string, paymentId: number, itemsData: AttachMultipleItemsData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/items/attach-multiple`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(itemsData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error attaching multiple items:', error);
      throw error;
    }
  }

  async getPaymentItemsSummary(token: string, paymentId: number): Promise<ApiResponse<PaymentItemsSummary>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/items/summary`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payment items summary:', error);
      throw error;
    }
  }

  async getPaymentItems(token: string, paymentId: number, page: number = 1): Promise<PaymentItemsResponse> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/items/attached?page=${page}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payment items:', error);
      throw error;
    }
  }

  async deletePayment(token: string, paymentId: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }

  async auditPaymentAccount(token: string, accountId: number, deposit: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payment-accounts/${accountId}/audit`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({ deposit }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error auditing payment account:', error);
      throw error;
    }
  }

  async submitMonthlyReport(token: string, email: string, periode: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payment-accounts/report-monthly`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({ email, periode }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting monthly report:', error);
      throw error;
    }
  }
}

export default new PaymentService();