import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';

interface PauseScreenProps {
  onTimerComplete: () => void;
  onContinue: () => void;
  timerComplete: boolean;
}

const PauseScreen: React.FC<PauseScreenProps> = ({
  onTimerComplete,
  onContinue,
  timerComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [showContent, setShowContent] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onTimerComplete();
      setShowContent(false);
      // Animate button fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [timeLeft, onTimerComplete, fadeAnim]);

  return (
    <View style={styles.container}>
      {showContent && (
        <>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{timeLeft}</Text>
          </View>
          <Text style={styles.title}>Respirá...</Text>
          <Text style={styles.subtitle}>¿Seguro que quieres entrar?</Text>
        </>
      )}
      {timerComplete && (
        <Animated.View style={[styles.buttonContainer, {opacity: fadeAnim}]}>
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.buttonText}>Continuar a la app</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },
  timerContainer: {
    marginBottom: 32,
  },
  timerText: {
    fontSize: 96,
    fontWeight: '500',
    color: '#374151',
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#F2D98D',
    borderWidth: 1,
    borderColor: '#E9CC7A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: 256,
    alignItems: 'center',
  },
  buttonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PauseScreen;