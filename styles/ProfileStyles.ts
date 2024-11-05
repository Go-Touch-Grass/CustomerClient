import { StyleSheet } from 'react-native';
import { Colors } from './commonStyles';

export const profileStyles = StyleSheet.create({
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  repairButton: {
    backgroundColor: '#FF6347', // Example color, use your preferred color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc', // Grey background for the disabled state
    opacity: 0.5, // Make it slightly transparent
  },
  container: {
    flex: 1,
    padding: 20,
  },
  infoContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.tertiary,
  },
  button: {
    backgroundColor: Colors.green,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  progressContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.tertiary,
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.green,
  },
  inputContainer: {
    width: '80%',
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.tertiary,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },
  generalErrorContainer: {
    width: '80%',
    marginTop: 10,
  },
  generalErrorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: Colors.red,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: Colors.green,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.tertiary,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: Colors.tertiary,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  modalCancelButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalDeleteButton: {
    backgroundColor: Colors.red,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});