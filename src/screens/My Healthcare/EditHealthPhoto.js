import React, { useState } from "react";

import {
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  View,
  Platform,
  ScrollView,
  Keyboard,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";

import {
  Layout,
  TopNav,
  Text,
  TextInput,
  Button,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";

import { Ionicons } from "@expo/vector-icons";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";

export default function ({ navigation, route }) {
  const { isDarkmode } = useTheme();

  const [imageURL, setImageURL] = useState(route.params.imageURL);

  const [title, setTitle] = useState(route.params.title);

  const [description, setDescription] = useState(route.params.description);

  const [loading, setLoading] = useState(false);

  console.log(route.params.key);

  const emptyState = () => {
    setTitle("");

    setDescription("");
  };

  const handlePress = () => {
    if (!title) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Title is required");
      else alert("Title is required");
    } else if (!description) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Description is required");
      else alert("Description is required");
    } else {
      setLoading(true);
      try {
        const d = new Date().getTime();
        const db = getFirestore();
        setDoc(doc(db, "Health", route.params.key), {
          title: title,

          description: description,

          imageURL: route.params.imageURL,

          startDate: route.params.startDate,

          updatedDate: d,

          CreatedUserId: route.params.CreatedUserId,

          CreatedUserName: route.params.CreatedUserName,

          CreatedUserPhoto: route.params.CreatedUserPhoto,
        })
          .then(() => {
            setLoading(false);
            if (Platform.OS === "ios" || Platform.OS === "android")
              Alert.alert("Document successfully edit!");
            else alert("Document successfully edit!");
          })
          .catch((error) => {
            setLoading(false);

            if (Platform.OS === "ios" || Platform.OS === "android")
              Alert.alert("Error writing document: ", error);
            else alert("Error writing document: ", error);
          });
      } catch (err) {
        setLoading(false);

        if (Platform.OS === "ios" || Platform.OS === "android")
          Alert.alert("There is something wrong!", err.message);
        else alert("There is something wrong! " + err.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <TopNav
          middleContent="Edit Health Photo"
          leftContent={
            <Ionicons
              name="chevron-back"
              size={20}
              color={isDarkmode ? themeColor.white100 : themeColor.black}
            />
          }
          leftAction={() => navigation.goBack()}
        />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 3,

              paddingHorizontal: 20,

              paddingBottom: 20,

              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Text
              fontWeight="bold"
              style={{
                alignSelf: "center",

                padding: 30,
              }}
              size="h3"
            >
              Edit Health Photo
            </Text>

            <Image
              source={{ uri: imageURL }}
              style={{
                width: 150,

                height: 150,

                borderWidth: 2,

                borderColor: "#d35647",

                resizeMode: "contain",

                margin: 8,
              }}
            />

            <Text>Title</Text>

            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Title*"
              value={title}
              autoCapitalize="none"
              autoCompleteType="on"
              autoCorrect={true}
              onChangeText={(title) => setTitle(title)}
            />

            <Text style={{ marginTop: 15 }}>Description</Text>

            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Description*"
              value={description}
              autoCapitalize="none"
              autoCompleteType="on"
              autoCorrect={true}
              onChangeText={(description) => setDescription(description)}
            />

            <Button
              text={loading ? "Loading" : "Done"}
              onPress={() => {
                handlePress();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
