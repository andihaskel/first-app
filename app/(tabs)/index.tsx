import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useState } from 'react';
import { Plus, Menu, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
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
    },
    {
      id: '2',
      title: 'surf',
      description: 'Ir a surfear a la tarde',
      completed: false,
      emoji: '',
      category: 'Today',
      tag: 'Inbox 📥'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Today');

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
        tag: 'Inbox 📥'
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setShowAddModal(false);
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
          <Menu size={24} color="#dc2626" />
          <MoreHorizontal size={24} color="#dc2626" />
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
        onPress={() => setShowAddModal(true)}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addTask}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.titleInput}
            placeholder="e.g., Replace lightbulb tomorrow at 3pm..."
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            autoFocus
          />

          <Text style={styles.descriptionLabel}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Add description..."
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
            multiline
          />

          <View style={styles.categoryButtons}>
            {['Today', 'Priority', 'Reminders'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonSelected
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
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
    marginLeft: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 20,
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
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  checkmark: {
    width: 8,
    height: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  taskTag: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  taskDescriptionCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  addButton: {
    position: 'absolute',
    bottom: 80, // más cerca del tabbar
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
