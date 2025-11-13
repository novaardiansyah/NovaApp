import APP_CONFIG from '@/config/app';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]> | string[];
}

export interface Account {
  id: number;
  name: string;
  logo?: string;
  deposit: number;
  formatted_deposit: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAccountData {
  name: string;
  logo_base64?: string;
}

export interface UpdateAccountData {
  name?: string;
  logo_base64?: string;
}

class AccountService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${APP_CONFIG.API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      }

      if (response.status === 403) {
        throw new Error('Forbidden. You do not have permission to perform this action.');
      }

      if (response.status === 404) {
        throw new Error('Account not found.');
      }

      if (response.status === 422) {
        try {
          const errorData = JSON.parse(responseText);
          const errorMessage = errorData.message || Object.values(errorData.errors || {}).flat().join(', ');
          throw new Error(errorMessage);
        } catch {
          throw new Error('Validation failed. Please check your input.');
        }
      }

      if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }

      throw new Error(`Request failed with status ${response.status}`);
    }

    if (responseText) {
      try {
        return JSON.parse(responseText);
      } catch {
        return { success: true };
      }
    }

    return { success: true };
  }

  async getAccounts(token: string): Promise<Account[]> {
    try {
      const response = await this.request('/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data || [];
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  }

  async createAccount(token: string, accountData: CreateAccountData): Promise<ApiResponse<Account>> {
    try {
      const response = await this.request('/accounts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(accountData),
      });

      return response;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  async updateAccount(token: string, accountId: number, accountData: UpdateAccountData): Promise<Account> {
    try {
      const response = await this.request(`/accounts/${accountId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(accountData),
      });

      return response.data;
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  async deleteAccount(token: string, accountId: number): Promise<void> {
    try {
      await this.request(`/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}

const accountService = new AccountService();

export { validateImageFile, convertImageToBase64 } from '@/utils/imageUtils';

export default accountService;