import React, { useState, useEffect } from "react";

// import all the components we are going to use

import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";

//import React Native chart Kit for different kind of Chart

import { LineChart, ProgressChart } from "react-native-chart-kit";

import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
  Button,
} from "react-native-rapi-ui";

import { Ionicons } from "@expo/vector-icons";

import {
  getFirestore,
  onSnapshot,
  collection,
  query,
  orderBy,
  where,
} from "firebase/firestore";

import { getAuth, signOut } from "firebase/auth";

const App = ({ navigation }) => {
  const { isDarkmode } = useTheme();

  const db = getFirestore();

  const [myProgressLabel, setMyProgressLabel] = useState();

  const [myProgressData, setmyProgressData] = useState([0, 0, 0, 0]);

  useEffect(() => {
    getMyProgressInformation();
  }, []);

  async function getMyProgressInformation() {
    const auth = getAuth();

    const q = query(
      collection(db, "Health Data"),
      where("CreatedUserId", "==", auth.currentUser.uid)
    );

    await onSnapshot(q, (querySnapshot) => {
      const questions = [];

      querySnapshot.forEach((doc) => {
        questions.push({
          ...doc.data(),

          key: doc.id,
        });
      });

      questions.sort((a, b) => a.updatedDate - b.updatedDate);

      questions.forEach((el) => {
        var DateObj = new Date(el.updatedDate);

        // Month from above Date Object is

        // Being extracted using getMonth()

        var months = DateObj.getMonth();

        console.log("month", months);

        myLineChartData[months] += 1;

        console.log(myLineChartData[months]);
      });

      setMyLineChartLabel([
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",

        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]);
    });
  }

  if (myLineChartLabel) {
    if (myLineChartLabel.length) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Layout>
            <TopNav
              middleContent="Progress Report"
              leftContent={
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={isDarkmode ? themeColor.white100 : themeColor.black}
                />
              }
              leftAction={() => navigation.goBack()}
            />

            <ScrollView>
              <View>
                <Text>Progress Ring</Text>

                <LineChart
                  data={{
                    labels: myLineChartLabel,

                    datasets: [
                      {
                        data: myLineChartData,

                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={Dimensions.get("window").width - 16}
                  height={220}
                  chartConfig={{
                    backgroundColor: "#1cc910",

                    backgroundGradientFrom: "#eff3ff",

                    backgroundGradientTo: "#efefef",

                    decimalPlaces: 2,

                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{
                    marginVertical: 8,

                    borderRadius: 16,
                  }}
                />
              </View>
            </ScrollView>
          </Layout>
        </SafeAreaView>
      );
    } else {
      return (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }
  } else {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text>no data found</Text>
      </View>
    );
  }
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "white",

    justifyContent: "center",

    alignItems: "center",

    textAlign: "center",

    padding: 10,
  },

  header: {
    textAlign: "center",

    fontSize: 18,

    padding: 16,

    marginTop: 16,
  },
});
