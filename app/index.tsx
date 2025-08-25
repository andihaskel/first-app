import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import PauseScreen from '../src/components/PauseScreen';
import TodoScreen from '../src/components/TodoScreen';
import MetricsScreen from '../src/components/MetricsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('pause');
  const [timerComplete, setTimerComplete] = useState(false);

  const handleTimerComplete = () => {
    setTimerComplete(true);
  };

  const handleContinue = () => {
    setCurrentScreen('todo');
  };

  const handleGoToTasks = () => {
    setCurrentScreen('metrics');
  };

  const handleContinueToApp = () => {
    setCurrentScreen('metrics');
  };

  const handleGoBack = () => {
    setCurrentScreen('pause');
    setTimerComplete(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      {currentScreen === 'pause' && (
        <PauseScreen
          onTimerComplete={handleTimerComplete}
          onContinue={handleContinue}
          timerComplete={timerComplete}
        />
      )}
      {currentScreen === 'todo' && (
        <TodoScreen
          onGoToTasks={handleGoToTasks}
          onContinueToApp={handleContinueToApp}
        />
      )}
      {currentScreen === 'metrics' && (
        <MetricsScreen onGoBack={handleGoBack} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});