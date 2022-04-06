import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../Screen/Login';
import Home from '../Screen/Home';
import LawBoard from '../Screen/LawBoard';


const Stack = createStackNavigator();

const StackNavigation = () => {
    return (
        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home}
                options={{headerShown:false}} 
            />
            <Stack.Screen name="LawBoard" component={LawBoard}
                options={{title:'국민을 국회로 법안게시판'}}/>
        </Stack.Navigator>  
    );
};

export default StackNavigation;
