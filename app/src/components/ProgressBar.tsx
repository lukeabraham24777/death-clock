import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { theme } from '../theme';

interface Props {
  progress: number; // 0 to 1
}

const { width } = Dimensions.get('window');

export default function ProgressBar({ progress }: Props) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: progress,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 1],
              outputRange: [0, width],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 3,
    backgroundColor: theme.colors.surfaceLight,
    width: '100%',
  },
  fill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
});
