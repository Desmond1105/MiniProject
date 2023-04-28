import React, { useEffect, useState } from "react";

import {
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
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

import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  deleteDoc,
} from "firebase/firestore";

import { SwipeListView } from "react-native-swipe-list-view";

import { Ionicons } from "@expo/vector-icons";

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();

  const db = getFirestore();

  const [loading, setLoading] = useState(true); // Set loading to true on component mount

  const [health, setHealth] = useState(); // Initial empty

  useEffect(() => {
    const subscriber = onSnapshot(
      collection(db, "Health Data"),
      (querySnapshot) => {
        const users = [];

        querySnapshot.forEach((doc) => {
          users.push({
            ...doc.data(),

            key: doc.id,
          });
        });

        setHealth(users);

        setLoading(false);
      }
    );

    // Unsubscribe from events when no longer in use

    return () => subscriber();
  }, []);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey, imageLocation) => {
    closeRow(rowMap, rowKey);
  };

  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  const renderItem = (data) => (
    <TouchableHighlight style={styles.rowFront} underlayColor={"#AAA"}>
      <View style={[styles.row, { flexDirection: "column" }]}>
        <Text>{data.item.age}</Text>
        <Text>{data.item.weight}</Text>
        <Text>{data.item.height}</Text>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => closeRow(rowMap, data.item.key)}
      >
        <Text style={styles.backTextWhite}>Close</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnMiddle]}
      >
        <Text style={styles.backTextWhite}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <Layout>
      <TopNav
        middleContent="Health Data"
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
          flexDirection: "row",

          alignItems: "center",

          marginTop: 30,

          justifyContent: "center",
        }}
      >
        <Text>Health Data</Text>
      </View>

      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <SwipeListView
            data={health}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-215}
            previewRowKey={"0"}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onRowDidOpen={onRowDidOpen}
          />
        </View>
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",

    flex: 1,
  },

  backTextWhite: {
    color: "#FFF",
  },

  rowFront: {
    alignItems: "center",

    backgroundColor: "#CCC",

    borderBottomColor: "black",

    borderBottomWidth: 1,

    justifyContent: "center",

    height: 100,
  },

  rowBack: {
    alignItems: "center",

    backgroundColor: "#DDD",

    flex: 1,

    flexDirection: "row",

    justifyContent: "space-between",

    paddingLeft: 15,
  },

  backRightBtn: {
    alignItems: "center",

    bottom: 0,

    justifyContent: "center",

    position: "absolute",

    top: 0,

    width: 75,
  },

  backRightBtnLeft: {
    backgroundColor: "blue",

    right: 150,
  },

  backRightBtnMiddle: {
    backgroundColor: "green",

    right: 75,
  },

  backRightBtnRight: {
    backgroundColor: "red",

    right: 0,
  },

  row: {
    flex: 1,

    flexDirection: "row",

    flexWrap: "wrap",

    alignItems: "center",

    marginBottom: 10,
  },
});
