import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  PanGestureHandler,
  State,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import TaskItem from './TaskItem';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoScreenProps {
  onGoToTasks: () => void;
  onContinueToApp: () => void;
}

const TodoScreen: React.FC<TodoScreenProps> = ({
  onGoToTasks,
  onContinueToApp,
}) => {
  const [tasks, setTasks] = useState<Task[]>([
    {id: 1, text: 'Terminar presentación', completed: false},
    {id: 2, text: 'Enviar email a cliente', completed: false},
    {id: 3, text: 'Preparar reunión de mañana', completed: false},
  ]);
  const [newTask, setNewTask] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Slider animation
  const translateX = useSharedValue(0);
  const SLIDER_WIDTH = 300;
  const THUMB_SIZE = 40;
  const MAX_TRANSLATE = SLIDER_WIDTH - THUMB_SIZE;

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = Math.max(
        0,
        Math.min(context.startX + event.translationX, MAX_TRANSLATE),
      );
    },
    onEnd: () => {
      if (translateX.value > MAX_TRANSLATE * 0.8) {
        runOnJS(onContinueToApp)();
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value + THUMB_SIZE,
    };
  });

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task,
      ),
    );
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
        },
      ]);
      setNewTask('');
      setIsAddingTask(false);
    }
  };

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    weekday: 'long',
  };
  const formattedDate = today.toLocaleDateString('es-ES', options);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hoy</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      
      <View style={styles.separator} />

      <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
        {isAddingTask ? (
          <View style={styles.addTaskContainer}>
            <TextInput
              style={styles.taskInput}
              placeholder="e.g., Reemplazar bombilla mañana a las 3..."
              value={newTask}
              onChangeText={setNewTask}
              onSubmitEditing={handleAddTask}
              autoFocus
              multiline
            />
            <View style={styles.addTaskButtons}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                <Text style={styles.addButtonText}>Añadir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsAddingTask(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <Animated.View style={[styles.sliderBackground, animatedBackgroundStyle]} />
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.sliderThumb, animatedThumbStyle]}>
              <Text style={styles.arrowText}>→</Text>
            </Animated.View>
          </PanGestureHandler>
          <Text style={styles.sliderText}>Desliza para continuar a la app</Text>
        </View>
      </View>

      {/* Add Task Button */}
      {!isAddingTask && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsAddingTask(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 0,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  addTaskContainer: {
    marginBottom: 24,
  },
  taskInput: {
    fontSize: 18,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    marginBottom: 16,
  },
  addTaskButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    backgroundColor: '#F2D98D',
    borderWidth: 1,
    borderColor: '#E9CC7A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  sliderContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
  },
  sliderTrack: {
    height: 56,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  sliderBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: '#E9CC7A',
    opacity: 0.2,
  },
  sliderThumb: {
    position: 'absolute',
    left: 4,
    width: 40,
    height: 40,
    backgroundColor: '#F2D98D',
    borderWidth: 1,
    borderColor: '#E9CC7A',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  arrowText: {
    fontSize: 20,
    color: '#374151',
  },
  sliderText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F2D98D',
    borderWidth: 1,
    borderColor: '#E9CC7A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 32,
    color: '#374151',
    fontWeight: '300',
  },
});

export default TodoScreen;