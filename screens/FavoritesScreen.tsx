import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Item from "../components/article/Item";
import { useSelector, useDispatch } from 'react-redux';
import { reloadFavoritesScreen } from '../actions';

export default function FavoritesScreen({ navigation }) {
  const dispatch = useDispatch();
  const [favoris, setFavoris] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const reload = useSelector(state => state?.reloadFavorisScreen);


  useEffect(() => {
    if(firstLoad || reload){
      AsyncStorage.getItem('favoris')
      .then(req => JSON.parse(req))
      .then(json => {
          setFavoris(json !== null ? json : []);
        })
      .catch(error => console.log('error!'));
      setFirstLoad(false);
      dispatch(reloadFavoritesScreen(false));
    }
    
  }, [firstLoad, favoris, reload])

  return (
    <View style={styles.container}>
      {favoris && favoris.length > 0 && 
        <FlatList
          data={favoris}
          renderItem={({item}) => 
            <Item product={item} />
          }
          keyExtractor={(item, index) => index.toString()}
        />
      }
      {favoris.length == 0 && <Text style={styles.anyResult}>Aucun favoris</Text>}
    </View>
);
}

const mainColor = '#f4511e';

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  resultContainer: {
    height: '70%',
    marginTop: 16
  },
  anyResult: {
    textAlign: 'center',
    color: '#666666',
    justifyContent: 'center',
    fontSize: 26,
    marginTop: '50%',
  }
});