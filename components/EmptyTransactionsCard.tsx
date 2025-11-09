import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface EmptyTransactionsCardProps {
  style?: any;
  withoutCard?: boolean;
}

const EmptyTransactionsCard: React.FC<EmptyTransactionsCardProps> = ({ style, withoutCard = false }) => {
  const content = (
    <View style={styles.emptyCardContent}>
      <Ionicons name="wallet-outline" size={48} color="#9ca3af" />
      <Text style={styles.emptyText}>Belum ada transaksi</Text>
    </View>
  );

  if (withoutCard) {
    return <View style={style}>
      <Ionicons name="wallet-outline" size={48} color="#9ca3af" />
      <Text style={styles.emptyText}>Belum ada transaksi</Text>
    </View>;
  }

  return (
    <Card style={[styles.emptyCard, style]}>
      <Card.Content>
        {content}
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
    paddingVertical: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingTop: 12
  },
});

export default EmptyTransactionsCard;