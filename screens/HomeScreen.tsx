import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Image,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from "react-native-modal";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/FontAwesome";
import Search from "../components/Search";
import PhoneNumber from "../components/PhoneNumber";
import Detail from '../components/article/Detail';
import Form from '../components/article/Form';
import { showArticleForm } from '../actions';
import {  ADD_ARTICLE, UPDATE_ARTICLE, CLOSE_FORM} from "../utils/constants";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const userData = useSelector(state => state?.userData);
  const showArticleModal = useSelector(state => state?.showArticleDetail);
  const formAction = useSelector(state => state?.formAction);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const top = new Animated.Value(0);
  const [topPosition, setTopPosition] = useState(top);

  const zoomOut = {
    0: {
      opacity: 1,
      scale: 1,
    },
    0.5: {
      opacity: 1,
      scale: 0.3,
    },
    1: {
      opacity: 0,
      scale: 0,
    },
  };

  const animateLogo = () => {
    Animated.timing(
      topPosition,
      {
        toValue: 10,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false
      }
    ).start()
  }

  const toggleForm = () => {
    if(formAction===ADD_ARTICLE || formAction===UPDATE_ARTICLE)
      dispatch(showArticleForm(CLOSE_FORM));
    else dispatch(showArticleForm(ADD_ARTICLE));
  }

  useEffect(() => {
    if(firstLoad){
      dispatch(showArticleForm(CLOSE_FORM));
      setFirstLoad(false);
    }
    animateLogo();
    if(userData.phone) setShowPhoneModal(false);
    else setShowPhoneModal(true);
  }, [userData, showArticleModal, formAction, firstLoad]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { marginTop: topPosition }]}>
        <Image
          style={styles.logo}
          source={require('../Images/logo.png')}
        />
      </Animated.View>
      <Animatable.View animation="fadeInDown" duration={2000} style={styles.searchContainer}>
        <Search />
      </Animatable.View>
      {/* <Animatable.View animation={"fadeInUp"} duration={2000} style={styles.promoContainer}>
        <Promo />
      </Animatable.View> */}
      <TouchableOpacity 
        style={styles.plusContainer} 
        onPress={toggleForm}
      >
        <Icon name="plus" size={25} color="white" />
      </TouchableOpacity>
      <Modal
        isVisible={showPhoneModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={.3}
      >
        <PhoneNumber/>
      </Modal>
      <Modal
        isVisible={showArticleModal}
        animationIn="fadeInUp"
        // animationOut="bounceOutDown"
        // animationIn="fadeInUp"
        animationOut="fadeInDown"
        animationInTiming={300}
        animationOutTiming={500}
      >
        <Detail/>
      </Modal>
      <Modal
        isVisible={formAction !== CLOSE_FORM}
        animationIn="fadeInUp"
        animationOut="fadeInDown"
        animationInTiming={500}
        animationOutTiming={100}
        // onBackdropPress={toggleForm}
        // onSwipeComplete={toggleForm}
      >
        <Form toggle={toggleForm} navigation={navigation}/>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    height: '10%',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28
  },
  logo: {
    width: 250,
    height: 85,
  },
  promoContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  plusContainer: {
    position: 'absolute',
    zIndex: 1,
    width: 50,
    height: 50,
    backgroundColor: "#f4511e",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    bottom: 5,
    right: 5,
    shadowColor: '#766f85',
    shadowOpacity: 0.3
  },
});