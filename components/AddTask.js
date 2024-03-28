import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import DatePicker from './DatePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AddTask = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskDetail, setTaskDetail] = useState('');
  const [priority, setPriority] = useState('Medium'); // Default priority level
  const [selectedDueDate, setSelectedDueDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const navigation = useNavigation();

  // Function to Add Task
  const handleAddTask = async () => {
    if (task.trim() !== '') {
      const newTask = {
        id: Date.now().toString(),
        title: task,
        detail: taskDetail,
        completed: false,
        priority: priority,
        dueDate: formatDate(selectedDueDate),
      };

      try {
        const updatedTasks = [...tasks, newTask];
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        setTask('');
        setTaskDetail('');

        await AsyncStorage.setItem(
          `taskDates_${newTask.id}`,
          JSON.stringify({
            dueDate: formatDate(selectedDueDate),
          })
        );

      } catch (error) {
        console.error('Error saving task:', error);
      }
    }
  };

  // Function to Edit Task
  const handleEditTask = async () => {
  const updatedTasks = tasks.map((item) =>
    item.id === selectedTaskId
      ? {
          ...item,
          title: task,
          priority: priority,
          detail: taskDetail,
          dueDate: formatDate(selectedDueDate),
        }
      : item
  );

  try {
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    setShowModal(false); // Close the modal after editing
    setTask('');
    setPriority('Medium'); // Reset priority to default after editing
    setSelectedTaskId(null); // Reset selectedTaskId
  } catch (error) {
    console.error('Error editing task:', error);
  }
};

  // Function to mark as complete
  const handleMarkComplete = async (taskId) => {
  const updatedTasks = tasks.map((item) =>
    item.id === taskId ? { ...item, completed: true } : item
    );

  try {
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    console.log("compltet");
    } catch (error) {
      console.error('Error marking task as complete:', error);
    }
  };

  // Function to Delete task
  const handleDeleteTask = async (taskId) => {
    const updatedTasks = tasks.filter((item) => item.id !== taskId);

    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      console.log("deleted");
    } catch (error) {
      console.error('Error saving updated tasks:', error);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Task List</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Task..."
        placeholderTextColor="#000"
        value={task}
        onChangeText={(text) => setTask(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Task Detail..."
        placeholderTextColor="#000"
        value={taskDetail}
        onChangeText={(text) => setTaskDetail(text)}
      />
      {/* Priority Selection */}
      <View style={styles.priorityContainer}>
        <Text style={styles.priorityText}>Priority: </Text>
        <TouchableOpacity onPress={() => setPriority('High')}>
          <Text style={[styles.priorityOption, priority === 'High' && styles.selectedOption]}>High</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPriority('Medium')}>
          <Text style={[styles.priorityOption, priority === 'Medium' && styles.selectedOption]}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPriority('Low')}>
          <Text style={[styles.priorityOption, priority === 'Low' && styles.selectedOption]}>Low</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>Due Date: </Text>
        <DatePicker
          selectedDate={selectedDueDate}
          setSelectedDate={setSelectedDueDate}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>

      <FlatList
        style={styles.listView}
        data={tasks.filter((item) => !item.completed)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
          <View style={styles.informationContainer}>
            <View style={styles.pencilTextView}>
              <FA5 name="tasks" size={20} />
              <Text style={styles.itemTitle}>{item.title}</Text>
              </View>
          <View>
          <Text> Details: {item.detail} </Text>
        </View>
        <View>
          <Text> Priority: {item.priority} </Text>
        </View>
        <View style={styles.itemDate}>
          <Text> Due Date: {item.dueDate} </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
          style={styles.checkButton}
          onPress={() => handleMarkComplete(item.id)}
        >
          <FA5 name="clipboard-check" size={20} style={styles.checkIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setSelectedTaskId(item.id);
            setShowModal(true);// open the modal 
          }}
        >
          <FA5 name="edit" size={20} style={styles.editIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTask(item.id)}
        >
          <FA5 name="trash" size={20} style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    </View>
  )}
/>
      {/* Edit Task Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput
              style={styles.editInput}
              placeholder="Change title here"
              placeholderTextColor="#000"
              value={task}
              onChangeText={(text) => setTask(text)}
            />
            <TextInput
              style={styles.editInput}
              placeholder="Change Details here"
              placeholderTextColor="#000"
              value={taskDetail}
              onChangeText={(text) => setTaskDetail(text)}
            />
            {/* Priority Selection in Modal */}
            <View style={styles.priorityContainer}>
              <Text style={styles.priorityText}>Priority: </Text>
              <TouchableOpacity onPress={() => setPriority('High')}>
                <Text style={[styles.priorityOption, priority === 'High' && styles.selectedOption]}>High</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPriority('Medium')}>
                <Text style={[styles.priorityOption, priority === 'Medium' && styles.selectedOption]}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPriority('Low')}>
                <Text style={[styles.priorityOption, priority === 'Low' && styles.selectedOption]}>Low</Text>
              </TouchableOpacity>
            </View>

            {/* Due Date Selection in Modal */}
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>End Date: </Text>
              <DatePicker
                selectedDate={selectedDueDate}
                setSelectedDate={setSelectedDueDate}
              />
            </View>
            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleEditTask(selectedTaskId)}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6FCFC',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '80%',
    padding: 10,
    color: 'black',
  },
  addButton: {
    backgroundColor: '#d5716e',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: 250,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F6FCFC',
    borderWidth: 1,
    borderRadius: 8,
  },
  informationContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F6FCFC',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#F6FCFC',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  checkButton: {
    backgroundColor: '#F6FCFC',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteIcon: {
    color: '#d5716e',
  },
  editIcon: {
    color: '#d5716e',
  },
  checkIcon: {
    color: '#d5716e',
  },
  listView: {
    width: '100%',
    backgroundColor: '#F6FCFC',
  },
  dateContainer: {
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  pencilTextView: {
    flexDirection: 'row',

  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  itemDate: {
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  editInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
    padding: 10,
    color: 'black',

  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  priorityOption: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 10,
  },
  selectedOption: {
    backgroundColor: '#d5716e',
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#d5716e',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#d5716e',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
});

export default AddTask;
