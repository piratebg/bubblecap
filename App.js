import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConfigScreen from "./screens/ConfigScreen";
import BubbleScreen from "./screens/BubbleScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Config"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Config" component={ConfigScreen} />
        <Stack.Screen name="Bubble" component={BubbleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
