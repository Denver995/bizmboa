import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ListItem } from "react-native-elements";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { setSelectedCategory } from '../actions';
import { ALL_CATEGORIES } from "../API/query";
import { useQuery, useLazyQuery } from "@apollo/client";
import ArticleByCategoryScreen from '../components/article/ArticleByCategoryScreen';


const mainColor = '#f4511e';
const iconSize = 20;

export default function CategoriesScreen({ navigation }) {
  const [showListResult, setShowListResult] = useState(false);
  const [isFirsLoad, setIsFirstLoad] = useState(true);
  const [allCategory, setAllCategory] = useState([]);
  
  const dispatch = useDispatch();
  const onclickCategory = (selected: any) => {
    dispatch(setSelectedCategory(selected));
    setShowListResult(true);
  }

  const [fetchCategories, { loading, error, refetch }] = useLazyQuery(ALL_CATEGORIES, { 
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log('allCategories ', data.allCategory);
      setAllCategory(data.allCategory);
    },
    onError() {
        
    },
  });
  
  useEffect(() => {
    if(isFirsLoad){
      fetchCategories().then(resp => {
        setAllCategory(resp.data.allCategory);
      })
      .catch(error => console.log("'une erreur s'est produite"));
      setIsFirstLoad(false);
    }
  }, [isFirsLoad, allCategory])
  

  return (
    <View style={styles.container}>
      <>
        {!showListResult && allCategory.length > 0 &&
          allCategory.map((item: any, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => { onclickCategory(item); }}
              style={styles.containerItem}
            >
              <ListItem bottomDivider style={styles.listItem}>
                <MaterialCommunityIcons
                  name={item.iconName}
                  size={iconSize}
                  color={mainColor}
                />
                <ListItem.Content>
                  <ListItem.Title>{item.name}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </TouchableOpacity>
          ))
        }
        {showListResult && <ArticleByCategoryScreen showList={setShowListResult}/> }
      </>
      {loading &&
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color={mainColor}/>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerItem: {
    flex: 1
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  }
})