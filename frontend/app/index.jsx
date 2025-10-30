import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { indexStyles as styles } from '../styles/indexStyles';

export default function Index() {
  useEffect(() => {
    // For now, redirect to login screen
    // Later, you can add logic to check if user is already logged in
    const timer = setTimeout(() => {
      router.replace('/auth/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LunaAI</Text>
      <Text style={styles.subtitle}>Your Personal Cycle Tracker</Text>
      <ActivityIndicator size="large" color="#ec4899" style={styles.loader} />
    </View>
  );
}