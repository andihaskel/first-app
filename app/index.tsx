import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('pause');
  const [timeLeft, setTimeLeft] = useState(5);
  const [timerComplete, setTimerComplete] = useState(false);

  // Simple timer logic
  useEffect(() => {
    if (currentScreen === 'pause' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !timerComplete) {
      setTimerComplete(true);
    }
  }, [timeLeft, currentScreen, timerComplete]);

  const handleContinue = () => {
    setCurrentScreen('todo');
  };

  const handleGoBack = () => {
    setCurrentScreen('pause');
    setTimeLeft(5);
    setTimerComplete(false);
  };

  if (currentScreen === 'pause') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.pauseScreen}>
          {!timerComplete ? (
            <>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{timeLeft}</Text>
              </View>
              <Text style={styles.title}>Respirá...</Text>
              <Text style={styles.subtitle}>¿Seguro que quieres entrar?</Text>
            </>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.buttonText}>Continuar a la app</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.todoScreen}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hoy</Text>
        </View>
        
        <View style={styles.taskList}>
          <View style={styles.taskItem}>
            <View style={styles.checkbox} />
            <Text style={styles.taskText}>Terminar presentación</Text>
          </View>
          <View style={styles.taskItem}>
            <View style={styles.checkbox} />
            <Text style={styles.taskText}>Enviar email a cliente</Text>
          </View>
          <View style={styles.taskItem}>
            <View style={styles.checkbox} />
            <Text style={styles.taskText}>Preparar reunión de mañana</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  pauseScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  todoScreen: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#F2D98D',
    borderWidth: 1,
    borderColor: '#E9CC7A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 20,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
  },
  taskList: {
    paddingHorizontal: 24,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    marginRight: 16,
  },
  taskText: {
    fontSize: 16,
    color: '#1f2937',
  },
});