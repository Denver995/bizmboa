import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { Input } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useLazyQuery, NetworkStatus } from "@apollo/client";
import Item from "./article/Item";
import Loader from "./Loader";
import FilterForm from "./FilterForm";
import { ALL_PRODUCT, FILTER_PRODUCT } from "../API/query";

export default function Search() {
    const [searchText, setSearchText] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [products, setProducts] = useState([]);
    const [isSearching, setIsSearching] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [firstLoad, setFirstLoad] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [showFilterResult, setShowFilterResult] = useState(false);
    const [category, setCategory] = useState();
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [city, setCity] = useState();
    const windowHeight = Dimensions.get('window').height;

    
    const handleResult = (result: any) => {
        setIsSearching(false);
        setSearchResult(result);
        if(result.edges) setProducts(result.edges);
    }

    const handleError = () => {
        setErrorMessage("Une erreur s'est produite");
    } 

    const [searchProduct, { loading, error, fetchMore, refetch, networkStatus }] = useLazyQuery(ALL_PRODUCT, {
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {
            setIsSearching(false);
            handleResult(data.allProducts);
        },
        onError() {
            setIsSearching(false)
            handleError()
            console.log('error ', error);
        },
    });

    const [filterProduct, { 
        loading: loadingFilter, 
        error: errorFilter, 
        fetchMore: fetchMoreFilter, 
        refetch: refetchFilter, 
        networkStatus: networkStatusFilter 
    }] = useLazyQuery(FILTER_PRODUCT, {
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {
            setIsSearching(false);
            handleResult(data.allProducts);
        },
        onError: (error) =>  {
            setIsSearching(false);
            handleError();
        },
    });


    const refreshing = !showFilterResult ? networkStatus === NetworkStatus.refetch : networkStatusFilter === NetworkStatus.refetch;

    const updateSearch = (text: string) => {
        setProducts([]);
        setSearchResult([]);
        setShowFilterResult(false);
        if(text.length > 0){
            setIsSearching(true);
            setSearchText(text);
            searchProduct({
                variables: {
                    first: 10,
                    after: 0,
                    name: text
                }
            })
        }else cancelSearch();
    }

    const handlerFilter = (category: String, minPrice: Number, maxPrice: Number, city: String) => {
        toggleFilter();
        setProducts([]);
        setSearchResult([]);
        // setCategory(category)
        // setMaxPrice(maxPrice)
        // setMinPrice(minPrice)
        // setCity(city)
        setIsSearching(true);
        filterProduct({
            variables: {
                first: 10,
                after: 0,
                category: category,
                minPrice: minPrice,
                maxPrice: maxPrice,
                city: city
            }
        })
    }

    const cancelSearch = () => {
        setShowFilterResult(false)
        setSearchText('')
        searchProduct({
            variables: {
                first: 10,
                after: 0,
                name: ''
            }
        })
    }

    const toggleFilter = () => setShowFilter(!showFilter)

    const handleOnEndReached = () => {
        if (fetchMore && searchResult?.pageInfo.hasNextPage){
            fetchMore({
                query: ALL_PRODUCT,
                variables: {
                    after: searchResult?.pageInfo.endCursor,
                    first: 5,
                    name: searchText
                },
            })
            .then(result => {
                setSearchResult(result.data.allProducts);
                if(result.data.allProducts.edges) setProducts(products.concat(result.data.allProducts.edges));
            })
            .catch(error => console.log('fetch more error ', error));
        }    
    }

    const handleOnEndReachedFilter = () => {
        if (fetchMoreFilter && searchResult?.pageInfo.hasNextPage){
            fetchMoreFilter({
                query: FILTER_PRODUCT,
                variables: {
                    after: searchResult?.pageInfo.endCursor,
                    first: 5
                },
            })
            .then(result => {
                setSearchResult(result.data.allProducts);
                if(result.data.allProducts.edges) setProducts(products.concat(result.data.allProducts.edges));
            })
            .catch(error => console.log('fetch more error ', error));
        }    
    }

    const onScroll = () => {
        showFilterResult ? handleOnEndReachedFilter() : handleOnEndReached();
    }
    
    const onRefetch = () => showFilterResult ? refetchFilter : refetch;

    useEffect(() => {
        if (firstLoad) {
            setIsSearching(true);
            searchProduct({
                variables: {
                    first: 10,
                    after: 0,
                    name: ''
                }
            }).then(resp => {
                setIsSearching(false);
                handleResult(resp.data.allProducts)}
            )
            .catch(error => {
                setIsSearching(false);
                handleError()
            })
            
            setFirstLoad(false);
        }
    }, [firstLoad, searchResult, products, isSearching])

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Input
                    inputContainerStyle={styles.formcontrol}
                    inputStyle={styles.input}
                    placeholder="Que recherchez-vous..."
                    onChangeText={updateSearch}
                    value={searchText}
                    leftIcon={<Icon name="search" style={styles.searchIcon} />}
                    rightIcon={
                        <View style={styles.rightIconContainer}>
                            <Icon name="close" style={styles.closeIcon} onPress={cancelSearch} />
                            <TouchableOpacity onPress={() => setShowFilter(true)}>
                                <Icon name="filter" style={styles.filterIcon} />
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>
            <View style={styles.resultContainer}>
                {isSearching && searchText.length !== 0 ? <><Loader /><Loader /></> : <></>}
                {isSearching && showFilterResult ? <><Loader /><Loader /></> : <></>}
                {(!isSearching && products.length > 0) && (
                    <FlatList
                        data={products}
                        renderItem={({item}) => 
                            <Item product={item.node} key={item.node.id}/>
                        }
                        keyExtractor={(item, index) => index.toString()}
                        onMomentumScrollBegin={() => {setScrollBegin(true)}}
                        onMomentumScrollEnd={() => setScrollBegin(false)}
                        onEndReached={({ distanceFromEnd }) => {
                            scrollBegin && onScroll()
                        }}
                        onEndReachedThreshold={0.5}
                        onRefresh={onRefetch}
                        refreshing={refreshing}
                    />
                )}
                {!isSearching && products.length == 0 && searchText.length !== 0 && <Text style={styles.anyResult}>{error ? "Oops...Une erreur s'est produite":"Aucun résultat"}</Text>}
            </View>
            <Modal
                isVisible={showFilter}
                animationIn="fadeInRight"
                animationOut="fadeInLeft"
                animationInTiming={500}
                animationOutTiming={100}
                deviceHeight={windowHeight}
            >
                <FilterForm 
                    toggle={toggleFilter}
                    handlerFilter={handlerFilter}
                    showFilterResult={setShowFilterResult}
                />
            </Modal>
            {scrollBegin &&
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' color={mainColor}/>
                </View>
            }
        </View>
    );
}

const mainColor = '#f4511e';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
      height: '10%'
    },
    formcontrol: {
        borderBottomColor: "#DCDFEC",
        backgroundColor: '#DCDFEC',
        borderRadius: 58,

    },
    input: {
        letterSpacing: 0.9,
        fontSize: 16,
        // textAlign: "center",
    },
    searchIcon: {
        color: mainColor,
        marginLeft:10,
        fontSize: 18
    },
    closeIcon: {
        color: mainColor,
        marginRight:15,
        fontSize: 18
    },
    filterContainer: {
        alignItems: 'flex-end'
    },
    rightIconContainer: {
        flexDirection: 'row'
    },
    filterIcon: {
        color: mainColor,
        marginRight: 5,
        // marginTop: 18,
        fontSize: 22
    },
    resultContainer: {
        flex: 1,
        height: '80%',
        margin: 15,
        marginTop: 16,
    },
    errorText: {
        color: 'red'
    },
    loading:{
        alignContent: 'center'
    },
    loading_container: {
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        color: mainColor
    },
    anyResult: {
        textAlign: 'center',
        color: '#666666',
        justifyContent: 'center',
        fontSize: 26,
        marginTop: 25,
    }
});