import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import NumberText2 from "./NumberText2";

const RateModal = ({ data, count = "50" }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const ratedDraw = Array.from({ length: 80 }, (_, idx) => [idx + 1, 0]);

  const validCount = useMemo(() => {
    const parsedCount = parseInt(count, 10);
    return isNaN(parsedCount) ? 50 : parsedCount;
  }, [count]);

  data.slice(0, validCount).forEach((item) => {
    item.draw.forEach((value) => {
      ratedDraw[value - 1] = [value, ratedDraw[value - 1][1] + 1];
    });
  });
  ratedDraw.sort((a, b) => b[1] - a[1]);

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectButtonText}>Rate</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View>
              <Text
                style={styles.modalTitle}
              >{`Occurrences of each number in the most recent ${validCount} rounds`}</Text>
            </View>
            <View style={styles.filteredNumbers}>
              {ratedDraw.map((item, idx) => (
                <NumberText2 key={idx} value={item[0]} rate={item[1]} />
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectButtonLabel: {
    fontSize: 16,
    marginRight: 16,
  },
  selectButton: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: "#00843d",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
  },
  selectButtonText: {
    fontSize: 16,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize:28,
    color: "#007BFF",
    textAlign:"center",
    marginBottom: 8
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemText: {
    fontSize: 16,
  },
  closeButton: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
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
  filteredNumbers: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  flatList: {},
});

export default RateModal;
