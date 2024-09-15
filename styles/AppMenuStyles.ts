import { StyleSheet } from 'react-native';
import { Colors } from './commonStyles';

export const appMenuStyles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: 40,
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  drawerItemText: {
    fontSize: 16,
    color: Colors.brand,
  },
});
