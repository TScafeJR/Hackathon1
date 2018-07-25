import React from 'react';
import { Dimensions, Image, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Text, AsyncStorage, } from 'react-native';
import { ImagePicker, LinearGradient } from 'expo';
import styles from '../styles.js';
import DOMAIN from '../../env.js';
import { Header, Label, Button, Right, Left, Icon, Body, Title } from 'native-base';

export default class profileEditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      firstName: '',
      lastName: '',
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
                    hometown: user.hometown
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

  submit(firstName, lastName, hometown, bio) {
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
        bio: bio
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

        <TextInput
            placeholder='First Name'
            value={this.state.firstName}
            style={styles.inputField2}
            onChangeText={(text) => this.setFirstName(text)}
        ></TextInput>

        <TextInput
            placeholder='Last Name'
            value={this.state.lastName}
            style={styles.inputField2}
            onChangeText={(text) => this.setLastName(text)}
        ></TextInput>

        <TextInput
            placeholder='Hometown'
            value={this.state.hometown}
            style={styles.inputField2}
            onChangeText={(text) => this.setHometown(text)}
        ></TextInput>

        <TextInput
            placeholder='Write a description about yourself'
            value={this.state.bio}
            multiline={true}
            numberOfLines={10}
            maxHeight={90}
            style={styles.inputField3}
            onChangeText={(text) => this.setBio(text)}
        ></TextInput>

        <TouchableOpacity style={[styles.button, styles.buttonLightBlue]} onPress={ () => {this.submit(this.state.firstName, this.state.lastName, this.state.hometown, this.state.bio)}}>
          <Text style={styles.buttonLabel}>Save</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      </ScrollView>
      </LinearGradient>
    );
  }


}