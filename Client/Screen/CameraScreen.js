import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import Plus from '../src/icon/plus.png';
import AsyncStorage from '@react-native-community/async-storage';
import CustomButton from '../src/CustomButton';
import styles from '../src/Styles';
import router from '../src/Router.json';


function CameraScreen({ navigation, route }) {
    const { owner, place, date, cost, club_title, club_id, user_id, club_leader_id, members, detail } = route.params;
    const [receipt, captured_receipt] = useState({});

    console.log("camera");
    console.log(user_id);
    console.log(club_leader_id);
    console.log(members);
    runCamera = async () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            includeBase64: true,
            useFrontCamera: false,
            cropping: true,
        }).then(image => {
            captured_receipt({
                uri: image.path,
                width: image.width,
                height: image.height,
                mime: image.mime,
                data: image.data,
            })
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    const renderImage = (flag) => {
        if (receipt.uri != undefined && flag == 1) {
            return <Image
                source={{ uri: receipt.uri }}
                style={extra.images}
            />
        } else {
            return <View style={extra.images}>
                <Image
                    source={Plus}
                    style={extra.plusIcon}
                />
            </View>
        }
    }

    function addReceipt() {
        AsyncStorage.getItem('user_information', async (err, res) => {
            const user = JSON.parse(res);
            fetch(router.aws + '/add_receipt', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    club_id: club_id,
                    user_name: owner,
                    user_address: user.user_address,
                    receipt: {
                        owner: owner,
                        place: place,
                        date: date,
                        cost: cost,
                        detail: detail,
                        image: receipt.data,
                        mime: receipt.mime,
                    },
                })
            }).then(res => res.json())
                .then(res => {
                    if (res.success) {
                        console.log(res);
                        navigation.navigate("Club", {
                            club_id: club_id,
                            club_balance: res.balance,
                            user_id: user_id,
                            club_title: club_title,
                            club_leader_id: club_leader_id,
                            members: members,
                        })
                    }
                })
        })
    }
    return (
        <View style={[styles.container, { backgroundColor: styles.Color_Main2, alignItems: 'center', justifyContent: 'center' }]}>
            <View style={{ marginTop: 150 }}></View>
            <View style={extra.TextView}>
                <Text style={extra.text}>+를 터치하여 <Text style={extra.highlight}>영수증</Text>을 찍어주세요</Text>
            </View>
            <TouchableOpacity onPress={runCamera} >
                {renderImage(1)}
            </TouchableOpacity>
            <View style={[{ marginTop: 50, width: '90%', height: 55, backgroundColor: 'theme' }]}>
                <CustomButton
                    buttonColor={'#4169e1'}
                    title="등록"
                    onPress={() => { addReceipt() }}
                />
            </View>
        </View>
    )
}

const extra = StyleSheet.create({
    images: {
        marginBottom: 100,
        width: 300,
        height: 400,
        borderWidth: 3,
        borderColor: "#cccccc",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    plusIcon: {
        width: 50,
        height: 50,
    },
    TextView: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    text: {
        color: 'white',
    },
    highlight: {
        width: 266,
        height: 19,
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: "white",
    },
})

export default CameraScreen
