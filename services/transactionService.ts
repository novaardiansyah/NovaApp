import APP_CONFIG from '@/config/app';

export interface Transaction {
  id: number;
  code: string;
  name: string;
  date: string;
  formatted_date: string;
  amount: number;
  formatted_amount: string;
  type: 'income' | 'expense';
  type_id: number;
  updated_at: string;
  has_items?: boolean;
  is_scheduled?: boolean;
}

export interface FinancialData {
  total_balance: number;
  scheduled_expense: number;
  total_after_scheduled: number;
  income: number;
  expenses: number;
  savings: number;
  period: {
    start_date: string;
    end_date: string;
    month: string;
  };
}

export interface Pagination {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface TransactionsResponse {
  success: boolean;
  data: Transaction[];
  pagination: Pagination;
}

export interface TransactionParams {
  page?: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
  type?: string;
  account_id?: string;
  search?: string;
}

class TransactionService {
  async getTransactions(token: string, params: TransactionParams = {}): Promise<TransactionsResponse> {
    const { page = 1, limit, date_from, date_to, type, account_id, search } = params;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());

    if (limit) {
      queryParams.append('limit', limit.toString());
    }

    if (date_from) {
      queryParams.append('date_from', date_from);
    }

    if (date_to) {
      queryParams.append('date_to', date_to);
    }

    if (type) {
      queryParams.append('type', type);
    }

    if (account_id) {
      queryParams.append('account_id', account_id);
    }

    if (search) {
      queryParams.append('search', search);
    }

    const url = `${APP_CONFIG.API_BASE_URL}/payments?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    const data: TransactionsResponse = await response.json();
    return data;
  }

  async getRecentTransactions(token: string, limit: number = 5): Promise<Transaction[]> {
    try {
      const response = await this.getTransactions(token, { page: 1, limit });

      if (response.success) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }
  }

  async getAllTransactions(token: string, page: number = 1, additionalParams: Omit<TransactionParams, 'page'> = {}): Promise<TransactionsResponse> {
    return await this.getTransactions(token, { page, ...additionalParams });
  }

  async fetchFinancialData(token: string): Promise<FinancialData | null> {
    if (!token) return null;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/summary`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default new TransactionService();