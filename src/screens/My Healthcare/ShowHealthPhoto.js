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
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  const db = getFirestore();
  const storage = getStorage();
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [haelthImage, setHealthImage] = useState(); // Initial empty

  useEffect(() => {
    const q = query(collection(db, "Health"), orderBy("updatedDate", "desc"));
    const subscriber = onSnapshot(q, (querySnapshot) => {
      const users = [];

      querySnapshot.forEach((doc) => {
        users.push({
          ...doc.data(),
          key: doc.id,
        });
      });

      setHealthImage(users);
      setLoading(false);
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey, imageURL) => {
    closeRow(rowMap, rowKey);
    try {
      const desertRef = ref(storage, imageURL);
      console.log(desertRef);
      // Delete the file

      deleteObject(desertRef)
        .then(() => {
          console.log("File deleted successfully");
          deleteDoc(doc(db, "Health", rowKey));
          console.log("Document successfully deleted!");
          // File deleted successfully
          //const newData = [...blogs];
          // const prevIndex = blogs.findIndex(item => item.key === rowKey);
          //newData.splice(prevIndex, 1);
          //setBlog(newData);
        })
        .catch((err) => {
          // Uh-oh, an error occurred!
          if (Platform.OS === "ios" || Platform.OS === "android")
            Alert.alert("There is something wrong!", err.message);
          else alert(err.message);
        });
    } catch (err) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("There is something wrong!", err.message);
      else alert(err.message);
    }
  };

  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  const renderItem = (data) => (
    <TouchableHighlight
      onPress={() => {
        navigation.navigate("DetailHealthScreen", {
          key: data.item.key,
          title: data.item.title,
          description: data.item.description,
          imageURL: data.item.imageURL,
          startDate: data.item.startDate,
          updatedDate: data.item.updatedDate,
          CreatedUserId: data.item.CreatedUserId,
          CreatedUserName: data.item.CreatedUserName,
          CreatedUserPhoto: data.item.CreatedUserPhoto,
        });
      }}
      style={styles.rowFront}
      underlayColor={"#AAA"}
    >
      <View style={[styles.row, { flexDirection: "column" }]}>
        <Image
          source={{ uri: data.item.imageURL }}
          style={{
            width: 70,
            height: 70,
            borderWidth: 2,
            borderColor: "#d35647",
            resizeMode: "contain",
            margin: 8,
          }}
        />
        <Text>{data.item.title}</Text>
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
        onPress={() => {
          navigation.navigate("EditHealthPhoto", {
            key: data.item.key,
            title: data.item.title,
            description: data.item.description,
            imageURL: data.item.imageURL,
            startDate: data.item.startDate,
            updatedDate: data.item.updatedDate,
            CreatedUserId: data.item.CreatedUserId,
            CreatedUserName: data.item.CreatedUserName,
            CreatedUserPhoto: data.item.CreatedUserPhoto,
          });
        }}
      >
        <Text style={styles.backTextWhite}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.key, data.item.imageURL)}
      >
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
        middleContent="Health Image List"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.black}
          />
        }
        leftAction={() => navigation.goBack()}
      />

      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <SwipeListView
            data={haelthImage}
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
