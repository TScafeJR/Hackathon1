import React from 'react';
import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, AsyncStorage, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Header, Body, Title } from 'native-base';
import { Constants } from 'expo';
import { StackNavigator } from 'react-navigation';

import DOMAIN from '../../env'

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

export default class LoginScreen extends React.Component {
    static navigationOptions = {
        title: 'Login',
        header: null
    };

    constructor() {
        super();
        this.state = {
        username:'',
        password:'',
        error:''
        }
    }

    componentDidMount() {
      AsyncStorage.getItem('user')
      .then(result => {
        if (result) {
          var parsedResult = JSON.parse(result);
          var username = parsedResult.username;
          var password = parsedResult.password;
          console.log(`this is the user and password combination: ${username}, ${password}`)
          if (username.length > 0 && password.length > 0) {
            return this.login2press(username, password)
            .then(resp => resp.json())
            .then( resp => {return resp})
          }
        }
        return
      })
      .catch(err => {
        return
      });
    }

    login2press(username, password) {
        fetch(`${DOMAIN}/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
        if(responseJson.success) {
            AsyncStorage.setItem('user', JSON.stringify({
            username: username,
            password: password
            }))
            return this.props.navigation.navigate('ChooseActivity');
        } else {
            alert('Login failed');
            console.log('error in fetchlogin', responseJson.error);
            this.setState({error: responseJson.error});
          }
        })
        .catch((err) => {
          console.log("Error!", JSON.stringify(err));
          alert(err)
        });
    }

    register() {
        this.props.navigation.navigate('Register');
    }

    setUsername(text){
      this.setState(Object.assign({}, this.state, {username: text}));
    }
  
    setPassword(text){
      this.setState(Object.assign({}, this.state, {password: text}))
    }

    render() {
        return (
        <View style={styles.container1}>
            <Text style={styles.title}>Your Account For Everything Runnr+</Text>
            <TextInput
            style={{textAlign: 'center', height: 40, borderStyle: 'solid', margin: 10}}
            placeholderTextColor="white"
            placeholder="Username"
            onChangeText={(text) => this.setUsername(text)}
            />
            <TextInput
            style={{textAlign: 'center', height: 40, borderStyle: 'solid', margin: 10}}
            placeholderTextColor="white"
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => this.setPassword(text)}
            />
            <TouchableOpacity onPress={ () => {this.login2press(this.state.username, this.state.password)} } style={styles.buttonLogin1}>
            <Text style={styles.buttonText}>{"LOGIN"}</Text>
            </TouchableOpacity>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container5: {
      flexDirection: 'column',
      backgroundColor: 'red',
      borderColor: '#2448a2',
      borderWidth: 2,
      flex: 1,
      height: 100,
      width: 375,
    },
    mapHalf: {
      flex:3,
      flexDirection: 'row',
      backgroundColor: 'yellow',
    },
    bottomHalf: {
      backgroundColor: 'pink',
      borderWidth: 2,
      borderColor: '#2448a2',
      width: 375,
      height: 50,
      flex:1,
    },
    map: {
      flex: 1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    buttonContainer: {
      marginVertical: 20,
      backgroundColor: 'maroon',
      flex:1,
    },
    button5: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.75)',
      borderRadius: 20,
      padding: 10,
      width: 100,
      height: 40,
      marginVertical: 20,
      borderColor:'#2448A2',
      borderWidth: 1,
      flex:1,
    },
    buttonText5: {
      alignItems:'center',
    },
    timeSliderView: {
      flex: 1,
      height: 100,
      width: 375,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      backgroundColor: '#4C69B0',
    },
    paceSliderView: {
      flex: 1,
      backgroundColor:'purple',
      height: 100,
      width: 375,
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: '#4C69B0',
    },
    slider: {
      width: 100,
      height: 30,
      backgroundColor:'#4C69B0',
      flex:4,
    },
    textTime: {
      backgroundColor: '#4C69B0',
      color: 'white',
      flex: 1
    },
    textPace: {
      backgroundColor: '#4C69B0',
      color: 'white',
      flex: 1
    },
    container3: {
      backgroundColor: '#4C69B0',
      flex: 1,
      flexDirection: 'column',
      color: 'white',
      width: '100%',
      overflow: 'scroll',
      paddingTop: 40,
      paddingBottom: 40,
    },
    cont: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    item: {
      alignSelf: "flex-start",
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      maxHeight: 30,
      maxWidth: 30
    },
    itemText: {
      fontSize: 20
    },
    shadow: {
      elevation: 16,
      shadowColor: '#000000',
      shadowOpacity: 0.5,
      shadowRadius: 20,
      shadowOffset: {
        height: 12
      }
    },
    container: {
      flex: 1,
    },
    container1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4C68B1',
    },
    title: {
      fontSize: PAGE_WIDTH / 12,
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: 'transparent',
      textAlign: 'center'
    },
    desc: {
      fontSize: PAGE_WIDTH / 24,
      color: '#fff',
      backgroundColor: 'transparent',
      marginTop: 20,
      lineHeight: 25,
      textAlign: 'center'
    },
    page: {
      width: PAGE_WIDTH,
      paddingTop: Constants.statusBarHeight + 48,
    },
    card: {
      position: 'absolute',
      margin: 12,
      marginTop: 40,
      left: 12,
      top: 0,
      right: 0,
      borderRadius: 8,
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 140,
    },
    frame: {
      position: 'absolute',
      left: 0,
      bottom: 160,
      borderRadius: (PAGE_WIDTH -100)/2,
      height: PAGE_WIDTH -100,
      width: PAGE_WIDTH - 100,
      margin: 50,
    },
    buttonRegister: {
      backgroundColor: 'rgba(0,0,0, 0.3)',
      position: 'absolute',
      margin: 12,
      marginLeft: -60,
      marginTop: 40,
      left: (PAGE_WIDTH / 2) - 100,
      borderRadius: 50,
      alignItems: 'center',
      bottom: 30,
    },
    buttonRegister1: {
      backgroundColor: 'rgba(0,0,0, 0.3)',
      position: 'absolute',
      margin: 12,
      marginLeft: 20,
      marginTop: 40,
      left: (PAGE_WIDTH / 2) - 100,
      borderRadius: 50,
      alignItems: 'center',
      bottom: 30,
    },
    buttonLogin: {
      backgroundColor: 'rgba(0,0,0, 0.3)',
      position: 'absolute',
      margin: 12,
      marginLeft: 115,
      marginTop: 40,
      left: (PAGE_WIDTH / 2) - 100,
      borderRadius: 50,
      alignItems: 'center',
      bottom: 30,
    },
    buttonLogin1: {
      backgroundColor: 'rgba(0,0,0, 0.3)',
      position: 'absolute',
      margin: 12,
      marginLeft: 35,
      marginTop: 40,
      left: (PAGE_WIDTH / 2) - 100,
      borderRadius: 50,
      alignItems: 'center',
      bottom: 30,
    },
    buttonText: {
      margin: 15,
      marginLeft: 50,
      marginRight: 40,
      color: '#fff',
      fontSize: 14,
    },
    photo: {
      flex: 1,
      borderRadius: (PAGE_WIDTH -100)/2,
    }
  });