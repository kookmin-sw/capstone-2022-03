import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './Screen /MainScreen';
import RegisterScreen from './Screen /RegisterScreen';
import LoginScreen from './Screen /LoginScreen';
import CameraScreen from './Screen /CameraScreen';
const stack = createStackNavigator();

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
              headerBackTitleVisible: false, //headerBackTitleVisible을 이용해서 버튼 타이틀의 렌더링 여부를 동일하게 설정
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
              headerBackTitleVisible: false, //headerBackTitleVisible을 이용해서 버튼 타이틀의 렌더링 여부를 동일하게 설정
            }}
          />
        </stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;
