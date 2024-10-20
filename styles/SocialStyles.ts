import { StyleSheet } from 'react-native';
import { Colors, commonStyles } from './commonStyles';

export const socialStyles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.tertiary,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  toggleLabel: {
    marginRight: 10,
    fontSize: 14,
    color: Colors.tertiary,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  leaderboardItem: {
    width: '100%',
    paddingHorizontal: 15,
  },
  listItemText: {
    fontSize: 16,
    color: Colors.tertiary,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.green,
    backgroundColor: Colors.white,
    minWidth: 120,
    height: 48,
  },
  acceptButton: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  rejectButton: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  removeButton: {
    padding: 5,
  },
  addButton: {
    backgroundColor: Colors.green,
  },
  buttonText: {
    color: Colors.green,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
    margin: 20,
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
  addFriendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: Colors.tertiary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: Colors.tertiary,
    backgroundColor: Colors.secondary,
    fontSize: 16,
  },
  friendsButton: {
    backgroundColor: Colors.green,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  friendsButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addFriendButton: {
    flex: 1,
    marginRight: 10,
  },
  friendRequestsButton: {
    flex: 1,
    flexDirection: 'row',
  },
  badgeContainer: {
    backgroundColor: Colors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.tertiary,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 10,
  },
  addButtonText: {
    color: Colors.white,
  },
  primaryButton: {
    backgroundColor: Colors.green,
  },
  primaryButtonText: {
    color: Colors.white,
  },
  fullWidthButton: {
    width: '100%',
    marginVertical: 10,
  },
  modalButton: {
    marginVertical: 5,
  },
  errorText: commonStyles.errorText,
  iconButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  currentUserItem: {
    backgroundColor: Colors.secondary,
    borderWidth: 2,
    borderColor: Colors.green,
  },
});

// Add these color definitions to the Colors object
Colors.lightGreen = '#a0d995';
Colors.lightGray = '#d0d0d0';
Colors.gray = '#a0a0a0';