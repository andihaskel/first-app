import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, 
  Modal, Alert
} from 'react-native';
import { useState } from 'react';
import { Plus, Menu, MoreHorizontal, Calendar, Flag, Bell, Inbox } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  emoji: string;
  category: string;
  tag: string;
}

export default function TodayScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Work',
      description: 'Trabajar',
      completed: false,
      emoji: '💻👨‍💼',
      category: 'Today',
      tag: 'Home 🏠 #'
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Today');
  const [modalVisible, setModalVisible] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: newTaskDescription,
        completed: false,
        emoji: '',
        category: selectedCategory,
        tag: 'Inbox'
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setModalVisible(false);
    }
  };

  const formatDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${day} ${month} • ${weekday}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Menu size={24} color="#dc2626" style={styles.headerIcon} />
          <MoreHorizontal size={24} color="#dc2626" style={styles.headerIcon} />
        </View>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.date}>{formatDate()}</Text>
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <TouchableOpacity
              style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
              onPress={() => toggleTask(task.id)}
            >
              {task.completed && <View style={styles.checkmark} />}
            </TouchableOpacity>

            <View style={styles.taskContent}>
              <View style={styles.taskHeader}>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                  {task.title} {task.emoji}
                </Text>
                <Text style={styles.taskTag}>{task.tag}</Text>
              </View>
              <Text style={[styles.taskDescription, task.completed && styles.taskDescriptionCompleted]}>
                {task.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Modal for adding tasks */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            
            <TextInput
              style={styles.titleInput}
              placeholder="Task title..."
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />

            <TextInput
              style={styles.descriptionInput}
              placeholder="Description"
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.addTaskButton, !newTaskTitle.trim() && styles.addTaskButtonDisabled]}
                onPress={addTask}
                disabled={!newTaskTitle.trim()}
              >
                <Text style={styles.addTaskButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },

  // HEADER
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIcon: { 
    marginLeft: 20 
  },
  title: { 
    fontSize: 36, 
    fontFamily: 'Inter-Bold', 
    color: '#1a1a1a', 
    marginBottom: 4 
  },
  date: { 
    fontSize: 16, 
    fontFamily: 'Inter-Medium', 
    color: '#6b7280' 
  },

  // TASKS
  tasksList: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  checkbox: {
    width: 22, 
    height: 22, 
    borderRadius: 11,
    borderWidth: 2, 
    borderColor: '#d1d5db',
    marginRight: 16, 
    marginTop: 2,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  checkboxCompleted: { 
    backgroundColor: '#f44336', 
    borderColor: '#f44336' 
  },
  checkmark: { 
    width: 8, 
    height: 8, 
    backgroundColor: '#ffffff', 
    borderRadius: 4 
  },
  taskContent: { 
    flex: 1 
  },
  taskHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  taskTitle: { 
    fontSize: 16, 
    fontFamily: 'Inter-SemiBold', 
    color: '#1a1a1a', 
    flex: 1 
  },
  taskTitleCompleted: { 
    textDecorationLine: 'line-through', 
    color: '#9ca3af' 
  },
  taskTag: { 
    fontSize: 13, 
    color: '#6b7280', 
    marginLeft: 8 
  },
  taskDescription: { 
    fontSize: 14, 
    fontFamily: 'Inter-Regular',
    color: '#6b7280', 
    marginTop: 2 
  },
  taskDescriptionCompleted: { 
    textDecorationLine: 'line-through', 
    color: '#9ca3af' 
  },

  // FAB
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56, 
    height: 56, 
    borderRadius: 28,
    backgroundColor: '#f44336',
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, 
    shadowRadius: 4,
    elevation: 5,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  titleInput: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#111827',
  },
  descriptionInput: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#6b7280',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  addTaskButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f44336',
    alignItems: 'center',
  },
  addTaskButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  addTaskButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
});