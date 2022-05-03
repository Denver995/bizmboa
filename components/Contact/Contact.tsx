import React from 'react';
import { Card } from 'react-native-elements';
import {
  FlatList,
  StyleSheet,
  View,
  Linking,
  ScrollView
} from 'react-native';

import Email from './Email';
import Separator from './Separator';
import Tel from './Tel';
import Header from '../account/Header';

export default function Contact({data}:{data:any}) {
  const onPressPlace = () => {
    console.log('place')
  }

  const onPressTel = (number: any) => {
    Linking.openURL(`tel://${number}`).catch(err => console.log('Error:', err))
  }

  const openWhatsApp = (number: any) => {
    let url = "whatsapp://send?text=" +
      "Bonjour et Bienvenue dans la messagerie de bizmboa" +
      "&phone=" +
      `${number}`;
    Linking.openURL(url).then(data => {
      console.log("WhatsApp Opened successfully " + data);
    }).catch(() => {
      alert("Make sure WhatsApp installed on your device");
    });
  };

  const onPressEmail = (email: string) => {
      Linking.openURL(`mailto://${email}?subject=subject&body=body`).catch(err =>
        console.log('Error:', err)
      )
    }


  const renderHeader = () => {
      const {
        avatarBackground,
        name,
        address: { city, country },
      } = data

      return (
        <Header 
          avatarBackground={avatarBackground} 
          name={name}
          city={city}
          country={country}
        />
      )
    }

  const renderTel = () => (
      <FlatList
        contentContainerStyle={styles.telContainer}
        data={data.tels}
        renderItem={(list) => {
          const { id, name, number } = list.item

          return (
            <Tel
              key={`tel-${id}`}
              index={list.index}
              name={name}
              number={number}
              openWhatsApp={openWhatsApp}
              onPressTel={onPressTel}
            />
          )
        }}
      />
    )

  const renderEmail = () => (
      <FlatList
        contentContainerStyle={styles.emailContainer}
        data={data.emails}
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

  return (
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Card containerStyle={styles.cardContainer}>
            {renderHeader()}
            {renderTel()}
            {Separator()}
            {renderEmail()}
          </Card>
        </View>
      </ScrollView>
    )
}

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
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
});