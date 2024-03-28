import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import FA5 from 'react-native-vector-icons/FontAwesome5';

const HomeScreen = ({ navigation }) => {
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const tasksString = await AsyncStorage.getItem('tasks');
          const tasks = tasksString ? JSON.parse(tasksString) : [];

          const incomplete = tasks.filter((task) => !task.completed);
          const completed = tasks.filter((task) => task.completed);

          incomplete.sort((a, b) => {
            const dateA = new Date(a.dueDate);
            const dateB = new Date(b.dueDate);
            return dateA - dateB;
          });

          setIncompleteTasks(incomplete);
          setCompletedTasks(completed);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };

      fetchData();

      return () => {
        setIncompleteTasks([]);
        setCompletedTasks([]);
      };
    }, [])
  );
  // Function to mark as complete
  const handleMarkComplete = async (taskId) => {
    try {
      const tasks = [...incompleteTasks, ...completedTasks];
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      );

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setIncompleteTasks(updatedTasks.filter((task) => !task.completed));
      setCompletedTasks(updatedTasks.filter((task) => task.completed));
    } catch (error) {
      console.error('Error marking task as complete:', error);
    }
  };

  // Function to Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      const tasks = [...incompleteTasks, ...completedTasks];
      const updatedTasks = tasks.filter((task) => task.id !== taskId);

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setIncompleteTasks(updatedTasks.filter((task) => !task.completed));
      setCompletedTasks(updatedTasks.filter((task) => task.completed));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };


  const renderItem = ({ item }) => {
    let priorityStyle = null;
    switch (item.priority) {
      case 'High':
        priorityStyle = styles.priorityHigh;
        break;
      case 'Medium':
        priorityStyle = styles.priorityMedium;
        break;
      case 'Low':
        priorityStyle = styles.priorityLow;
        break;
      default:
        priorityStyle = null;
        break;
    }

    const renderButtons = !item.completed ? (
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.checkButton} onPress={() => handleMarkComplete(item.id)}>
          <FA5 name="clipboard-check" size={20} style={styles.checkIcon}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTask(item.id)}>
          <FA5 name="trash" size={20} style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    ) : null;

    return (
      <View style={styles.taskItem}>
        <Text>{item.title}</Text>
        <Text>Due Date: {item.dueDate}</Text>
        <Text style={[styles.priorityText, priorityStyle]}>Priority: {item.priority}</Text>
        {renderButtons}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Incomplete Tasks</Text>
      <FlatList
        data={incompleteTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.header}>Completed Tasks</Text>
      <FlatList
        data={completedTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6FCFC',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign:'center',
  },
  taskItem: {
    backgroundColor: '#d0efef',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  priorityText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  checkButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  checkIcon: {
    color: '#d5716e',
  },
  deleteIcon: {
    color: '#d5716e',
  },
  priorityHigh: {
    color: 'red',
  },
  priorityMedium: {
    color: 'orange',
  },
  priorityLow: {
    color: 'green',
  },
});

export default HomeScreen;
