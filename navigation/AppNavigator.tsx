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
import PrivacyPolicyScreen from '@/screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '@/screens/TermsOfServiceScreen';
import AllTransactionsScreen from '@/screens/AllTransactionsScreen';
import AddPaymentScreen from '@/screens/AddPaymentScreen';
import AddPaymentItemScreen from '@/screens/AddPaymentItemScreen';
import ViewPaymentItemsScreen from '@/screens/ViewPaymentItemsScreen';
import AuditScreen from '@/screens/AuditScreen';
import AddAttachmentScreen from '@/screens/AddAttachmentScreen';
import ViewAttachmentScreen from '@/screens/ViewAttachmentScreen';
import CurrentAttachmentsScreen from '@/screens/CurrentAttachmentsScreen';
import ViewPaymentDetailsScreen from '@/screens/ViewPaymentDetailsScreen';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const MainStack = createStackNavigator();
const GoalsStack = createStackNavigator();

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
      <ProfileStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: 'Kebijakan Privasi' }}
      />
      <ProfileStack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{ title: 'Syarat dan Ketentuan' }}
      />
    </ProfileStack.Navigator>
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
      <MainStack.Screen
        name="Budget"
        component={BudgetScreen}
        options={{ title: 'Budget & Accounts' }}
      />
      <MainStack.Screen
        name="AuditPaymentAccount"
        component={AuditScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ title: 'Reports' }}
      />
      <MainStack.Screen
        name="AddAttachment"
        component={AddAttachmentScreen}
        options={{ title: 'Add Attachments' }}
      />
      <MainStack.Screen
        name="CurrentAttachments"
        component={CurrentAttachmentsScreen}
        options={{ title: 'Current Attachments' }}
      />
      <MainStack.Screen
        name="ViewAttachment"
        component={ViewAttachmentScreen}
        options={{ title: 'Attachment Details' }}
      />
      <MainStack.Screen
        name="ViewPaymentDetails"
        component={ViewPaymentDetailsScreen}
        options={{ title: 'Payment Details' }}
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
          tabBarLabel: 'Home',
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
        name="AllTransactions"
        component={AllTransactionsScreen}
        options={{
          tabBarLabel: 'Transaction',
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
          tabBarLabel: 'Goals',
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
          tabBarLabel: 'Profile',
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
      <MainStack.Screen
        name="AddAttachment"
        component={AddAttachmentScreen}
        options={{ title: 'Add Attachments' }}
      />
      <MainStack.Screen
        name="CurrentAttachments"
        component={CurrentAttachmentsScreen}
        options={{ title: 'Current Attachments' }}
      />
      <MainStack.Screen
        name="ViewAttachment"
        component={ViewAttachmentScreen}
        options={{ title: 'Attachment Details' }}
      />
      <MainStack.Screen
        name="ViewPaymentDetails"
        component={ViewPaymentDetailsScreen}
        options={{ title: 'Payment Details' }}
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