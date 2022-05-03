import React from "react";
import { useDispatch } from "react-redux";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Image, Icon } from 'react-native-elements';
import { media_url } from "../../utils/config";
import { setSelectedShop } from "../../actions";

export default function Item({shop, showList}) {
    const dispatch = useDispatch();
    
    const onclickShop = () => {
        dispatch(setSelectedShop(shop));
        showList(true);
    }

    return (
        <TouchableOpacity style={[styles.container, styles.shadowContainer, styles.shadowProp]} onPress={onclickShop}>
            <Image
              style={styles.userImage}
              source={shop?.shopLogo && shop?.shopLogo.length > 0 ? {uri: `${media_url}/${shop?.shopLogo[0].image}`} : require('../../Images/defaultStore1.jpeg')}
              PlaceholderContent={<ActivityIndicator />}
            />
            <View style={styles.detailContainer}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>
                        {shop.company ? shop.company : "Boutique sans nom"}
                    </Text>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description} numberOfLines={3}>
                        {shop?.profileDescription}
                    </Text>
                </View>
                <View style={styles.userAddressRow}>
                    <Icon
                        name="place"
                        underlayColor="transparent"
                        iconStyle={styles.placeIcon}
                        // onPress={onPressPlace}
                    />
                    <Text style={styles.userCityText}>
                        {shop?.city ? shop?.city : "Douala"}, {shop?.country ? shop?.country : "Cameroon"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flex: 1,
        flexDirection: 'row'
    },
    shadowContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginVertical: 10,
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.8,
        shadowRadius: 3,
    },
    userCityText: {
      color: '#f4511e',
      fontSize: 15,
      fontWeight: '600',
    },
    userImage: {
      borderColor: '#FFF',
      borderRadius: 60,
      borderWidth: 3,
      height: 120,
      marginBottom:5,
      width: 120,
    },
    userAddressRow: { 
        alignItems: 'center',
        flexDirection: 'row',
        left: 35,

    },
    placeIcon: {
      color: '#f4511e',
      fontSize: 26,
    },
    detailContainer: {
        flex: 1,
        paddingLeft: 7
    },
    header: {
        flex: 1,
        flexDirection: "row",
    },
    title: {
        fontSize: 15,
        flexWrap: 'wrap',
        width: "70%"
    },
    descriptionContainer: {
        flex: 1
    },
    description: {
        color: '#666666',
        // height: '35%',
        fontSize: 12,
        alignItems: 'center',
    }
})