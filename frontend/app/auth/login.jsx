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
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import { API_BASE_URL } from '../../lib/config';
import { loginStyles as styles } from '../../styles/authLoginStyles';

export default function LoginScreen() {
  // Local state: controlled inputs and loading flag
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Triggered when the user presses the "Sign In" button
  // - Validates required fields
  // - First tries Supabase Auth (for new users)
  // - If Supabase Auth fails, falls back to Users table verification (for legacy users)
  // - On success from either, navigates to Home
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // Try Supabase Auth first (for users signed up through Supabase)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error && data.session) {
        // Supabase Auth succeeded
        console.log('Supabase session established', Boolean(data.session));
        router.replace('/(tabs)/home');
        return;
      }

      // Supabase Auth failed - try Users table as fallback (for legacy users)
      console.log('Supabase Auth failed, trying Users table | error=', error?.message);
      
      try {
        const response = await axios.post(`${API_BASE_URL}/users/verify-password`, {
          email,
          password,
        });
        
        // Users table verification succeeded - create a local session marker
        // Note: This user won't have Supabase Auth session, but app can proceed
        console.log('Users table verification successful | user_id=', response.data.user_id);
        
        // Optionally create a Supabase Auth session here if needed, or proceed without it
        router.replace('/(tabs)/home');
      } catch (usersError) {
        // Both Supabase Auth and Users table failed
        throw new Error(usersError.response?.data?.detail || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Login failed. Please try again.');
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
