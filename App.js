import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TaskComponent from "./components/Task";
import Empty from "./components/Empty";

const Stack = createStackNavigator();
const STORAGE_KEY = "TASKS"; // Key for storing tasks in AsyncStorage
const THEME_KEY = "THEME"; // Key for storing theme preference in AsyncStorage

const HomeScreen = ({ navigation, isDarkMode, toggleDarkMode }) => {
  const [task, setTask] = useState(""); // State for the new task input
  const [taskItems, setTaskItems] = useState([]); // State for the list of tasks
  const [completedTasks, setCompletedTasks] = useState([]); // State for completed tasks
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Load tasks from AsyncStorage when the component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever taskItems change
  useEffect(() => {
    saveTasks(taskItems);
  }, [taskItems]);

  // Function to load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTaskItems(parsedTasks);
        setCompletedTasks(parsedTasks.filter(task => task.completed)); // Filter completed tasks
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load tasks!");
    }
  };

  // Function to save tasks to AsyncStorage
  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      Alert.alert("Error", "Failed to save tasks!");
    }
  };

  // Function to handle adding a new task
  const handleAddTask = () => {
    if (task.trim().length > 0) {
      const newTask = { text: task, completed: false, date: new Date().toLocaleString() };
      setTaskItems([...taskItems, newTask]); // Add new task to the list
      setTask(""); // Clear the input field
    } else {
      Alert.alert("Warning", "Task cannot be empty!");
    }
  };

  // Function to toggle task completion (check/uncheck)
  const toggleTaskCompletion = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy[index] = { ...itemsCopy[index], completed: !itemsCopy[index].completed }; // Toggle completion status

    if (itemsCopy[index].completed) {
      setCompletedTasks([...completedTasks, itemsCopy[index]]); // Add to completed tasks if marked as completed
    } else {
      setCompletedTasks(completedTasks.filter(task => task.text !== itemsCopy[index].text)); // Remove from completed tasks if unchecked
    }

    setTaskItems(itemsCopy); // Update the main task list
  };

  // Function to confirm deletion of a task
  const confirmDeleteTask = (index) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => deleteTask(index),
      },
    ]);
  };

  // Function to delete a task
  const deleteTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy); // Remove the task from the list
  };

  // Function to confirm deletion of all tasks
  const deleteAllTasks = () => {
    Alert.alert("Delete All Tasks", "Are you sure you want to delete all tasks?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => setTaskItems([]), // Clear all tasks
      },
    ]);
  };

  // Filter tasks based on the search query
  const filteredTasks = taskItems.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic styles based on dark mode
  const dynamicStyles = getDynamicStyles(isDarkMode);

  return (
    <View style={dynamicStyles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Text style={dynamicStyles.title}>🌟 To-Do List 🌟</Text>

      {/* Search bar and delete all tasks icon */}
      <View style={dynamicStyles.searchContainer}>
        <TextInput
          style={dynamicStyles.searchBar}
          placeholder="🔍 Search tasks..."
          placeholderTextColor={isDarkMode ? "#999" : "#666"}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={deleteAllTasks} style={dynamicStyles.deleteIcon}>
          <Text style={dynamicStyles.deleteIconText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable list of tasks */}
      <ScrollView style={dynamicStyles.scrollView}>
        {filteredTasks.length === 0 ? (
          <Empty isDarkMode={isDarkMode} /> // Show empty state if no tasks match the search
        ) : (
          filteredTasks.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleTaskCompletion(index)} // Toggle task completion on press
              onLongPress={() => confirmDeleteTask(index)} // Confirm deletion on long press
            >
              <TaskComponent
                text={item.text}
                completed={item.completed}
                onPress={() => toggleTaskCompletion(index)}
                date={item.date}
                isDarkMode={isDarkMode}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Add task input and button */}
      <View style={dynamicStyles.addTaskContainer}>
        <TextInput
          style={dynamicStyles.input}
          placeholder="✍️ Add a task..."
          placeholderTextColor={isDarkMode ? "#999" : "#666"}
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity onPress={handleAddTask} style={dynamicStyles.addButton}>
          <Text style={dynamicStyles.addButtonText}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Button to view completed tasks */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CompletedTasks", { 
            completedTasks,
            setCompletedTasks: (newTasks) => setCompletedTasks(newTasks),
            isDarkMode,
          })
        }
        style={dynamicStyles.completedButton}
      >
        <Text style={dynamicStyles.completedButtonText}>✔️ View Completed Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

