import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native'

export default function Promo() {
    return (
        <View style={styles.container}>
            <Text style={styles.promoTitle}>Best Deals</Text>
            <FlatList 
                data={[1, 2, 3]}
                horizontal={true}
                // extraData={[1, 2, 3, 4, 5]}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.promoItem}>
                        <Image
                            style={styles.img_promo_item}
                            source={require('../../Images/machupicu.jpg')}
                        />
                        <View style={styles.footer}>
                            <Text style={styles.text}>Product Title</Text>
                            <Text style={styles.price}>231 fcfa</Text>
                        </View>
                    </TouchableOpacity>
                )}
            // keyExtractor={({item, index}) => index.toString()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    promoItem: {
        padding: 2,
        margin: 2,
        // height: '100%',
        position: 'relative'
    },
    img_promo_item: {
        width: '100%',
        height: '100%',
    },
    promoTitle: {
        textAlign: 'center',
        justifyContent: 'center',
        color: '#f4511e'
    },
    footer: {
        height: '15%',
    },
    text: {
        letterSpacing: 0.8,
        color: "#000",
        fontSize: 17,
        opacity: 0.9,
        justifyContent: 'center',
        textAlign: 'center',
    },
    price: {
        letterSpacing: 0.4,
        color: "#f4511e",
        fontSize: 17,
        opacity: 0.9,
        justifyContent: 'center',
        textAlign: 'center'
    },
});