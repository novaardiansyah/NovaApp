import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/screens/LoginScreen';
import SignupScreen from '@/screens/SignupScreen';
import ForgotPasswordScreen from '@/screens/ForgotPasswordScreen';
import OTPScreen from '@/screens/OTPScreen';
import ResetPasswordScreen from '@/screens/ResetPasswordScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f9fafb' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        initialParams={{ email: '' }}
      />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
        initialParams={{ email: '', otp: '' }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        initialParams={{ email: '', otp: '' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;