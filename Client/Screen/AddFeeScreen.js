import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import styles from '../src/Styles';
import router from '../src/Router.json';
import CustomButton from '../src/CustomButton';
import 'react-native-gesture-handler';
import MaskInput, { createNumberMask } from 'react-native-mask-input'; { }
import AsyncStorage from '@react-native-community/async-storage';

const theme = styles.Color_Main2
const dollarMask = createNumberMask({
    delimiter: ',',
    separator: ' ',
    precision: 0,
})

function AddFee({ route, navigation }) {
    const { club_title, club_id, user_id, club_leader_id, members } = route.params;
    const [fee, setFee] = useState('');
    let set_fee = fee.replace(/[ ,원]/gi, "");

    async function feeSubmit() {
        console.log(set_fee)
        if (!fee) {
            Alert.alert('금액을 입력해주새요!')
        }
        else {
            AsyncStorage.getItem('user_information', async (err, res) => {
                const user = JSON.parse(res);
                fetch(router.aws + '/add_fee', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "club_id": club_id,
                        "user_address": user.user_address,
                        "fee": parseInt(set_fee)
                    })
                }).then(res => res.json())
                    .then(res => {
                        if (res.success) {
                            console.log(res);
                            navigation.navigate('Club', {
                                user_id: user_id,
                                club_title: club_title,
                                club_id: club_id,
                                club_balance: res.balance,
                                club_leader_id: club_leader_id,
                                members: members
                            })
                        }
                    })
            })
        }
    }

    return (
        <View style={[styles.Center_Container, { backgroundColor: theme }]}>
            <View style={[styles.title, { alignItems: 'center', backgroundColor: theme }]}>
                <Text style={[styles.Font_Title2, { color: 'white' }]}>
                    입금한 금액을 입력하세요
                </Text>
                <View style={[styles.PayMoneyInput, {}]}>
                    <MaskInput
                        value={fee}
                        mask={dollarMask}
                        onChangeText={(masked, unmasked) => {
                            setFee(unmasked); // you can use the masked value as well
                        }}
                        autoFocus={true}
                        style={[styles.Font_Title2, { backgroundColor: styles.Color_Main2, color: 'white' }]}
                        keyboardType='number-pad'
                    />
                    <Text style={[styles.Font_Title2, { color: 'white' }]}> 원</Text>
                </View>
                <View style={[{ marginTop: 50, width: '90%', height: 55, backgroundColor: 'theme' }]}>
                    <CustomButton
                        title='등록'
                        buttonColor={styles.Color_Main1}
                        onPress={() => feeSubmit()}
                    />
                </View>
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
