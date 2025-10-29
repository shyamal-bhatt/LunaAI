import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 32,
  },
  loader: {
    marginTop: 20,
  },
});