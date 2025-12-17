import { Alert } from 'react-native'
import paymentService from '@/services/paymentService'

export interface DeletePaymentCallbacks {
  onSuccess: () => void
  onError?: (error: any) => void
  setDeleting?: (deleting: boolean) => void
  setActionSheetVisible?: (visible: boolean) => void
}

export const showDeletePaymentAlert = (
  paymentName: string,
  paymentId: number,
  token: string | null,
  callbacks: DeletePaymentCallbacks
) => {
  if (!token) return

  Alert.alert(
    'Hapus Pembayaran',
    `Apakah Anda yakin ingin menghapus "${paymentName}"? Tindakan ini tidak dapat dibatalkan.`,
    [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => executeDeletePayment(paymentId, token, callbacks),
      },
    ]
  )
}

export const executeDeletePayment = async (
  paymentId: number,
  token: string,
  callbacks: DeletePaymentCallbacks
) => {
  const { onSuccess, onError, setDeleting, setActionSheetVisible } = callbacks

  setDeleting?.(true)
  try {
    const response = await paymentService.deletePayment(token, paymentId)

    if (response.success) {
      onSuccess()
    } else {
      Alert.alert(
        'Kesalahan',
        response.message || 'Gagal menghapus pembayaran. Silakan coba lagi.',
        [{ text: 'OK' }]
      )
    }
  } catch (error) {
    console.error('Error deleting payment:', error)
    Alert.alert(
      'Kesalahan',
      'Gagal menghapus pembayaran. Silakan periksa koneksi Anda dan coba lagi.',
      [{ text: 'OK' }]
    )
    onError?.(error)
  } finally {
    setDeleting?.(false)
    setActionSheetVisible?.(false)
  }
}
