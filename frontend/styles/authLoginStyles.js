import { StyleSheet } from 'react-native';

// Styles for the Login screen
// Each key below describes where it is used and what it does
export const loginStyles = StyleSheet.create({
  // Root container for the entire login screen; sets background and full height
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Wraps content to move up when keyboard is open (used inside KeyboardAvoidingView)
  keyboardAvoidingView: {
    flex: 1,
  },
  // Centers main content and adds horizontal padding for consistent spacing
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  // Top section containing brand and headings; centers and spaces elements
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  // Brand label shown above title for product identity - increased size
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ec4899',
    marginBottom: 12,
    letterSpacing: 1,
  },
  // Main heading text for the screen
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  // Secondary text to guide user on what to do next
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Wrapper for the form block; separates fields from footer
  form: {
    marginBottom: 32,
  },
  // Groups a label and input with spacing between fields
  inputContainer: {
    marginBottom: 20,
  },
  // Label text displayed above inputs to describe the field
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  // Text input box for email and password entries
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1f2937',
  },
  // Prominent CTA button for login action
  loginButton: {
    backgroundColor: '#ec4899',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  // Disabled state for button when loading
  buttonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  // Text inside the login button
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Touch target for password recovery link
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  // Styling for the password recovery text link
  forgotPasswordText: {
    color: '#ec4899',
    fontSize: 14,
    fontWeight: '500',
  },
  // Footer row that contains the signup navigation link
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Static text in the footer preceding the link
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  // Emphasized link text for navigating to the signup screen
  signupLink: {
    color: '#ec4899',
    fontSize: 14,
    fontWeight: '600',
  },
});


