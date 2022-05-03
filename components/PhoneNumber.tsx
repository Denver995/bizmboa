import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button, Input } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { CountryCode } from "react-native-country-picker-modal";
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from "@apollo/client";
import { setUserData } from "../actions";
import { REGISTER, LOGINUSER } from "../API/mutations";
export default function PhoneNumber() {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [valid, setValid] = useState(false);
  const [phone, setPhone] = useState("");
  const [phone1, setPhone1] = useState("");
  const [password, setPassword] = useState("");
  const [showSecurePasswordInput, setShowSecurePasswordInput] = useState(true);
  const [authenticateMe, setAuthenticateMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [countryCode, setCountryCode] = useState<CountryCode>("CM");
  const phoneInput = useRef<PhoneInput>(null);
  const [createUser] = useMutation(REGISTER);
  const [login] = useMutation(LOGINUSER);

  const toast = (type: string, position: any, title: string, msg: string) => {
    Toast.show({
      type: type,
      position: position,
      text1: title,
      text2: msg,
      visibilityTime: 3000,
      autoHide: true,
    });
  }

  const onHandleForm = () => {
    setLoader(true);
    if (phone && valid && !authenticateMe) {
      handleRegistration(phone);
      return;
    }
    if(phone && valid && authenticateMe){
      handleLogin(phone, password);
      return;
    }
    toast("error", "top", "Erreur", "Une erreur est survenue");
  };

  const onChangedPhoneNiumber = (phone) => {
    setPhone(phone);
    setErrorMessage("");
    setCountryCode(phoneInput.current?.getCountryCode() || "");
    const checkValid = phoneInput.current?.isValidNumber(phone);
    setValid(checkValid ? checkValid : false);
  }

  const onChangePassword = (password: string) => setPassword(password);

  const handleLogin = (phone: string, password: string) => {
    login({
      variables: {
        phone: phone,
        password: password,
      },
    }).then((res) => {
      setLoader(false);
      dispatch(setUserData({phone: phone}));
      AsyncStorage.setItem('phone', phone);
      AsyncStorage.setItem('token', res.data.login.token);
    }).catch(err => {
      setLoader(false);
      setErrorMessage(err.toString());
      toast("error", "top", "Erreur", "Une erreur est survenue lors de l'authentification "+err);
    });
  }
  

  const handleRegistration = (phone: string) => {
    // const password = "bizboa237";
    createUser({
      variables: {
        phone: phone,
        company: "Test",
        password: password,
        firstName: "",
        lastName: "",
      },
    }).then((res) => {
      setLoader(false);
      dispatch(setUserData({phone: phone}));
      AsyncStorage.setItem('phone', phone);
      handleLogin(phone, password);
      toast("success", "bottom", "Succès", "Votre numéro a été enregistré avec succès");
      console.log(" user created !: ", res);
    }).catch((err) => {
      // setErrorMessage(err.toString());
      setErrorMessage("Désolé, un compte utilise déjà ce numéro");
      setLoader(false);
      toast("error", "top", "Erreur", "Une erreur est survenue lors de l'enregistrement "+err);
    });
  }

  const toggleShowPassword = () => setShowSecurePasswordInput(!showSecurePasswordInput)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "position" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 15 : 0}
    >
      <View style={styles.modal}>
        {errorMessage.length > 0 && 
          <Text style={styles.badNumber}>{errorMessage}!!!</Text>
        }
        {!valid && phone1.length > 0 && (
          <Text style={styles.badNumber}>Le numéro n'est pas valide!</Text>
        )}
        <View style={styles.form1}>
          <PhoneInput
            ref={phoneInput}
            textInputStyle={styles.input}
            codeTextStyle={styles.code}
            containerStyle={[styles.formcontrol, !valid && styles.error1]}
            defaultValue={phone1}
            onChangeText={(text) => {
              setPhone1(text);
            }}
            defaultCode={countryCode}
            onChangeFormattedText={onChangedPhoneNiumber}
            disableArrowIcon
            // withShadow
            placeholder="Numéro de téléphone"
            textInputProps={{ placeholderTextColor: "#FFFFFF" }}
          />
          <Input 
            placeholder="Password" 
            secureTextEntry={showSecurePasswordInput}
            onChangeText={onChangePassword}
            // value={password}
            style={styles.input}
            rightIcon={
              <Icon name={showSecurePasswordInput ? "eye" : "eye-slash"} style={styles.showPassword} onPress={toggleShowPassword} size={18}/>
            }
          />
          <Button
            title={authenticateMe ? "Se connecter" : "Créer un compte"}
            loading={loader ? true : false}
            disabled={valid && password.length > 2 ? false : true}
            disabledStyle={styles.btn1}
            buttonStyle={styles.buttonStyle}
            disabledTitleStyle={styles.btnText}
            onPress={onHandleForm}
          />
        </View>
        <View style={styles.actionType}>
          <TouchableOpacity onPress={() => setAuthenticateMe(true)}>
            <Text style={authenticateMe ? styles.activateText : styles.disableText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAuthenticateMe(false)}>
            <Text style={authenticateMe ? styles.disableText : styles.activateText}>Créer mon compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  formcontrol: {
    borderColor: "#000",
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 3,
  },
  error1: {
    borderColor: "#FF8787",
  },
  error: {
    color: "#000",
    marginLeft: 38,
  },
  input: {
    color: "#000",
    letterSpacing: 0.9,
    fontSize: 14
  },
  code: {
    marginLeft: -25,
    // fontFamily: "quicksand-regular",
  },
  text: {
    // fontFamily: "quicksand-regular",
    letterSpacing: 1.05,
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 1,
    marginTop: 25,
  },
  btn: {
    borderRadius: 3,
    height: 40,
    backgroundColor: "#f4511e",
    width: width - 40,
    marginTop: 20,
    opacity: 1,
  },
  btn1: {
    borderRadius: 10,
    height: 30,
    width: width - 60,
    opacity: 1,
  },
  buttonStyle: {
    borderRadius: 10,
    height: 30,
    backgroundColor: "#f4511e",
    width: width - 60,
    opacity: 1,
  },
  btnText: {
    letterSpacing: 1.05,
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 1,
  },
  modal: {
    // flex: 1,
    backgroundColor: "#fff",
    minHeight: 200,
    borderRadius: 10,
    height: '66%',//haveAccount ? '70%' : '60%',
    marginTop: 120
    
  },
  mTitle: {
    color: "#000",
    fontSize: 15,
    // textAlign: "center",
    opacity: 0.5,
    letterSpacing: 0.9,
    marginLeft: 19,
  },
  badNumber: {
    color: "red",
    fontSize: 14,
    // textAlign: "center",
    opacity: 0.5,
    letterSpacing: 0.2,
    marginLeft: 19
  },
  form1: {
    // flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  activateText: {
    color: "#f4511e",
    letterSpacing: 0.9,
    fontSize: 17,
    textDecorationStyle: 'solid',
    textDecorationColor: "#f4511e",
    opacity: 0.0
  },
  disableText: {
    color: "#000",
    letterSpacing: 0.5,
    fontSize: 17,
    opacity: 0.5
  },
  actionType:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    // backgroundColor: "#f4511e",
  },
  titleConatiner:{
    flex: 1
  },
  showPassword: {
    color: '#f4511e'
  }
});