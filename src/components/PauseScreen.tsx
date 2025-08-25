import React, { useEffect, useState } from 'react';
interface PauseScreenProps {
  onTimerComplete: () => void;
  onContinue: () => void;
  timerComplete: boolean;
}
const PauseScreen: React.FC<PauseScreenProps> = ({
  onTimerComplete,
  onContinue,
  timerComplete
}) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [showContent, setShowContent] = useState(true);
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onTimerComplete();
      // Hide content and then show button with fade-in
      setShowContent(false);
      setTimeout(() => {
        setShowButton(true);
      }, 500); // Small delay before showing button
    }
  }, [timeLeft, onTimerComplete]);
  return <div className="h-full w-full flex flex-col items-center justify-center bg-white px-6">
      {showContent && <>
          <div className="mb-8">
            <div className="text-6xl font-medium text-gray-700 transition-all">
              {timeLeft}
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 text-gray-700 mr-2" />
            <h1 className="text-2xl font-medium text-gray-700">Respirá...</h1>
          </div>
          <p className="text-lg text-center text-gray-600 mb-10">
            ¿Seguro que quieres entrar?
          </p>
        </>}
      {showButton && <button className="w-64 py-3 px-6 rounded-md text-gray-700 font-medium bg-cream border border-cream-dark shadow-sm hover:bg-cream-dark transition-colors opacity-0 animate-fadeIn" onClick={onContinue} style={{
      animation: 'fadeIn 0.8s ease forwards'
    }}>
          Continuar a la app
        </button>}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>;
};
export default PauseScreen;