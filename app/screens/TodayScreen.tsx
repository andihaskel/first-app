import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, 
  KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useState } from 'react';
import { Plus, Menu, MoveHorizontal as MoreHorizontal, Sparkles } from 'lucide-react-native';
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
      title: 'Surf',
      description: 'Ir a surfear a la tarde',
      completed: false,
      emoji: '🏄‍♂️',
      category: 'Today',
      tag: 'Inbox 📥'
    }
  ]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
    setShowDetailModal(false);
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
          <TouchableOpacity key={task.id} onPress={() => openTaskDetail(task)}>
            <View style={styles.taskItem}>
              {/* Checkbox */}
              <TouchableOpacity
                style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
                onPress={() => toggleTask(task.id)}
              >
                {task.completed && <View style={styles.checkmark} />}
              </TouchableOpacity>

              {/* Task content */}
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
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Task Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent
        onRequestClose={closeTaskDetail}
      >
        <TouchableWithoutFeedback onPress={closeTaskDetail}>
          <View style={styles.detailOverlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                style={styles.detailSheet}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
              >
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTag}>{selectedTask?.tag || 'Inbox'} </Text>
                  <TouchableOpacity onPress={closeTaskDetail}>
                    <Text style={styles.detailClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.detailTitle}>{selectedTask?.title}</Text>
                <Text style={styles.detailDescription}>{selectedTask?.description}</Text>

                {/* Subtasks */}
                <ScrollView style={{ flex: 1 }}>
                  <TouchableOpacity style={styles.subTask}>
                    <View style={styles.subCircle} />
                    <Text style={styles.subText}>Add Sub-task</Text>
                  </TouchableOpacity>
                </ScrollView>

                {/* AI Assistant */}
                <View style={styles.aiContainer}>
                  <TextInput
                    style={styles.aiInput}
                    placeholder="Ask AI to help you break this task into steps..."
                    multiline
                  />
                  <TouchableOpacity style={styles.magicButton}>
                    <Sparkles size={22} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

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
  headerIcon: { marginLeft: 20 },
  title: { fontSize: 36, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  date: { fontSize: 16, fontWeight: '500', color: '#6b7280' },

  // TASKS
  tasksList: { flex: 1, paddingHorizontal: 20 },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#d1d5db',
    marginRight: 16, marginTop: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxCompleted: { backgroundColor: '#f44336', borderColor: '#f44336' },
  checkmark: { width: 8, height: 8, backgroundColor: '#ffffff', borderRadius: 4 },
  taskContent: { flex: 1 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', flex: 1 },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: '#9ca3af' },
  taskTag: { fontSize: 13, color: '#6b7280', marginLeft: 8 },
  taskDescription: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  taskDescriptionCompleted: { textDecorationLine: 'line-through', color: '#9ca3af' },

  // FAB
  addButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#f44336',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4,
  },

  // DETAIL MODAL
  detailOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  detailSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    height: '80%',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailTag: { fontSize: 14, color: '#6b7280' },
  detailClose: { fontSize: 20, color: '#6b7280' },
  detailTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  detailDescription: { fontSize: 16, color: '#6b7280', marginBottom: 16 },

  subTask: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  subCircle: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#d1d5db', marginRight: 12,
  },
  subText: { fontSize: 16, color: '#1a1a1a' },

  aiContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 8,
    marginTop: 12,
  },
  aiInput: {
    flex: 1,
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: 'top',
    paddingHorizontal: 8,
  },
  magicButton: {
    padding: 8,
  },
});
