import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import BudgetScreen from '@/screens/BudgetScreen';
import ReportsScreen from '@/screens/ReportsScreen';
import ChangePasswordScreen from '@/screens/ChangePasswordScreen';
import UpdateProfileScreen from '@/screens/UpdateProfileScreen';
import AllTransactionsScreen from '@/screens/AllTransactionsScreen';
import AddPaymentScreen from '@/screens/AddPaymentScreen';
import AddPaymentItemScreen from '@/screens/AddPaymentItemScreen';
import ViewPaymentItemsScreen from '@/screens/ViewPaymentItemsScreen';
import AuditScreen from '@/screens/AuditScreen';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const MainStack = createStackNavigator();
const BudgetStack = createStackNavigator();

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
        options={{ title: 'Change Password' }}
      />
    </ProfileStack.Navigator>
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
    </BudgetStack.Navigator>
  );
};

const HomeStackNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <MainStack.Screen
        name="AllTransactions"
        component={AllTransactionsScreen}
        options={{ title: 'All Transactions' }}
      />
      <MainStack.Screen
        name="AddPayment"
        component={AddPaymentScreen}
        options={{ title: 'Add Payment' }}
      />
      <MainStack.Screen
        name="AddPaymentItem"
        component={AddPaymentItemScreen}
        options={{ title: 'Add Payment Items' }}
      />
      <MainStack.Screen
        name="ViewPaymentItems"
        component={ViewPaymentItemsScreen}
        options={{ title: 'Payment Items' }}
      />
    </MainStack.Navigator>
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
          height: 60 + insets.bottom,
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
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetStackNavigator}
        options={{
          tabBarLabel: 'Budget',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="AllTransactions"
        component={AllTransactionsScreen}
        options={{ title: 'All Transactions' }}
      />
      <MainStack.Screen
        name="AddPayment"
        component={AddPaymentScreen}
        options={{ title: 'Add Payment' }}
      />
      <MainStack.Screen
        name="AddPaymentItem"
        component={AddPaymentItemScreen}
        options={{ title: 'Add Payment Items' }}
      />
    </MainStack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <MainNavigator />
  );
};

export default AppNavigator;