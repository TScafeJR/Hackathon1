import React from 'react';
import { Animated, Text, View, Dimensions, TextInput, TouchableOpacity, StyleSheet, AsyncStorage, Button, ListView, Alert, ScrollView, Image, Slider } from 'react-native';
import { Constants } from 'expo';
import { Header, Body, Title } from 'native-base';

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

export default class chooseActivity extends React.Component {
    static navigationOptions = {
      title: 'Choose',
      header: null
    }
  
    constructor(props) {
      super(props);
    }
  
    workoutPress() {
      this.props.navigation.navigate('Workout');
    }
  
    sportsPress() {
      this.props.navigation.navigate('Sports');
    }
  
    render() {
      const workoutTile = [];
      const sportsTile = [];
      return (
        <ScrollView style={[styles.container3], {backgroundColor: '#81A078', paddingTop: 40}} contentContainerStyle={styles.cont}>
          <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>Today I feel like... </Text>
          <View>
            <TouchableOpacity style={{paddingTop: 40, paddingBottom: 20}} onPress={() => {this.workoutPress()}}>
              <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
                source={{uri: 'https://res.cloudinary.com/tscafejr/image/upload/v1532455580/runner/app_images/workout.gif'}}
              />
              <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>working out</Text>
              {workoutTile.map(i => Item({...tileDimensions, text: i}))}
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => {this.sportsPress()}} style={{display: 'flex'}}>
              <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
                source={{uri: 'https://res.cloudinary.com/tscafejr/image/upload/v1532455580/runner/app_images/sports.gif'}}
              />
              <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>a pick-up game</Text>
              {sportsTile.map(i => Item({...tileDimensions, text: i}))}
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
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