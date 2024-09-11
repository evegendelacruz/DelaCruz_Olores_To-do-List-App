import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import TaskComponent from "./components/Task";
import Empty from "./components/Empty";

const { width } = Dimensions.get("window");
const backgroundHeight = 162; // Height of the background rectangle

export default function App() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [task, setTask] = useState("");
  const [taskItems, setTaskItems] = useState([]);
  const [isTaskInputVisible, setIsTaskInputVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [charCount, setCharCount] = useState(0); // New state for character count

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentDateTime(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000 * 60);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddTask = () => {
    if (task.length > 0) {
      if (isEditing) {
        let itemsCopy = [...taskItems];
        itemsCopy[editingIndex].text = task;
        setTaskItems(itemsCopy);
        setIsEditing(false);
        setEditingIndex(null);
      } else {
        setTaskItems([...taskItems, { text: task, completed: false }]);
      }
      setTask("");
      setCharCount(0); // Reset character count
      setIsTaskInputVisible(false);
    }
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy[index].completed = !itemsCopy[index].completed;
    setTaskItems(itemsCopy);
  };

  const confirmDeleteTask = (index) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => deleteTask(index) },
      ],
      { cancelable: true }
    );
  };

  const deleteTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  };

  const editTask = (index) => {
    setTask(taskItems[index].text);
    setCharCount(taskItems[index].text.length); // Set initial character count for editing
    setIsTaskInputVisible(true);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const toggleTaskInput = () => {
    setIsTaskInputVisible(!isTaskInputVisible);
    if (!isTaskInputVisible) {
      setIsEditing(false);
      setTask("");
      setCharCount(0); // Reset character count when input is hidden
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.backgroundRect}>
        <Text style={styles.sectionTitle}>To-do List</Text>
        <Text style={styles.sectionTimestamp}>{currentDateTime}</Text>
      </View>

      <View style={styles.container}>
        {taskItems.length === 0 ? (
          <Empty />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {taskItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => editTask(index)}
                onLongPress={() => confirmDeleteTask(index)}
                style={styles.taskContainer}
              >
                <TaskComponent
                  text={item.text}
                  completed={item.completed}
                  onPress={() => completeTask(index)}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {!isTaskInputVisible && (
        <TouchableOpacity onPress={toggleTaskInput} style={styles.addWrapper}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      )}

      {isTaskInputVisible && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeTaskWrapper}
        >
          <View style={styles.taskInputContainer}>
            <TouchableOpacity
              onPress={toggleTaskInput}
              style={styles.closeButtonWrapper}
            >
              <Text style={styles.closeButton}>x</Text>
              <Text style={styles.addTitle}>
                {isEditing ? "Edit to-do" : "New to-do"}
              </Text>
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={"Write here"}
                value={task}
                onChangeText={(text) => {
                  if (text.length <= 90) {
                    setTask(text);
                    setCharCount(text.length); // Update character count
                  }
                }}
                autoFocus={true}
                multiline={true}
              />
              <Text style={styles.charCount}>{charCount}/90</Text>
            </View>

            <TouchableOpacity
              onPress={handleAddTask}
              style={styles.saveButtonWrapper}
            >
              <Text style={styles.saveButton}>
                {isEditing ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E9E9",
  },

  backgroundRect: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: backgroundHeight,
    backgroundColor: "#0058D4",
    paddingHorizontal: 30,
    paddingTop: 49,
    justifyContent: "center",
    zIndex: 1,
  },

  sectionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  sectionTimestamp: {
    fontSize: 13,
    color: "#FFFFFF",
    marginTop: 2,
  },

  scrollContainer: {
    paddingTop: backgroundHeight + 20,
  },

  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  writeTaskWrapper: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  taskInputContainer: {
    position: "absolute",
    width: width,
    height: 300,
    backgroundColor: "#0058D4",
    borderColor: "#E9E9E9",
    borderWidth: 1,
    padding: 15,
    borderRadius: 40,
    flexDirection: "column", // Changed to column to center content vertically
    alignItems: "center",
    justifyContent: "center", // Center content vertically
  },

  closeButtonWrapper: {
    position: "absolute",
    top: 10,
    left: 30,
    borderRadius: 100,
  },

  closeButton: {
    fontSize: 18,
    color: "#FFFFFF",
  },

  addTitle: {
    left: 30,
    top: -22,
    fontSize: 16,
    color: "#FFFFFF",
  },

  inputWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center", // Center the input vertically
  },

  input: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderColor: "#EEEEEE",
    borderWidth: 1,
    width: "95%",
    maxHeight: 120, // Adjusted for scrolling
    textAlignVertical: "top", // Align text to the top of the input box
    top: -70,
  },

  charCount: {
    position: "absolute",
    top: -23,
    right: 19,
    color: "#888888",
    fontSize: 10,
  },

  saveButton: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  saveButtonWrapper: {
    position: "absolute",
    right: 30,
    top: 113,
    borderRadius: 100,
    padding: 10,
  },

  addWrapper: {
    position: "absolute",
    bottom: 40,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    borderColor: "#EEEEEE",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  addText: {
    fontSize: 24,
    color: "#0058D4",
  },
});
