import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import styles from '../src/Styles';
import router from '../src/Router.json';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const theme = styles.Color_Main2

function JoinClub({ navigation }) {
    const isFocused = useIsFocused();

    const [club_number, SetClub_Number] = useState('');
    const [user_id, SetUser_id] = useState('');
    const [user_name, SetUser_Name] = useState('');
    const [user_email, SetUser_Email] = useState('');
    const [user_address, SetUser_Address] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('user_information', (err, res) => {
            const user = JSON.parse(res);
            if (user.user_id != null) {
                SetUser_id(user.user_id);
                SetUser_Name(user.user_name);
                SetUser_Email(user.user_email);
                SetUser_Address(user.user_address);
            }
        })
    }, [isFocused]);

    const _checkcode = (club_number) => {
        fetch(router.aws + '/join_club', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user_id": user_id,
                "user_name": user_name,
                "user_email": user_email,
                "user_address": user_address,
                "club_number": club_number,
            })
        }).then(res => res.json())
            .then(res => {
                if (res.success) {
                    alert(`모임에 참여 완료하였습니다!`);
                    navigation.reset({
                        routes: [{
                            name: 'Main',
                        }]
                    })
                }
            })

    }

    return (
        <View style={[styles.Center_Container, { backgroundColor: theme }]}>
            <Text style={[styles.Font_Title2, { color: 'white' }]}>
                모임 번호를 입력해주세요
            </Text>
            <SmoothPinCodeInput
                codeLength={5}
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
                value={club_number}
                onTextChange={newText => SetClub_Number(newText)}
                onFulfill={_checkcode}
                cellSpacing={5}
                keyboardType='numeric'
            />
        </View>
    );
}

export default JoinClub;
