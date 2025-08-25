import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({task, onToggle}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View style={styles.checkboxContainer}>
        <View style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
          {task.text}
        </Text>
        <View style={styles.separator} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    position: 'relative',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    marginRight: 16,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#374151',
    borderColor: '#374151',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    paddingBottom: 12,
  },
  taskText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
  },
  taskTextCompleted: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
});

export default TaskItem;