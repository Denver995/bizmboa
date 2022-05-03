import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import ShopLoader from "../components/ShopLoader";
import { Input } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import Item from "../components/shop/Item";
import ArticleByShop from '../components/article/ArticleByShop';
import { useLazyQuery, NetworkStatus } from "@apollo/client";
import { ALL_USERS } from "../API/query";

export default function ShopScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(true);
  const [searchResult, setSearchResult] = useState([]);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [scrollBegin, setScrollBegin] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [showListResult, setShowListResult] = useState(false);
  
  const [getUsers, { loading, error, fetchMore, refetch, networkStatus }] =
    useLazyQuery(ALL_USERS, {
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        handleResult(data.allUsers);
      },
      onError() {
        // setIsSearching(false)
        handleError();
        console.log("error ", error);
      },
    });

    const handleResult = (result: any) => {
      setSearchResult(result);
      setIsSearching(false);
      if(result.edges) {
        setUsers(result.edges);
      }
    }

    const handleError = () => {
      setIsSearching(false);
      setErrorMessage("Une erreur s'est produite");
    } 

    const updateSearch = (text: string) => {
        if(text.length > 0){
            setIsSearching(true);
            setSearchText(text);
            getUsers({
                variables: {
                  first: 10,
                  after: 0,
                  company: text
                }
            })
        }else cancelSearch();
    }

    const cancelSearch = () => {
      setSearchText('')
      getUsers({
        variables: {
          first: 10,
          after: 0,
          company: ''
        }
      })
    }

  const refreshing = networkStatus === NetworkStatus.refetch;

  const handleOnEndReached = () => {
    if (fetchMore && searchResult?.pageInfo.hasNextPage) {
      fetchMore({
        query: ALL_USERS,
        variables: {
          after: searchResult?.pageInfo.endCursor,
          first: 5,
        }
      })
        .then((result) => {
          setSearchResult(result.data.allUsers);
          if (result.data.allUsers.edges) setUsers(users.concat(result.data.allUsers.edges));
        })
        .catch((error) => console.log("fetch more error ", error));
    }
  };

  useEffect(() => {
    if (firstLoad) {
      setIsSearching(true);
      setFirstLoad(false);
      getUsers({
        variables: {
          first: 10,
          after: 0,
          company: ''
        }
      })
    }
  }, [firstLoad, searchResult, users])

  return (
    <View style={styles.container}>
      {!showListResult && 
        <View style={styles.searchContainer}>
          <Input
            inputContainerStyle={styles.formcontrol}
            inputStyle={styles.input}
            placeholder="Recherchez une boutique..."
            onChangeText={updateSearch}
            value={searchText}
            leftIcon={<Icon name="search" style={styles.searchIcon} />}
            rightIcon={<Icon name="close" style={styles.closeIcon} onPress={cancelSearch} />}
          />
        </View>
      }
      <View style={styles.cardContainer}>
        {isSearching ? (
          <>
            <ShopLoader />
            <ShopLoader />
            <ShopLoader />
          </> 
        ) : (
          <></>
        )}
        {!showListResult && !isSearching && users.length > 0 && (
          <FlatList
            data={users}
            renderItem={({ item }) => (
              <Item shop={item.node} key={item.node.id} showList={setShowListResult}/>
            )}
            keyExtractor={(item, index) => index.toString()}
            onMomentumScrollBegin={() => {
              setScrollBegin(true);
            }}
            onMomentumScrollEnd={() => setScrollBegin(false)}
            onEndReached={({ distanceFromEnd }) => {
              // console.log('distanceFromEnd ', distanceFromEnd<=0.5);
              scrollBegin && handleOnEndReached();
            }}
            onEndReachedThreshold={0.5}
            onRefresh={refetch}
            refreshing={refreshing}
            // horizontal={true}
            numColumns={1}
          />
        )}
        {!isSearching && users.length == 0 && searchText.length !== 0 && (
          <Text style={styles.anyResult}>
            {error ? "Oops...Une erreur s'est produite" : "Aucun résultat"}
          </Text>
        )}
        {showListResult && <ArticleByShop showList={setShowListResult}/> }
      </View>
      {scrollBegin && (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" color={mainColor} />
        </View>
      )}
    </View>
  );
}

const mainColor = "#f4511e";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shopConatiner: {},
  shopName: {},
  searchContainer: {
    marginTop: 20,
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
    marginRight:10,
    fontSize: 18
  },
  resultContainer: {
    flex: 1,
    height: '80%',
    margin: 15,
    marginTop: 16,
  },
  cardContainer: {
    // backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    marginTop: 16,
    // margin: 20,
    padding: 0,
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
