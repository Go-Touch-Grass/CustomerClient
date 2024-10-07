import { StyleSheet } from 'react-native';
import { Colors } from './commonStyles';

export const ChangeLanguageStyles = StyleSheet.create({
  languageListContainer: {
    padding: 10,
  },

  languageItem: {
  padding: 15,
  borderBottomColor: '#ccc',
  borderBottomWidth: 1,
  },

  languageItemText: {
  fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  backIcon: {
    color: Colors.green,
    fontSize: 24,
  },
  languagesList: {
    flex: 1,
    justifyContent: 'center',
    padding: 10
  },
  languageButton: {
    padding: 10,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  lngName: {
    fontSize: 16,
    color: 'white',
  },
});