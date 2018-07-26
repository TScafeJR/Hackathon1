import React from 'react';
import { Animated, View, Dimensions, TextInput, TouchableOpacity, StyleSheet, AsyncStorage, ListView, Alert, ScrollView, Image, Slider, Platform } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Thumbnail } from 'native-base';
import { Constants } from 'expo';

export default class LandingFooter extends React.Component {
    static navigationOptions = {
      title: 'LandingFooter',
      header: null
    }

    constructor(props) {
      super(props);
      this.state = {
      }
    }

    goToProfile(){
      this.setState({currentPage: 'Profile'})
      this.props.navigation.navigate('Profile')
    }

    goToDiscover(){
      this.setState({currentPage: 'ChooseActivity'})
      this.props.navigation.navigate('ChooseActivity')
    }

    goToHome(){
      this.setState({currentPage: 'Landing'})
      this.props.navigation.navigate('Landing')
    }

    componentDidMount(){

    }

    render(){
        return (
          <Container>
          <Header />
          <Content />
          <Footer>
            <FooterTab>
              <Button active={this.props.navigation.state.routeName === 'Landing'} vertical onPress={() => this.goToHome()}>
              <Icon active={this.props.navigation.state.routeName === 'Landing'} style={{fontSize: 36}} name="home"/>
              </Button>
              <Button active={this.props.navigation.state.routeName === 'Discover'} vertical onPress={() => this.goToDiscover()}>
                <Icon active={this.props.navigation.state.routeName === 'Discover'} style={{fontSize: 36}} name="navigate" />
              </Button>
              <Button active={this.props.navigation.state.routeName === 'Profile'} vertical onPress={() => this.goToProfile()}>
              <Thumbnail small source={{ uri: 'https://res.cloudinary.com/tscafejr/image/upload/v1532455579/runner/app_images/basketball1.gif' }} />
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
  