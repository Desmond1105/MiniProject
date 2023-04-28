import React, { useState, useCallback } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image, Alert, Platform, StyleSheet,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import DropDownPicker from "react-native-dropdown-picker";
import { TextInputMask } from 'react-native-masked-text';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useForm, Controller } from 'react-hook-form';


export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();
  const db = getFirestore();
  const [display_name, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);
  const [genderValue, setGenderValue] = useState(null);
  const [birth_date, setBirthDate] = useState('09-10-2020');
  const { handleSubmit, control } = useForm();
  const [genderOpen, setGenderOpen] = useState(false);


  const onGenderOpen = useCallback(() => {
    //setCompanyOpen(false);
  }, []);




  async function register() {



    if (!display_name) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert('Display name is required');
      else
        alert('Display name is required');
    }
    else if (!email) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert('Email is required');
      else
        alert('Email is required');
    }


    else if (!password) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert('Password is required');
      else
        alert('Password is required');
    }
    else if (!confirm_password) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert('Confirm password is required');
      else
        alert('Confirm password is required');
    }
    else if (password != confirm_password) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert('Confirm password not match to password');
      else
        alert('Confirm password not match to password');
    }
    else if (!genderValue) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert('Gender is required');
      else
        alert('Gender is required');
    }
    else if (!birth_date) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert('Birth Date is required');
      else
        alert('Birth Date is required');
    }
    else {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password).then(() => {
        // Profile updated!
        updateProfile(auth.currentUser, {
          displayName: display_name,
          photoURL: ""
        }).then(() => {
          // Register Info insert in firestore!           
          setDoc(doc(db, "users", auth.currentUser.uid), {
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
            gender: genderValue,
            birthDate: birth_date,
            tokenId: "-",


          });


        }).catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
          setLoading(false);
          if (Platform.OS === "ios" || Platform.OS === "android")
            Alert.alert(errorMessage);
          else
            alert(errorMessage);
        });


      }).catch(function (
        error
      ) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        setLoading(false);
        if (Platform.OS === "ios" || Platform.OS === "android")
          Alert.alert(errorMessage);
        else
          alert(errorMessage);
      });
    }
  }


  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <Layout>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require("../../../assets/register.png")}
            />
          </View>
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
              size="h3"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
            >
              Register
            </Text>
            <Text>Display Name</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your name"
              value={display_name}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              onChangeText={(text) => setDisplayName(text)}
            />
            <Text>Email</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your email"
              value={email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />


            <Text style={{ marginTop: 15 }}>Password</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your password"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Text style={{ marginTop: 15 }}>Confirm Password</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your confirm password"
              value={confirm_password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setConfirmPassword(text)}
            />

            <Text style={{ marginTop: 15 }}>Gender</Text>
            <Controller
              name="gender"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.dropdownGender}>
                  <DropDownPicker
                    style={styles.dropdown}
                    open={genderOpen}
                    value={genderValue} //genderValue
                    items={gender}
                    setOpen={setGenderOpen}
                    setValue={setGenderValue}
                    setItems={setGender}
                    placeholder="Select Gender"
                    placeholderStyle={styles.placeholderStyles}
                    onOpen={onGenderOpen}
                    onChangeValue={onChange}
                    zIndex={3000}
                    zIndexInverse={1000}
                  />
                </View>
              )}
            />

            <Text style={{ marginTop: 15 }}>Birth Date</Text>
            <TextInputMask
              style={{
                textAlign: 'center',
                width: 200,
                backgroundColor: 'white',
                padding: 5,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: 'black',
                paddingHorizontal: 20,
              }}
              placeholder="DD/MM/YYYY"
              type={'datetime'}
              options={{
                format: 'DD/MM/YYYY',
              }}
              value={birth_date}
              onChangeText={(text) => setBirthDate(text)}
            />



            <Button
              text={loading ? "Loading" : "Create an account"}
              onPress={() => {
                register();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />


            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <Text size="md">Already have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Login");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Login here
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  isDarkmode ? setTheme("light") : setTheme("dark");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </Layout>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  datePickerStyle: {
    width: 200,
    marginTop: 20,
  },
  dropdownGender: {
    marginHorizontal: 10,
    width: "50%",
    marginBottom: 15,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 50,
  },
});
