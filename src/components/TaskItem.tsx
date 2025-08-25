import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
interface Task {
  id: number;
  text: string;
  completed: boolean;
}
interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle
}) => {
  return <div className="flex items-start py-3 relative">
      <div className="w-6 h-6 mr-4 flex-shrink-0 cursor-pointer" onClick={onToggle}>
        {task.completed ? <CheckCircle className="w-6 h-6 text-gray-700" /> : <Circle className="w-6 h-6 text-gray-300" strokeWidth={1.5} />}
      </div>
      <div className="flex flex-col flex-1 pb-3 cursor-pointer" onClick={onToggle}>
        <span className={`text-base ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
          {task.text}
        </span>
        {/* Separator that starts from text and goes to the end */}
        <div className="absolute bottom-0 left-10 right-0 border-b border-gray-200"></div>
      </div>
    </div>;
};
export default TaskItem;