import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { withNavigation } from 'react-navigation'
import ci from '../src/CI.png'


class Login extends React.Component{
  render(){
    return(
      <View style={{ flex :1 , alginItems : 'center', justifyContent: 'center'}}>
        <Image 
          source={ci} 
          style={{width: '50%', height:300 }}
          resizeMode="contain"
          />
        <Text>Login</Text>
        <Text>Sign</Text>
        <Text style={{fontSize: 25}}>Welcome Back</Text>
        <Text>Sign in with your account</Text>
        <Text style={{fontSize :20}}>Username</Text>
        <TextInput 
        placeholder='아이디를 입력해주세요'
         />
        <Text style={{fontSize :20}}>Password</Text>
        <TextInput 
        placeholder='비밀번호를 입력해주세요'
        secureTextEntry={true}
        />
        <Button
          title="Login"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    )
  }
}

export default withNavigation(Login);