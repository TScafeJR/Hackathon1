import React from 'react';
import { Dimensions, Image, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, AsyncStorage, Platform, StyleSheet, Alert} from 'react-native';
import { ImagePicker, LinearGradient } from 'expo';
// import styles from '../styles.js';
import DOMAIN from '../../env.js';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

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

export default class UserProfile extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      hometown: '',
      bio: '',
      homeState: '',
      isDateTimePickerVisible: false,
    }
  }

  static navigationOptions = {
    title: 'Profile',
    header: null
  };

  componentDidMount() {
    AsyncStorage.getItem('user')
      .then(result => {
        if (result) {
          var parsedResult = JSON.parse(result);
          if (parsedResult.username) {
            var lowerUsername = parsedResult.username.toLowerCase()
            fetch(`${DOMAIN}/profile/${lowerUsername}`, {
              method: 'GET',
            })
            .then((response) => {
              return response.json()
            })
            .then((responseJson) => {
               if(responseJson.success){
                 var user = responseJson.user

                 function toTitleCase(str) {
                  return str.replace(/\w\S*/g, function(txt){
                      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                  });
                } 

                  this.setState({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    hometown: user.hometown,
                    homeState: toTitleCase(user.homeState),
                    bio: user.bio
                  })
               } else {
                   console.log("The user is not logged in to perform the profile search. Please login.");
                   return this.props.navigation.navigate('Login');
               }
              })    
            .catch((err) => {
                console.log("Something else went wrong trying to retrieve the user's information");
                return this.props.navigation.navigate('Login');
                alert(err)
            });
          } else {
            alert("User is not logged in.")
            return this.props.navigation.navigate('Login');
          }
        } else {
          return this.props.navigation.navigate('Login');
        }
      })
      .catch((error)=>{
        console.log("There was an error retrieving the user from the app storage")
        return this.props.navigation.navigate('Login');
      })
  }

  goToEditAccount(){
    this.props.navigation.navigate('ProfileEdit')
  }

  render() {
      return (
        <Container>
      <Header />
      <Content padder>
        <Card>
          <CardItem header bordered>
              <Left>
                <Thumbnail source={{uri: 'https://res.cloudinary.com/tscafejr/image/upload/v1532455579/runner/app_images/basketball1.gif'}} />
                <Body>
                  <Text>{this.state.username}</Text>
                  <Text note>{this.state.firstName} {this.state.lastName}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem bordered>
            <Body style={{flexDirection: "row", justifyContent: "center"}}>
              <Text>
                {this.state.hometown}, {this.state.homeState}
              </Text>
            </Body>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Text>
                {this.state.bio}
              </Text>
            </Body>
          </CardItem>
          <CardItem footer bordered>
          <TouchableOpacity onPress={() => this.goToEditAccount()}>
            <Text>Edit Account</Text>
            </TouchableOpacity>
          </CardItem>
        </Card>
      </Content>
    </Container>
      );
  }
}