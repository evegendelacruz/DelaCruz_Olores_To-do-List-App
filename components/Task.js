import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const TaskComponent = (props) => {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <TouchableOpacity onPress={props.onPress}>
          <View
            style={[
              styles.circular,
              {
                backgroundColor: props.completed ? "#4285F4" : "#F9F9F9",
                opacity: props.completed ? 1 : 0.4,
              },
            ]}
          ></View>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.itemText,
              {
                textDecorationLine: props.completed ? "line-through" : "none",
                color: props.completed ? "#888" : "#000",
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {props.text}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#FFFFFF",
    padding: 13,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
    borderColor: "#EEEEEE",
    borderWidth: 1,
    width: '95%',
    height: 50,
    left:8,
    alignSelf: "center",
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%", // Ensures the container uses the full width
  },

  textContainer: {
    flex: 1, // Allows the text container to take up available space
    marginLeft: 10, // Provides spacing between the circular element and the text
  },

  itemText: {
    fontSize: 15,
    flexShrink: 1, // Allows text to shrink if necessary
  },

  circular: {
    width: 22,
    height: 22,
    borderRadius: 100,
    borderColor: "#0058D4",
    borderWidth: 1,
  },
});

export default TaskComponent;
