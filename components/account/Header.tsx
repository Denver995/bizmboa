import React from 'react';
import { Icon } from 'react-native-elements';
import { 
    Image,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function Header({ country, name, city, avatarBackground, photo }) {

    const onPressPlace = () =>  console.log('place')

    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          style={styles.headerBackgroundImage}
          blurRadius={10}
          source={{uri: avatarBackground}}
        >
          <View style={styles.headerColumn}>
            <Image
              style={styles.userImage}
              source={photo ? {uri: photo} : require('../../Images/defaultStore1.jpeg')}
              progressiveRenderingEnabled={true}
              
            />
            <Text style={styles.userNameText}>{name}</Text>
            <View style={styles.userAddressRow}>
              <View>
                <Icon
                  name="place"
                  underlayColor="transparent"
                  iconStyle={styles.placeIcon}
                  onPress={onPressPlace}
                />
              </View>
              <View style={styles.userCityRow}>
                <Text style={styles.userCityText}>
                  {city}, {country}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
  );
}

const styles = StyleSheet.create({
    headerContainer: {
      flex: 1
    },
    headerBackgroundImage: {
      paddingBottom: 10,
      paddingTop: 10,
    },
    headerColumn: {
      backgroundColor: 'transparent',
      ...Platform.select({
        ios: {
          alignItems: 'center',
          elevation: 1,
          marginTop: -1,
        },
        android: {
          alignItems: 'center',
        },
      }),
    },
    userCityRow: {
      backgroundColor: 'transparent',
    },
    userCityText: {
      color: '#A5A5A5',
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
    },
    userImage: {
      borderColor: '#FFF',
      borderRadius: 60,
      borderWidth: 3,
      height: 120,
      marginBottom: 15,
      width: 120,
    },
    userAddressRow: { 
      alignItems: 'center',
      flexDirection: 'row',
    },
    userNameText: {
      color: '#FFF',
      fontSize: 22,
      fontWeight: 'bold',
      paddingBottom: 8,
      textAlign: 'center',
    },
    placeIcon: {
      color: 'white',
      fontSize: 26,
    }
});