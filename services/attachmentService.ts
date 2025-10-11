import APP_CONFIG from '@/config/app';

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

export interface AttachmentData {
  file_base64: string;
  filename: string;
  mime_type: string;
  file_size: number;
}

export interface AttachmentsResponse {
  success: boolean;
  data: Attachment[];
  message?: string;
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
  errors?: Record<string, string[]>;
}

class AttachmentService {
  private getHeaders(token: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

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

  async uploadAttachment(token: string, paymentId: number, attachmentData: AttachmentData): Promise<UploadResponse> {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${paymentId}/attachments`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(attachmentData),
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
  };

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
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

export default new AttachmentService();