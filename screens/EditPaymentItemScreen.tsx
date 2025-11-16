import React, { useState } from 'react';
import { View, ScrollView, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { PaperProvider, Appbar, Card, TextInput } from 'react-native-paper';
import { Theme } from '@/constants/colors';
import { FormButton, Notification } from '@/components';
import { styles } from '@/styles/EditPaymentItemScreen.styles';
import { useAuth } from '@/contexts/AuthContext';
import paymentService from '@/services/paymentService';
import { formatAmount } from '@/utils/transactionUtils';

interface EditPaymentItemScreenProps {
  navigation?: any;
  route?: {
    params?: {
      paymentId?: number;
      item?: {
        id: number;
        name: string;
        code: string;
        price: number;
        quantity: number;
        pivot_id?: number;
      };
    };
  };
}

const EditPaymentItemScreen: React.FC<EditPaymentItemScreenProps> = ({ navigation, route }) => {
  const { paymentId, item } = route?.params || {};
  const { token } = useAuth();

  if (!token || !paymentId || !item) return null;

  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [price, setPrice] = useState(item.price.toString());
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const savePaymentItem = async () => {
    if (loading) return;

    setLoading(true);

    const formData: { quantity: number; price?: number } = {
      quantity: parseInt(quantity),
      ...(price && { price: parseFloat(price) })
    };

    try {
      const response = await paymentService.editPaymentItem(token, paymentId, item.pivot_id || item.id, formData);

      if (response.success) {
        setNotification('Item pembayaran berhasil diperbarui!');
      } else {
        Alert.alert(
          'Error',
          response.message || 'Gagal memperbarui item pembayaran',
          [{ text: 'OK' }]
        );
        setLoading(false);
      }
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = Object.entries(error.errors)
          .map(([field, messages]) => {
            const fieldMessages = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${fieldMessages.join(', ')}`;
          })
          .join('\n');
      } else {
        Alert.alert(
          'Error',
          'Gagal memperbarui item pembayaran. Silakan coba lagi.',
          [{ text: 'OK' }]
        );
      }
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const qty = parseInt(quantity) || 1;
    const itemPrice = parseFloat(price) || item.price;
    return qty * itemPrice;
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation?.goBack()} />
          <Appbar.Content title="Edit item pembayaran" />
        </Appbar.Header>

          <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.description}>
              Pembaruan akan otomatis di sesuaikan dengan akun keuangan yang dipilih.
            </Text>

            {/* Item Info */}
            <Card style={styles.itemInfoCard}>
              <Card.Content style={styles.itemInfoContent}>
                <Text style={styles.itemInfoName}>{item.name}</Text>
                <Text style={styles.itemInfoCode}>ID: {item.code}</Text>
              </Card.Content>
            </Card>

            {/* Edit Form */}
            <Card style={styles.formCard}>
              <Card.Content style={styles.formContent}>
                <TextInput
                  label="Kuantitas"
                  value={quantity}
                  onChangeText={setQuantity}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                  outlineColor="#e5e7eb"
                  activeOutlineColor="#6366f1"
                />

                <TextInput
                  label={`Harga (Rp${price ? ` ${formatAmount(price)}` : ` ${formatAmount(item.price.toString())}`})`}
                  value={price}
                  onChangeText={setPrice}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                  outlineColor="#e5e7eb"
                  activeOutlineColor="#6366f1"
                />
              </Card.Content>
            </Card>

            {/* Total Amount */}
            <Card style={styles.totalCard}>
              <Card.Content style={styles.totalContent}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </Text>
              </Card.Content>
            </Card>

            {/* Save Button */}
            <FormButton
              title="Simpan Perubahan"
              onPress={savePaymentItem}
              loading={loading}
              icon="content-save"
              style={styles.saveButton}
            />

            <FormButton
              title="Batal"
              onPress={() => navigation?.goBack()}
              variant="outline"
              style={styles.cancelButton}
              loading={loading}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Notification
        visible={!!notification}
        message={notification || ''}
        type="success"
        onDismiss={() => {
          setNotification(null);
          navigation.navigate('ViewPaymentItems', {
            paymentId,
            refresh: Date.now()
          });
        }}
      />
    </PaperProvider>
  );
};

export default EditPaymentItemScreen;