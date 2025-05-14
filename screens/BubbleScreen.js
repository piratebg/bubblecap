import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import BubbleArena from "../components/BubbleArena";

export default function BubbleScreen({ navigation, route }) {
  const { cryptoCount, bubbleSizeMode } = route.params;
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: parseInt(cryptoCount),
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoins(res.data);
      } catch (error) {
        console.error("Error fetching coins:", error);
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [cryptoCount, bubbleSizeMode]);

  return (
    <View style={styles.container}>
      {loading || !Array.isArray(coins) || coins.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#00A86B" />
        </View>
      ) : (
        <BubbleArena
          coins={coins}
          width={width}
          height={height}
          bubbleSizeMode={bubbleSizeMode}
        />
      )}

      <View style={styles.backButtonOverlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.replace("Config")}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonOverlay: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 999,
  },
  backButton: {
    backgroundColor: "#00A86B",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  backText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
