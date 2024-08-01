import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

import NumberText from "../components/NumberText";

const RenderItem = ({ item, jurisdiction }) => (
  <View style={styles.grid_row}>
    <Text
      style={styles.grid_row_title}
    >{`Game ${item["game-number"]} (${jurisdiction})`}</Text>
    <View style={styles.filteredNumbers}>
      {item.draw.map((item, idx, arr) => (
        <NumberText key={idx} value={item} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  grid_row: {
    borderTopWidth: 2,
    borderStyle: "solid",
    borderColor: "#9CB1B6",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 12,
    marginHorizontal: 6,
    backgroundColor: "#EEFBF8",
  },
  grid_row_title: {
    fontSize: 24,
    color: "#107FBE",
  },
  filteredNumbers: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  flatList: {},
});
export default RenderItem;
