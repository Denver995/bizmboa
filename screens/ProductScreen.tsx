import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProductScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 25}}>Coming soon</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});