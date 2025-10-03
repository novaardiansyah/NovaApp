import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Divider } from 'react-native-paper';

interface RecentTransactionsSkeletonProps {
  count?: number;
}

const RecentTransactionsSkeleton: React.FC<RecentTransactionsSkeletonProps> = ({ count = 3 }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        {Array.from({ length: count }).map((_, index) => (
          <View key={index}>
            <View style={styles.transactionItem}>
              <View style={styles.leftSection}>
                <View style={styles.iconSkeleton} />
                <View style={styles.textSection}>
                  <View style={styles.titleSkeleton} />
                  <View style={styles.dateSkeleton} />
                </View>
              </View>
              <View style={styles.amountSkeleton} />
            </View>
            {index < count - 1 && <Divider style={styles.divider} />}
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 16,
  },
  textSection: {
    flex: 1,
    maxWidth: '60%',
  },
  titleSkeleton: {
    height: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 4,
    width: '80%',
  },
  dateSkeleton: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    width: '60%',
  },
  amountSkeleton: {
    height: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    width: 70,
  },
  divider: {
    marginVertical: 0,
  },
});

export default RecentTransactionsSkeleton;