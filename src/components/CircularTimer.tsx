import React from 'react';
interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
}
const CircularTimer: React.FC<CircularTimerProps> = ({
  timeLeft,
  totalTime
}) => {
  const progress = timeLeft / totalTime * 100;
  const circumference = 2 * Math.PI * 45; // r = 45
  const strokeDashoffset = circumference - progress / 100 * circumference;
  return <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="8" />
        {/* Progress circle */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#3B82F6" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
      </svg>
      <div className="absolute text-3xl font-medium text-gray-700">
        {timeLeft}
      </div>
    </div>;
};
export default CircularTimer;