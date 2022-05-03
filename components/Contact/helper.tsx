import { Icon } from 'react-native-elements'
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
  Linking
} from 'react-native'

import Email from './Email'
import Tel from './Tel'

const onPressPlace = () => {
    console.log('place')
  }

const onPressTel = (number: string) => {
    Linking.openURL(`tel://${number}`).catch(err => console.log('Error:', err))
  }

const onPressSms = () => {
    console.log('sms')
  }

const onPressEmail = (email: string) => {
    Linking.openURL(`mailto://${email}?subject=subject&body=body`).catch(err =>
      console.log('Error:', err)
    )
  }


export const renderHeader = (props: any) => {
    const {
      avatarBackground,
      name,
      // address: { city, country },
    } = props

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
              source={require('../../Images/logo.png')}
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
    )
  }

export const renderTel = (props: any) => (
    <FlatList
      contentContainerStyle={styles.telContainer}
      data={props.tels}
      renderItem={(list) => {
        const { id, name, number } = list.item

        return (
          <Tel
            key={`tel-${id}`}
            index={list.index}
            name={name}
            number={number}
            onPressSms={onPressSms}
            onPressTel={onPressTel}
          />
        )
      }}
    />
  )

export const renderEmail = (props) => (
    <FlatList
      contentContainerStyle={styles.emailContainer}
      data={props.emails}
      renderItem={(list) => {
        const { email, id, name } = list.item

        return (
          <Email
            key={`email-${id}`}
            index={list.index}
            name={name}
            email={email}
            onPressEmail={onPressEmail}
          />
        )
      }}
    />
  )

const styles = StyleSheet.create({
    cardContainer: {
      backgroundColor: '#FFF',
      borderWidth: 0,
      flex: 1,
      margin: 0,
      padding: 0,
    },
    container: {
      flex: 1,
    },
    emailContainer: {
      backgroundColor: '#FFF',
      flex: 1,
      paddingTop: 30,
    },
    headerBackgroundImage: {
      paddingBottom: 20,
      paddingTop: 45,
    },
    headerContainer: {},
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
    placeIcon: {
      color: 'white',
      fontSize: 26,
    },
    telContainer: {
      backgroundColor: '#FFF',
      flex: 1,
      paddingTop: 30,
    },
    userAddressRow: {
      alignItems: 'center',
      flexDirection: 'row',
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
      borderRadius: 85,
      borderWidth: 3,
      height: 170,
      marginBottom: 15,
      width: 170,
    },
    userNameText: {
      color: '#FFF',
      fontSize: 22,
      fontWeight: 'bold',
      paddingBottom: 8,
      textAlign: 'center',
    },
  })