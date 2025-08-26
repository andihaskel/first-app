import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, 
  KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useState } from 'react';
import { Plus, Menu, MoveHorizontal as MoreHorizontal, Inbox, X, Sparkles } from 'lucide-react-native';
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
      tag: 'Home 🏠'
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

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

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
        category: 'Today',
        tag: 'Inbox'
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setShowAddModal(false);
    }
  };

  const openDetail = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const closeDetail = () => {
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
          <View key={task.id} style={styles.taskWrapper}>
            <View style={styles.taskItem}>
              {/* Checkbox */}
              <TouchableOpacity 
                style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
                onPress={() => toggleTask(task.id)}
              >
                {task.completed && <View style={styles.checkmark} />}
              </TouchableOpacity>

              {/* Content */}
              <TouchableOpacity 
                style={styles.taskContent} 
                onPress={() => openDetail(task)}
                activeOpacity={0.7}
              >
                {/* Título */}
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                  {task.title} {task.emoji}
                </Text>

                {/* Descripción */}
                {task.description ? (
                  <Text style={[styles.taskDescription, task.completed && styles.taskDescriptionCompleted]}>
                    {task.description}
                  </Text>
                ) : null}

                {/* Tag abajo a la derecha */}
                <Text style={styles.taskTag}>{task.tag}</Text>
              </TouchableOpacity>
            </View>
            {/* Separador solo bajo el texto */}
            <View style={styles.separator} />
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
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAddModal(false)}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              style={{ flex: 1, justifyContent: 'flex-end' }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalSheet}>
                  <TextInput
                    style={styles.titleInput}
                    placeholder="e.g., Replace lightbulb tomorrow at 3pm..."
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

                  <TouchableOpacity 
                    style={[styles.sendButton, !newTaskTitle.trim() && styles.sendButtonDisabled]}
                    onPress={addTask}
                    disabled={!newTaskTitle.trim()}
                  >
                    <Text style={styles.sendArrow}>↑</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeDetail}
      >
        <TouchableWithoutFeedback onPress={closeDetail}>
          <View style={styles.detailOverlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                style={{ flex: 1, justifyContent: 'flex-end' }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
              >
                <View style={styles.detailSheet}>
                  {/* Header */}
                  <View style={styles.detailHeader}>
                    <Text style={styles.detailInbox}>{selectedTask?.tag || 'Inbox'}</Text>
                    <TouchableOpacity onPress={closeDetail}>
                      <X size={22} color="#6b7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Título y descripción */}
                  {selectedTask && (
                    <>
                      <Text style={styles.detailTitle}>{selectedTask.title}</Text>
                      <Text style={styles.detailDescription}>{selectedTask.description}</Text>
                    </>
                  )}

                  <View style={styles.separator} />

                  {/* Subtasks (estático por ahora) */}
                  <TouchableOpacity style={styles.subtaskButton}>
                    <Text style={styles.subtaskText}>+ Add Sub-task</Text>
                  </TouchableOpacity>

                  {/* Área AI */}
                  <View style={styles.aiContainer}>
                    <TextInput
                      style={styles.aiInput}
                      placeholder="Ask AI to help you break this task into steps..."
                      placeholderTextColor="#9ca3af"
                      multiline
                    />
                    <TouchableOpacity style={styles.aiButton}>
                      <Sparkles size={20} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
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
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 },
  headerTop: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 12 },
  headerIcon: { marginLeft: 20 },
  title: { fontSize: 36, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  date: { fontSize: 16, fontWeight: '500', color: '#6b7280' },

  // TASKS
  tasksList: { flex: 1, paddingHorizontal: 20 },
  taskWrapper: { marginBottom: 8 },
  taskItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 6 },
  checkbox: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#d1d5db',
    marginRight: 16, marginTop: 4, justifyContent: 'center', alignItems: 'center',
  },
  checkboxCompleted: { backgroundColor: '#f44336', borderColor: '#f44336' },
  checkmark: { width: 8, height: 8, backgroundColor: '#ffffff', borderRadius: 4 },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: '#9ca3af' },
  taskDescription: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  taskDescriptionCompleted: { textDecorationLine: 'line-through', color: '#9ca3af' },
  taskTag: { fontSize: 13, color: '#6b7280', marginTop: 6, alignSelf: 'flex-end' },
  separator: { height: 1, backgroundColor: '#f3f4f6', marginTop: 8, marginLeft: 38 },

  // FAB
  addButton: {
    position: 'absolute', bottom: 80, right: 20,
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#f44336',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4,
  },

  // MODALS
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },

  titleInput: { fontSize: 16, fontWeight: '500', marginBottom: 8, paddingVertical: 6, color: '#111827' },
  descriptionInput: { fontSize: 14, color: '#6b7280', marginBottom: 16, paddingVertical: 6 },

  sendButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#f44336',
    justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end'
  },
  sendButtonDisabled: { backgroundColor: '#d1d5db' },
  sendArrow: { fontSize: 18, color: '#fff', fontWeight: '600' },

  // DETAIL MODAL
  detailOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.1)' },
  detailSheet: { 
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,   // espacio extra
    minHeight: '45%',    // más chico
    maxHeight: '70%'
  },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  detailInbox: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  detailTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  detailDescription: { fontSize: 15, color: '#6b7280', marginBottom: 12 },

  subtaskButton: { paddingVertical: 12 },
  subtaskText: { fontSize: 15, color: '#374151' },

  aiContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 16, 
    marginBottom: 10,   // margen para no pegarse al borde
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 12, 
    paddingHorizontal: 12 
  },
  aiInput: { flex: 1, fontSize: 15, paddingVertical: 8, color: '#111827' },
  aiButton: { marginLeft: 8, backgroundColor: '#f44336', padding: 10, borderRadius: 20 }
});
