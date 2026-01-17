import APP_CONFIG from '@/config/app';

export interface PaymentGoalsOverview {
  total_goals: number;
  completed: number;
  success_rate: string;
}

export interface PaymentGoalFormatted {
  amount: string;
  target_amount: string;
  progress: string;
  start_date: string;
  target_date: string;
}

export interface CreatePaymentGoalData {
  name: string;
  description: string;
  amount: number;
  target_amount: number;
  start_date: string;
  target_date: string;
}

export interface AddFundsData {
  amount: number;
  payment_account_id: number;
}

export interface PaymentGoal {
  id: number;
  code: string;
  name: string;
  description: string;
  status: string;
  formatted: PaymentGoalFormatted;
  created_at: string;
  updated_at: string;
}

export interface PaymentGoalsMeta {
  total_records: number;
  items_on_page: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  has_more_pages: boolean;
}

export interface PaymentGoalsResponse {
  data: PaymentGoal[];
  meta: PaymentGoalsMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]> | string[];
}

class PaymentGoalsService {
  private getHeaders(token: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getPaymentGoalsOverview(token: string): Promise<ApiResponse<PaymentGoalsOverview>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payment-goals/overview`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payment goals overview:', error);
      throw error;
    }
  }

  async getPaymentGoals(token: string, page: number = 1): Promise<ApiResponse<PaymentGoal[]>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL_GO}/payment-goals?page=${page}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payment goals:', error);
      throw error;
    }
  }

  async createPaymentGoal(token: string, goalData: CreatePaymentGoalData): Promise<ApiResponse<PaymentGoal>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payment-goals`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(goalData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating payment goal:', error);
      throw error;
    }
  }

  async addFundsToGoal(token: string, goalId: number, fundsData: AddFundsData): Promise<ApiResponse<{
    amount: string;
    target_amount: string;
    progress: string;
  }>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payment-goals/${goalId}/progress`, {
        method: 'PUT',
        headers: this.getHeaders(token),
        body: JSON.stringify({
          amount: fundsData.amount,
          payment_account_id: fundsData.payment_account_id
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding funds to payment goal:', error);
      throw error;
    }
  }

  async deletePaymentGoal(token: string, goalId: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payment-goals/${goalId}`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting payment goal:', error);
      throw error;
    }
  }
}

export default new PaymentGoalsService();