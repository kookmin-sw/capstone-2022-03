import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import styles from '../src/Styles';
import router from '../src/Router.json';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import CustomButton from '../src/CustomButton';
import 'react-native-gesture-handler';

const theme = styles.Color_Main2

function AddFee({ route, navigation }) {
    const { club_title, club_id, club_balance } = route.params;
    const [fee, setFee] = useState('');

    const _checkcode = (club_number) => {
        console.log(user_id);
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

    async function feeSubmit() {
        if (!fee) {
            Alert.alert('금액을 입력해주새요!')
        }
        else {
            fetch(router.aws + '/add_fee', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "club_id": club_id,
                    "fee": parseInt(fee)
                })
            }).then(res => res.json())
                .then(res => {
                    if (res) {
                        navigation.navigate('Club', {
                            club_title: club_title,
                            club_id: club_id,
                            club_balance: res.balance
                        })
                    }
                })
        }
    }
    return (
        <View style={[styles.Center_Container_2, { backgroundColor: theme }]}>
            <Text style={[styles.Font_Title2, { color: 'white' }]}>
                회비 금액을 입력해주세요
            </Text>
            <View style={extra.Input_container}>
                <TextInput
                    mode='flat'
                    style={styles.textInput}
                    selectionColor='white'
                    activeUnderlineColor='black'
                    backgroundColor='white'
                    onChangeText={newText => setFee(newText)}
                />
            </View>
            <View style={[styles.footer, { height: '8%', marginBottom: 20 }]}>
                <CustomButton
                    buttonColor={styles.Color_Main2}
                    title="모임 참가"
                    onPress={() => feeSubmit()}
                />
            </View>
        </View>

    );
}

const extra = StyleSheet.create({
    Input_container: {
        marginTop: 15,
        width: 200,
        height: 40,
        borderRadius: 7,
        backgroundColor: "white",
        textAlign: 'center',
        shadowColor: '#d3d3d3',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 1,
        shadowRadius: 1,
    }
})
export default AddFee;