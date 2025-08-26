import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Fade out animation before navigation
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            router.replace('/screens/TodayScreen');
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer
    // Start fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Fade out animation before navigation
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            router.replace('/screens/TodayScreen');
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer
    const navigationTimer = setTimeout(() => {
      router.replace('/screens/TodayScreen');
    }, 3500);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(countdownInterval);
      clearTimeout(navigationTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {countdown > 0 && (
          <Text style={styles.countdown}>{countdown}</Text>
        )}
        <Text style={styles.message}>Focus on what matters first</Text>
      </Animated.View>
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {countdown > 0 && (
          <Text style={styles.countdown}>{countdown}</Text>
        )}
        <Text style={styles.message}>Focus on what matters first</Text>
      </Animated.View>
    </View>
  );
}