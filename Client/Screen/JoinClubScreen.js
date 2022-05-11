import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import styles from '../src/Styles';

const theme = styles.Color_Main2

function JoinClub({ navigation }) {

    const [club_id, SetClub_Id] = useState('');

    _checkcode = (club_id) => {

        alert(`club_id : ${club_id}`);
        /*
            모임번호 4자리를 모두 입력하면 이 함수를 실행한다
            위 함수에서 서버와 통신하도록 한다.
            해당하는 모임의 번호가 있을 경우 유저를 해당 모임에 추가시키고
            해당하는 모임의 번호가 없을 경우 없는 모임번호라는 toast알림을 띄워준다.
        */
    }

    return (
        <View style={[styles.Center_Container, { backgroundColor: theme }]}>
            <Text style={[styles.Font_Title2, { color: 'white' }]}>
                모임 번호를 입력해주세요
            </Text>
            <SmoothPinCodeInput
                // password mask="*"
                cellSize={45}
                cellStyle={{
                    borderBottomWidth: 2,
                    borderColor: 'white',
                }}
                cellStyleFocused={{
                    borderBottomWidth: 2,
                    borderColor: 'white',
                }}
                textStyle={[styles.Font_Title2, { color: 'white' }]}
                value={club_id}
                onTextChange={newText => SetClub_Id(newText)}
                onFulfill={_checkcode}
                cellSpacing={5}
                keyboardType='numeric'
            />
        </View>
    );
}

export default JoinClub;