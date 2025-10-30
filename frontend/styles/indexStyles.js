import { StyleSheet } from 'react-native';

// Styles for the app landing/index screen
export const indexStyles = StyleSheet.create({
  // Root container centers brand and loader; sets screen background
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  // Large brand title displayed prominently
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 8,
  },
  // Supporting text to describe the app purpose
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 32,
  },
  // Loader spacer to create visual separation from text
  loader: {
    marginTop: 20,
  },
});


