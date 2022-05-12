import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, Text, Image, TouchableOpacity, Linking, ScrollView } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { reloadFavoritesScreen, showArticleDetail } from '../../actions';
import { SliderBox } from "react-native-image-slider-box";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateRNFile } from "../../utils/helper";
import { media_url } from "../../utils/config";


export default function Detail() {
    const dispatch = useDispatch();
    const selectedArticle = useSelector(state => state.selectedArticle);
    const [loader, setLoader] = useState(false);
    const [favoris, setFavoris] = useState([]);
    const [productImages, setProductImage] = useState([]);
    const [firstLoad, setFirstLoad] = useState(true);
    const [imageTodisplayed, setImageToDisplayed] = useState(0);
    const [showFullScreenImage, setShowFullScreenImage] = useState(false);

    const onClose = () => {
        dispatch(showArticleDetail(false));
    }    

    const indexProduct = () => {
        const index = favoris.findIndex(item => item.id === selectedArticle.id);
        return index;
    }
    
    const toggleFavorisProduct  = () => {
        let listFavoris = favoris;
        if(indexProduct() !== -1)
            listFavoris = favoris.filter((item, index) => item.id !== selectedArticle.id)
        else
            listFavoris.push(selectedArticle);
        AsyncStorage.setItem('favoris', JSON.stringify(listFavoris))
        .then(json => {
            setFirstLoad(true);
            dispatch(reloadFavoritesScreen(true));
        })
        .catch(error => console.log('error!'));
    }

    const getProductImagesUri = () => {
        if(productImages.length > 0) return;
        selectedArticle.images.forEach((val: any) => {
            const file = generateRNFile(`${media_url}/${val?.image}`, val?.image);
            productImages.push(file);
        });
        
    }

    const onPressTel = (number: any) => {
        Linking.openURL(`tel://${number}`).catch(err => console.log('Error:', err))
    }

    const onPressHand = (type: string) => {

    }
    
    const openWhatsApp = (number: any) => {
        let url = "whatsapp://send?text=" +
          "Bonjour et Bienvenue dans la messagerie de bizmboa" +
          "&phone=" +
          `${number}`;
            Linking.openURL(url).then(data => {
        }).catch(() => {
          alert("Make sure WhatsApp installed on your device");
        });
    };

    useEffect(() => {
        if(firstLoad){
            // setProductImage([]);
            getProductImagesUri();
            AsyncStorage.getItem('favoris')
            .then(req => JSON.parse(req))
            .then(json => {
                setFavoris(json !== null ? json : []);
              })
            .catch(error => console.log('error!'));
            setFirstLoad(false)
        }
    }, [selectedArticle, favoris, firstLoad])

    const _displayFavoriteImage = () => {
        let sourceImage = require('../../Images/ic_favorite_border.png');
        if (indexProduct() !== -1) {
            sourceImage = require('../../Images/ic_favorite.png');
        }
        return (
            <Image
                style={styles.favorite_image}
                source={sourceImage}
            />
        )
    }

    const showFullScreen = (index) => {
        setImageToDisplayed(index);
        setShowFullScreenImage(true);
    }

    const _display = () => {
        return (
            <>
                {!showFullScreenImage &&
                    <View style={styles.container}>
                        <View style={styles.titleContainer}>
                            <TouchableOpacity onPress={onClose}>
                                <MaterialCommunityIcons
                                    name="close-circle"
                                    size={30}
                                    color={mainColor}
                                />
                            </TouchableOpacity>
                            <Text style={styles.price}>
                                {selectedArticle?.name} - {selectedArticle?.price ? selectedArticle?.price.toLocaleString('de-DE') +" fcfa" : "Aucune prix"}
                            </Text>
                        </View>
                        {/* <Image style={styles.image_container} source={require('../../Images/machupicu.jpg')}/> */}
                        
                        <View style={styles.uploadImage}>
                            { selectedArticle.images.length > 0 && 
                                <SliderBox
                                    images={productImages}
                                    onCurrentImagePressed={index => {showFullScreen(index)}}
                                />
                            }
                        </View>
                        <TouchableOpacity
                            style={styles.favorite_container}
                            onPress={toggleFavorisProduct}
                        >
                            {_displayFavoriteImage()}
                        </TouchableOpacity>
                        <View style={styles.block_commander}>
                            <TouchableOpacity style={styles.action_item} onPress={() => onPressHand('up')}>
                                <AntDesign
                                    name="like1"
                                    size={25}
                                    color="#f4511e"
                                />
                                <Text style={styles.note}>12</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.action_item} onPress={() => onPressHand('down')}>
                                <AntDesign
                                    name="dislike1"
                                    size={25}
                                    color="#f4511e"
                                />
                                <Text style={styles.note}>3</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.action_item} onPress={() => onPressTel(selectedArticle.createdBy.phone)}>
                                <MaterialCommunityIcons
                                    name="phone"
                                    size={25}
                                    color="#f4511e"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.action_item} onPress={() => openWhatsApp(selectedArticle.createdBy.phone)}>
                                <MaterialCommunityIcons
                                    name="chat"
                                    size={25}
                                    color="#f4511e"
                                />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.description_text_block}>
                            <Text style={styles.description_text}>
                                {selectedArticle?.description}
                            </Text>
                        </ScrollView>
                        {/* <Rating showRating fractions={1} startingValue={3.3} imageSize={20} /> */}
                    </View>
                }
                {showFullScreenImage && 
                    <View
                        style={styles.fulScreenImage}
                    >
                        <SliderBox
                            sliderBoxHeight={'100%'}
                            images={productImages}
                            onCurrentImagePressed={index => {setShowFullScreenImage(false)}}
                            circleLoop={true}
                            firstItem={imageTodisplayed}
                            style
                        />
                    </View>
                }
            </>
        )
    }

    return(
        <View style={styles.main_container}>
            <Spinner visible={loader}/>
            {_display()}
        </View> 
    )
}

const mainColor = '#f4511e';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: 'white'
    },
    favorite_container: {
        alignItems: 'center', // Alignement des components enfants sur l'axe secondaire, X ici
    },
    favorite_image: {
        marginTop: '5%',
        width: 40,
        height: 30
    },
    main_container: {
        flex: 1
    },
    image_container: {
        marginTop: '5%',
        height: '30%',
        width: '100%',
        backgroundColor: 'gray'
    },
    titleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12
    },
    price: {
        letterSpacing: 1,
        color: "#f4511e",
        fontSize: 19,
        opacity: 0.9,
        maxWidth: '85%'
    },
    description_text_block: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        margin: 10,
        paddingBottom: 15,
        marginHorizontal: 20,
    },
    description_text: {
        // fontStyle: 'italic',
        color: '#666666',
        letterSpacing: 1,
        fontSize: 15,
    },
    uploadImage: {
        overflow: 'hidden',
        // marginTop: '5%',
        height: '30%',
        width: '100%'
    },
    block_commander: {
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 15,
        justifyContent: 'center',
    },
    action_item: {
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15
    },
    note: {
        padding: 3
    },
    fulScreenImage: {
        flex: 1, 
        right: 0, 
        left: 0, 
        top: 0, 
        bottom: 0, 
        position: 'absolute', 
        alignItems: 'center',
        justifyContent: 'center'
    }
})