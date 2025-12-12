import React, { useState } from 'react';
import { View, ScrollView, Text, KeyboardAvoidingView, Platform, Alert, RefreshControl } from 'react-native';
import { PaperProvider, Appbar, Card, TextInput, HelperText } from 'react-native-paper';
import { Theme } from '@/constants/colors';
import { FormButton, Notification } from '@/components';
import { EditItemSkeleton } from '@/components';
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

interface FormErrors {
  quantity?: string;
  price?: string;
}

const EditPaymentItemScreen: React.FC<EditPaymentItemScreenProps> = ({ navigation, route }) => {
  const { paymentId, item } = route?.params || {};
  const { token } = useAuth();

  if (!token || !paymentId || !item) return null;

  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [price, setPrice] = useState(item.price.toString());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

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
        setNotification('Item transaksi berhasil diperbarui!');
      } else {
        throw response;
      }
    } catch (error: any) {
      if (error.errors) {
        const newErrors: FormErrors = {};

        Object.entries(error.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            newErrors[field as keyof FormErrors] = messages[0] as string;
          }
        });

        setErrors(newErrors);
      } else {
        Alert.alert(
          'Error',
          'Gagal memperbarui item transaksi. Silakan coba lagi.',
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

  const handleRefresh = () => {
    setRefreshing(true);

    setQuantity(item.quantity.toString());
    setPrice(item.price.toString());
    setNotification(null);
    setErrors({});

    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  };

  const clearErrorForField = (field: keyof FormErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation?.goBack()} />
          <Appbar.Content title="Edit item transaksi" />
        </Appbar.Header>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#6366f1']}
                tintColor="#6366f1"
              />
            }
          >
            {refreshing ? (
              <EditItemSkeleton />
            ) : (
              <>
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
                    <View style={styles.inputContainer}>
                      <TextInput
                        label="Kuantitas"
                        value={quantity}
                        onChangeText={(value) => {
                          setQuantity(value);
                          clearErrorForField('quantity');
                        }}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                        outlineColor="#e5e7eb"
                        activeOutlineColor="#6366f1"
                      />
                      <HelperText type="error" visible={!!errors.quantity} style={styles.helperText}>
                        {errors.quantity}
                      </HelperText>
                    </View>

                    <View style={[styles.inputContainer, { marginBottom: 0 }]}>
                      <TextInput
                        label={`Harga (Rp${price ? ` ${formatAmount(price)}` : ` ${formatAmount(item.price.toString())}`})`}
                        value={price}
                        onChangeText={(value) => {
                          setPrice(value);
                          clearErrorForField('price');
                        }}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                        outlineColor="#e5e7eb"
                        activeOutlineColor="#6366f1"
                      />
                      <HelperText type="error" visible={!!errors.price} style={styles.helperText}>
                        {errors.price}
                      </HelperText>
                    </View>
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
              </>
            )}
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