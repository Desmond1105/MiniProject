import React, { useContext } from "react";
import { initializeApp, getApps } from "firebase/app";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useTheme, themeColor } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";
//Screens
import Home from "../screens/Home";
import SecondScreen from "../screens/SecondScreen";
import About from "../screens/About";
import Profile from "../screens/Profile";
import Loading from "../screens/utils/Loading";
// Auth screens
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";
import { AuthContext } from "../provider/AuthProvider";

//diary modules
import DiaryHome from "../screens/My Diary/DiaryHome";

//contact modules
import ContactHome from "../screens/My Contact/ContactHome";

//time management modules
import TimeHome from "../screens/My Time/TimeHome";

//money modules
import MoneyHome from "../screens/My Money/MoneyHome";

//healthcare modules
import HealthData from "../screens/My Healthcare/HealthData";
import HealthDataHome from "../screens/My Healthcare/HealthDataHome";
import ViewHealthData from "../screens/My Healthcare/ViewHealthData";
import AddHealthPhoto from "../screens/My Healthcare/AddHealthPhoto";
import ShowHealthPhoto from "../screens/My Healthcare/ShowHealthPhoto";
import EditHealthPhoto from "../screens/My Healthcare/EditHealthPhoto";
import DetailHealthScreen from "../screens/My Healthcare/DetailHealthScreen";
// import MapScreen from "../screens/My Healthcare/MapScreen";
// import MarkerMapScreen from "../screens/My Healthcare/MarkerMapScreen";
// import MyLocationScreen from "../screens/My Healthcare/MyLocationScreen";
// import PedometerScreen from "../screens/My Healthcare/PedometerScreen";

// Better put your these secret keys in .env file
const firebaseConfig = {
  apiKey: "AIzaSyDipcSU9hOVkjf09mv9L3Jr38NxBS3bAgw",
  authDomain: "groupmp-dc1e7.firebaseapp.com",
  projectId: "groupmp-dc1e7",
  storageBucket: "groupmp-dc1e7.appspot.com",
  messagingSenderId: "284079436101",
  appId: "1:284079436101:web:dddaa79b76d50142d48e2c",
  measurementId: "G-TXW0EZS0YT",
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
    </AuthStack.Navigator>
  );
};

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="SecondScreen" component={SecondScreen} />

      {/*----------------------------begin of Diary---------------------------------*/}
      <MainStack.Screen name="DiaryHome" component={DiaryHome} />

      {/*----------------------------end of Diary---------------------------------*/}

      {/*----------------------------begin of contact---------------------------------*/}
      <MainStack.Screen name="ContactHome" component={ContactHome} />

      {/*----------------------------end of contact---------------------------------*/}

      {/*----------------------------begin of Time---------------------------------*/}
      <MainStack.Screen name="TimeHome" component={TimeHome} />

      {/*----------------------------end of Time---------------------------------*/}

      {/*----------------------------begin of Money---------------------------------*/}
      <MainStack.Screen name="MoneyHome" component={MoneyHome} />

      {/*----------------------------end of Money---------------------------------*/}

      {/*----------------------------beginning of health---------------------------------*/}
      <MainStack.Screen name="HealthDataHome" component={HealthDataHome} />
      <MainStack.Screen name="HealthData" component={HealthData} />
      <MainStack.Screen name="ViewHealthData" component={ViewHealthData} />
      <MainStack.Screen name="AddHealthPhoto" component={AddHealthPhoto} />
      <MainStack.Screen name="EditHealthPhoto" component={EditHealthPhoto} />
      <MainStack.Screen
        name="DetailHealthScreen"
        component={DetailHealthScreen}
      />
      <MainStack.Screen name="ShowHealthPhoto" component={ShowHealthPhoto} />
      {/* <MainStack.Screen name="MapScreen" component={MapScreen} />
      <MainStack.Screen name="MarkerMapScreen" component={MarkerMapScreen} />
      <MainStack.Screen name="MyLocationScreen" component={MyLocationScreen} />
      <MainStack.Screen name="PedometerScreen" component={PedometerScreen} /> */}

      {/*----------------------------end of health---------------------------------*/}
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const { isDarkmode } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
        },
      }}
    >
      {/* these icons using Ionicons */}
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Home" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"md-home"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Profile" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"person"} />
          ),
        }}
      />
      <Tabs.Screen
        name="About"
        component={About}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="About" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"ios-information-circle"} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default () => {
  const auth = useContext(AuthContext);
  const user = auth.user;
  return (
    <NavigationContainer>
      {user == null && <Loading />}
      {user == false && <Auth />}
      {user == true && <Main />}
    </NavigationContainer>
  );
};
