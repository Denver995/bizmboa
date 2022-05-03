import React, { useEffect, useState } from "react"; 
import { FlatList, StyleSheet, Text, View } from "react-native";
import Item from './Item';
import PropTypes from "prop-types";

function List({ products, onEndReached, refetch,  refreshing}) {
    const [list, setList] = useState(products)
    const [scrollBegin, setScrollBegin] = useState(false);
    
    return (
        <View style={styles.container}>
            { products.length > 0 ?
                <FlatList
                    data={list}
                    renderItem={({item}) => 
                        <Item product={item.node} key={item.node.id}/>
                    }
                    keyExtractor={(item, index) => index.toString()}
                    onMomentumScrollBegin={() => {setScrollBegin(true)}}
                    onMomentumScrollEnd={() => {
                        setScrollBegin(false);
                        console.log('scrool end ');
                    }}
                    onEndReached={({ distanceFromEnd }) => {
                        console.log('distanceFromEnd ', distanceFromEnd<=0.5);
                        scrollBegin &&
                        onEndReached()
                        }
                    }
                    onEndReachedThreshold={0.5}
                    onRefresh={refetch}
                    refreshing={refreshing}
                />
                : <Text style={styles.anyResult}>Aucun résultat</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    anyResult: {
        textAlign: 'center',
        color: '#666666',
        justifyContent: 'center',
        fontSize: 26,
        marginTop: 25,
    }

})

List.propTypes = {
    onEndReached: PropTypes.func,
    refetch: PropTypes.func,
    refreshing: PropTypes.bool,
    products: PropTypes.array
};

export default List;