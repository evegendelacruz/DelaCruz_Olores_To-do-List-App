import React from "react";
import { TextInput, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <TextInput
      style={styles.searchBar}
      placeholder="Search here"
      value={searchQuery}
      onChangeText={(text) => setSearchQuery(text)}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    position: "absolute",
    top: 180,
    left: "10%",
    width: "95%",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 20,
    fontSize: 16,
    flexDirection: "row",
  },
});

export default Search;
