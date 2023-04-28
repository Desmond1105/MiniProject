import React, { useContext, useState, useEffect } from "react";
import { View, Linking, Platform } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
} from "react-native-rapi-ui";
import { AuthContext } from "../provider/AuthProvider";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,

    shouldPlaySound: false,

    shouldSetBadge: false,
  }),
});

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();
  const [displayName, setDisplayName] = useState(null);
  const authContextData = useContext(AuthContext);

  useEffect(() => {
    async function fetchMyData() {
      const db = getFirestore();

      const docRef = doc(db, "users", auth.currentUser.uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.data()) {
        // console.log(docSnap.data());

        if (Platform.OS === "ios" || Platform.OS === "android") {
          registerForPushNotificationsAsync().then((token) => {
            // console.log("token 1", token)
            //  console.log("database", docSnap.data().tokenId)
            // console.log("token 2", token)

            if (token != docSnap.data().tokenId) {
              console.log({ token });
              console.log("user id", auth.currentUser.uid);

              setDoc(doc(db, "users", auth.currentUser.uid), {
                email: auth.currentUser.email,
                displayName: auth.currentUser.displayName,
                photoURL: auth.currentUser.photoURL,
                gender: docSnap.data().gender,
                birthDate: docSnap.data().birthDate,
                tokenId: token,
              });
            }
          });
        }
      }
    }
    fetchMyData();
  }, []);

  return (
    <Layout>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 20,
        }}
      >
        <Section>
          <SectionContent>
            <Text fontWeight="bold" style={{ textAlign: "center" }}>
              Welcome {authContextData.displayName}
            </Text>
            <Button
              style={{ marginTop: 10 }}
              text="Rapi UI Documentation"
              status="info"
              onPress={() => Linking.openURL("https://rapi-ui.kikiding.space/")}
            />
            <Button
              text="Go to Diary screen"
              onPress={() => {
                navigation.navigate("DiaryHome");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Go to Contact screen"
              onPress={() => {
                navigation.navigate("ContactHome");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Go to Time screen"
              onPress={() => {
                navigation.navigate("TimeHome");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Go to Money screen"
              onPress={() => {
                navigation.navigate("MoneyHome");
              }}
              style={{
                marginTop: 10,
              }}
            />

            <Button
              text="Go to My Health Module"
              onPress={() => {
                navigation.navigate("HealthDataHome");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              status="danger"
              text="Logout"
              onPress={() => {
                signOut(auth);
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text={isDarkmode ? "Light Mode" : "Dark Mode"}
              status={isDarkmode ? "success" : "warning"}
              onPress={() => {
                if (isDarkmode) {
                  setTheme("light");
                } else {
                  setTheme("dark");
                }
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");

      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",

      importance: Notifications.AndroidImportance.MAX,

      vibrationPattern: [0, 250, 250, 250],

      lightColor: "#FF231F7C",
    });
  }

  return token;
}
