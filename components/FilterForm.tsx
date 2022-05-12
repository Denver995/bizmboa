import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SelectBox from 'react-native-multi-selectbox';
import {
    View, 
    TextInput, 
    StyleSheet,
    Platform,
    ActivityIndicator,
    KeyboardAvoidingView,
    Dimensions
} from "react-native";
import { Button } from "react-native-elements";
import { useForm, Controller } from "react-hook-form";
import { ALL_CATEGORIES, ALL_CITIES } from "../API/query";
import { useQuery } from "@apollo/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from "prop-types";

function FilterForm(props: any) {
    const [loader, setLoader] = useState(false);
    const [category, setCategory] = useState({id: null, item: ""});
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [city, setCity] = useState({id: null, item: ""});
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [firstLoad, setFirstLoad] = useState(true);

    const handlerFilter = () => {
        props.showFilterResult(true);
        saveDraft();
        props.handlerFilter(category.item, minPrice, maxPrice, city.item);
    }

    let allCategories = [];
    let allCities = [];

    const onCloseForm = () => {
        setLoader(false);
        saveDraft()
        props.toggle()
    }

    const onChangeCategory = (val: any) => setCategory(val);

    const onChangeCity = (val: any) => setCity(val);

    const saveDraft = () => {
        const data = {
            category: category,
            minPrice: minPrice,
            maxPrice: maxPrice,
            city: city
        }
        AsyncStorage.setItem('filter_draft', JSON.stringify(data));
    }

    useEffect(() => {
        if (firstLoad) {
            setFirstLoad(false);
            AsyncStorage.getItem('filter_draft')
            .then(req => JSON.parse(req))
            .then(json => {
                setMinPrice(json.minPrice);
                setMaxPrice(json.maxPrice);
                setCity(json.city);
                setCategory(json.category)
            })
            .catch(error => console.log('error!'));
            
        }
    }, [firstLoad]);

    const { data } = useQuery(ALL_CATEGORIES);
    if(data && data.allCategory) allCategories = data.allCategory;

    const { data: citiesData } = useQuery(ALL_CITIES);
    if(citiesData && citiesData.allCity) allCities = citiesData.allCity;

    const _displayLoading = () => {
        if (loader) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' color={"#f4511e"}/>
                </View>
            )
        }
    }

    const categoryList = () => {
        var pickerList = [];
        for (let index = 0; index < allCategories.length; index++) {
            const categorie = allCategories[index];
            pickerList.push({ item: categorie.name, id: categorie.id })
        }
        return (
            <View style={styles.selectStyle}>
                <SelectBox
                    label="Choisir une catégorie"
                    options={pickerList}
                    value={category}
                    onChange={onChangeCategory}
                    hideInputFilter={false}
                    containerStyle={{ color: "#f4511e"}}
                    labelStyle={styles.selectLabelStyle}
                    selectedItemStyle={{color: '#f4511e'}}
                />
            </View>
        )
    }

    const cityList = () => {
        var pickerList = [];
        for (let index = 0; index < allCities.length; index++) {
            const city = allCities[index];
            pickerList.push({ item: city.name, id: city.id })
        }
        return (
            <View style={styles.selectStyle}>
                <SelectBox
                    label="Choisir une ville"
                    options={pickerList}
                    value={city}
                    onChange={onChangeCity}
                    hideInputFilter={false}
                    labelStyle={styles.selectLabelStyle}
                    selectedItemStyle={{color: '#f4511e'}}
                    inputFilterContainerStyle={{color: '#f4511e'}}
                />
            </View>
        )
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            <View style={styles.container}>
                { categoryList() }
                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder={"Prix min"}
                                style={styles.input}
                                onBlur={onBlur}
                                keyboardType="decimal-pad"
                                onChangeText={(new_val) => {
                                    onChange(new_val)
                                    setMinPrice(new_val);
                                }}
                                value={minPrice}
                            />
                        )}
                        name="minPrice"
                        defaultValue=""
                    />
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder={"Prix max"}
                                style={[styles.input, { marginLeft: 15}]}
                                onBlur={onBlur}
                                keyboardType="decimal-pad"
                                onChangeText={(new_val) => {
                                    onChange(new_val)
                                    setMaxPrice(new_val);
                                }}
                                value={maxPrice}
                            />
                        )}
                        name="maxPrice"
                        defaultValue=""
                    />
                    {_displayLoading()}
                </View>
                { cityList() }
                <View style={styles.buttonContainer}>
                    <Button
                        title={"Voir les résultats"}
                        loading={loader ? true : false}
                        disabledStyle={styles.btn1}
                        buttonStyle={styles.buttonStyle}
                        disabledTitleStyle={styles.btnText}
                        onPress={handlerFilter}
                    />
                    <Button
                        title={"Annuler"}
                        loading={loader ? true : false}
                        buttonStyle={[styles.buttonStyle, { marginLeft: 10}]}
                        onPress={onCloseForm}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const mainColor = "#f4511e";
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        minHeight: Dimensions.get('window').height,
        padding: 5,
        right: -50,
        position: 'relative',
        width: Dimensions.get('window').width - 60,
        backgroundColor: 'white',
        // marginTop: 10,
        // borderRadius: 10
    },
    inputContainer: {
        // flex: 1,
        flexDirection: 'row',
        marginTop: 40,
        zIndex: 1
    },
    input: {
        width: '45%',
        height: 40,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: mainColor,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: "#FFF",
        borderColor: "#f4511e"
    },
    selectStyle: {
        marginTop: 40
    },
    buttonContainer: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        position: 'absolute',
        margin: 10,
        bottom: 10 
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
    btn1: {
        borderRadius: 10,
        height: 30,
        opacity: 1,
    },
    buttonStyle: {
        borderRadius: 10,
        height: 35,
        backgroundColor: "#f4511e",
        opacity: 1,
        margin: 10
    },
    btnText: {
        letterSpacing: 1.05,
        color: "#FFFFFF",
        fontSize: 14,
        opacity: 1,
    },
    selectLabelStyle: {
        color: "#f4511e",   
    }
})

FilterForm.propTypes = {
    toggle: PropTypes.func,
    handlerFilter: PropTypes.func,
    showFilterResult: PropTypes.func,
};

export default FilterForm;