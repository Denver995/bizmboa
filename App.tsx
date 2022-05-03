import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Provider} from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { StyleSheet, LogBox } from 'react-native';
import Navigation from "./navigations/Navigation";
import { createUploadLink } from 'apollo-upload-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { relayStylePagination } from "@apollo/client/utilities";
import { setContext } from '@apollo/client/link/context';
import {store, persistor} from "./store";
import { api_url } from './utils/config';

const uri = `${api_url}/graphql/`
const httpLink = createHttpLink({
  uri: uri,
});

const uploadLink = createUploadLink({ 
  uri: uri,
})

const getAuthorization = async() => {
  let token = await AsyncStorage.getItem('token');
  token = token ? "JWT " + token : "";
  return token;
};

const authLink = setContext(async(_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await getAuthorization();
  
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization' : token,
    }
  }
});

const client = new ApolloClient({
  //authLink.concat(uploadLink.concat(httpLink)),
  link: authLink.concat(uploadLink.concat(httpLink)),
  cache: new InMemoryCache(
    {
      typePolicies: {
        Query: {
          fields: {
            allProduct: relayStylePagination(),
          },
        },
      },
    }
  ),
});

export default function App() {

  LogBox.ignoreLogs(['Remote debugger']);
  const [apolloClient, setApolloClient] = useState(client)
  // const [apolloClientUpload, setClientUpload] = useState(clientUpload)

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={apolloClient}>
          <SafeAreaProvider>
            <Navigation />
            <Toast  ref={(ref) => Toast.setRef(ref)} />
          </SafeAreaProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
