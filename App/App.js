import React, { Component } from 'react';
import { Animated, Text, View, Dimensions, TextInput, TouchableOpacity, StyleSheet, AsyncStorage, Button, ListView, Alert, ScrollView, Image, Slider } from 'react-native';
import { Constants } from 'expo';
import { StackNavigator } from 'react-navigation';
import MapView from 'react-native-maps';
import { athletes } from './athletes.js';
import ChooseActivity from './components/ChooseActivity.js'
import LoginScreen from './components/LoginScreen.js'
import RegisterScreen from './components/RegisterScreen.js'
import SportsScreen from './components/SportsScreen.js'
import WorkoutScreen from './components/WorkoutScreen.js'
import LandingScreen from './components/LandingScreen.js'
import RunnerMap from './components/RunnerMap.js'
import UserProfile from './components/UserProfile.js'

import DOMAIN from '../env.js'

import styles from './styles.js'

const { width } = Dimensions.get("window");

const PAGES = [
  {
    title: 'Runnr+',
    description: "Connect with active people nearby looking for a workout partner",
    backgroundColor: '#2448a2',
    image: 'http://assets.menshealth.co.uk/main/thumbs/35653/nike1__square.jpg'
  },
  {
    title: 'Runnr+',
    description: "Choose the sport you want to play... and we'll find players in your vicinity",
    backgroundColor: '#79a9dc',
    image: 'https://images.unsplash.com/photo-1468465226960-8899e992537c?w=1653'
  },
  {
    title: 'Runnr+',
    description: "Join and play pick-up sports instantly",
    backgroundColor: '#66a98b',
    image: 'https://images.unsplash.com/photo-1497292348804-01ddc743bcb7?w=1950'
  },
  {
    title: 'Runnr+',
    description: "Find someone to motivate you and inspire you",
    backgroundColor: '#4b79a9',
    image: 'https://images.unsplash.com/photo-1506534067239-9e2fabb3a863?w=1950'
  },
  {
    title: 'Runnr+',
    description: "Changing the way you train - from solo to social",
    backgroundColor: '#127186',
    image: 'https://images.unsplash.com/photo-1474925558543-e7a5f06e733e?w=1950'
  },
]

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
    header: null
  }
  state = {
    scroll: new Animated.Value(0),
  };
  loginpress() {
    this.props.navigation.navigate('Login');
  }
  registerpress() {
    this.props.navigation.navigate('Register');
  }
  render() {
    const position = Animated.divide(this.state.scroll, PAGE_WIDTH);
    const backgroundColor = position.interpolate({
      inputRange: PAGES.map((_, i) => i),
      outputRange: PAGES.map(p => p.backgroundColor),
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[ StyleSheet.absoluteFill, { backgroundColor, opacity: 0.8 } ]} />
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [ { nativeEvent: { contentOffset: { x: this.state.scroll } } } ],
          )}>
          {PAGES.map((page, i) => (
            <View key={i} style={styles.page}>
              <View style={[ styles.card ]}>
                <Text style={styles.title}>{page.title}</Text>
                <Text style={styles.desc}>{page.description}</Text>
              </View>
              <Animated.View style={[ styles.frame, styles.shadow, { transform: [{ translateX: Animated.multiply(Animated.add(position, -i), -200) }] } ]}>
                <Animated.Image
                  source={{uri: page.image}}
                  style={styles.photo}
                />
              </Animated.View>
            </View>
          ))}
        </Animated.ScrollView>
        <View>
          <TouchableOpacity onPress={ () => {this.registerpress()} } style={styles.buttonRegister}>
            <Text style={styles.buttonText}>{"REGISTER"}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={ () => {this.loginpress()} } style={styles.buttonLogin}>
            <Text style={styles.buttonText}>{"  LOGIN   "}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

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

class DiscoverScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={() => {navigation.state.params.onRightPress()}} />
  });

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      users: [],
      dataSource: ds.cloneWithRows([]),
    }
    fetch(`${DOMAIN}/users`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({dataSource: ds.cloneWithRows(athletes)});
    })
  }

  componentDidMount() {
    this.setState({dataSource: ds.cloneWithRows(athletes)});
    AsyncStorage.getItem('user')
    .then(result => {
      const parsedResult = JSON.parse(result);
      const username = parsedResult.username;
      const password = parsedResult.password;
      if (username && password) {
        return login(username, password)
        .then(resp => resp.json())
        .then(checkResponseAndGoToMainScreen);
      }
    })
    .catch((err) => {
      console.log('Error!', err)
    })
    this.props.navigation.setParams({
      onRightPress: this.getMessages.bind(this)
    })
  }

  getMessages() {
    this.props.navigation.navigate('Messages')
  }

  touchUser(user) {
    fetch(`${DOMAIN}/profile/${user.id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success){

      }
    })
  }

  longTouchUser(user) {
    fetch(`${site}/messages/${user.id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .catch((err) => {
      console.log('Error!', err)
    })
  }
  
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={() => {navigation.state.params.onRightPress()}} />
  })

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <TouchableOpacity
            onPress={this.touchUser.bind(this, rowData)}
            onLongPress={this.sendLocation.bind(this, rowData)}
            >
              <Text style={{fontSize: 20}}>{rowData.username}</Text></TouchableOpacity>}
            />
      </View>
    );
  }
}

export default StackNavigator({
    ChooseActivity: {
      screen: ChooseActivity,
    },
    Workout: {
      screen: WorkoutScreen,
    },
    Sports: {
      screen: SportsScreen,
    },
    Login: {
      screen: LoginScreen,
    },
    Register: {
      screen: RegisterScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    RunMap: {
      screen: RunnerMap,
    },
    Users: {
      screen: DiscoverScreen
    },
    Landing: {
      screen: LandingScreen
    },
    Profile: {
      screen: UserProfile
    }
  },
  {initialRouteName: 'Login'},
  { headerMode: 'screen' }
);

console.disableYellowBox = true;
