import React from 'react';
import { Dimensions, Image, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, AsyncStorage, Platform, StyleSheet, Alert} from 'react-native';
import { ImagePicker, LinearGradient } from 'expo';
import DOMAIN from '../../env.js';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import LandingFooter from './LandingFooter.js';

export default class LandingScreen extends React.Component {
    static navigationOptions = {
        title: 'Landing',
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
          currentPage: 'Landing'
        }
      }

    render(){
        return (
            <LandingFooter navigation={this.props.navigation}/>
        )
    }
} 