import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles } from '@/styles';
import { styles as searchItemStyles } from '@/styles/AddPaymentItemScreen.styles';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: object;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 20, style }) => {
  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: '#e5e7eb',
          borderRadius: 4,
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
      {Array.from({ length: count }).map((_, index) => (
        <AccountCardSkeleton key={index} style={index < count - 1 ? { marginBottom: 0 } : { marginBottom: 0 }} />
      ))}
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
    <Card style={[style, { borderRadius: 12, backgroundColor: '#ffffff' }]}>
      <Card.Content style={{ padding: 16 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Skeleton width={40} height={40} style={{ borderRadius: 20, marginRight: 16 }} />
                <View style={{ flex: 1 }}>
                  <Skeleton width={80} height={16} style={{ marginBottom: 4 }} />
                  <Skeleton width={100} height={12} />
                </View>
              </View>
              <Skeleton width={40} height={16} />
            </View>
            {index < 3 && <View style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }} />}
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};


interface ReportsTransactionsSkeletonProps {
  style?: object;
}

export const ReportsTransactionsSkeleton: React.FC<ReportsTransactionsSkeletonProps> = ({ style }) => {
  return (
    <Card style={[style, { borderRadius: 12, backgroundColor: '#ffffff' }]}>
      <Card.Content style={{ padding: 16 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Skeleton width={40} height={40} style={{ borderRadius: 20, marginRight: 16 }} />
                <View style={{ flex: 1 }}>
                  <Skeleton width={120} height={16} style={{ marginBottom: 4 }} />
                  <Skeleton width={80} height={12} />
                </View>
              </View>
              <Skeleton width={80} height={16} />
            </View>
            {index < 4 && <View style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }} />}
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

export default Skeleton;