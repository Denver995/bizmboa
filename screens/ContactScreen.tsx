import React from 'react';
import { View, StyleSheet } from 'react-native';
import { defaultContact } from '../utils/config';
import Contact from '../components/Contact/Contact';

export default function ContactScreen({navigation}) {
    const data = {...defaultContact};
    return (
        <View style={styles.container}>
            <Contact data={data} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
})