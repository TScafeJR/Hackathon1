import React from 'react';
import { View,  Alert, AsyncStorage } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { Facebook } from 'expo';
import { DOMAIN, FB_TOKEN } from '../../env.js'

export default class FBLoginButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        }
    }

    componentDidMount() {  
        AsyncStorage.getItem('user')
        .then(result => {
            if (result) {
                var parsedResult = JSON.parse(result);
                if (parsedResult.username) {
                    var lowerUsername = parsedResult.username.toLowerCase()
                    this.setState({
                    username: lowerUsername
                    })
                }
            }
        })
        .catch((error) => {
            console.log(`There was an error retrieving the user's information:\n${error}`)
        })
    }

    handleFacebookLogin = async () => {
        try {
        const { type, token } = await Facebook.logInWithReadPermissionsAsync(
            FB_TOKEN,
            { permissions: ['public_profile'] }
        );

        switch (type) {
            case 'success': {
            // Get the user's name using Facebook's Graph API
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            const profile = await response.json();
            Alert.alert(
                'Logged in!',
                `Hi ${profile.name}!`,
            );
            break;
            }
            case 'cancel': {
            Alert.alert(
                'Cancelled!',
                'Login was cancelled!',
            );
            break;
            }
            default: {
            Alert.alert(
                'Oops!',
                'Login failed, wrong password!',
            );
            }
        }
        } catch (e) {
            Alert.alert(
                'Oops!',
                'Login failed!',
            );
        }
    }

    connectFacebook = async () => {
        try {
          const { type, token } = await Facebook.logInWithReadPermissionsAsync(
            FB_TOKEN,
            { permissions: ['public_profile'] }
          );

          switch (type) {
            case 'success': {
              // Get the user's name using Facebook's Graph API
              const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
              const profile = await response.json();
                await fetch(`${DOMAIN}/fbupdate/${this.state.username}`, {
                  method: 'POST',
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    facebookName: profile.name,
                    facebookID: profile.id,
                  })
                })
                .then((response) => {
                    Alert.alert(
                        'Logged in!',
                        `Hi ${profile.name}!`,
                    );
                  return response.json();
                })
                .catch(function(error){
                    console.log(`There was an error\n${error}`)
                })
                  break;
             }
             case 'cancel': {
                Alert.alert(
                  'Cancelled!',
                  'Login was cancelled!',
                );
                break;
              }
              default: {
                Alert.alert(
                  'Oops!',
                  'Login failed!',
                );
              }
            }
            } catch (e) {
                console.log(`there was an error logging in:\n${e}`)
                Alert.alert(
                    `Oops!`,
                    `Facebook login failed! Try again`
                );
        }
    }

    render() {
        return (
            <View>
            
            <Button full iconLeft onPress={() => this.connectFacebook()}>
            <Icon type="FontAwesome" name='facebook' />
                <Text>Connect Facebook</Text>
            </Button>

            {/*<Button
                publishPermissions={["email"]}
                onLoginFinished={
                (error, result) => {
                    if (error) {
                    alert("Login failed with error: " + error.message);
                    } else if (result.isCancelled) {
                    alert("Login was cancelled");
                    } else {
                    alert("Login was successful with permissions: " + result.grantedPermissions)
                    }
                }
                }
            onLogoutFinished={() => alert("User logged out")}/> */}
            </View>
        );
    }
};
