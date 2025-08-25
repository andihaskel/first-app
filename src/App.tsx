import React, { useState } from 'react';
import PauseScreen from './components/PauseScreen';
import TodoScreen from './components/TodoScreen';
import MetricsScreen from './components/MetricsScreen';
export function App() {
  const [currentScreen, setCurrentScreen] = useState('pause'); // 'pause', 'todo', 'metrics'
  const [timerComplete, setTimerComplete] = useState(false);
  const handleTimerComplete = () => {
    setTimerComplete(true);
  };
  const handleContinue = () => {
    setCurrentScreen('todo');
  };
  const handleGoToTasks = () => {
    // In a real app, this would navigate to a task management screen
    setCurrentScreen('metrics');
  };
  const handleContinueToApp = () => {
    // In a real app, this would allow access to the original app
    // For demo purposes, we'll show the metrics screen
    setCurrentScreen('metrics');
  };
  const handleGoBack = () => {
    setCurrentScreen('pause');
    setTimerComplete(false);
  };
  return <div className="flex w-full min-h-screen justify-center items-center bg-gray-100">
      <div className="w-full max-w-md h-[667px] bg-white rounded-3xl overflow-hidden shadow-lg relative">
        {currentScreen === 'pause' && <PauseScreen onTimerComplete={handleTimerComplete} onContinue={handleContinue} timerComplete={timerComplete} />}
        {currentScreen === 'todo' && <TodoScreen onGoToTasks={handleGoToTasks} onContinueToApp={handleContinueToApp} />}
        {currentScreen === 'metrics' && <MetricsScreen onGoBack={handleGoBack} />}
      </div>
    </div>;
}