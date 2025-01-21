import React, { useState } from "react"; // Import React and useState for managing state
import { StatusBar } from "expo-status-bar"; // Expo's status bar component
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native"; // Core React Native components
import { NavigationContainer } from "@react-navigation/native"; // Navigation container for managing screens
import { createStackNavigator } from "@react-navigation/stack"; // Stack navigator for screen navigation
import TaskComponent from "./components/Task"; // Custom task component
import Empty from "./components/Empty"; // Custom empty state component

const Stack = createStackNavigator(); // Create a stack navigator instance

// Home screen for managing tasks
const HomeScreen = ({ navigation }) => {
  const [task, setTask] = useState(""); // State for new task input
  const [taskItems, setTaskItems] = useState([]); // State for storing task list
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // Add a new task to the list
  const handleAddTask = () => {
    if (task.length > 0) {
      setTaskItems([...taskItems, { text: task, completed: false }]);
      setTask(""); // Clear the input field
    }
  };

  // Mark a task as completed or incomplete
  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy[index] = {
      ...itemsCopy[index], // Spread the existing task properties
      completed: !itemsCopy[index].completed, // Toggle the `completed` property
    };
    setTaskItems(itemsCopy);
  };

  // Delete a task from the list
  const deleteTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  };

  // Filter tasks based on the search query
  const filteredTasks = taskItems.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>To-Do List</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search here"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Task List */}
      <ScrollView style={styles.scrollView}>
        {filteredTasks.length === 0 ? (
          <Empty />
        ) : (
          filteredTasks.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => completeTask(index)}
              onLongPress={() => deleteTask(index)}
            >
              <TaskComponent
                text={item.text}
                completed={item.completed}
                onPress={() => completeTask(index)}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Add Task Input */}
      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Navigate to Completed Tasks */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CompletedTasks", { taskItems: taskItems })
        }
        style={styles.completedButton}
      >
        <Text style={styles.completedButtonText}>View Completed Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

// Completed Tasks screen
const CompletedTasksScreen = ({ route }) => {
  const { taskItems } = route.params; // Get task data from navigation route
  const completedTasks = taskItems.filter((task) => task.completed); // Filter completed tasks

  return (
    <View style={styles.completedContainer}>
      <Text style={styles.title}>Completed Tasks</Text>
      <ScrollView style={styles.scrollView}>
        {completedTasks.length === 0 ? (
          <Text style={styles.emptyText}>No completed tasks yet!</Text>
        ) : (
          completedTasks.map((item, index) => (
            <View key={index} style={styles.completedTask}>
              <Text style={styles.completedTaskText}>{item.text}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

// Main App component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="CompletedTasks"
          component={CompletedTasksScreen}
          options={{ title: "Completed Tasks" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Style definitions for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E9E9", // Light gray background
    padding: 20, // Space around the content
  },
  completedContainer: {
    flex: 1,
    backgroundColor: "#dce9f5", // Light blue background
    padding: 20, // Space around the content
  },
  title: {
    fontSize: 24, // Large text
    fontWeight: "bold", // Bold font
    marginBottom: 10, // Space below
  },
  searchBar: {
    backgroundColor: "#FFF", // White background
    borderRadius: 10, // Rounded corners
    padding: 10, // Inner padding
    marginBottom: 10, // Space below
  },
  scrollView: {
    flex: 1,
    marginBottom: 20, // Space below
  },
  addTaskContainer: {
    flexDirection: "row", // Horizontal layout
    alignItems: "center", // Center items vertically
    marginVertical: 10, // Space above and below
  },
  input: {
    flex: 1, // Take up remaining space
    backgroundColor: "#FFF", // White background
    borderRadius: 10, // Rounded corners
    padding: 10, // Inner padding
    marginRight: 10, // Space to the right
  },
  addButton: {
    backgroundColor: "#0058D4", // Blue background
    borderRadius: 10, // Rounded corners
    padding: 10, // Inner padding
  },
  addButtonText: {
    color: "#FFF", // White text
    fontSize: 18, // Large font
  },
  completedButton: {
    backgroundColor: "#0058D4", // Blue background
    padding: 10, // Inner padding
    borderRadius: 10, // Rounded corners
    alignItems: "center", // Center text
    marginVertical: 10, // Space above and below
  },
  completedButtonText: {
    color: "#FFF", // White text
    fontSize: 16, // Medium font
  },
  completedTask: {
    backgroundColor: "#a8c8f0", // Light blue background for completed tasks
    padding: 10, // Inner padding
    marginBottom: 10, // Space below
    borderRadius: 5, // Rounded corners
  },
  completedTaskText: {
    fontSize: 16, // Medium font
    color: "#003366", // Darker blue text
  },
  emptyText: {
    textAlign: "center", // Center text
    color: "#666", // Gray text
  },
});
