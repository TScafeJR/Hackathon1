import React from 'react';
import { Animated, Text, View, Dimensions, TextInput, TouchableOpacity, StyleSheet, AsyncStorage, Button, ListView, Alert, ScrollView, Image, Slider } from 'react-native';
import { Constants } from 'expo';
import { Header, Body, Title } from 'native-base';
import { athletes } from '../athletes.js';
import styles from '../styles.js'
import MapView from 'react-native-maps';

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

export default class runnerMap extends React.Component {
    static navigationOptions = ({ navigation }) => ({
      title: 'Run Map',
      headerRight: <Button title='Users' onPress={() => {navigation.state.params.onRightPress()}} />
    })
  
    constructor(props) {
      super(props)
      this.state = {
        paceToggleOn: false,
        timeToggleOn: false,
        markers: athletes,
        time: 0,
        disabled: false,
        pace: 0,
      }
      this.handlePress=this.handlePress.bind(this);
    }
  
    getMessages() {
      this.props.navigation.navigate('Users')
    }
  
    componentDidMount(){
      this.props.navigation.setParams({
        onRightPress: this.getMessages.bind(this)
      })
    }
  
    getModal(){}
  
    handlePress(e) {
      const sliderTime = this.state.time
      const sliderPace = this.state.pace
  
      const sliceMarkers = this.state.markers.slice()
      sliceMarkers.push({
        name: 'Pam',
        coordinate: Object.values(e.nativeEvent.coordinate),
        sport: 'running',
        pace: 8,
        image: 'https://scontent-sjc2-1.xx.fbcdn.net/v/t31.0-8/21414894_1458249047562200_5036214036861933050_o.jpg?oh=2f5c495444364c8259de38e61a38f6fb&oe=5AB00CFB',
        distance: 4,
        start: sliderTime,
        show: true,
      })
  
      this.setState({
        markers: sliceMarkers
      }, () => console.log('NEW STATE', this.state.markers.length));
    }
  
    checkTime(timeValue) {
      if (this.state.paceToggleOn) {
        this.checkBoth(timeValue, this.state.pace)
      } else {
        const copiedAthletes = [...this.state.markers]
        const timeAlteredAthletes = copiedAthletes.map((person) => {
          if (person.start === timeValue){
            person.show = true
          } else { person.show = false }
          return person
        })
        this.setState({markers: timeAlteredAthletes, time: timeValue})
      }
    }
  
    checkPace(paceValue) {
      if (this.state.timeToggleOn) {
        this.checkBoth(this.state.time, paceValue)
      } else {
        // if both toggles are on, go to check Both, else
        const copiedAthletesPace = [...this.state.markers]
        const paceAlteredAthletes = copiedAthletesPace.map((person) => {
          if (person.pace === paceValue) {
            person.show = true
          } else { person.show = false }
          return person
        })
        this.setState({markers: paceAlteredAthletes, pace: paceValue})
      }
    }
  
    checkBoth(timeValue, paceValue){
      const copiedAthletesBoth = [...this.state.markers]
      const bothAlteredAthletes = copiedAthletesBoth.map((person) => {
        if (person.pace === paceValue && person.start === timeValue) {
          person.show = true
        } else {
          person.show = false }
          return person
        })
        this.setState({markers: bothAlteredAthletes, pace: paceValue, time: timeValue})
    }
  
    render() {
      return (
        <View style={styles.container5}>
          <View style={styles.mapHalf}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 37.792900,
                longitude: -122.428202,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2,
              }}
              onPress={this.handlePress}
              >
                {this.state.markers.map((marker, index) => (
                  <MapView.Marker
                    coordinate={{
                      latitude: marker.coordinate[0],
                      longitude: marker.coordinate[1],
                    }}
                    key={index} >
                    <Image
                      source={{uri: marker.image}}
                      style={{width:30, height:30, display: marker.show ? "flex" : "none"}}
                    />
                  </MapView.Marker>
                ))}
              </MapView>
          </View>
          <View style={styles.bottomHalf}>
            <View style={styles.timeSliderView} >
              <TouchableOpacity
                style={styles.button5}
                onPress={() => this.setState({
                  timeToggleOn: !this.state.timeToggleOn
                })}
                >
                <Text style={styles.buttonText5}>{this.state.timeToggleOn ? 'All times' : ' Filter by time'} </Text>
              </TouchableOpacity>
              <Text style={[styles.textTime, {display: this.state.timeToggleOn ? "flex" : 'none'}]}>
                  {this.state.time ? this.state.time + " o'clock": " Choose start time."}
              </Text>
              <Slider
                style={[styles.slider, {display: this.state.timeToggleOn ? "flex" : 'none'}]}
                step={1}
                minimumValue={5}
                maximumValue={23}
                maximumTrackTintColor={'blue'}
                value={this.state.time}
                onValueChange={(val) => {this.checkTime(val)}}
              />
            </View>
  
              {/* PACE SLIDER */}
  
            <View style={styles.paceSliderView}>
              <TouchableOpacity
                style={styles.button5}
                onPress={() => this.setState({
                  paceToggleOn: !this.state.paceToggleOn
                })}
                >
                  <Text style={styles.buttonText5}>{this.state.paceToggleOn ? 'All paces' : 'Filter by pace'} </Text>
                </TouchableOpacity>
                <Text style={[styles.textPace, {display: this.state.paceToggleOn ? "flex" : 'none'}]}>
                  {this.state.pace ? this.state.pace + "min/mile": "Choose pace."}
                </Text>
                <Slider
                  style={[styles.slider, {display: this.state.paceToggleOn ? "flex" : 'none'}]}
                  step={1}
                  minimumValue={5}
                  maximumValue={10}
                  maximumTrackTintColor={'blue'}
                  value={this.state.pace}
                  onValueChange={(val) => {this.checkPace(val)}}
                />
            </View>
          </View>
        </View>
      );
    }
  }
  