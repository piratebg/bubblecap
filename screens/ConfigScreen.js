import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function ConfigScreen({ navigation }) {
  const [cryptoCount, setCryptoCount] = useState("20");
  const [bubbleSizeMode, setBubbleSizeMode] = useState("market_cap");
  const [aboutVisible, setAboutVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>BubbleCap App</Text>
      <Text style={styles.bodyText}>
        This is a crypto data aggregation and visualizing app.
      </Text>
      <Text style={[styles.bodyText, { fontWeight: "bold" }]}>Settings</Text>
      <Text style={styles.label}>Number of Coins</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={cryptoCount}
          onValueChange={setCryptoCount}
          mode="dropdown"
          style={styles.picker}
          dropdownIconColor="black"
        >
          <Picker.Item label="10" value="10" color="black" />
          <Picker.Item label="20" value="20" color="black" />
          <Picker.Item label="30" value="30" color="black" />
          <Picker.Item label="40" value="40" color="black" />
          <Picker.Item label="50" value="50" color="black" />
        </Picker>
      </View>

      <Text style={styles.label}>Bubble Size Criteria</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={bubbleSizeMode}
          onValueChange={setBubbleSizeMode}
          mode="dropdown"
          style={styles.picker}
          dropdownIconColor="black"
        >
          <Picker.Item label="Market Cap" value="market_cap" color="black" />
          <Picker.Item label="24h % Change" value="change_24h" color="black" />
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.applyButton}
        onPress={() =>
          navigation.replace("Bubble", {
            cryptoCount,
            bubbleSizeMode,
          })
        }
      >
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.aboutButton}
        onPress={() => setAboutVisible(true)}
      >
        <Text style={styles.aboutText}>About Me</Text>
      </TouchableOpacity>

      <Modal
        visible={aboutVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAboutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>About the Developer</Text>
              <Text style={styles.modalText}>
                I am Rajan. BubbleCap was built using React Native (Expo) and
                the CoinGecko API.
                {"\n\n"}Send feedback or bug reports to: rjentenergy@gmail.com
              </Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setAboutVisible(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    paddingTop: Platform.OS === "android" ? 50 : 60,
  },
  heading: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    color: "black",
    fontSize: 14,
    marginBottom: 4,
  },
  pickerWrapper: {
    borderColor: "#00A86B",
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    marginBottom: 20,
  },
  picker: {
    color: "black",
    height: 56,
    fontSize: 16,
    paddingVertical: 8,
    width: "100%",
  },
  applyButton: {
    backgroundColor: "#00A86B",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 10,
  },
  applyText: {
    color: "white",
    fontWeight: "bold",
  },
  aboutButton: {
    backgroundColor: "#444",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  aboutText: {
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00A86B",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "white",
    lineHeight: 20,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#00A86B",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
  bodyText: {
    fontSize: 14,
    color: "black",
    marginBottom: 10,
  },
});
