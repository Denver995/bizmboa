import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
// import ImagePicker from "react-native-customized-image-picker";
import { SliderBox } from "react-native-image-slider-box";
import SelectBox from 'react-native-multi-selectbox';
import { 
    Text, 
    View, 
    TextInput, 
    StyleSheet, 
    Alert,
    Platform, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useForm, Controller } from "react-hook-form";
import { CREATE_PRODUCT, UPDATE_PRODUCT } from "../../API/mutations";
import { ALL_CATEGORIES } from "../../API/query";
import Toast from "react-native-toast-message";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from "prop-types";
import { generateRNFile } from "../../utils/helper";
import { UPDATE_ARTICLE, ADD_ARTICLE , UPDATE_ARTICLE_MESSAGE, ADD_ARTICLE_MESSAGE } from "../../utils/constants";

function Form(props: any) {
    const [localImage, setLocalImage] = useState([])
    const [imagesSrc] = useState<any[]>([]);
    const [loader, setLoader] = useState(false);
    const [category, setCategory] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState();
    const selectedArticle = useSelector(state => state?.selectedArticle);
    const formAction = useSelector(state => state?.formAction);
    const [allCategory, setAllCategory] = useState([]);
    const [firstLoad, setFirstLoad] = useState(true);

    const FORM_HANDLER = formAction === ADD_ARTICLE ? CREATE_PRODUCT : UPDATE_PRODUCT;
    const [handleForm] = useMutation(FORM_HANDLER);

    const [fetchCategories, { loading, error, refetch }] = useLazyQuery(ALL_CATEGORIES, { 
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {
          setAllCategory(data.allCategory);
        },
        onError() {},
      });

    const { control, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data: any) => {
        //handleSubmit
        submitProduct();
    }; 

    const photoOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        allowsEditing: false,
        selectionLimit: 0,
        allowsMultipleSelection: true,
        // aspect: [4, 3],
        quality: 1,
    }

    const onCloseForm = () => {
        setLoader(false);
        saveDraft()
        props.toggle()
    }

    const toast = (type: string, position: any, title: string, msg: string) => {
        Toast.show({
          type: type,
          position: position,
          text1: title,
          text2: msg,
          visibilityTime: 2000,
          autoHide: true,
        });
    }

    const onChangeCategory = (val: any) => setCategory(val);

    const setDefaultValue = () => {
        setTitle(selectedArticle.name);
        setPrice(selectedArticle?.price.toString());
        setDescription(selectedArticle.description);
        setCategory({id: selectedArticle.category.id, item: selectedArticle.category.name})
        
       
    }

    const saveDraft = () => {
        const data = {
            title: title,
            description: description,
            category: category,
            price: price,
            imagesSrc: imagesSrc,
            localImage: localImage
        }
        AsyncStorage.setItem('product_draft', JSON.stringify(data));
    }

    useEffect(() => {
        if(firstLoad && allCategory.length === 0){
            fetchCategories().then(resp => {
                setAllCategory(resp.data.allCategory);
            })
            .catch(error => console.log("'une erreur s'est produite"));
        }
        if (firstLoad) {
            getPermissionAsync();
            setFirstLoad(false);
            if(formAction === UPDATE_ARTICLE) {
                setDefaultValue();
                return;
            }
            AsyncStorage.getItem('product_draft')
            .then(req => JSON.parse(req))
            .then(json => {
                setPrice(json.price);
                setDescription(json.description);
                setTitle(json.title);
                setLocalImage(json.localImage);
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
        if(!imageObject) return;
        let imageUri = imageObject ? imageObject.uri : null
        imageUri = Platform.OS === "android" ? imageUri : imageUri.replace("file://", "")
        const file_ext = imageUri.split(".").pop();
        let file = generateRNFile(imageUri, `picture-${Date.now()}`);
        setLocalImage([...localImage,file]);
        imagesSrc.push({
            file: file,
            ext: file_ext,
        });
        totalImage = imagesSrc.length;
    }

    const takePhoto = async (response: any) => {
        let pickerResult = await ImagePicker.launchCameraAsync(photoOptions);
        addPhoto(pickerResult); 
    }

    const _pickImage = async (response: any) => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync(photoOptions)
        addPhoto(pickerResult); 
    }

    const categoryList = () => {
        var pickerList = [];
        for (let index = 0; index < allCategory.length; index++) {
            const categorie = allCategory[index];
            pickerList.push({ item: categorie.name, id: categorie.id })
        }
        return (
            <View>
                <SelectBox
                    label="Choisir une catégorie"
                    options={pickerList}
                    value={category}
                    onChange={onChangeCategory}
                    hideInputFilter={false}
                />
            </View>
        )
    }

    //submit user
    const submitProduct = () => {
        if((localImage.length === 0 && formAction === ADD_ARTICLE) || description.length < 3 || title.length < 3 ) {
            props.toggle();
            toast("error", "top", "Erreur", "Vous devez ajouter au moin une image");
            return;
        }
        if(!category){
            props.toggle();
            toast("error", "top", "Erreur", "Vous devez sélectionner une catégorie");
            return;
        }
        setLoader(true);
        console.log('local image in article form ', localImage);
        handleForm({
            variables: {
                id: selectedArticle.id,
                name: title,
                description: description,
                price: price,
                category: category?.id,
                images: localImage,
            },
        })
        .then((res) => {
            setLoader(false);
            if(formAction === ADD_ARTICLE)
                toast("success", "bottom", "Succès", ADD_ARTICLE_MESSAGE);
            else
                toast("success", "bottom", "Succès", UPDATE_ARTICLE_MESSAGE);
            props.navigation.navigate('AccountScreen');
            props.toggle();
        })
        .catch((err) => {
            console.log('error ', err);
            setLoader(false);
            toast("error", "top", "Erreur", "Une erreur est survenue lors de l'enregistrement");
            saveDraft();
            props.toggle();
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
                        setLocalImage(localImage.filter(item => item !== localImage[index]));
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
                { categoryList() }
                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder={"Titre"}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={(new_val) => {
                                    onChange(new_val)
                                    setTitle(new_val);
                                }}
                                value={title}
                            />
                        )}
                        name="title"
                        defaultValue=""
                    />
                    {errors.title && <Text>Ce champs est requis.</Text>}

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder={"Prix"}
                                style={styles.input}
                                onBlur={onBlur}
                                keyboardType="decimal-pad"
                                onChangeText={(new_val) => {
                                    onChange(new_val)
                                    setPrice(new_val);
                                }}
                                value={price}
                            />
                        )}
                        name="price"
                        defaultValue=""
                    />
                    {errors.price && <Text>Ce champs est requis.</Text>}
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
                <View style={[styles.uploadImage, {height: localImage.length  > 0 ? '35%' : 0}]}>
                    { localImage.length > 0 && 
                        <SliderBox
                            images={localImage}
                            onCurrentImagePressed={index => {showAlert(index)}}
                            // currentImageEmitter={index => {}}
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
                    <TouchableOpacity onPress={onSubmit} disabled={loader}>
                        <MaterialCommunityIcons
                            name={'send-circle'}
                            size={45}
                            color={mainColor}
                        />
                    </TouchableOpacity>
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
        // flex: 1,
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
        // flex: 1,
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
    }
})

Form.propTypes = {
    toggle: PropTypes.func,
    navigation: PropTypes.any,
    action: PropTypes.string
};

export default Form;