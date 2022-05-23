import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import styles from '../src/Styles';
import CustomButton from '../src/CustomButton';
import 'react-native-gesture-handler';


const theme = styles.Color_Main2

function WithDraw({ route, navigation }) {
    const { club_title, club_id, user_id, club_leader_id, members } = route.params;

    console.log("withdraw");
    console.log(user_id);
    console.log(club_leader_id);
    console.log(members);
    return (
        <View style={[styles.Center_Container, { backgroundColor: theme }]}>
            <View style={[styles.title, extra.Input_container, { alignItems: 'center', backgroundColor: theme }]}>
                <Text style={[styles.Font_Title2, { color: 'white' }]}>
                    출금 내역 등록방식을 선택해주세요
                </Text>
                <View style={[{ marginTop: 30, width: '90%', height: 55, backgroundColor: 'theme', flexDirection: 'row' }]}>
                    <CustomButton
                        title='직접 입력'
                        buttonColor='white'
                        titleColor='#3a527a'
                        onPress={() => navigation.navigate("ManualReceipt", {
                            user_id: user_id,
                            club_title: club_title,
                            club_id: club_id,
                            club_leader_id: club_leader_id,
                            members: members
                        })}
                    />
                </View>
            </View>
        </View>
    );
}

const extra = StyleSheet.create({
    Input_container: {
        marginBottom: 15,
    }
})
export default WithDraw;
