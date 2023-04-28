import React from "react";
import { View, Image } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default function ({ navigation, route }) {
  const { isDarkmode } = useTheme();
  return (
    <Layout>
      <TopNav
        middleContent="Health Photo Detail"
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
        {/* This text using ubuntu font */}
        <Text fontWeight="bold">{route.params.title}</Text>
        <Image
          source={{ uri: route.params.imageURL }}
          style={{
            width: 260,

            height: 300,

            borderWidth: 2,

            borderColor: "#d35647",

            resizeMode: "contain",

            margin: 8,
          }}
        />
        <Text>{route.params.description}</Text>
      </View>
    </Layout>
  );
}
