import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSelector, useDispatch } from 'react-redux';
import Modal from "react-native-modal";
import Form from '../components/account/Form';
import Header from '../components/account/Header';
import Loader from "../components/Loader";
import Item from '../components/article/Item';
import { useLazyQuery, useQuery, NetworkStatus } from "@apollo/client";
import { PRODUCT_BY_USER, USER_INFO } from '../API/query';
import { setUserData } from '../actions';
import { media_url } from "../utils/config";

export default function AccountScreen({ navigation }) {
  const dispatch = useDispatch();
  const userData = useSelector(state => state?.userData);
  const [searchResult, setSearchResult] = useState([]);
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [scrollBegin, setScrollBegin] = useState(false);
  const [phone, setPhone] = useState(userData?.phone);
  const [showForm, setShowForm] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [refetchUserInfo, setRefetchUserInfo] = useState(false);

  const [getUserInfo, { loading: loadingUserInfo, error: UserInfoError, refetch: refetchUser }] = useLazyQuery(USER_INFO, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log('successfull get user data ', data);
      
    },
    onError() {
      console.log('error ', error);
    },
  });


  const handleResult = (result: any) => {
    setSearchResult(result);
    setIsSearching(false);
    if(result.edges) setProducts(result.edges);
    // setPhone(data.connectedUser.phone);
  }

  const handleError = () => {
    setIsSearching(false);
    setErrorMessage("Une erreur s'est produite");
  }

  const [getProduct, { loading: loadingProduct, error, fetchMore, refetch, networkStatus }] = useLazyQuery(PRODUCT_BY_USER, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      handleResult(data.allProducts);
    },
    onError() {
      handleError()
      console.log('error ', error);
    },
  });

  const toggleForm = async() => {
    if(showForm && refetchUserInfo) {
      data = null;
      await refetchUser();
      setIsFirstLoad(true)
      console.log('reloading ');
    }
    setShowForm(!showForm);
  }


  const refreshing = networkStatus === NetworkStatus.refetch;

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
    if(isFirstLoad) {
      getUserInfo()
      .then(userInfo => {
        setIsSearching(true);
        getProduct({
          variables: {
            first: 10,
            after: 0,
            id: userInfo.data.connectedUser.id,
          }
        })
        .then(resp => {
          setIsSearching(false);
          if(resp.data.allProducts && resp.data.allProducts.edges) setProducts(resp.data.allProducts.edges);
        })
        .catch(error => {
          handleError()
        })
        setIsFirstLoad(false)
      }).catch(error => {
        console.log('user info error ', error);
      })
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, userData, isSearching]);
  
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Header 
            avatarBackground={'https://i.imgur.com/rXVcgTZ.jpg'} 
            photo={userData?.shopLogo && userData?.shopLogo.length > 0 ? `${media_url}/${userData?.shopLogo[0].image}` : ''}
            name={userData?.company}
            city={'Douala'}
            country={'Cameroun'}
          />
        </View>
        <View style={styles.resultContainer}>
          {isSearching ? <><Loader /><Loader /></>  : <></>}
          {!isSearching && products && products.length > 0 && 
            <FlatList
              data={products}
              renderItem={({item}) => 
                <Item product={item.node} showAction={true} refetch={refetch}/>
              }
              keyExtractor={(item, index) => index.toString()}
              onMomentumScrollBegin={() => {setScrollBegin(true)}}
              onMomentumScrollEnd={() => setScrollBegin(false)}
              onEndReached={({ distanceFromEnd }) => {
                scrollBegin &&
                handleOnEndReached()
              }}
              // onEndReachedThreshold={0.5}
              onRefresh={refetch}
              refreshing={refreshing}
            />   
          }
        </View>
        <TouchableOpacity 
          style={styles.plusContainer} 
          onPress={toggleForm}
        >
          <Icon name="user-cog" size={20} color="white" />
        </TouchableOpacity>
        {!isFirstLoad && !isSearching && products.length == 0 && 
          <View style={{flex: 1 ,marginTop: 15}}>
            {products.length == 0 && <Text style={styles.anyResult}>Aucune publication</Text>}
          </View>
        }
        {scrollBegin &&
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' color={mainColor}/>
          </View>
        }
      </View>
      <Modal
        isVisible={showForm}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        // onBackdropPress={toggleForm}
        // onSwipeComplete={toggleForm}
      >
        <Form toggle={toggleForm} navigation={navigation} refetchUser={setRefetchUserInfo}/>
      </Modal>
    </View>
  );
}

const mainColor = '#f4511e';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    // flex: 1,
    height: '35%'
  },
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  anyResult: {
    textAlign: 'center',
    color: '#666666',
    justifyContent: 'center',
    fontSize: 26,
  },
  resultContainer: {
    // marginTop: -15,
    flex: 1,
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
  plusContainer: {
    position: 'absolute',
    zIndex: 1,
    width: 50,
    height: 50,
    // backgroundColor: "#f4511e",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    // bottom: 5,
    // right: 5,
    top: 5,
    right: 5,
    shadowColor: '#766f85',
    shadowOpacity: 0.3
  },
});