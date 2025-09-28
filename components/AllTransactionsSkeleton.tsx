import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

interface AllTransactionsSkeletonProps {
  count?: number;
}

const AllTransactionsSkeleton: React.FC<AllTransactionsSkeletonProps> = ({ count = 10 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.leftSection}>
                <View style={styles.iconSkeleton} />
                <View style={styles.textSection}>
                  <View style={styles.titleSkeleton} />
                  <View style={styles.dateSkeleton} />
                </View>
              </View>
              <View style={styles.amountSkeleton} />
            </Card.Content>
          </Card>
          {index < count - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
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
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
  },
  dateSkeleton: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    width: '60%',
  },
  amountSkeleton: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    width: 80,
    minWidth: '35%',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
});

export default AllTransactionsSkeleton;