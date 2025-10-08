import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles } from '@/styles';
import { styles as searchItemStyles } from '@/styles/AddPaymentItemScreen.styles';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: object;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 20, style }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#e5e7eb',
          borderRadius: 4,
          opacity,
        },
        style,
      ]}
    />
  );
};

interface BalanceCardSkeletonProps {
  style?: object;
}

export const BalanceCardSkeleton: React.FC<BalanceCardSkeletonProps> = ({ style }) => {
  return (
    <Card style={[style, { borderRadius: 16, backgroundColor: '#ffffff' }]}>
      <Card.Content style={{ padding: 16 }}>
        <Skeleton width={80} height={14} style={{ marginBottom: 8 }} />
        <Skeleton width={200} height={32} style={{ marginBottom: 16 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Skeleton width={60} height={16} style={{ marginBottom: 4 }} />
            <Skeleton width={80} height={12} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Skeleton width={60} height={16} style={{ marginBottom: 4 }} />
            <Skeleton width={80} height={12} />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

interface TransactionItemSkeletonProps {
  style?: object;
}

export const TransactionItemSkeleton: React.FC<TransactionItemSkeletonProps> = ({ style }) => {
  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 16 }}>
        <Skeleton width={40} height={40} style={{ borderRadius: 20, marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Skeleton width={120} height={16} style={{ marginBottom: 2 }} />
          <Skeleton width={60} height={12} />
        </View>
      </View>
      <Skeleton width={80} height={16} />
    </View>
  );
};

interface TransactionsSkeletonProps {
  count?: number;
  style?: object;
}

export const TransactionsSkeleton: React.FC<TransactionsSkeletonProps> = ({ count = 3, style }) => {
  return (
    <Card style={[style, { borderRadius: 16 }]}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index}>
          <TransactionItemSkeleton />
          {index < count - 1 && (
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }} />
          )}
        </View>
      ))}
    </Card>
  );
};

interface AccountCardSkeletonProps {
  style?: object;
}

export const AccountCardSkeleton: React.FC<AccountCardSkeletonProps> = ({ style }) => {
  return (
    <Card style={[style, commonStyles.accountCard]}>
      <Card.Content style={commonStyles.accountCardContent}>
        <View style={commonStyles.accountLeft}>
          <Skeleton width={48} height={48} style={[commonStyles.accountLogo, { borderRadius: 24 }]} />
          <View style={commonStyles.accountInfo}>
            <Skeleton width={100} height={16} style={{ marginBottom: 4 }} />
            <Skeleton width={80} height={14} />
          </View>
        </View>
        <Skeleton width={20} height={20} />
      </Card.Content>
    </Card>
  );
};

interface AccountsListSkeletonProps {
  count?: number;
  style?: object;
}

