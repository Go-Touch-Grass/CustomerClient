import { StyleSheet } from 'react-native';
import { Colors } from './commonStyles';

export const BusinessAvatarInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9', // Light green background
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32', // Darker green for text
    textAlign: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 20,
    marginBottom: 15,
    color: '#4caf50', // Green color for location
    textAlign: 'center',
  },
  category: {
    fontSize: 20,
    marginBottom: 15,
    color: '#388e3c',
    textAlign: 'center',
  },
  description: {
    fontSize: 20,
    color: '#388e3c',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  backIcon: {
    color: '#4CAF50',
    fontSize: 28,
  },
  navigateButton: {
    backgroundColor: '#66bb6a', // Green button background
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 200, // Increased margin to move it higher
    alignSelf: 'center',
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
