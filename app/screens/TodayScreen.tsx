import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, 
  KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Keyboard,
  Dimensions, Animated
} from 'react-native';
import { useState, useRef } from 'react';
import { Plus, Menu, MoveHorizontal as MoreHorizontal, Calendar, Flag, Bell, Inbox, Undo2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

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
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Today');

  // Undo state
  const [showUndo, setShowUndo] = useState(false);
  const [lastCompleted, setLastCompleted] = useState<Task | null>(null);
  const undoAnim = useRef(new Animated.Value(0)).current;
  let undoTimer: NodeJS.Timeout;

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // marcar completada
    setTasks(tasks.filter(t => t.id !== id));
    setLastCompleted(task);

    // mostrar undo
    setShowUndo(true);
    Animated.timing(undoAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // ocultar después de 3s
    undoTimer = setTimeout(() => {
      Animated.timing(undoAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setShowUndo(false));
    }, 3000);
  };

  const handleUndo = () => {
    if (lastCompleted) {
      setTasks(prev => [...prev, lastCompleted]);
      setLastCompleted(null);
    }
    clearTimeout(undoTimer);
    Animated.timing(undoAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowUndo(false));
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
            
            {/* Checkbox + Title */}
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
                onPress={() => toggleTask(task.id)}
              >
                {task.completed && <View style={styles.checkmark} />}
              </TouchableOpacity>
              <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                {task.title} {task.emoji}
              </Text>
            </View>

            {/* Description */}
            <Text style={[styles.taskDescription, task.completed && styles.taskDescriptionCompleted]}>
              {task.description}
            </Text>

            {/* Tag */}
            <View style={styles.tagRow}>
              <Text style={styles.taskTag}>{task.tag}</Text>
            </View>

            {/* Separator */}
            <View style={styles.separator} />
          </View>
        ))}
      </ScrollView>

      {/* Undo Snackbar */}
      {showUndo && (
        <Animated.View 
          style={[
            styles.undoContainer,
            {
              opacity: undoAnim,
              transform: [
                { translateX: undoAnim.interpolate({ inputRange: [0,1], outputRange: [-200, 0] }) }
              ]
            }
          ]}
        >
          <TouchableOpacity onPress={handleUndo} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Undo2 size={18} color="#dc2626" style={{ marginRight: 6 }} />
            <View>
              <Text style={styles.undoText}>Undo</Text>
              <Text style={styles.undoSubText}>Completed</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* FAB */}
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

                  {/* Input título */}
                  <TextInput
                    style={styles.titleInput}
                    placeholder="e.g., Replace lightbulb tomorrow at 3pm..."
                    value={newTaskTitle}
                    onChangeText={setNewTaskTitle}
                    autoFocus
                  />

                  {/* Input descripción */}
                  <TextInput
                    style={styles.descriptionInput}
                    placeholder="Description"
                    value={newTaskDescription}
                    onChangeText={setNewTaskDescription}
                    multiline
                  />

                  {/* Categorías */}
                  <View style={styles.categoryButtons}>
                    <TouchableOpacity style={styles.categoryChip}>
                      <Calendar size={16} color={selectedCategory === 'Today' ? '#0f7b3e' : '#6b7280'} style={{marginRight: 6}} />
                      <Text style={[styles.categoryChipText, selectedCategory === 'Today' && {color: '#0f7b3e'}]}>Today</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.categoryChip}>
                      <Flag size={16} color="#6b7280" style={{marginRight: 6}} />
                      <Text style={styles.categoryChipText}>Priority</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.categoryChip}>
                      <Bell size={16} color="#6b7280" style={{marginRight: 6}} />
                      <Text style={styles.categoryChipText}>Reminders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.categoryChip}>
                      <Text style={styles.categoryChipText}>...</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Separador */}
                  <View style={styles.separator} />

                  {/* Selector Inbox + botón enviar */}
                  <View style={styles.bottomRow}>
                    <TouchableOpacity style={styles.dropdown}>
                      <Inbox size={18} color="#6b7280" style={{marginRight: 6}} />
                      <Text style={styles.dropdownText}>Inbox ▼</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.sendButton, !newTaskTitle.trim() && styles.sendButtonDisabled]}
                      onPress={addTask}
                      disabled={!newTaskTitle.trim()}
                    >
                      <Text style={styles.sendArrow}>↑</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
    paddingVertical: 12,
    marginBottom: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#d1d5db',
    marginRight: 12, marginTop: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxCompleted: { backgroundColor: '#f44336', borderColor: '#f44336' },
  checkmark: { width: 8, height: 8, backgroundColor: '#ffffff', borderRadius: 4 },
  taskTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: '#9ca3af' },
  taskDescription: { fontSize: 14, color: '#6b7280', marginLeft: 34, marginTop: 2 },
  taskDescriptionCompleted: { textDecorationLine: 'line-through', color: '#9ca3af' },
  tagRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4, marginLeft: 34 },
  taskTag: { fontSize: 13, color: '#6b7280' },
  separator: { height: 1, backgroundColor: '#f3f4f6', marginTop: 8, marginLeft: 34 },

  // FAB
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#f44336',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4,
  },

  // UNDO
  undoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  undoText: { fontSize: 16, fontWeight: '600', color: '#dc2626' },
  undoSubText: { fontSize: 13, color: '#6b7280' },

  // MODAL
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxWidth: width,
    alignSelf: 'center',
    width: '100%',
  },
  titleInput: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    paddingVertical: 6,
    color: '#111827',
  },
  descriptionInput: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    paddingVertical: 6,
  },
  categoryButtons: { flexDirection: 'row', marginBottom: 12 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db',
    marginRight: 8,
  },
  categoryChipText: { fontSize: 14, color: '#374151' },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dropdown: { flexDirection: 'row', alignItems: 'center' },
  dropdownText: { fontSize: 15, color: '#374151' },
  sendButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#f44336',
    justifyContent: 'center', alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#d1d5db' },
  sendArrow: { fontSize: 18, color: '#fff', fontWeight: '600' },
});
