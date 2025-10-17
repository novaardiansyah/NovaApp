import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Divider } from 'react-native-paper';

interface CurrentAttachmentsSkeletonProps {
  count?: number;
}

const CurrentAttachmentsSkeleton: React.FC<CurrentAttachmentsSkeletonProps> = ({ count = 5 }) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {Array.from({ length: count }).map((_, index) => (
          <View key={index}>
            <View style={styles.attachmentItem}>
              <View style={styles.attachmentLeft}>
                <View style={styles.attachmentIconSkeleton} />
                <View style={styles.attachmentInfo}>
                  <View style={styles.attachmentNameSkeleton} />
                  <View style={styles.attachmentDetailsSkeleton} />
                </View>
              </View>
              <View style={styles.chevronSkeleton} />
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
  cardContent: {
    paddingVertical: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  attachmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attachmentIconSkeleton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    marginRight: 16,
  },
  attachmentInfo: {
    flex: 1,
    maxWidth: '60%',
  },
  attachmentNameSkeleton: {
    height: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 4,
    width: '80%',
  },
  attachmentDetailsSkeleton: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    width: '60%',
  },
  chevronSkeleton: {
    width: 20,
    height: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
  },
  divider: {
    marginVertical: 0,
  },
});

export default CurrentAttachmentsSkeleton;