import { StyleSheet } from 'react-native';

// Styles for the Chat screen
export const chatStyles = StyleSheet.create({
  // Root container for the entire chat screen
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // KeyboardAvoidingView wrapper to adjust when keyboard opens
  keyboardAvoidingView: {
    flex: 1,
  },
  // Main area where chat messages will be displayed
  chatArea: {
    flex: 1,
    padding: 16,
  },
  // Placeholder container for empty chat state
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  // Title text in the placeholder
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  // Helper text in the placeholder
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Bottom container holding text input and send button - sticks directly on top of tab bar
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  // Text input field for typing messages
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 12,
    fontSize: 16,
    color: '#1f2937',
    maxHeight: 100,
    marginRight: 8,
  },
  // Send button - circular button with send icon
  sendButton: {
    backgroundColor: '#ec4899',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Disabled state for send button when input is empty
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
});
