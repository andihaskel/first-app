import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Animated } from 'react-native';
import { useRouter } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  content: {
    alignItems: 'center',
  },
  countdown: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#f97316',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 28,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 36,
  },
});

export default function SplashScreen() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const messageFadeAnim = useRef(new Animated.Value(1)).current;

  const messages = [
    "Focus on what matters first",
    "One day or day one. You decide.",
    "You got this."
  ];

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
          return 0;
        }
        
        // Change message with fade animation
        Animated.timing(messageFadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
          Animated.timing(messageFadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        });
        
        return prev - 1;
      });
    }, 1000);

    // Fade out animation after countdown finishes
    const fadeOutTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/screens/TodayScreen');
      });
    }, 3000);

    // Cleanup timer
    const fallbackTimer = setTimeout(() => {
      router.replace('/screens/TodayScreen');
    }, 4000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(fadeOutTimer);
      clearTimeout(fallbackTimer);
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
        <Animated.Text 
          style={[
            styles.message,
            { opacity: messageFadeAnim }
          ]}
        >
          {messages[currentMessageIndex]}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}