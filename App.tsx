import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthNavigator from '@/navigation/AuthNavigator';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <AuthNavigator />
    </AuthProvider>
  );
}