import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";

const SingleSelect = ({ data, onSelect, placeholder = "NSW" }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setModalVisible(false);
    onSelect(item);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.selectButtonLabel}>Location</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectButtonText}>
            {selectedItem ? selectedItem.label : placeholder}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
            />
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
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  selectButtonLabel: {
    fontSize: 16,
    marginRight: 16,
  },
  selectButton: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: "#006bb5",
    alignItems: "center",
    justifyContent: "center",
    width: 150,
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
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
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
});

export default SingleSelect;
