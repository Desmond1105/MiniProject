import React, { useState } from "react";

import { View, Alert, Platform } from "react-native";

import {
  Layout,
  TopNav,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";

import { Ionicons } from "@expo/vector-icons";

import { getFirestore, addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import CalendarPicker from "react-native-calendar-picker";

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedDob, setSelectedDob] = useState();
  const [age, setAge] = useState(0); // added state for age
  const dob = selectedDob ? selectedDob.toString() : "";

  const [loading, setLoading] = useState(false);
  function getAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  async function AddHealthData() {
    if (!height) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Health data is required");
      else alert("Health data is required");
    } else if (!weight) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Health data is required");
      else alert("Health data is required");
    } else if (!dob) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Health data is required");
      else alert("Health data is required");
    } else {
      setLoading(true);

      const db = getFirestore();

      const auth = getAuth();

      const currentUser = auth.currentUser;

      const startDate = new Date();

      await addDoc(collection(db, "Health Data"), {
        age: age,

        weight: weight,

        height: height,

        startDate: startDate,

        updatedDate: startDate,

        CreatedUserId: currentUser.uid,

        CreatedUserName: currentUser.displayName,

        CreatedUserPhoto: currentUser.photoURL,
      })
        .then((docRef) => {
          setLoading(false);

          setAge("");
          setHeight("");
          setWeight("");

          if (Platform.OS === "ios" || Platform.OS === "android")
            Alert.alert(
              "Added successfully. Data written with ID: ",
              docRef.id
            );
          else alert("Added successfully. Data written with ID: " + docRef.id);
        })
        .catch((error) => {
          setLoading(false);

          if (Platform.OS === "ios" || Platform.OS === "android")
            Alert.alert("Error adding data: ", error.toString());
          else alert("Error adding data: " + error.toString());
        });
    }
  }

  return (
    <Layout>
      <TopNav
        middleContent="Add Health Information"
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
          flex: 3,

          paddingHorizontal: 20,

          paddingBottom: 20,

          backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
        }}
      >
        <Text
          size="h3"
          fontWeight="bold"
          style={{
            alignSelf: "center",

            padding: 30,
          }}
        >
          Add Health Data
        </Text>

        <Text>Height</Text>
        <TextInput
          containerStyle={{ marginTop: 15 }}
          placeholder="Enter your Height (in cm)"
          value={height}
          onChangeText={(text) => setHeight(text)}
        />

        <Text>Weight</Text>
        <TextInput
          containerStyle={{ marginTop: 15 }}
          placeholder="Enter your Weight (in kg)"
          value={weight}
          onChangeText={(text) => setWeight(text)}
        />
        <Text>Date of Birth</Text>
        <CalendarPicker
          height={400}
          width={400}
          onDateChange={(e) => {
            setSelectedDob(e);
            setAge(getAge(e));
          }}
        />

        <Button
          text={loading ? "Loading" : "Add"}
          onPress={() => {
            AddHealthData();
          }}
          style={{
            marginTop: 20,
          }}
          disabled={loading}
        />
      </View>
    </Layout>
  );
}
