import { StyleSheet } from 'react-native';

// Styles for the Home screen with calendar and activity logging sections
export const homeStyles = StyleSheet.create({
  // Root container for the entire home screen - sets background color
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // ScrollView container to enable vertical scrolling of content
  scrollView: {
    flex: 1,
  },
  // Content container inside ScrollView - adds padding and spacing
  scrollContent: {
    paddingBottom: 24,
  },
  // Header section at top showing app name and tagline
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  // Main app title in the header
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ec4899',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  // Subtitle with tagline
  subtitle: {
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '600',
  },
  // "cycle" text in red/blood color
  cycleText: {
    color: '#dc2626', // Red/blood color
    fontWeight: '700',
  },
  // Container for the calendar component with card-like appearance
  calendarContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  // Title text above the calendar
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  // Placeholder section for future activity logging components
  placeholderSection: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  // Placeholder text indicating where activity logging will appear
  placeholderText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  // Activity sections container
  activitySection: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  // Bleeding section with light red background and top placement
  bleedingSection: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fee2e2', // light red background
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecdd3',
  },
  // Section heading text
  activityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  // Grid layout for options
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  // Option pill (unselected)
  optionPill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f3f4f6',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  // Option pill (selected) - highlighted pink background with pink border
  optionPillActive: {
    backgroundColor: '#fdf2f8',
    borderColor: '#ec4899',
    borderWidth: 2,
  },
  // Text inside unselected option pill
  optionPillText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 14,
  },
  // Text inside selected option pill - pink color
  optionPillTextActive: {
    color: '#ec4899',
    fontWeight: '700',
  },
  // Yes/No row
  yesNoRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  // Numeric input row
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  numberInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 90,
    color: '#1f2937',
  },
});


