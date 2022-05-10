import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './Screen/MainScreen';
import CameraScreen from './Screen/CameraScreen';
import RegisterScreen from './Screen/RegisterScreen';
import LoginScreen from './Screen/LoginScreen';
// const HomeScreen = ({ navigation }) => {
//   return (
//     <View style={styles.screen}>
//       <Text>HomeScreen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.navigate('Details')}
//       />
//     </View>
//   )
// }

// const DetailsScreen = ({ navigation }) => {
//   return (
//     <View style={styles.screen}>
//       <Text>Details Screen</Text>
//       <Button
//         title="Go to Details again"
//         onPress={() => navigation.push('Details')}
//       />
//       <Button
//         title="Go to Home"
//         onPress={() => navigation.navigate('Home')}
//       />
//       <Button
//         title="Go Back"
//         onPress={() => navigation.goBack()}
//       />
//       <Button
//         title="Go back to first screen in stack"
//         onPress={() => navigation.popToTop()}
//       />
//     </View>
//   )
// }
// 앱이 각 화면이 전환될 수 있는 기본 틀을 제공한다.
const Stack = createStackNavigator();

function BackBtn() {
  return (
    <Image
      source={require('./src/icon/back.png')}
      style={{ marginLeft: 16, width: 24, height: 24 }}
    />
  );
}

class App extends Component {
  render() {

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
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
          <Stack.Screen
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
              headerBackImage: BackBtn,
            }}
          />
          <Stack.Screen
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
          <Stack.Screen
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
              headerBackImage: BackBtn,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;