import * as React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { NavigationContainer } from '@react-navigation/native';
import CategoriesScreen from "../screens/CategoriesScreen";
import FavoritesScreen from '../screens/FavoritesScreen';
import ContactScreen from "../screens/ContactScreen";
import HomeScreen from "../screens/HomeScreen";
import AccountScreen from '../screens/AccountScreen';
import ShopScreen from '../screens/ShopScreen';


const Drawer = createDrawerNavigator();

const mainColor = '#f4511e';

export default function Navigation() {

  const screenOption = (title: string, iconName: string) => {
    return {
      title: title,
      drawerIcon: ({focused, size}) => (
        <Icon
          name={iconName}
          size={size}
          color={focused ? '#f4511e' : '#ccc'}
        />
      )
    }
  }

  const drawerContentOption = (props: any) => {
    const filteredProps = {
      ...props,
      state: {
        ...props.state,
        routeNames: props.state.routeNames.filter((routeName: String) => {
          routeName !== 'Détails';
        }),
        routes: props.state.routes.filter((route: any) =>
          route.name !== 'Détails'
        ),
      },
    };

    return (
      <DrawerContentScrollView {...filteredProps}>
        <DrawerItemList {...filteredProps} />
      </DrawerContentScrollView>
    );
  }

  // function StackHomeScreen() {
  //   return (
  //     <Stack.Navigator>
  //       <Stack.Screen name="Home" component={HomeScreen} />
  //       <Stack.Screen name="Filter Result" component={ShopScreen} />
  //     </Stack.Navigator>
  //   );
  // }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: mainColor, //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
        drawerContent={drawerContentOption}
      >
        <Drawer.Screen 
          name="Home" 
          component={HomeScreen} 
          options={screenOption("Accueil", "home")}
        />
        <Drawer.Screen 
          name="CategoriesScreen" 
          component={CategoriesScreen} 
          options={screenOption("Catégorie", "tag")}
        />
        <Drawer.Screen 
          name="FavoritesScreen" 
          component={FavoritesScreen} 
          options={screenOption("Favoris", "heart")}
        />
        <Drawer.Screen 
          name="ShopScreen" 
          component={ShopScreen} 
          options={screenOption("Boutiques", "shopping-bag")}
        />
        <Drawer.Screen 
          name="AccountScreen" 
          component={AccountScreen} 
          options={screenOption("Mon Compte", "user")}
        />
        <Drawer.Screen name="Contact-us" component={ContactScreen}
          options={{
            title: 'Nous Contacter',
            drawerIcon: ({focused, size}) => (
                <SimpleLineIcons
                    name="phone"
                    size={size}
                    color={focused ? '#f4511e' : '#ccc'}
                />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}