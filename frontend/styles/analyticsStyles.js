import { StyleSheet } from 'react-native';

// Styles for the Analytics screen with graphs
export const analyticsStyles = StyleSheet.create({
  // Root container for the entire analytics screen
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // ScrollView container to enable vertical scrolling
  scrollView: {
    flex: 1,
  },
  // Content container inside ScrollView - adds padding
  scrollContent: {
    paddingBottom: 24,
  },
  // Header section at top showing title
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  // Main title in the header
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  // Subtitle below title
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  // Container for each graph card
  graphCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  // Header row for graph with title and remove button
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  // Title for each graph
  graphTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  // Remove graph button
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  // Remove button text
  removeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },
  // Container for selector (month or activity)
  selectorContainer: {
    marginBottom: 16,
  },
  // Label text for selector
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  // Scrollable container for activity options
  activityScroll: {
    marginHorizontal: -4,
  },
  // Row of option pills
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 4,
  },
  // Option pill (unselected)
  optionPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  // Option pill (selected)
  optionPillActive: {
    backgroundColor: '#fdf2f8',
    borderColor: '#ec4899',
    borderWidth: 2,
  },
  // Option pill (disabled - already selected in other activity)
  optionPillDisabled: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    opacity: 0.5,
  },
  // Text inside unselected option pill
  optionPillText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 12,
  },
  // Text inside selected option pill
  optionPillTextActive: {
    color: '#ec4899',
    fontWeight: '700',
  },
  // Text inside disabled option pill
  optionPillTextDisabled: {
    color: '#9ca3af',
  },
  // Container for the chart/graph visualization
  chartContainer: {
    marginTop: 16,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 8,
    minHeight: 280,
  },
  // Container shown when no data available
  noDataContainer: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  // Text shown when no data available
  noDataText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  // Container shown when no activity selected
  noSelectionContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  // Text shown when no activity selected
  noSelectionText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Button to add another graph
  addButton: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    paddingVertical: 14,
    backgroundColor: '#ec4899',
    borderRadius: 12,
    alignItems: 'center',
  },
  // Text inside add button
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Container for custom legend
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
    paddingVertical: 8,
  },
  // Individual legend item
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  // Legend dot (color indicator)
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  // Legend text
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});

