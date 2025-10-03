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
}

class TransactionService {
  async getTransactions(token: string, params: TransactionParams = {}): Promise<TransactionsResponse> {
    const { page = 1, limit } = params;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());

    if (limit) {
      queryParams.append('limit', limit.toString());
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

  async getAllTransactions(token: string, page: number = 1): Promise<TransactionsResponse> {
    return await this.getTransactions(token, { page });
  }
}

export default new TransactionService();