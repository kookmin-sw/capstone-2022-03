import React, { Component } from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen'; /** Splash 추가 **/

import MainScreen from './Screen /MainScreen';
import RegisterScreen from './Screen /RegisterScreen';
import LoginScreen from './Screen /LoginScreen';
import CameraScreen from './Screen /CameraScreen';
import ClubScreen from './Screen /ClubScreen';
import JoinClubScreen from './Screen /JoinClubScreen';
import CreateClubScreen from './Screen /CreateClubScreen';
import AddFeeScreen from './Screen /AddFeeScreen';
import AddMemberScreen from './Screen /AddMemberScreen';
import WithDrawScreen from './Screen /WithDrawScreen';
import ManualReceiptScreen from './Screen /ManualReceiptScreen';
import ManualReceiptDetailScreen from './Screen /ManualReceiptDetailScreen';
import ReceiptInfoScreen from './Screen /ReceiptInfoScreen';
import ReceiptImageScreen from './Screen /ReceiptImageScreen';
import OCRScreen from './Screen /OCRScreen';
import OCRReceiptScreen from './Screen /OCRReceiptScreen';
import OCRReceiptDetailScreen from './Screen /OCRReceiptDetailScreen';
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

    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

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
              title: '',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
                color: "#707070"
              },
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerBackImage: BackBtn,
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
              title: "",
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
                color: "#707070"
              },
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerBackImage: BackBtn,
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
              headerBackImage: BackBtn,
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
          <stack.Screen
            name="AddFee"
            component={AddFeeScreen}
            options={{
              title: "",
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerBackImage: BackBtn,
            }}
          />
          <stack.Screen
            name="AddMember"
            component={AddMemberScreen}
            options={{
              title: "총무추가",
              headerBackTitleVisible: false,
              headerBackImage: BackBtn,
            }}
          />
          <stack.Screen
            name="WithDraw"
            component={WithDrawScreen}
            options={{
              title: "",
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerBackImage: BackBtn,
            }}
          />
          <stack.Screen
            name="ManualReceipt"
            component={ManualReceiptScreen}
            options={{
              title: "",
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerBackImage: BackBtn,
            }}
          />
          <stack.Screen
            name="ManualReceiptDetail"
            component={ManualReceiptDetailScreen}
            options={{
              title: "",
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerBackImage: BackBtn,
            }}
          />
          <stack.Screen
            name="ReceiptInfo"
            component={ReceiptInfoScreen}
            options={{
              title: "",
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerBackImage: BackBtn,
            }}
          />
          <stack.Screen
            name="ReceiptImage"
            component={ReceiptImageScreen}
            options={{
              title: "",
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerBackImage: BackBtn,
            }}
          />
          <stack.Screen
            name="OCR"
            component={OCRScreen}
            options={{
              title: "",
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerBackImage: BackBtn,
            }}
          />
          <stack.Screen
            name="OCRReceipt"
            component={OCRReceiptScreen}
            options={{
              title: "",
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerBackImage: BackBtn,
            }}
          />
          <stack.Screen
            name="OCRReceiptDetail"
            component={OCRReceiptDetailScreen}
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
