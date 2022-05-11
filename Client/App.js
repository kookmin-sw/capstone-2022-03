import React, { Component } from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './Screen /MainScreen';
import RegisterScreen from './Screen /RegisterScreen';
import LoginScreen from './Screen /LoginScreen';
import CameraScreen from './Screen /CameraScreen';
import ClubScreen from './Screen /ClubScreen';
import JoinClubScreen from './Screen /JoinClubScreen';
import CreateClubScreen from './Screen /CreateClubScreen';
const stack = createStackNavigator();

function BackBtn() {
  return (
    <Image
      source={require('./src/icon/back-btn.png')}
      style={{ marginLeft: 10, width: 22, height: 22 }}
    />
  );
}

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <stack.Navigator initialRouteName='Login'>
          <stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Login',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
                color: "#707070"
              },
              headerShown: false
            }}
          />
          <stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              title: '회원가입',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
                color: "#707070"
              },
              headerBackTitleVisible: false,
              // headerBackImage: BackBtn,
            }}
          />
          <stack.Screen
            name="Main"
            component={MainScreen}
            options={{
              title: "여기모영",
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
                color: "#707070"
              },
              headerShown: false
            }}
          />
          <stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{
              title: "영수증 촬영",
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
                color: "#707070"
              },
              headerBackTitleVisible: false,
            }}
          />
          <stack.Screen
            name="Club"
            component={ClubScreen}
            options={{
              title: "",
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
                color: "#707070"
              },
              headerBackTitleVisible: false,
              headerTransparent: true,
            }}
          />
          <stack.Screen
            name="JoinClub"
            component={JoinClubScreen}
            options={{
              title: "",
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerBackImage: BackBtn,
            }}
          />
          <stack.Screen
            name="CreateClub"
            component={CreateClubScreen}
            options={{
              title: "",
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerBackImage: BackBtn,
            }}
          />
        </stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;
