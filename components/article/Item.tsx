import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Image } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Switch } from 'react-native-elements';
import { setSelectedArticle, showArticleDetail, showArticleForm } from "../../actions";
import Moment from "moment";
import { media_url } from "../../utils/config";
import { UPDATE_ARTICLE, TOGGLE_STATUS_ARTICLE_MESSAGE } from "../../utils/constants";
import { useMutation } from "@apollo/client";
import Toast from "react-native-toast-message";
import { UPDATE_PRODUCT_STATUS, DELETE_PRODUCT } from "../../API/mutations";

export default function Item({product, showAction=false, refetch}) {
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(product.publish);
    // const formAction = useSelector(state => state?.formAction);
    const [changeArticleStatus] = useMutation(UPDATE_PRODUCT_STATUS);
    const [deleteArticle] = useMutation(DELETE_PRODUCT);
    let priceFormat = Intl.NumberFormat('de-DE');

    const showAlert = (index) => {
        Alert.alert(
            "Attention!!!",
            "Une fois supprimé, votre article ne sera plus visible sur la plateforme"
            +"\nSouhaitez-vous continuer ?",
            [
                {
                    text: "Annuler",
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: "Continuer",
                    onPress: () => {
                        onDelete();
                    },
                },
            ],
            {
                cancelable: true,
            }
        );
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

    const  onDelete = () => {
        deleteArticle({
            variables: {
                id: product.id
            },
        })
        .then((res) => {
            setChecked(!checked);
            toast("success", "bottom", "Succès", "Article supprimé avec succès");
            refetch()
        })
        .catch((err) => {
            setChecked(checked);
            toast("error", "top", "Erreur", "Une erreur est survenue lors de l'opération");
        });
    };
    
    const toggleSwitch = (value) => {
        setChecked(value);
        changeArticleStatus({
            variables: {
                id: product.id,
                publish: value,
            },
        })
        .then((res) => {
            setChecked(!checked);
            toast("success", "bottom", "Succès", TOGGLE_STATUS_ARTICLE_MESSAGE);
        })
        .catch((err) => {
            setChecked(checked);
            toast("error", "top", "Erreur", "Une erreur est survenue lors de l'opération");
        });
    };
    

    const showDetail = () => {
        dispatch(setSelectedArticle(product));
        dispatch(showArticleDetail(true));
    }

    const onEdit = () => {
        dispatch(setSelectedArticle(product));
        dispatch(showArticleForm(UPDATE_ARTICLE));
    }
    
    return (
        <TouchableOpacity style={[styles.container, styles.shadowContainer, styles.shadowProp]} onPress={showDetail}>
            {product.images && product.images.length > 0 ? 
                (
                    <Image 
                        containerStyle={styles.image} 
                        source={{uri: `${media_url}/${product.images[0].image}`}}
                        // PlaceholderContent={<ActivityIndicator />}
                    />
                ):
                (
                    <Image 
                        containerStyle={styles.image} 
                        source={require('../../Images/defaultProduct.jpeg')}
                        PlaceholderContent={<ActivityIndicator />}
                        progressiveRenderingEnabled={true}
                    />
                )
            }
            <View style={styles.detailContainer}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>
                        {product?.name}
                    </Text>
                    {showAction && 
                        <View style={styles.actionContainer}>
                            <TouchableOpacity onPress={showAlert} style={styles.edit}
                                hitSlop={{top: 25, bottom: 25, left: 30, right: 40}}
                            >
                                <MaterialCommunityIcons
                                    name="delete-circle"
                                    size={20}
                                    color={"#f4511e"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onEdit} style={styles.edit}
                                hitSlop={{top: 25, bottom: 25, left: 30, right: 30}}
                            >
                                <MaterialCommunityIcons
                                    name="pencil-circle"
                                    size={20}
                                    color={"#f4511e"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Switch}>
                                <Switch
                                    value={checked}
                                    onValueChange={toggleSwitch}
                                    color={"#f4511e"}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                <Text style={styles.description} numberOfLines={3}>
                    {product?.description}
                </Text>
                <View style={styles.footer}>
                    {/* <Text style={styles.vote}>
                        {product?.note ? product?.note : ""} 
                    </Text> */}
                    <Text style={styles.vote}>
                        {product?.price ? priceFormat.format(product?.price)+" Fcfa" : ""}
                    </Text>
                    <Text style={styles.createdAt} >
                        {Moment(new Date(product.createdAt)).startOf('day').fromNow()}
                        
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    shadowContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 0,
        paddingHorizontal: 0,
        width: '100%',
        marginVertical: 10,
    },
    header: {
        flex: 1,
        flexDirection: "row",
        width: '70%'
    },
    actionContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: -9
    },
    title: {
        fontSize: 15,
        flexWrap: 'wrap',
        width: "70%"
    },
    Switch: {
        marginTop: -2,
    },
    edit: {
        marginRight: 15,
        marginTop: 10,
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    detailContainer: {
        flex: 1,
        paddingLeft: 7,
        paddingTop: 5
    },
    image: {
        width: '30%',
        height: 120,
        margin: 8,
        aspectRatio: 1,
        backgroundColor: 'gray'
    },
    description: {
        color: '#666666',
        height: '35%',
        fontSize: 12
    },
    footer: {
        flex: 1,
        flexDirection: 'row'
    },
    vote: { 
        width: '60%',
        fontWeight: 'bold',
        fontSize: 10,
        marginTop: 23,
        color: '#f4511e'
    },
    createdAt: {
        fontSize: 10,
        marginTop: 23,
        right: -22,
        color: '#f4511e'
    },
    bizProduct: {
        
    }

})