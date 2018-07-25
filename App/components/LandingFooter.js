import React from 'react';
import { Animated, View, Dimensions, TextInput, TouchableOpacity, StyleSheet, AsyncStorage, ListView, Alert, ScrollView, Image, Slider, Platform } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
import { Constants } from 'expo';

export default class LandingFooter extends React.Component {
    static navigationOptions = {
      title: 'LandingFooter',
      header: null
    }

    goToProfile(){
      this.props.navigation.navigate('Profile')
    }

    goToDiscover(){
      this.props.navigation.navigate('ChooseActivity')
    }

    render(){
        return (
          <Container>
          <Header />
          <Content />
          <Footer>
            <FooterTab>
              <Button vertical>
              <Icon name="home"/>
              <Text>Home</Text>
              </Button>
              <Button vertical onPress={() => this.goToDiscover()}>
                <Icon name="navigate" />
                <Text>Discover</Text>
              </Button>
              <Button vertical onPress={() => this.goToProfile()}>
                <Icon name="person" />
                <Text>Profile</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
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
  