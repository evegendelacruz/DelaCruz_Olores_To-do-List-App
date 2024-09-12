import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Empty = () => {
  return (
    <View style={styles.emptySpace}>
      <Image
        source={require("../assets/empty_notes.png")} // Update to correct path if necessary
        style={styles.image}
      />
      <Text style={styles.empty}>No task today!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptySpace: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 140, // Add space between image and text
  },
  empty: {
    fontSize: 16,
    color: "#8A8686",
    textAlign: 'center', // Ensure text is centered
    top:-150,
  },
});

export default Empty;
