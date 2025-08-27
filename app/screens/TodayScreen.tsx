import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, 
  KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Keyboard,
  Dimensions, Animated
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Plus, TrendingUp, Calendar, Flag, Bell, Inbox, Undo2, Sparkles, X, ChevronRight, Check, ChevronDown } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

// Modal heights
const COLLAPSED_HEIGHT = height * 0.4; // 40% of screen
const EXPANDED_HEIGHT = height * 0.85;  // 85% of screen

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  isCompleting?: boolean;
  fadeAnim?: Animated.Value;
  emoji: string;
  category: string;
  tag: string;
  subTasks: SubTask[];
}

export default function TodayScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Work',
      description: 'Trabajar',
      completed: false,
      emoji: '💻👨‍💼',
      category: 'Today',
      tag: 'Home 🏠',
      subTasks: []
    },
    {
      id: '2',
      title: 'Surf',
      description: 'Ir a surfear a la tarde',
      completed: false,
      emoji: '🏄‍♂️',
      category: 'Today',
      tag: 'Inbox 📥',
      subTasks: [
        { id: 'sub1', title: 'Test', completed: false }
      ]
    }
  ]);

  // Initialize animations for existing tasks
  useEffect(() => {
    setTasks(prev => prev.map(task => ({
      ...task,
      fadeAnim: task.fadeAnim || new Animated.Value(1)
    })));
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Today');

  // Undo state
  const [showUndo, setShowUndo] = useState(false);
  const [lastCompleted, setLastCompleted] = useState<Task | null>(null);
  const undoAnim = useRef(new Animated.Value(0)).current;
  let undoTimer: NodeJS.Timeout;

  // Detail modal state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [tempDescription, setTempDescription] = useState('');

  // Modal animation state
  const modalHeight = useSharedValue(COLLAPSED_HEIGHT);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sub-task modal state
  const [showSubTaskModal, setShowSubTaskModal] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [showSubTasks, setShowSubTasks] = useState(true);

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // First, mark as completing (orange with white check)
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, isCompleting: true } : t
    ));

    // After 500ms, start slide up and fade out animation
    setTimeout(() => {
      if (task.fadeAnim) {
        Animated.timing(task.fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Remove task after animation completes
          setTasks(prev => prev.filter(t => t.id !== id));
          setLastCompleted(task);

          setShowUndo(true);
          Animated.timing(undoAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }).start();

          undoTimer = setTimeout(() => {
            Animated.timing(undoAnim, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }).start(() => setShowUndo(false));
          }, 3000);
        });
      }
    }, 500);
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subTasks: task.subTasks.map(subTask =>
            subTask.id === subTaskId 
              ? { ...subTask, completed: !subTask.completed }
              : subTask
          )
        };
      }
      return task;
    }));

    // Update selected task if it's the one being modified
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? {
        ...prev,
        subTasks: prev.subTasks.map(subTask =>
          subTask.id === subTaskId 
            ? { ...subTask, completed: !subTask.completed }
            : subTask
        )
      } : null);
    }
  };

  const handleUndo = () => {
    if (lastCompleted) {
      const restoredTask = {
        ...lastCompleted,
        isCompleting: false,
        fadeAnim: new Animated.Value(1)
      };
      setTasks(prev => [...prev, restoredTask]);
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
        tag: 'Inbox 📥',
        fadeAnim: new Animated.Value(1),
        subTasks: []
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setShowAddModal(false);
    }
  };

  const addSubTask = () => {
    if (newSubTaskTitle.trim() && selectedTask) {
      const newSubTask: SubTask = {
        id: Date.now().toString(),
        title: newSubTaskTitle,
        completed: false
      };

      // Update tasks array
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, subTasks: [...task.subTasks, newSubTask] }
          : task
      ));

      // Update selected task
      setSelectedTask(prev => prev ? {
        ...prev,
        subTasks: [...prev.subTasks, newSubTask]
      } : null);

      setNewSubTaskTitle('');
      setShowSubTaskModal(false);
    }
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setTempTitle(task.title);
    setTempDescription(task.description);
    setIsExpanded(false);
    modalHeight.value = COLLAPSED_HEIGHT;
    setShowDetailModal(true);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
    setShowDetailModal(false);
    setEditingTitle(false);
    setEditingDescription(false);
    setIsExpanded(false);
    modalHeight.value = COLLAPSED_HEIGHT;
  };

  const startEditingTitle = () => {
    setEditingTitle(true);
    setTempTitle(selectedTask?.title || '');
  };

  const startEditingDescription = () => {
    setEditingDescription(true);
    setTempDescription(selectedTask?.description || '');
  };

  const saveTitle = () => {
    if (selectedTask && tempTitle.trim()) {
      // Update tasks array
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, title: tempTitle.trim() }
          : task
      ));

      // Update selected task
      setSelectedTask(prev => prev ? { ...prev, title: tempTitle.trim() } : null);
    }
    setEditingTitle(false);
  };

  const saveDescription = () => {
    if (selectedTask) {
      // Update tasks array
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, description: tempDescription.trim() }
          : task
      ));

      // Update selected task
      setSelectedTask(prev => prev ? { ...prev, description: tempDescription.trim() } : null);
    }
    setEditingDescription(false);
  };

  const handleContinue = () => {
    router.push('/(tabs)');
  };

  const formatDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${day} ${month} • ${weekday}`;
  };

  const getCompletedSubTasksCount = (subTasks: SubTask[]) => {
    return subTasks.filter(st => st.completed).length;
  };

  // Gesture handler for modal
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newHeight = modalHeight.value - event.translationY;
      modalHeight.value = Math.max(COLLAPSED_HEIGHT, Math.min(EXPANDED_HEIGHT, newHeight));
    })
    .onEnd((event) => {
      const velocity = -event.velocityY;
      const currentHeight = modalHeight.value;
      
      // Determine target based on velocity and current position
      let targetHeight = COLLAPSED_HEIGHT;
      let targetExpanded = false;
      
      if (velocity > 500) {
        // Fast upward swipe - expand
        targetHeight = EXPANDED_HEIGHT;
        targetExpanded = true;
      } else if (velocity < -500) {
        // Fast downward swipe - collapse
        targetHeight = COLLAPSED_HEIGHT;
        targetExpanded = false;
      } else {
        // Slow swipe - snap to nearest
        const midPoint = (COLLAPSED_HEIGHT + EXPANDED_HEIGHT) / 2;
        if (currentHeight > midPoint) {
          targetHeight = EXPANDED_HEIGHT;
          targetExpanded = true;
        } else {
          targetHeight = COLLAPSED_HEIGHT;
          targetExpanded = false;
        }
      }
      
      modalHeight.value = withSpring(targetHeight, {
        damping: 20,
        stiffness: 300,
      });
      
      runOnJS(setIsExpanded)(targetExpanded);
    });

  // Animated styles
  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      height: modalHeight.value,
    };
  });

  const animatedHandleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      modalHeight.value,
      [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
      [0.3, 0.6],
      Extrapolate.CLAMP
    );
    return {
      opacity,
    };
  });
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TrendingUp size={24} color="#f97316" />
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue to app →</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.date}>{formatDate()}</Text>
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
        {tasks.map((task) => (
          <Animated.View
            key={task.id}
            style={[
              styles.taskItem,
              {
                opacity: task.fadeAnim || 1
              }
            ]}
          >
            <TouchableOpacity onPress={() => openTaskDetail(task)}>
              {/* Checkbox + Title */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={[
                    styles.checkbox, 
                    task.completed && styles.checkboxCompleted,
                    task.isCompleting && styles.checkboxCompleting
                  ]}
                  onPress={() => toggleTask(task.id)}
                >
                  {(task.completed || task.isCompleting) && (
                    <Check size={12} color="#ffffff" strokeWidth={3} />
                  )}
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
            </TouchableOpacity>
          </Animated.View>
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

                  <View style={styles.separator} />

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
              <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.detailSheet, animatedModalStyle]}>
                  {/* Drag Handle */}
                  <Animated.View style={[styles.dragHandle, animatedHandleStyle]} />
                  
                  <KeyboardAvoidingView
                    style={styles.detailContent}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                  >
                    <View style={styles.detailHeader}>
                      <Text style={styles.detailTag}>{selectedTask?.tag || 'Inbox'}</Text>
                      <TouchableOpacity onPress={closeTaskDetail}>
                        <X size={22} color="#6b7280" />
                      </TouchableOpacity>
                    </View>

                    {/* Editable Title */}
                    {editingTitle ? (
                      <TextInput
                        style={styles.editTitleInput}
                        value={tempTitle}
                        onChangeText={setTempTitle}
                        onBlur={saveTitle}
                        onSubmitEditing={saveTitle}
                        autoFocus
                        multiline
                      />
                    ) : (
                      <TouchableOpacity onPress={startEditingTitle}>
                        <Text style={styles.detailTitle}>{selectedTask?.title}</Text>
                      </TouchableOpacity>
                    )}

                    {/* Editable Description */}
                    {editingDescription ? (
                      <TextInput
                        style={styles.editDescriptionInput}
                        value={tempDescription}
                        onChangeText={setTempDescription}
                        onBlur={saveDescription}
                        onSubmitEditing={saveDescription}
                        autoFocus
                        multiline
                        placeholder="Add description..."
                      />
                    ) : (
                      <TouchableOpacity onPress={startEditingDescription}>
                        <Text style={styles.detailDescription}>
                          {selectedTask?.description || 'Add description...'}
                        </Text>
                      </TouchableOpacity>
                    )}

                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                      {/* Sub-tasks Section */}
                      {selectedTask && selectedTask.subTasks.length > 0 && (
                        <View style={styles.subTasksSection}>
                          <TouchableOpacity 
                            style={styles.subTasksHeader}
                            onPress={() => setShowSubTasks(!showSubTasks)}
                          >
                            <Text style={styles.subTasksTitle}>
                              Sub-tasks {getCompletedSubTasksCount(selectedTask.subTasks)}/{selectedTask.subTasks.length}
                            </Text>
                            <ChevronDown 
                              size={20} 
                              color="#6b7280" 
                              style={{ 
                                transform: [{ rotate: showSubTasks ? '0deg' : '-90deg' }] 
                              }} 
                            />
                          </TouchableOpacity>

                          {showSubTasks && selectedTask.subTasks.map((subTask) => (
                            <View key={subTask.id} style={styles.subTaskItem}>
                              <TouchableOpacity
                                style={[
                                  styles.subTaskCheckbox,
                                  subTask.completed && styles.subTaskCheckboxCompleted
                                ]}
                                onPress={() => toggleSubTask(selectedTask.id, subTask.id)}
                              >
                                {subTask.completed && (
                                  <Check size={12} color="#ffffff" strokeWidth={3} />
                                )}
                              </TouchableOpacity>
                              <Text style={[
                                styles.subTaskText,
                                subTask.completed && styles.subTaskTextCompleted
                              ]}>
                                {subTask.title}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Add Sub-task Button */}
                      <TouchableOpacity 
                        style={styles.addSubTaskButton}
                        onPress={() => setShowSubTaskModal(true)}
                      >
                        <Plus size={18} color="#dc2626" />
                        <Text style={styles.addSubTaskText}>Add Sub-task</Text>
                      </TouchableOpacity>
                    </ScrollView>

                    {isExpanded && (
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
                    )}
                  </KeyboardAvoidingView>
                </Animated.View>
              </GestureDetector>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Add Sub-task Modal */}
      <Modal
        visible={showSubTaskModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSubTaskModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSubTaskModal(false)}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              style={{ flex: 1, justifyContent: 'flex-end' }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.subTaskModalSheet}>
                  <View style={styles.subTaskModalHeader}>
                    <Text style={styles.subTaskModalTitle}>Add Sub-task</Text>
                    <TouchableOpacity onPress={() => setShowSubTaskModal(false)}>
                      <X size={22} color="#6b7280" />
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.subTaskTitleInput}
                    placeholder="Sub-task title..."
                    value={newSubTaskTitle}
                    onChangeText={setNewSubTaskTitle}
                    autoFocus
                  />

                  <View style={styles.subTaskModalButtons}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => setShowSubTaskModal(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.addButton2, !newSubTaskTitle.trim() && styles.addButtonDisabled]}
                      onPress={addSubTask}
                      disabled={!newSubTaskTitle.trim()}
                    >
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  // HEADER
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  continueButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f97316',
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f97316',
  },
  title: { fontSize: 36, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  quote: { fontSize: 18, fontStyle: 'italic', color: '#6b7280', marginBottom: 4 },
  date: { fontSize: 16, fontWeight: '500', color: '#6b7280' },

  // TASKS
  tasksList: { flex: 1, paddingHorizontal: 20 },
  taskItem: { paddingVertical: 12, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#d1d5db',
    marginRight: 12, marginTop: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxCompleted: { backgroundColor: '#f44336', borderColor: '#f44336' },
  checkboxCompleting: { backgroundColor: '#f97316', borderColor: '#f97316' },
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
    position: 'absolute', bottom: 20, right: 20,
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#f44336',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4,
  },

  // UNDO
  undoContainer: {
    position: 'absolute', bottom: 20, left: 20, right: 100,
    backgroundColor: '#fff', borderRadius: 12,
    paddingVertical: 10, paddingHorizontal: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  undoText: { fontSize: 16, fontWeight: '600', color: '#dc2626' },
  undoSubText: { fontSize: 13, color: '#6b7280' },

  // MODAL ADD
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40, maxWidth: width, alignSelf: 'center',  width: '100%' },
  titleInput: { fontSize: 16, fontWeight: '500', marginBottom: 8, paddingVertical: 6, color: '#111827' },
  descriptionInput: { fontSize: 14, color: '#6b7280', marginBottom: 16, paddingVertical: 6 },
  categoryButtons: { flexDirection: 'row', marginBottom: 12 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', marginRight: 8 },
  categoryChipText: { fontSize: 14, color: '#374151' },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,  
  },
  dropdown: { flexDirection: 'row', alignItems: 'center' },
  dropdownText: { fontSize: 15, color: '#374151' },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f44336', justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: '#d1d5db' },
  sendArrow: { fontSize: 18, color: '#fff', fontWeight: '600' },

  // MODAL DETAIL
  detailOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.1)' },
  detailSheet: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16, 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  detailContent: {
    flex: 1,
    padding: 20,
  },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailTag: { fontSize: 14, color: '#6b7280' },
  detailTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  detailDescription: { fontSize: 16, color: '#6b7280', marginBottom: 16 },
  editTitleInput: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 6, 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 8, 
    padding: 8,
    minHeight: 40
  },
  editDescriptionInput: { 
    fontSize: 16, 
    color: '#6b7280', 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 8, 
    padding: 8,
    minHeight: 40
  },

  // SUB-TASKS
  subTasksSection: { marginBottom: 20 },
  subTasksHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12,
    paddingVertical: 8
  },
  subTasksTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  subTaskItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 8,
    marginLeft: 8
  },
  subTaskCheckbox: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  subTaskCheckboxCompleted: { backgroundColor: '#f44336', borderColor: '#f44336' },
  subTaskText: { fontSize: 16, color: '#1a1a1a', flex: 1 },
  subTaskTextCompleted: { textDecorationLine: 'line-through', color: '#9ca3af' },
  addSubTaskButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    marginLeft: 8
  },
  addSubTaskText: { fontSize: 16, color: '#dc2626', marginLeft: 8, fontWeight: '500' },

  // SUB-TASK MODAL
  subTaskModalSheet: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    padding: 20, 
    paddingBottom: 40 
  },
  subTaskModalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  subTaskModalTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  subTaskTitleInput: { 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 20,
    minHeight: 44
  },
  subTaskModalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 12 
  },
  cancelButton: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 8 
  },
  cancelButtonText: { fontSize: 16, color: '#6b7280' },
  addButton2: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 8, 
    backgroundColor: '#f44336' 
  },
  addButtonDisabled: { backgroundColor: '#d1d5db' },
  addButtonText: { fontSize: 16, color: '#ffffff', fontWeight: '500' },

  aiContainer: { flexDirection: 'row', alignItems: 'flex-end', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 8, marginTop: 12 },
  aiInput: { flex: 1, fontSize: 15, minHeight: 60, textAlignVertical: 'top', paddingHorizontal: 8 },
  magicButton: { padding: 8 },
});