// Screen to display completed tasks
const CompletedTasksScreen = ({ route }) => {
  const { completedTasks, setCompletedTasks, isDarkMode } = route.params;

  // Function to confirm deletion of all completed tasks
  const handleDeleteAllCompleted = () => {
    Alert.alert("Delete All Completed Tasks", "Are you sure you want to delete all completed tasks?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => setCompletedTasks([]), // Clear completed tasks
      },
    ]);
  };

  // Dynamic styles based on dark mode
  const dynamicStyles = getDynamicStyles(isDarkMode);

  return (
    <View style={dynamicStyles.completedContainer}>
      <Text style={dynamicStyles.title}>✅ Completed Tasks</Text>

      {/* Scrollable list of completed tasks */}
      <ScrollView style={dynamicStyles.scrollView}>
        {completedTasks.length === 0 ? (
          <Text style={dynamicStyles.emptyText}>No completed tasks yet! 😊</Text>
        ) : (
          completedTasks.map((item, index) => (
            <View key={index} style={dynamicStyles.completedTask}>
              <Text style={dynamicStyles.completedTaskText}>
                {item.text} {"\n"}<Text style={dynamicStyles.completedDate}>{item.date}</Text>
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Button to delete all completed tasks */}
      <TouchableOpacity onPress={handleDeleteAllCompleted} style={dynamicStyles.deleteAllButton}>
        <Text style={dynamicStyles.deleteAllButtonText}>🗑️ Delete All Completed Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main App component with navigation
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    const newTheme = !isDarkMode ? "dark" : "light"; // Toggle theme
    setIsDarkMode(!isDarkMode); // Update state
    saveTheme(newTheme); // Save theme preference to AsyncStorage
  };

  // Function to save theme preference to AsyncStorage
  const saveTheme = async (theme) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, theme); // Save theme to AsyncStorage
    } catch (error) {
      Alert.alert("Error", "Failed to save theme preference!"); // Show error if saving fails
    }
  };

  // Load theme preference from AsyncStorage when the app starts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY); // Get stored theme
        if (storedTheme) {
          setIsDarkMode(storedTheme === "dark"); // Set dark mode if stored theme is "dark"
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load theme preference!"); // Show error if loading fails
      }
    };
    loadTheme();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={toggleDarkMode} // Toggle dark mode on press
                style={{
                  backgroundColor: "#1E88E5", // Blue background
                  padding: 10,
                  borderRadius: 10,
                  marginRight: 15,
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 16 }}>
                  {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"} 
                </Text>
              </TouchableOpacity>
            ),
          })}
        >
          {(props) => (
            <HomeScreen
              {...props}
              isDarkMode={isDarkMode} // Pass dark mode state
              toggleDarkMode={toggleDarkMode} // Pass toggle function
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="CompletedTasks"
          component={CompletedTasksScreen}
          options={{ title: "Completed Tasks" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Function to get dynamic styles based on dark mode
const getDynamicStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#121212" : "#E3F2FD", // Dark or light background
      padding: 20,
    },
    completedContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? "#1E1E1E" : "#BBDEFB", // Dark or light background
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      elevation: 5,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: isDarkMode ? "#FFF" : "#1E88E5", // White or dark blue text
    },
    searchContainer: {
      flexDirection: "row", // Align search bar and delete icon horizontally
      alignItems: "center",
      marginBottom: 10,
    },
    searchBar: {
      flex: 1,
      backgroundColor: isDarkMode ? "#333" : "#FFF", // Dark or light background
      borderRadius: 10,
      padding: 10,
      marginRight: 10,
      borderWidth: 1,
      borderColor: isDarkMode ? "#555" : "#B3E5FC", // Dark or light border
      color: isDarkMode ? "#FFF" : "#000", // White or black text
    },
    deleteIcon: {
      backgroundColor: "#ff8080", // Red background for the delete icon
      borderRadius: 11,
      padding: 9,
    },
    deleteIconText: {
      color: "#FFF", // White text for the delete icon
      fontSize: 18,
    },
    scrollView: {
      flex: 1,
      marginBottom: 20,
    },
    addTaskContainer: {
      flexDirection: "row", // Align input and add button horizontally
      alignItems: "center",
      marginVertical: 10,
    },
    input: {
      flex: 1,
      backgroundColor: isDarkMode ? "#333" : "#FFF", // Dark or light background
      borderRadius: 10,
      padding: 13,
      marginRight: 10,
      borderWidth: 1,
      borderColor: isDarkMode ? "#555" : "#B3E5FC", // Dark or light border
      color: isDarkMode ? "#FFF" : "#000", // White or black text
    },
    addButton: {
      backgroundColor: "#1E88E5", // Blue background for the add button
      borderRadius: 10,
      padding: 14,
    },
    addButtonText: {
      color: "#FFF", // White text for the add button
      fontSize: 18,
    },
    completedButton: {
      backgroundColor: "#1976D2", // Darker blue background for the completed tasks button
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      marginVertical: 10,
    },
    completedButtonText: {
      color: "#FFF", // White text for the completed tasks button
      fontSize: 16,
    },
    deleteAllButton: {
      backgroundColor: "#FF5252", // Red background for the delete all button
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
      marginVertical: 10,
    },
    deleteAllButtonText: {
      color: "#FFF", // White text for the delete all button
      fontSize: 16,
    },
    completedTask: {
      backgroundColor: isDarkMode ? "#333" : "#F0F8FF", // Dark or light background
      padding: 15,
      marginBottom: 15,
      borderRadius: 10,
      shadowColor: "#000", // Shadow for the task cards
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3, // Shadow for Android
    },
    completedTaskText: {
      fontSize: 16,
      color: isDarkMode ? "#FFF" : "#0D47A1", // White or dark blue text
      lineHeight: 22, // Improved line height for readability
    },
    completedDate: {
      fontSize: 12,
      color: isDarkMode ? "#999" : "#01579B", // Light gray or light blue for the date
      fontStyle: "italic",
      marginTop: 5, // Space between task text and date
    },
    emptyText: {
      textAlign: "center",
      color: isDarkMode ? "#999" : "#666", // Light gray or gray text for empty state
      fontStyle: "italic",
      marginTop: 50, // Space above empty message
    },
  });