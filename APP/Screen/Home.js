import React from 'react';
import { View, Text, Button } from 'react-native';
import { render } from 'react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod';
import { withNavigation } from 'react-navigation'


let user_name = '민태식';

    var Law = {
        Law_Id : undefined,
        Law_Name : '공공주택 특별법 시행령 일부개정령안 입법예고',
        Due_Date : '2022.03.03~2022.04.02',
        Office_Ministry : '국방부'
    };


class Home extends React.Component{

  render(){
    return(
      <View style={{ flex: 1, alignItems : 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 30}}>국민을 국회로</Text>
        <Text>`안녕하세요 {user_name}님!`</Text>
        <Button
          title="Go to Lawboard"
          onPress={() => this.props.navigation.navigate('LawBoard')}
        />
      </View>
    )
  }
};

export default withNavigation(Home);
  
  