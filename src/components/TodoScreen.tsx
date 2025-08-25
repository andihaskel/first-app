import React, { useEffect, useState, useRef } from 'react';
import { Circle, PlusIcon, InstagramIcon, ArrowRightIcon } from 'lucide-react';
import TaskItem from './TaskItem';
interface TodoScreenProps {
  onGoToTasks: () => void;
  onContinueToApp: () => void;
}
const TodoScreen: React.FC<TodoScreenProps> = ({
  onGoToTasks,
  onContinueToApp
}) => {
  const [tasks, setTasks] = useState([{
    id: 1,
    text: 'Terminar presentación',
    completed: false
  }, {
    id: 2,
    text: 'Enviar email a cliente',
    completed: false
  }, {
    id: 3,
    text: 'Preparar reunión de mañana',
    completed: false
  }]);
  const [newTask, setNewTask] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  // Slider state
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const maxSliderWidth = useRef(0);
  const startX = useRef(0);
  useEffect(() => {
    if (sliderRef.current) {
      const sliderWidth = sliderRef.current.parentElement?.clientWidth || 0;
      maxSliderWidth.current = sliderWidth - (sliderRef.current.clientWidth || 0);
    }
  }, []);
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsDragging(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    const newPosition = Math.max(0, Math.min(sliderPosition + diff, maxSliderWidth.current));
    setSliderPosition(newPosition);
    startX.current = currentX;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX.current;
    const newPosition = Math.max(0, Math.min(sliderPosition + diff, maxSliderWidth.current));
    setSliderPosition(newPosition);
    startX.current = currentX;
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
    if (sliderPosition >= maxSliderWidth.current * 0.9) {
      // Slider is complete, redirect to app
      onContinueToApp();
    } else {
      // Reset slider position
      setSliderPosition(0);
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    if (sliderPosition >= maxSliderWidth.current * 0.9) {
      // Slider is complete, redirect to app
      onContinueToApp();
    } else {
      // Reset slider position
      setSliderPosition(0);
    }
  };
  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? {
      ...task,
      completed: !task.completed
    } : task));
  };
  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        completed: false
      }]);
      setNewTask('');
      setIsAddingTask(false);
    }
  };
  // Get current date
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    weekday: 'long'
  };
  const formattedDate = today.toLocaleDateString('es-ES', options);
  // Calculate progress percentage for slider background
  const progressPercentage = sliderPosition / maxSliderWidth.current * 100;
  return <div className="h-full w-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-10 pb-0">
        <h1 className="text-4xl font-bold text-black mb-0">Hoy</h1>
      </div>
      {/* Date - moved to be directly against the separator */}
      <div className="px-6 pb-1">
        <p className="text-sm font-bold text-gray-600">{formattedDate}</p>
      </div>
      <div className="border-b border-gray-200 w-full mb-4"></div>
      {/* Task list */}
      <div className="flex-1 px-6">
        {isAddingTask ? <div className="mb-6">
            <div className="flex items-center border-b border-gray-300 pb-2">
              <input type="text" className="flex-1 py-2 focus:outline-none text-lg" placeholder="e.g., Reemplazar bombilla mañana a las 3..." value={newTask} onChange={e => setNewTask(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddTask()} autoFocus />
            </div>
            <div className="flex mt-4 space-x-3">
              <button className="px-4 py-2 bg-cream text-gray-700 rounded-md text-sm font-medium border border-cream-dark hover:bg-cream-dark transition-colors" onClick={handleAddTask}>
                Añadir
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors" onClick={() => setIsAddingTask(false)}>
                Cancelar
              </button>
            </div>
          </div> : <div className="space-y-0">
            {tasks.map(task => <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />)}
          </div>}
      </div>
      {/* Slider for "Continue to app" */}
      <div className="mt-auto border-t border-gray-200 p-4" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="relative h-14 bg-white border border-gray-300 rounded-md flex items-center px-4 overflow-hidden">
          {/* Progress background */}
          <div className="absolute top-0 left-0 h-full bg-cream-dark opacity-20 transition-all" style={{
          width: `${progressPercentage}%`
        }}></div>
          {/* Slider thumb */}
          <div ref={sliderRef} className="absolute h-10 aspect-square bg-cream border border-cream-dark rounded-md flex items-center justify-center cursor-pointer z-10 shadow-sm" style={{
          left: `${sliderPosition}px`
        }} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
            <ArrowRightIcon className="w-5 h-5 text-gray-700" />
          </div>
          {/* Slider text */}
          <div className="w-full text-center text-gray-700 font-medium">
            Desliza para continuar a la app
          </div>
        </div>
      </div>
      {/* Floating action button - now more circular */}
      {!isAddingTask && <button className="absolute bottom-20 right-6 w-14 h-14 rounded-full bg-cream border border-cream-dark text-gray-700 flex items-center justify-center shadow-md hover:bg-cream-dark transition-colors" onClick={() => setIsAddingTask(true)}>
          <PlusIcon className="w-8 h-8" />
        </button>}
      {/* Hidden Instagram button */}
      <button className="hidden" onClick={onContinueToApp}>
        <InstagramIcon className="w-5 h-5 mr-2" />
        Seguir a Instagram
      </button>
    </div>;
};
export default TodoScreen;