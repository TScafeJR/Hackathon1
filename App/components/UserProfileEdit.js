import React from 'react';
import { Dimensions, Image, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Text, AsyncStorage, } from 'react-native';
import { ImagePicker, LinearGradient } from 'expo';
import styles from '../styles.js';
import DOMAIN from '../../env.js';
import { Header, Label, Button, Right, Left, Icon, Body, Title, Container, Content, Form, Item, Input, Picker} from 'native-base';

export default class profileEditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      bio: '',
      hometown: '',
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
                  this.setState({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    bio: user.bio,
                    hometown: user.hometown,
                    homeState: user.homeState
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

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      const file = {
        // `uri` can also be a file system path (i.e. file://)
        uri: result.uri,
        name: this.state.id,
        type: "image/png"
      }

      const options = {
        keyPrefix: "uploads/",
        bucket: "trouvaille",
        region: "us-east-1",
        accessKey: ACCESSKEY,
        secretKey: SECRETKEY,
        successActionStatus: 201
      }

      RNS3.put(file, options).then(response => {
        if (response.status !== 201)
          throw new Error("Failed to upload image to S3");
        fetch(`${DOMAIN}/photoUpdate`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            profileURL: response.body.postResponse.location
          })
        })
        .then((response) => {
          return response.json();
        })
        .then((responseJson) => {
          if(responseJson.success){
            return this.props.navigation.navigate('Profile');
          } else {
            alert('Picture was not uploaded');
            console.log('error in picture fail', responseJson.error);
            this.setState({error: responseJson.error});
          }
        })
        .catch((err) => {
          console.log('caught error in catch of add picture', err);
          alert(err)
          /* do something if there was an error with fetching */
        })
        /**
         * {
         *   postResponse: {
         *     bucket: "your-bucket",
         *     etag : "9f620878e06d28774406017480a59fd4",
         *     key: "uploads/image.png",
         *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
         *   }
         * }
         */
      });
    }
  };


  goBack() {
    this.props.navigation.navigate('Profile')
  }

  addCar() {
    this.props.navigation.navigate('addCar')
  }

  setFirstName(text){
    let update = Object.assign({}, this.state, {firstName: text})
    this.setState(update)
  }

  setLastName(text){
    let update = Object.assign({}, this.state, {lastName: text})
    this.setState(update)
  }

  setBio(text){
    let update = Object.assign({}, this.state, {bio: text})
    this.setState(update)
  }
  
  setHometown(text){
    let update = Object.assign({}, this.state, {hometown: text})
    this.setState(update)
  }

  setHomeState(text){
    let update = Object.assign({}, this.state, {homeState: text})
    this.setState(update)
  }

  submit(firstName, lastName, hometown, bio, homeState) {
    fetch(`${DOMAIN}/profileUpdate`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        firstName: firstName,
        lastName: lastName,
        hometown: hometown,
        bio: bio,
        homeState: homeState
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
       if(responseJson.success) {
          return this.props.navigation.navigate('Profile');
       } else {
          alert(responseJson.error)
          console.log(`There was an error updating the user's account\n${responseJson.error}`);
       }
    })
    .catch((err) => {
        console.log(`caught error in catch of user update`);
        alert(err)
    });
  }


  render() {
    return (
      
      <LinearGradient colors={['#43C6AC', '#F8FFAE']} style={{height: Dimensions.get('window').height}}>
      <Header style={{backgroundColor: 'transparent'}}>
        <Left>
          <Button transparent>
            <Icon name='ios-arrow-back' onPress={() => {this.goBack()}} style={{color: 'white'}}/>
          </Button>
        </Left>
        <Body>
          <Title style={{fontSize: 25, textAlign: 'center', color: 'white'}}>{this.state.username}</Title>
        </Body>
        <Right>
        </Right>
      </Header>
      <ScrollView>
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 40, paddingTop: 20}}>
        {this.state.image ? <Image source={{ uri: this.state.image }} style={{ width: 180, height: 180, borderRadius: 25 }} /> : null}
        
        {/*
        <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
          <TouchableOpacity onPress={this._pickImage} style={{marginRight: 10}}>
          <Image
          style={{width:60, height: 60}}
          source={require('../assets/camerarollButton.png')}
          />
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => this.addCar() } style={{marginLeft: 10}}>
          <Image
          style={{width:70, height: 70}}
          source={require('../assets/carButton.png')}
          />
          </TouchableOpacity>
        </View>
        
                style={styles.inputField2}
          */}

        <Item floatingLabel>
          <Label style={{color: 'black'}}>First Name</Label>
          <Input
              value={this.state.firstName}
              onChangeText={(text) => this.setFirstName(text)}
          ></Input>
        </Item>

        <Item floatingLabel>
          <Label style={{color: 'black'}}>Last Name</Label>
        <Input
            value={this.state.lastName}
            onChangeText={(text) => this.setLastName(text)}
        ></Input>
        </Item>


        <Item floatingLabel>
        <Label style={{color: 'black'}}>Hometown</Label>
        <Input
            value={this.state.hometown}
            onChangeText={(text) => this.setHometown(text)}
        ></Input>
        </Item>

        <Item stackedLabel>
          <Label style={{color: 'black'}}>Home State</Label>
        <Picker
              renderHeader={backAction =>
                <Header style={{ backgroundColor: "#6C3483" }}>
                  <Left>
                    <Button transparent onPress={backAction}>
                      <Icon name="arrow-back" style={{ color: "#fff" }} />
                    </Button>
                  </Left>
                  <Body style={{ flex: 3 }}>
                    <Title style={{ color: "#fff" }}>State Picker</Title>
                  </Body>
                  <Right />
                </Header>}
              mode="dropdown"
              iosIcon={<Icon name="ios-arrow-down-outline" />}
              selectedValue={this.state.homeState}
              onValueChange={this.setHomeState.bind(this)}
            >
            <Picker.Item label="Alabama" value="AL"/>
            <Picker.Item label="Alaska" value="AK"/>
            <Picker.Item label="American Samoa" value="AS"/>
            <Picker.Item label="Arizona" value="AZ"/>
            <Picker.Item label="Arkansas" value="AR"/>
            <Picker.Item label="California" value="CA"/>
            <Picker.Item label="Colorado" value="CO"/>
            <Picker.Item label="Connecticut" value="CT"/>
            <Picker.Item label="Delaware" value="DE"/>
            <Picker.Item label="District Of Columbia" value="DC"/>
            <Picker.Item label="Federated States Of Micronesia" value="FM"/>
            <Picker.Item label="Florida" value="FL"/>
            <Picker.Item label="Georgia" value="GA"/>
            <Picker.Item label="Guam" value="GU"/>
            <Picker.Item label="Hawaii" value="HI"/>
            <Picker.Item label="Idaho" value="ID"/>
            <Picker.Item label="Illinois" value="IL"/>
            <Picker.Item label="Indiana" value="IN"/>
            <Picker.Item label="Iowa" value="IA"/>
            <Picker.Item label="Kansas" value="KS"/>
            <Picker.Item label="Kentucky" value="KY"/>
            <Picker.Item label="Louisiana" value="LA"/>
            <Picker.Item label="Maine" value="ME"/>
            <Picker.Item label="Marshall Islands" value="MH"/>
            <Picker.Item label="Maryland" value="MD"/>
            <Picker.Item label="Massachusetts" value="MA"/>
            <Picker.Item label="Michigan" value="MI"/>
            <Picker.Item label="Minnesota" value="MN"/>
            <Picker.Item label="Mississippi" value="MS"/>
            <Picker.Item label="Missouri" value="MO"/>
            <Picker.Item label="Montana" value="MT"/>
            <Picker.Item label="Nebraska" value="NE"/>
            <Picker.Item label="Nevada" value="NV"/>
            <Picker.Item label="New Hampshire" value="NH"/>
            <Picker.Item label="New Jersey" value="NJ"/>
            <Picker.Item label="New Mexico" value="NM"/>
            <Picker.Item label="New York" value="NY"/>
            <Picker.Item label="North Carolina" value="NC"/>
            <Picker.Item label="North Dakota" value="ND"/>
            <Picker.Item label="Northern Mariana Islands" value="MP"/>
            <Picker.Item label="Ohio" value="OH"/>
            <Picker.Item label="Oklahoma" value="OK"/>
            <Picker.Item label="Oregon" value="OR"/>
            <Picker.Item label="Palau" value="PW"/>
            <Picker.Item label="Pennsylvania" value="PA"/>
            <Picker.Item label="Puerto Rico" value="PR"/>
            <Picker.Item label="Rhode Island" value="RI"/>
            <Picker.Item label="South Carolina" value="SC"/>
            <Picker.Item label="South Dakota" value="SD"/>
            <Picker.Item label="Tennessee" value="TN"/>
            <Picker.Item label="Texas" value="TX"/>
            <Picker.Item label="Utah" value="UT"/>
            <Picker.Item label="Vermont" value="VT"/>
            <Picker.Item label="Virgin Islands" value="VI"/>
            <Picker.Item label="Virginia" value="VA"/>
            <Picker.Item label="Washington" value="WA"/>
            <Picker.Item label="West Virginia" value="WV"/>
            <Picker.Item label="Wisconsin" value="WI"/>
            <Picker.Item label="Wyoming" value="WY"/>
            </Picker>
            </Item>

        <Item floatingLabel>
          <Label style={{color: 'black'}}>Bio</Label>
          <Input
              placeholder='Write a description about yourself'
              value={this.state.bio}
              multiline={true}
              numberOfLines={10}
              maxHeight={90}
              onChangeText={(text) => this.setBio(text)}
          ></Input>
        </Item>

        <TouchableOpacity style={[styles.button, styles.buttonLightBlue]} onPress={ () => {this.submit(this.state.firstName, this.state.lastName, this.state.hometown, this.state.bio, this.state.homeState)}}>
          <Text style={styles.buttonLabel}>Save</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      </ScrollView>
      </LinearGradient>
    );
  }


}