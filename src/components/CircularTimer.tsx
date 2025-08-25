import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
}

const CircularTimer: React.FC<CircularTimerProps> = ({timeLeft, totalTime}) => {
  const progress = timeLeft / totalTime;
  const circumference = 2 * Math.PI * 45; // r = 45
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={styles.container}>
      <Svg width={128} height={128} viewBox="0 0 100 100" style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <Circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </Svg>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{timeLeft}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 128,
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  timeContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: '500',
    color: '#374151',
  },
});

export default CircularTimer;