import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ListItem } from "react-native-elements";
import { useLazyQuery, NetworkStatus } from "@apollo/client";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from "../Loader";
import Item from "./Item";
import { PRODUCT_BY_USER } from "../../API/query";

export default function ArticleByShop({showList}) {
  const [searchResult, setSearchResult] = useState([]);
  const [products, setProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const [scrollBegin, setScrollBegin] = useState(false);
  const selectedShop = useSelector(state => state.selectedShop);
    
    
  const handleResult = (result: any) => {
    setSearchResult(result);
    if(result.edges) setProducts(result.edges);
  }
    
  const handleError = () => {
    setErrorMessage("Une erreur s'est produite");
  }

  const [productByUser, { loading, error, fetchMore, refetch, networkStatus }] = useLazyQuery(PRODUCT_BY_USER, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setIsSearching(false);
      handleResult(data.allProducts);
    },
    onError() {
      setIsSearching(false)
      handleError()
    },
  });

  const refreshing = networkStatus === NetworkStatus.refetch

  const handleOnEndReached = () => {
    if (fetchMore && searchResult?.pageInfo.hasNextPage){
      fetchMore({
        query: PRODUCT_BY_USER,
        variables: {
          after: searchResult?.pageInfo.endCursor,
          first: 5,
        },
        // updateQuery: onUpdate
      })
      .then(result => {
        setSearchResult(result.data.allProducts);
        if(result.data.allProducts.edges) setProducts(products.concat(result.data.allProducts.edges));
      })
      .catch(error => console.log('fetch more error ', error));
    }    
  }

  useEffect(() => {
    if (firstLoad) {
      setIsSearching(false);
      setFirstLoad(false);
      productByUser({
        variables: {
          first: 10,
          after: 0,
          phone: selectedShop.phone
        }
      })
      .then(resp => {
        setIsSearching(false);
        handleResult(resp.data.allProducts)
      })
      .catch(error => {
        setIsSearching(false);
        handleError()
      })
    }
  }, [firstLoad, searchResult, products])

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => showList(false)} style={styles.titleContainer}>
        <ListItem bottomDivider>
          <MaterialCommunityIcons
            name="arrow-left"
            size={30}
            color="#f4511e"
          />
          <ListItem.Content>
            <ListItem.Title>{selectedShop.company}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
      <View style={styles.resultContainer}>
        {loading ?<><Loader /><Loader /><Loader /></>  : <></>}
        {(!loading && products.length > 0) && (
          <FlatList
            data={products}
            renderItem={({item}) => 
                <Item product={item.node} key={item.node.id}/>
            }
            keyExtractor={(item, index) => index.toString()}
            onMomentumScrollBegin={() => {setScrollBegin(true)}}
            onMomentumScrollEnd={() => setScrollBegin(false)}
            onEndReached={({ distanceFromEnd }) => {
                scrollBegin &&
                handleOnEndReached()
            }}
            onEndReachedThreshold={0.5}
            onRefresh={refetch}
            refreshing={refreshing}
          />
        )}
        {!loading && products.length == 0 && 
          <View style={{ marginTop: 15}}>
            <Text style={styles.anyResult}>{error ? "Oops...Une erreur s'est produite":"Aucun r??sultat"}</Text>
          </View>
        }
      </View>
      {scrollBegin &&
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color={'#f4511e'}/>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    titleContainer: {
      flex: 1,
      marginBottom: 0,
      height: 15
    },
    anyResult: {
      textAlign: 'center',
      color: '#666666',
      justifyContent: 'center',
      alignContent: 'center',
      fontSize: 26,

    },
    resultContainer: {
      height: '90%',
      marginLeft: 13,
      marginRight: 13,
    },
    loading_container: {
      flex: 1,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      color: '#f4511e'
    }
})