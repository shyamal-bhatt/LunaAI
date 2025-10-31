// Signup screen component
// - Renders a multi-field form and calls FastAPI /auth/signup on submit
// - On success, redirects user to Login screen
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import { API_BASE_URL } from '../../lib/config';
import { signupStyles as styles } from '../../styles/authSignupStyles';

export default function SignupScreen() {
  // Local state: grouped form values and loading flag
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Triggered on every input change to update the corresponding field
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Synchronous client-side validation for all fields
  // - Ensures presence, email format, password strength, and match
  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Triggered when the user presses the "Create Account" button
  // - Validates inputs
  // - Uses Supabase Auth to sign up the user
  // - On success, navigates to the Login screen
  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName || null,
          },
        },
      });
      if (error) throw new Error(error.message);

      // Create a corresponding row in backend Users table with plaintext password (for debugging)
      try {
        console.log('Attempting Users upsert | url=', `${API_BASE_URL}/users/upsert`);
        const response = await axios.post(`${API_BASE_URL}/users/upsert`, {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName || null,
          password: formData.password, // Stored as plaintext for debugging
        }, {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        console.log('Users upsert successful', response.data);
      } catch (e) {
        // Log detailed error for debugging
        const errorInfo = {
          message: e.message,
          code: e.code,
          url: `${API_BASE_URL}/users/upsert`,
          response: e.response?.data,
          status: e.response?.status,
        };
        console.error('Users upsert failed', errorInfo);
        
        // Network errors might be transient - log but don't block signup
        if (e.code === 'ERR_NETWORK' || e.message === 'Network Error') {
          console.warn('Network error - backend may be unreachable. Ensure backend is running on', API_BASE_URL);
        }
        // For now, we still allow signup to succeed even if Users table insert fails
        // but log it so we can debug - this is a network/backend issue
      }

      Alert.alert(
        'Success',
        'Account created successfully! Please sign in.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join LunaAI to track your cycle</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.nameRow}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>First Name</Text>
                  {/* Updates `firstName` on each keystroke */}
                  <TextInput
                    style={styles.input}
                    placeholder="First name"
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Last Name</Text>
                  {/* Updates `lastName` on each keystroke */}
                  <TextInput
                    style={styles.input}
                    placeholder="Last name"
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                {/* Updates `email` on each keystroke */}
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                {/* Updates `confirmPassword` on each keystroke */}
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <TouchableOpacity
                style={[styles.signupButton, isLoading && styles.buttonDisabled]}
                // Pressing this calls `handleSignup`
                onPress={handleSignup}
                disabled={isLoading}
              >
                <Text style={styles.signupButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              {/* Navigates to login screen when pressed */}
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles moved to ../../styles/authSignupStyles for consistency and reuse
