import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import BudgetScreen from '@/screens/BudgetScreen';
import ReportsScreen from '@/screens/ReportsScreen';
import GoalsScreen from '@/screens/GoalsScreen';
import AddGoalScreen from '@/screens/AddGoalScreen';
import AddFundsScreen from '@/screens/AddFundsScreen';
import ChangePasswordScreen from '@/screens/ChangePasswordScreen';
import UpdateProfileScreen from '@/screens/UpdateProfileScreen';
import AllTransactionsScreen from '@/screens/AllTransactionsScreen';
import AddPaymentScreen from '@/screens/AddPaymentScreen';
import AddPaymentItemScreen from '@/screens/AddPaymentItemScreen';
import ViewPaymentItemsScreen from '@/screens/ViewPaymentItemsScreen';
import AuditScreen from '@/screens/AuditScreen';
import AddAttachmentScreen from '@/screens/AddAttachmentScreen';
import ViewAttachmentScreen from '@/screens/ViewAttachmentScreen';
import CurrentAttachmentsScreen from '@/screens/CurrentAttachmentsScreen';
import ViewPaymentDetailsScreen from '@/screens/ViewPaymentDetailsScreen';
import AddAccountScreen from '@/screens/AddAccountScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const TransactionsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const BudgetStack = createStackNavigator();
const ReportsStack = createStackNavigator();
const GoalsStack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <HomeStack.Screen
        name="AllTransactions"
        component={AllTransactionsScreen}
        options={{ title: 'All Transactions' }}
      />
    </HomeStack.Navigator>
  );
};

const BudgetStackNavigator = () => {
  return (
    <BudgetStack.Navigator screenOptions={{ headerShown: false }}>
      <BudgetStack.Screen
        name="BudgetMain"
        component={BudgetScreen}
        options={{ title: 'Budget & Accounts' }}
      />
      <BudgetStack.Screen
        name="AuditPaymentAccount"
        component={AuditScreen}
        options={{ headerShown: false }}
      />
      <BudgetStack.Screen
        name="AddAccount"
        component={AddAccountScreen}
        options={{ title: 'Add Account' }}
      />
    </BudgetStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <ProfileStack.Screen
        name="UpdateProfile"
        component={UpdateProfileScreen}
        options={{ title: 'Update Profile' }}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Ganti Password' }}
      />
    </ProfileStack.Navigator>
  );
};

const TransactionsStackNavigator = () => {
  return (
    <TransactionsStack.Navigator screenOptions={{ headerShown: false }}>
      <TransactionsStack.Screen
        name="TransactionsMain"
        component={AllTransactionsScreen}
        options={{ title: 'Transactions' }}
      />
      <TransactionsStack.Screen
        name="AddPayment"
        component={AddPaymentScreen}
        options={{ title: 'Add Payment' }}
      />
      <TransactionsStack.Screen
        name="AddPaymentItem"
        component={AddPaymentItemScreen}
        options={{ title: 'Add Payment Items' }}
      />
      <TransactionsStack.Screen
        name="ViewPaymentItems"
        component={ViewPaymentItemsScreen}
        options={{ title: 'Payment Items' }}
      />
      <TransactionsStack.Screen
        name="AuditPaymentAccount"
        component={AuditScreen}
        options={{ headerShown: false }}
      />
      <TransactionsStack.Screen
        name="AddAttachment"
        component={AddAttachmentScreen}
        options={{ title: 'Add Attachments' }}
      />
      <TransactionsStack.Screen
        name="CurrentAttachments"
        component={CurrentAttachmentsScreen}
        options={{ title: 'Current Attachments' }}
      />
      <TransactionsStack.Screen
        name="ViewAttachment"
        component={ViewAttachmentScreen}
        options={{ title: 'Attachment Details' }}
      />
      <TransactionsStack.Screen
        name="ViewPaymentDetails"
        component={ViewPaymentDetailsScreen}
        options={{ title: 'Payment Details' }}
      />
      <TransactionsStack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ title: 'Reports' }}
      />
    </TransactionsStack.Navigator>
  );
};

const GoalsStackNavigator = () => {
  return (
    <GoalsStack.Navigator screenOptions={{ headerShown: false }}>
      <GoalsStack.Screen
        name="GoalsMain"
        component={GoalsScreen}
        options={{ title: 'Financial Goals' }}
      />
      <GoalsStack.Screen
        name="AddGoal"
        component={AddGoalScreen}
        options={{ title: 'Create Financial Goal' }}
      />
      <GoalsStack.Screen
        name="AddFunds"
        component={AddFundsScreen}
        options={{ title: 'Add Funds' }}
      />
    </GoalsStack.Navigator>
  );
};

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 4 + insets.bottom,
          paddingTop: 4,
          height: 65 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetStackNavigator}
        options={{
          tabBarLabel: 'Anggaran',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AllTransactions"
        component={TransactionsStackNavigator}
        options={{
          tabBarLabel: 'Transaksi',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsStackNavigator}
        options={{
          tabBarLabel: 'Tujuan',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "diamond" : "diamond-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <TabNavigator />
  );
};

export default AppNavigator;