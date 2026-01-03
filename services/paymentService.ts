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
  is_draft: boolean;
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
  is_draft: boolean;
  formatted_amount: string;
  formatted_date: string;
  type: string;
  type_id: number;
  updated_at: string;
  formatted_updated_at: string;
  attachments_count: number;
  items_count: number;
  account: {
    id: number;
    name: string;
  };
  account_to: {
    id: number | null;
    name: string | null;
  };
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

export interface GalleryItem {
  id: number;
  user_id: number;
  subject_id: number;
  subject_type: string;
  file_name: string;
  url: string;
  file_size: number;
  is_private: boolean;
  description: string;
  size: string;
  has_optimized: boolean;
  group_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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


export interface UploadAttachmentData {
  uri: string;
  name: string;
  type: string;
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

  async updatePayment(token: string, paymentId: number, paymentData: {
    amount: number;
    name: string;
    date: string;
    type_id: number;
    payment_account_id: number;
    payment_account_to_id: number | null;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}`, {
        method: 'PUT',
        headers: this.getHeaders(token),
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating payment:', error);
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
      const response = await fetch(`${APP_CONFIG.API_BASE_URL_GO}/payments/summary?startDate=${startDate}&endDate=${endDate}`, {
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

  async generateReport(token: string, reportData: {
    report_type: 'daily' | 'monthly' | 'date_range';
    periode?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/generate-report`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(reportData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  async getPaymentAttachments(token: string, paymentId: number): Promise<ApiResponse<GalleryItem[]>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_CDN_URL}/galleries?subject_id=${paymentId}&subject_type=App%5CModels%5CPayment&size=small`, {
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

  async getGalleryByGroupCode(token: string, groupCode: string, size: string = 'large'): Promise<ApiResponse<GalleryItem[]>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_CDN_URL}/galleries/${groupCode}/?size=${size}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching gallery by group code:', error);
      throw error;
    }
  }

  async uploadAttachment(token: string, paymentId: number, attachmentData: UploadAttachmentData): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: attachmentData.uri,
        name: attachmentData.name,
        type: attachmentData.type,
      } as any);
      formData.append('description', '');
      formData.append('is_private', 'false');
      formData.append('subject_id', paymentId.toString());
      formData.append('subject_type', 'App\\Models\\Payment');
      formData.append('dir', 'payment');

      const response = await fetch(`${APP_CONFIG.API_CDN_URL}/galleries/upload`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading attachment:', error);
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

  async deleteGalleryByGroupCode(token: string, groupCode: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_CDN_URL}/galleries/${groupCode}`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting gallery by group code:', error);
      throw error;
    }
  }

  async editPaymentItem(token: string, paymentId: number, pivotId: number, itemData: { quantity: number; price?: number }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/items/${pivotId}`, {
        method: 'PUT',
        headers: this.getHeaders(token),
        body: JSON.stringify(itemData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error editing payment item:', error);
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

  async manageDraft(token: string, paymentCode: string, action: 'approve' | 'reject', allowEmpty: boolean = true): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentCode}/manage-draft`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({ status: action, allow_empty: allowEmpty }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error managing draft:', error);
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