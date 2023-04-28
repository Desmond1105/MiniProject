import React, { useState, useEffect } from "react";

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

import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();

  const [image, setImage] = useState(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const emptyState = () => {
    setImage(null);

    setTitle("");

    setDescription("");
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      allowsEditing: true,

      aspect: [4, 3],

      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePress = async () => {
    if (!title) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Title is required");
      else alert("Title is required");
    } else if (!description) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Description is required");
      else alert("Description is required");
    } else if (image == null) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Image is required.");
      else alert("Image is required.");
    } else {
      setLoading(true);

      const auth = getAuth();
      const storage = getStorage();
      const db = getFirestore();

      const startDate = new Date().getTime();

      const response = await fetch(image);

      const blob = await response.blob();

      let u =
        Date.now().toString(16) + Math.random().toString(16) + "0".repeat(16);

      let guid = [
        u.substr(0, 8),
        u.substr(8, 4),
        "4000-8" + u.substr(13, 3),
        u.substr(16, 12),
      ].join("-");

      const spaceRef = ref(storage, "Health/" + guid);
      try {
        uploadBytes(spaceRef, blob).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);

            const currentUser = auth.currentUser;

            addDoc(collection(db, "Health"), {
              title: title,

              description: description,

              imageURL: downloadURL,

              startDate: startDate,

              updatedDate: startDate,

              CreatedUserId: currentUser.uid,

              CreatedUserName: currentUser.displayName,

              CreatedUserPhoto: currentUser.photoURL,
            })
              .then((docRef) => {
                emptyState();

                setLoading(false);

                if (Platform.OS === "ios" || Platform.OS === "android")
                  Alert.alert(
                    "Added successfully. Document written with ID: ",
                    docRef.id
                  );
                else
                  alert(
                    "Added successfully. Document written with ID: " + docRef.id
                  );
              })
              .catch((error) => {
                setLoading(false);

                if (Platform.OS === "ios" || Platform.OS === "android")
                  Alert.alert("Error adding document: ", error);
                else alert("Error adding document: " + error);
              });
          });
        });
      } catch (err) {
        setLoading(false);

        if (Platform.OS === "ios" || Platform.OS === "android")
          Alert.alert("There is something wrong!", err.message);
        else alert("There is something wrong!" + err.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <TopNav
          middleContent="Add Health Image"
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
              Add Health Image
            </Text>

            <Button text="Pick an image from camera roll" onPress={pickImage} />

            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200 }}
              />
            )}

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
