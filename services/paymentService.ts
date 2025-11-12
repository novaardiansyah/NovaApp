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

export interface PaymentDetailsData {
  id: number;
  code: string;
  name: string;
  date: string;
  amount: number;
  has_items: boolean;
  is_scheduled: boolean;
  formatted_amount: string;
  formatted_date: string;
  type: string;
  type_id: number;
  updated_at: string;
  formatted_updated_at: string;
  attachments_count: number;
  items_count: number;
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
  pivot_id?: number;
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

export interface PaymentSummaryData {
  total_balance: number;
  initial_balance: number;
  income: number;
  expenses: number;
  withdrawal: number;
  transfer: number;
  percents: {
    income: number;
    expenses: number;
    withdrawal: number;
    transfer: number;
  };
  period: {
    start_date: string;
    end_date: string;
  };
}

export interface Attachment {
  id: number;
  payment_id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export interface DeleteItemResponse {
  success: boolean;
  message: string;
  data: {
    amount: number;
    formatted_amount: string;
    items_count: number;
  };
}


export interface MultipleAttachmentData {
  attachment_base64_array: string[];
}

export interface AttachmentsResponse {
  success: boolean;
  message?: string;
  data: {
    payment_id: number;
    attachments: Attachment[];
    attachments_count: number;
  };
  errors?: Record<string, string[]> | string[];
}

export interface UploadResponse {
  success: boolean;
  data: Attachment;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]> | string[];
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

  async getPaymentDetails(token: string, paymentId: number): Promise<ApiResponse<PaymentDetailsData>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payment details:', error);
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

  async getPaymentSummary(token: string, startDate: string, endDate: string): Promise<ApiResponse<PaymentSummaryData>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/summary?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payment summary:', error);
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

  // Attachment Management Methods
  async getPaymentAttachments(token: string, paymentId: number): Promise<AttachmentsResponse> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/attachments`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payment attachments:', error);
      throw error;
    }
  }

  async uploadMultipleAttachments(token: string, paymentId: number, attachmentData: MultipleAttachmentData): Promise<AttachmentsResponse> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/attachments`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(attachmentData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading multiple attachments:', error);
      throw error;
    }
  }

  async deleteAttachment(token: string, paymentId: number, attachmentId: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      throw error;
    }
  }

  async deleteAttachmentByFilepath(token: string, paymentId: number, filepath: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/attachments`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
        body: JSON.stringify({ filepath }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting attachment by filepath:', error);
      throw error;
    }
  }

  async deleteItem(token: string, paymentId: number, pivotId: number): Promise<DeleteItemResponse> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/items/${pivotId}`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting payment item:', error);
      throw error;
    }
  }

  // File validation and utility methods
  validateFile(asset: any): { isValid: boolean; error?: string } {
    // Check file size (5MB max for attachments)
    const fileSize = asset.fileSize || asset.size;
    if (fileSize && fileSize > 5 * 1024 * 1024) {
      return { isValid: false, error: 'File size must be less than 5MB' };
    }

    // Check file type - only images allowed
    const mimeType = asset.mimeType || asset.type;
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (mimeType && !allowedTypes.includes(mimeType)) {
      return {
        isValid: false,
        error: 'Only image files (JPEG, PNG, GIF, WEBP) are allowed'
      };
    }

    return { isValid: true };
  }

  convertFileToBase64 = async (uri: string, mimeType: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          // Add data URL prefix if not present
          const base64WithPrefix = base64.startsWith('data:')
            ? base64
            : `data:${mimeType};base64,${base64.split(',')[1]}`;
          resolve(base64WithPrefix);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error('Failed to process file. Please try again.');
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }
}

export default new PaymentService();