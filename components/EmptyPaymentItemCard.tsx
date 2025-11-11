import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface EmptyPaymentItemCardProps {
  style?: any;
}

const EmptyPaymentItemCard: React.FC<EmptyPaymentItemCardProps> = ({ style }) => {
  return (
    <Card style={[styles.emptyCard, style]}>
      <Card.Content>
        <View style={styles.emptyCardContent}>
          <Ionicons name="cube-outline" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>Belum Ada Produk / Layanan</Text>
          <Text style={styles.emptySubtext}>Mulai dengan menambahkan produk / layanan pertama Anda</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginTop: 0,
  },
  emptyCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingTop: 12,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    paddingTop: 4,
  },
});

export default EmptyPaymentItemCard;