import React from 'react';
import { Animated, Text, View, Dimensions, TextInput, TouchableOpacity, StyleSheet, AsyncStorage, Button, ListView, Alert, ScrollView, Image, Slider, Platform } from 'react-native';
import { Header, Body, Title } from 'native-base';
import { Constants } from 'expo';

const { width } = Dimensions.get("window");

const PAGE_WIDTH = Dimensions.get('window').width;

const Item = ({size, margin, text}) => (
    <View style={[styles.item, {width: size, height: size, marginHorizontal: margin}]}>
      <Text style={styles.itemText}>{text}</Text>
    </View>
  )
  
const calcTileDimensions = (deviceWidth, tpr) => {
    const margin = deviceWidth / (tpr * 10);
    const size = (deviceWidth - margin * (tpr * 2)) / tpr;
    return { size, margin };
};

export default class LandingScreen extends React.Component {
    static navigationOptions = {
      title: 'landing',
      header: null
    }

    clickMe() {
        Alert.alert(Platform.select({
            ios: 'Welcome to iOS!',
            android: 'Welcome to Android!'
          }));
    }

    profilePress(){
        this.props.navigation.navigate('Profile')
    }

    render(){
        return (
            <View style={styles.container}>
            <TouchableOpacity onPress={this.clickMe.bind(this)}>
              <View style={styles.box}>
                <Text>Hello {this.props.name}. Please click me.</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    box: {
      borderColor: 'red',
      backgroundColor: '#fff',
      borderWidth: 1,
      marginTop: 200,
      padding: 10,
      width: 100,
      height: 100
    },
});
  