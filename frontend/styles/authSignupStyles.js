import { StyleSheet } from 'react-native';

// Styles for the Signup screen
// Each style includes context on where it's used and its purpose
export const signupStyles = StyleSheet.create({
  // Root container covering full screen and setting the background color
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Wrapper to shift content when keyboard appears
  keyboardAvoidingView: {
    flex: 1,
  },
  // Provides minimum height for scroll area and allows vertical centering
  scrollContent: {
    flexGrow: 1,
  },
  // Main content area: center content and add consistent padding
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  // Top section with screen heading and subtitle
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  // Main title for the signup screen
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  // Supporting text describing the purpose of the screen
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Wrapper around all form fields to separate from footer
  form: {
    marginBottom: 32,
  },
  // Horizontal row for first and last name fields
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Shared container for each label + input pair
  inputContainer: {
    marginBottom: 20,
  },
  // Utility to make an input container take half width next to another
  halfWidth: {
    width: '48%',
  },
  // Label text shown above each input
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  // Text input box for all form fields
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
  // Primary button for creating an account
  signupButton: {
    backgroundColor: '#ec4899',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  // Disabled visual state for the primary button during loading
  buttonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  // Text inside the create account button
  signupButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Footer container with a horizontal row for sign-in link
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Static footer text preceding the sign-in link
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  // Emphasized link text to navigate to the login screen
  loginLink: {
    color: '#ec4899',
    fontSize: 14,
    fontWeight: '600',
  },
});