export const AccountsListSkeleton: React.FC<AccountsListSkeletonProps> = ({ count = 3, style }) => {
  return (
    <View style={style}>
      <Card style={{ backgroundColor: '#ffffff', borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
        <Card.Content style={{ paddingVertical: 8 }}>
          {Array.from({ length: count }).map((_, index) => (
            <View key={index}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Skeleton width={48} height={48} style={{ borderRadius: 24, marginRight: 16, backgroundColor: '#e5e7eb' }} />
                  <View style={{ flex: 1 }}>
                    <Skeleton width={100} height={14} style={{ marginBottom: 4 }} />
                    <Skeleton width={80} height={14} />
                  </View>
                </View>
                <Skeleton width={20} height={20} />
              </View>
              {index < count - 1 && (
                <View style={{ height: 1, backgroundColor: '#f3f4f6', marginVertical: 0 }} />
              )}
            </View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );
};

interface DropdownSkeletonProps {
  style?: object;
}

export const DropdownSkeleton: React.FC<DropdownSkeletonProps> = ({ style }) => {
  return (
    <Card style={[style, { borderRadius: 8, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb' }]}>
      <Card.Content style={{ paddingVertical: 16, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Skeleton width={120} height={20} />
        <Skeleton width={24} height={24} />
      </Card.Content>
    </Card>
  );
};

interface DropdownItemsSkeletonProps {
  count?: number;
  style?: object;
}

export const DropdownItemsSkeleton: React.FC<DropdownItemsSkeletonProps> = ({ count = 3, style }) => {
  return (
    <View style={[style, { backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', marginTop: -6, marginBottom: 16 }]}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={{ padding: 16, borderBottomWidth: index < count - 1 ? 1 : 0, borderBottomColor: '#f3f4f6' }}>
          <Skeleton width={120} height={16} />
        </View>
      ))}
    </View>
  );
};

// Reports Screen Skeleton Components
interface ReportsPeriodSkeletonProps {
  style?: object;
}

export const ReportsPeriodSkeleton: React.FC<ReportsPeriodSkeletonProps> = ({ style }) => {
  return (
    <Card style={[style, { borderRadius: 12, backgroundColor: '#ffffff' }]}>
      <Card.Content style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Skeleton width={20} height={20} style={{ borderRadius: 10, marginRight: 8 }} />
            <Skeleton width={120} height={16} />
          </View>
          <Skeleton width={20} height={20} style={{ borderRadius: 10 }} />
        </View>
      </Card.Content>
    </Card>
  );
};

interface ReportsSummarySkeletonProps {
  style?: object;
}

export const ReportsSummarySkeleton: React.FC<ReportsSummarySkeletonProps> = ({ style }) => {
  return (
    <Card style={[style, { borderRadius: 12, backgroundColor: '#ffffff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }]}>
      <Card.Content style={{ paddingVertical: 8 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Skeleton width={40} height={40} style={{ borderRadius: 20, marginRight: 16 }} />
                <View style={{ flex: 1 }}>
                  <Skeleton width={80} height={14} style={{ marginBottom: 4 }} />
                  <Skeleton width={100} height={12} />
                </View>
              </View>
              <Skeleton width={40} height={14} />
            </View>
            {index < 3 && <Divider style={{ marginVertical: 0 }} />}
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};



// AddPaymentItemScreen Search Skeleton Components
interface SearchItemSkeletonProps {
  style?: object;
}

export const SearchItemSkeleton: React.FC<SearchItemSkeletonProps> = ({ style }) => {
  return (
    <View style={[searchItemStyles.searchResultItem, style]}>
      <View style={searchItemStyles.searchResultContent}>
        <Skeleton width={180} height={16} style={{ marginBottom: 4 }} />
        <View style={searchItemStyles.searchResultDetails}>
          <Skeleton width={80} height={12} style={{ marginRight: 16 }} />
          <Skeleton width={60} height={14} />
        </View>
        <Skeleton width={40} height={20} style={[searchItemStyles.searchResultType]} />
      </View>
    </View>
  );
};

interface SearchResultsSkeletonProps {
  count?: number;
  style?: object;
}

export const SearchResultsSkeleton: React.FC<SearchResultsSkeletonProps> = ({ count = 5, style }) => {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <SearchItemSkeleton key={index} style={index < count - 1 ? { marginBottom: 4 } : { marginBottom: 0 }} />
      ))}
    </View>
  );
};

// Payment Items Skeleton Components
interface PaymentItemSkeletonProps {
  style?: object;
}

export const PaymentItemSkeleton: React.FC<PaymentItemSkeletonProps> = ({ style }) => {
  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8 }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 }}>
        <View style={{ flex: 1 }}>
          <Skeleton width={150} height={14} style={{ marginBottom: 4 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Skeleton width={40} height={12} />
            <Skeleton width={30} height={12} />
          </View>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Skeleton width={60} height={14} style={{ marginBottom: 2 }} />
        <Skeleton width={50} height={12} />
      </View>
    </View>
  );
};

interface PaymentItemsSkeletonProps {
  count?: number;
  style?: object;
}

export const PaymentItemsSkeleton: React.FC<PaymentItemsSkeletonProps> = ({ count = 5, style }) => {
  return (
    <Card style={[style, { borderRadius: 12, backgroundColor: '#ffffff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }]}>
      <Card.Content style={{ paddingVertical: 8 }}>
        {Array.from({ length: count }).map((_, index) => (
          <View key={index}>
            <PaymentItemSkeleton />
            {index < count - 1 && (
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6', marginVertical: 0 }} />
            )}
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};

// Payment Summary Skeleton Component
interface PaymentSummarySkeletonProps {
  style?: object;
}

export const PaymentSummarySkeleton: React.FC<PaymentSummarySkeletonProps> = ({ style }) => {
  return (
    <Card style={[style, { borderRadius: 12, backgroundColor: '#ffffff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginVertical: 16 }]}>
      <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16 }}>
        <View style={{ flex: 1 }}>
          <Skeleton width={80} height={16} style={{ marginBottom: 2 }} />
          <Skeleton width={100} height={12} />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Skeleton width={40} height={14} style={{ marginBottom: 2 }} />
          <Skeleton width={80} height={18} />
        </View>
      </Card.Content>
    </Card>
  );
};

// Audit Screen Skeleton Components
interface AuditAccountCardSkeletonProps {
  style?: object;
}

export const AuditAccountCardSkeleton: React.FC<AuditAccountCardSkeletonProps> = ({ style }) => {
  return (
    <Card style={[style, { backgroundColor: '#ffffff', borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 24 }]}>
      <Card.Content style={{ paddingVertical: 20, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Skeleton width={120} height={20} style={{ marginBottom: 8 }} />
            <Skeleton width={80} height={14} />
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Skeleton width={60} height={20} style={{ borderRadius: 12 }} />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

interface AuditFormSkeletonProps {
  style?: object;
}

export const AuditFormSkeleton: React.FC<AuditFormSkeletonProps> = ({ style }) => {
  return (
    <View style={style}>
      <Skeleton width={150} height={24} style={{ marginBottom: 16, marginTop: -12 }} />

      <Skeleton width="100%" height={56} style={{ marginBottom: 16 }} />
      <Skeleton width="100%" height={56} style={{ marginBottom: 16 }} />

      <Card style={{ backgroundColor: '#ffffff', borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 16 }}>
        <Card.Content style={{ paddingVertical: 20, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Skeleton width={80} height={16} />
            <Skeleton width={100} height={18} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton width={60} height={16} />
            <Skeleton width={80} height={18} />
          </View>
        </Card.Content>
      </Card>

      <Skeleton width="100%" height={48} style={{ marginBottom: 8, borderRadius: 8 }} />
      <Skeleton width="100%" height={48} style={{ borderRadius: 8 }} />
    </View>
  );
};

export default Skeleton;