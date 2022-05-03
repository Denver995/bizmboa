import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
// import ImagePicker from "react-native-customized-image-picker";
import { SliderBox } from "react-native-image-slider-box";
import SelectBox from 'react-native-multi-selectbox';
import { Button } from "react-native-elements";
import { 
    Text,
    View, 
    TextInput, 
    StyleSheet, 
    Alert,
    Platform, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { CountryCode } from "react-native-country-picker-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import { useQuery, useMutation } from "@apollo/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from "prop-types";
import { generateRNFile } from "../../utils/helper";
import { setUserData } from '../../actions';
import { UPDATE_USER } from "../../API/mutations";
import { ALL_CITIES } from "../../API/query";

function Form(props: any) {
    const dispatch = useDispatch();
    const userData = useSelector(state => state?.userData);
    const [localImage, setLocalImage] = useState();
    const [loader, setLoader] = useState(false);
    const [city, setCity] = useState({});
    const [company, setCompany] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState("")
    const [valid, setValid] = useState(false);
    const [phone, setPhone] = useState(userData?.phone);
    const [phone1, setPhone1] = useState(userData?.phone.split("+237")[1]);
    const [countryCode, setCountryCode] = useState<CountryCode>("CM");
    const phoneInput = useRef<PhoneInput>(null);

    const { loading, error, data: dataCities } = useQuery(ALL_CITIES);

    const onChangeCity = (val: any) => setCity(val);

    const getCities = () => {
        var pickerList = [];
        for (let index = 0; index < dataCities.allCity.length; index++) {
            const city = dataCities.allCity[index];
            pickerList.push({ item: city.name, id: city.id })
        }
        return (
            <View>
                <SelectBox
                    label="Votre boutique se trouve dans quelle ville ?"
                    options={pickerList}
                    value={city}
                    onChange={onChangeCity}
                    hideInputFilter={false}
                />
            </View>
        )
    }

    const [handleForm] = useMutation(UPDATE_USER);
 
    const { control, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data: any) => {
        //handleSubmit
        submitProduct();
    }; 
    const [firstLoad, setFirstLoad] = useState(true);

    const photoOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        allowsEditing: false,
        selectionLimit: 0,
        allowsMultipleSelection: true,
        // aspect: [4, 3],
        quality: 1,
    }

    const onChangedPhoneNiumber = (phone) => {
        setPhone(phone);
        setErrorMessage("");
        setCountryCode(phoneInput.current?.getCountryCode() || "");
        const checkValid = phoneInput.current?.isValidNumber(phone);
        setValid(checkValid ? checkValid : false);
    }

    const toast = (type: string, position: any, company: string, msg: string) => {
        Toast.show({
          type: type,
          position: position,
          text1: company,
          text2: msg,
          visibilityTime: 2000,
          autoHide: true,
        });
    }

    const onCloseForm = () => {
        saveDraft()
        setLoader(false);
        props.toggle()
    }

    const saveDraft = () => {
        const data = {
            company: company,
            city: city,
            description: description,
            phone: phone,
            // imagesSrc: `${imagesSrc}`,
            localImage: localImage
        }
        AsyncStorage.setItem('user_detail', JSON.stringify(data));
        dispatch(setUserData(data));
    }

    useEffect(() => {
        if (firstLoad) {
            getPermissionAsync();
            setFirstLoad(false);
            AsyncStorage.getItem('user_detail')
            .then(req => JSON.parse(req))
            .then(details => {
                setDescription(details.description);
                setCompany(details.company);
                setCity(details.city ? details.city : {item: "", id: null})
                // setLocalImage(details.localImage);
                addPhoto(details.localImage)
            })
            .catch(error => console.log('error!'));
        }
    }, [firstLoad]);

    const _displayLoading = () => {
        if (loader) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' color={"#f4511e"}/>
                </View>
            )
        }
    }

    const getPermissionAsync = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    const addPhoto = (imageObject: any) => {
        let imageUri = imageObject ? imageObject.uri : null
        imageUri = Platform.OS === "android" ? imageUri : imageUri.replace("file://", "")
        const file_ext = imageUri.split(".").pop();
        let file = generateRNFile(imageUri, `picture-${Date.now()}`);
        setLocalImage(file);
    }

    const takePhoto = async (response: any) => {
        let pickerResult = await ImagePicker.launchCameraAsync(photoOptions);
        addPhoto(pickerResult); 
    }

    const _pickImage = async (response: any) => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync(photoOptions)
        addPhoto(pickerResult); 
    }

    //submit user
    const submitProduct = () => {
        if(description.length < 3 || company.length < 3) {
            props.toggle();
            toast("error", "top", "Erreur", "Vous ajouter une description et un nom");
            return;
        }
        if(!city.id){
            props.toggle();
            toast("error", "top", "Erreur", "Vous devez sélectionner une  ville");
            return;
        }
        setLoader(true);
        handleForm({
            variables: {
                id: userData.id,
                phone: phone,
                profileDescription: description,
                city: city?.id,
                shopLogo: localImage,
            },
        })
        .then((res) => {
            setLoader(false);
            toast("success", "bottom", "Succès", "Vos informations ont été mise à jour");
            dispatch(setUserData(res.data))
            props.refetchUser(true);
            props.toggle();
        })
        .catch((err) => {
            console.log('error ', err);
            setLoader(false);
            toast("error", "top", "Erreur", "Une erreur est survenue lors de la mise à jour");
            saveDraft();
            // props.toggle();
        });
    }

    const showAlert = (index) => {
        Alert.alert(
            "Supprimer image",
            "Souhaitez-vous supprimer cette image?",
            [
                {
                    text: "Annuler",
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: "Ok",
                    onPress: () => {
                        setLocalImage(null);
                    },
                },
            ],
            {
                cancelable: true,
            }
        );
    }


    return (
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            <View style={styles.container}>
                <View style={styles.pickerContainer}>
                    <TouchableOpacity style={styles.closeIcon} onPress={onCloseForm}>
                        <MaterialCommunityIcons
                            name="close-circle"
                            size={30}
                            color={mainColor}
                        />
                    </TouchableOpacity>
                </View>
                { dataCities && dataCities.allCity && getCities() }
                <View style={styles.inputContainer}>
                    <PhoneInput
                        ref={phoneInput}
                        textInputStyle={styles.inputPhone}
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
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder={"Nom de la boutique"}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={(new_val) => {
                                    onChange(new_val)
                                    setCompany(new_val);
                                }}
                                value={company}
                            />
                        )}
                        name="company"
                        defaultValue=""
                    />
                    {errors.company && <Text>Ce champs est requis.</Text>}
                    <Controller
                        control={control}
                        rules={{
                            maxLength: 100,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder={"Description"}
                                multiline={true}
                                style={[styles.input, { height: 50 }]}
                                onBlur={onBlur}
                                onChangeText={(new_val) => {
                                    onChange(new_val)
                                    setDescription(new_val)
                                }}
                                value={description}
                            />
                        )}
                        name="description"
                        defaultValue=""
                    />
                    {_displayLoading()}
                </View>
                <View style={[styles.uploadImage, {height: localImage ? '35%' : 0}]}>
                    { localImage && 
                        <SliderBox
                            images={[localImage]}
                            onCurrentImagePressed={index => {showAlert(index)}}
                        />
                    }
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.photoIcon}>
                        <TouchableOpacity onPress={takePhoto} disabled={loader} style={{marginRight: 30}}>
                            <MaterialCommunityIcons
                                name={'camera-plus'}
                                size={25}
                                color={mainColor}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={_pickImage} disabled={loader}>
                            <MaterialCommunityIcons
                                name={'attachment'}
                                size={27}
                                color={mainColor}
                            />
                        </TouchableOpacity>
                    </View>
                    <Button
                        title={"Enregistrer"}
                        loading={loader ? true : false}
                        disabled={phone1.length > 0 ? false : true}
                        disabledStyle={styles.btn1}
                        buttonStyle={styles.buttonStyle}
                        disabledTitleStyle={styles.btnText}
                        onPress={onSubmit}
                    />
                    {/* <TouchableOpacity onPress={onSubmit} disabled={loader}>
                        <MaterialCommunityIcons
                            name={'send-circle'}
                            size={45}
                            color={mainColor}
                        />
                    </TouchableOpacity> */}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const mainColor = "#f4511e";
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        minHeight: 200,
        padding: 5,
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 10
    },
    inputContainer: {
        zIndex: 1
    },
    uploadImage: {
        overflow: 'hidden',
        marginTop: 10,
        width: '100%',
    },
    input: {
        width: '100%',
        height: 35,
        padding: 10,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: mainColor,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: "#FFF",
        borderColor: "#f4511e"
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginTop: 40,
    },
    photoIcon: {
        flexDirection: "row",
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pickerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // padding: 5,
    },
    closeIcon: {
        marginLeft: '90%',
    },
    code: {
      marginLeft: -25,
    },
    formcontrol: {
        width: '100%',
        // height: 35,
        // padding: 10,
        marginTop: 10,
        borderBottomWidth: 1,
        borderWidth: 1,
        // marginBottom: 5,  
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    error1: {
      borderColor: "#FF8787",
    },
    inputPhone: {
        color: "#000",
        letterSpacing: 0.9,
        fontSize: 14
    },
    btn1: {
        borderRadius: 10,
        height: 30,
        // width: width - 60,
        opacity: 1,
    },
    buttonStyle: {
        borderRadius: 10,
        height: 30,
        backgroundColor: "#f4511e",
        // width: width - 60,
        opacity: 1,
    },
    btnText: {
        letterSpacing: 1.05,
        color: "#FFFFFF",
        fontSize: 14,
        opacity: 1,
    },
})

Form.propTypes = {
    toggle: PropTypes.func,
    navigation: PropTypes.any,
    action: PropTypes.string,
    refetchUser: PropTypes.func
};

export default Form;