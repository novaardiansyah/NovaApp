import { StatusBar } from 'expo-status-bar';
import AuthNavigator from '@/navigation/AuthNavigator';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <AuthNavigator />
    </>
  );
}