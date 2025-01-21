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
const STORAGE_KEY = "TASKS";

const HomeScreen = ({ navigation }) => {
  const [task, setTask] = useState("");
  const [taskItems, setTaskItems] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks(taskItems);
  }, [taskItems]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTaskItems(parsedTasks);
        setCompletedTasks(parsedTasks.filter(task => task.completed));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load tasks!");
    }
  };

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      Alert.alert("Error", "Failed to save tasks!");
    }
  };

  const handleAddTask = () => {
    if (task.trim().length > 0) {
      const newTask = { text: task, completed: false, date: new Date().toLocaleString() };
      setTaskItems([...taskItems, newTask]);
      setTask("");
    } else {
      Alert.alert("Warning", "Task cannot be empty!");
    }
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy[index] = { ...itemsCopy[index], completed: true };
    setCompletedTasks([...completedTasks, itemsCopy[index]]);
    setTaskItems(itemsCopy);
  };

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

  const deleteTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy); // Remove from the main list only
  };

  const filteredTasks = taskItems.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>🌟 To-Do List 🌟</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Search tasks..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <ScrollView style={styles.scrollView}>
        {filteredTasks.length === 0 ? (
          <Empty />
        ) : (
          filteredTasks.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => completeTask(index)}
              onLongPress={() => confirmDeleteTask(index)}
            >
              <TaskComponent
                text={item.text}
                completed={item.completed}
                onPress={() => completeTask(index)}
                date={item.date}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.input}
          placeholder="✍️ Add a task..."
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>➕</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CompletedTasks", { completedTasks })
        }
        style={styles.completedButton}
      >
        <Text style={styles.completedButtonText}>✔️ View Completed Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

const CompletedTasksScreen = ({ route }) => {
  const { completedTasks } = route.params;

  return (
    <View style={styles.completedContainer}>
      <Text style={styles.title}>✅ Completed Tasks</Text>
      <ScrollView style={styles.scrollView}>
        {completedTasks.length === 0 ? (
          <Text style={styles.emptyText}>No completed tasks yet! 😊</Text>
        ) : (
          completedTasks.map((item, index) => (
            <View key={index} style={styles.completedTask}>
              <Text style={styles.completedTaskText}>
                {item.text} {"\n"}<Text style={styles.completedDate}>{item.date}</Text>
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 20,
  },
  completedContainer: {
    flex: 1,
    backgroundColor: "#BBDEFB", // Light blue background
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5, // Adds a subtle shadow effect
   },
   title: {
     fontSize: 28,
     fontWeight: "bold",
     marginBottom: 20,
     textAlign: "center",
     color: "#1E88E5", // Darker blue for title
   },
   searchBar: {
     backgroundColor: "#FFF",
     borderRadius: 10,
     padding: 10,
     marginBottom: 10,
     borderWidth: 1,
     borderColor: "#B3E5FC",
   },
   scrollView: {
     flex: 1,
     marginBottom: 20,
   },
   addTaskContainer: {
     flexDirection: "row",
     alignItems: "center",
     marginVertical: 10,
   },
   input: {
     flex: 1,
     backgroundColor: "#FFF",
     borderRadius: 10,
     padding: 10,
     marginRight: 10,
     borderWidth: 1,
     borderColor: "#B3E5FC",
   },
   addButton: {
     backgroundColor: "#1E88E5",
     borderRadius: 10,
     padding: 10,
   },
   addButtonText: {
     color: "#FFF",
     fontSize: 18,
   },
   completedButton: {
     backgroundColor: "#1976D2",
     padding:10,
     borderRadius :10 ,
     alignItems:"center",
     marginVertical :10 ,
   },
   completedButtonText:{
     color:"#FFF" ,
     fontSize :16 ,
   },
   completedTask:{
     backgroundColor:"#F0F8FF", // Slightly darker blue for task cards
     padding :15,
     marginBottom :15 ,
     borderRadius :10 ,
     shadowColor :"#000" ,
     shadowOffset :{ width :0 , height :2 },
     shadowOpacity :0.3 ,
     shadowRadius :4 ,
     elevation :3 , // Shadow for Android
   },
   completedTaskText:{
     fontSize :16 ,
     color :"#0D47A1" , // Dark blue for task text
     lineHeight :22 , // Improved line height for readability
   },
   completedDate:{
     fontSize :12 ,
     color :"#01579B" , // Lighter blue for date
     fontStyle :"italic" ,
     marginTop :5 , // Space between task text and date
   },
   emptyText:{
     textAlign :"center" ,
     color:"#666" ,
     fontStyle :"italic" ,
     marginTop :50 , // Space above empty message
   },
});
