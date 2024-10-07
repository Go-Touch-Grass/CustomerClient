import styled from 'styled-components/native';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

const StatusBarHeight = Constants.statusBarHeight;

export const Colors = {
  white: '#ffffff',
  secondary: '#E5E7EB',
  tertiary: '#06402B',
  darkLight: '#9CA3AF',
  black: '#000000',
  green: '#4CAF50',
  red: '#EF4444',
  lightGreen: '#a0d995',
  lightGray: '#d0d0d0',
  gray: '#a0a0a0',
};

const { white: primary, black: brand } = Colors;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 10}px;
  background-color: ${primary};
`;

export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const PageLogo = styled.Image`
  width: 250px;
  height: 200px;
`;

export const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${brand};
  padding: 10px;
`;

export const commonStyles = StyleSheet.create({
  errorText: {
    color: Colors.red,
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});
