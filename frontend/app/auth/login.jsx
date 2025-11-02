// Login screen component
// - Renders email/password form and calls FastAPI /auth/login on submit
// - On success, navigates to the app's root
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { loginStyles as styles } from '../../styles/authLoginStyles';
import { generateDummyData } from '../../lib/generateDummyData';
import { clearAllLogs } from '../../lib/activityStorage';

export default function LoginScreen() {
  // Local state: controlled inputs and loading flag
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Triggered when the user presses the "Sign In" button
  // - Bypasses all authentication for testing purposes
  // - Generates dummy data if none exists
  // - Directly navigates to Home page
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // BYPASS: Skip authentication and go directly to home
      console.log('[Login] ⚠️ Bypassing authentication - going directly to home');
      console.log('[Login] Email entered:', email);
      
      // Always generate dummy data on sign in (clear existing first)
      console.log('[Login] Clearing existing data and generating fresh dummy data...');
      await clearAllLogs();
      await generateDummyData();
      console.log('[Login] ✅ Dummy data generated successfully');
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('[Login] ❌ Navigation error:', error.message);
      Alert.alert('Error', 'Failed to navigate to home');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Use SafeAreaView from react-native-safe-area-context to avoid deprecation and handle notches
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            {/* App name for brand identity */}
            <Text style={styles.appName}>LunaAI</Text>
            {/* Primary screen heading */}
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              {/* Updates `email` on each keystroke */}
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              {/* Updates `password` on each keystroke */}
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.buttonDisabled]}
              // Pressing this calls `handleLogin`
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            {/* Navigates to signup screen when pressed */}
            <Link href="/auth/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles moved to ../../styles/authLoginStyles for consistency and reuse
