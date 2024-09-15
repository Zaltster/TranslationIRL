import React from 'react';
import { StyleSheet } from 'react-native';
import CameraTextOverlay from '../../components/CameraTextOverlay';

export default function TabTwoScreen() {
  console.log('Rendering TabTwoScreen');
  return <CameraTextOverlay />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});