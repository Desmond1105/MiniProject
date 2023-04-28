import React from "react";
import { View } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
  Button,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  return (
    <Layout>
      <TopNav
        middleContent="Test Health Module Screen"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.black}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          text="Go to Add Health Data"
          onPress={() => {
            navigation.navigate("HealthData");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Go to View Health Data"
          onPress={() => {
            navigation.navigate("ViewHealthData");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Go to Add Health Photo"
          onPress={() => {
            navigation.navigate("AddHealthPhoto");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Go to View Health Photo"
          onPress={() => {
            navigation.navigate("ShowHealthPhoto");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Go to View Map Screen"
          onPress={() => {
            navigation.navigate("MapScreen");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Go to View Marker Map Screen"
          onPress={() => {
            navigation.navigate("MarkerMapScreen");
          }}
          style={{
            marginTop: 10,
          }}
        />

        <Button
          text="Go to View My Location Screen"
          onPress={() => {
            navigation.navigate("MyLocationScreen");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Go to View Pedometer Screen"
          onPress={() => {
            navigation.navigate("PedometerScreen");
          }}
          style={{
            marginTop: 10,
          }}
        />
      </View>
    </Layout>
  );
}
