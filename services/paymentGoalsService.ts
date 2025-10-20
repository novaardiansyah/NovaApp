import APP_CONFIG from '@/config/app';

export interface PaymentGoalsOverview {
  total_goals: number;
  completed: number;
  success_rate: string;
}

export interface PaymentGoalStatus {
  id: number;
  name: string;
  badge_color: string;
}

export interface PaymentGoalFormatted {
  amount: string;
  target_amount: string;
  progress: string;
}

export interface PaymentGoal {
  id: number;
  code: string;
  name: string;
  description: string;
  amount: number;
  target_amount: number;
  progress_percent: number;
  progress_color: string;
  start_date: string;
  target_date: string;
  status: PaymentGoalStatus;
  formatted: PaymentGoalFormatted;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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

  async getPaymentGoals(token: string, page: number = 1): Promise<ApiResponse<PaymentGoalsResponse>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payment-goals?page=${page}`, {
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
}

export default new PaymentGoalsService();