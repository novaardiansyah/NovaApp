/**
 * Image utility functions for file handling and base64 conversion
 */

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates image file based on size and type
 * @param asset - Image asset from image picker
 * @returns Validation result with isValid flag and error message if invalid
 */
export const validateImageFile = (asset: any): ImageValidationResult => {
  // Check file size (2MB max)
  const fileSize = asset.fileSize || asset.size;
  if (fileSize && fileSize > 2 * 1024 * 1024) {
    return { isValid: false, error: 'File size must be less than 2MB' };
  }

  // Check file type
  const mimeType = asset.mimeType || asset.type;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (mimeType && !allowedTypes.includes(mimeType)) {
    return {
      isValid: false,
      error: 'Only image files (JPEG, PNG, GIF, WEBP) are allowed'
    };
  }

  return { isValid: true };
};

/**
 * Converts image URI to base64 string
 * @param uri - Local image URI
 * @param mimeType - Optional MIME type for the data URL prefix (defaults to image/jpeg)
 * @returns Promise resolving to base64 string with data URL prefix
 */
export const convertImageToBase64 = async (uri: string, mimeType?: string): Promise<string> => {
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
          : `data:${mimeType || 'image/jpeg'};base64,${base64.split(',')[1]}`;
        resolve(base64WithPrefix);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error('Failed to process image. Please try again.');
  }
};