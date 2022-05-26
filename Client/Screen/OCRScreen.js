import 'react-native-gesture-handler';
import React, { useEffect, useState, version } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Button, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import Plus from '../src/icon/plus.png';
import AsyncStorage from '@react-native-community/async-storage';
import CustomButton from '../src/CustomButton';
import styles from '../src/Styles';
import router from '../src/Router.json';

const default_data = {
    id: Math.random().toString(),
    item_name: "인식 오류",
    item_cost: "인식 오류"
}

function CameraScreen({ navigation, route }) {
    const { club_title, club_id, user_id, club_leader_id, members } = route.params;
    const [receipt, captured_receipt] = useState({});
    const [detail, setDetail] = useState([]);
    const [place, setStorename] = useState("");
    const [date, setDate] = useState("");
    const [cost, setTotalprice] = useState("");

    useEffect(() => {
        if (place != '') {
            console.log("mime", receipt.mime)
            console.log("data", receipt.data)
            navigation.navigate("OCRReceipt", {
                place: place,
                date: date,
                cost: cost,
                detail: detail[0],
                user_id: user_id,
                club_title: club_title,
                club_id: club_id,
                club_leader_id: club_leader_id,
                members: members,
                mime: receipt.mime,
                data: receipt.data,
            })
        }
    }, [detail])
    const runCamera = async () => {
        ImagePicker.openCamera({
            includeBase64: true,
            useFrontCamera: false,
            freeStyleCropEnabled: true,
            cropping: true,
            compressImageQuality: 1,
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

    async function StoreHandler(storename) {
        try {
            if (storename != undefined) {
                setStorename(storename);
            } else {
                setStorename("사용처를 입력해주세요");
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    async function DateHandler(paymentInfo) {
        try {
            if (paymentInfo != undefined) {
                setDate(paymentInfo);
            } else {
                setStorename("결제일자를 입력해주세요");
            }
        } catch (e) {
            setStorename("결제일자를 입력해주세요");
            console.log(e);
        } finally {
        }
    };

    async function CostHandler(totalPrice) {
        try {
            if (totalPrice != undefined) {
                setTotalprice(totalPrice);
            } else {
                setTotalprice("총 결제금액을 입력해주세요");
            }
        } catch (e) {
            setTotalprice("총 결제금액을 입력해주세요");
            console.log(e);
        } finally {
        }
    };

    async function DetailHandler(data) {
        try {
            if (data != undefined) {
                const sub_list = data
                let details = []
                for (let item of sub_list) {
                    details.push({ id: Math.random().toString(), item_name: item.name.text, item_cost: item.price.price.text.replace(/[^0-9]/g, "") }) //비동기
                }
                setDetail([...detail, details])
            } else {
                setDetail([...detail, default_data])
            }
        } catch (e) {
            console.log(e)
            setDetail([...detail, default_data])
        }
    }
    async function addReceipt() {
        console.log("분석on");
        fetch(router.CLOVA.InvokeURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-OCR-SECRET': 'c3BUU095bklkY3pHbGVmbkZNQ01EeU1Zc0dZbmRqcFg='
            },
            body: JSON.stringify({
                "lang": 'ko',
                "requestId": 'receipt',
                "resultType": 'string',
                "version": "V2",
                "timestamp": 0,
                "images": [{
                    "format": "jpeg",
                    "name": "receipt",
                    "data": receipt.data
                }]
            })
        }).then(async res => await res.json())
            .then(async res => {
                await StoreHandler(res.images[0].receipt.result.storeInfo.name.text)
                await DateHandler(res.images[0].receipt.result.paymentInfo.date.text)
                await CostHandler(res.images[0].receipt.result.totalPrice.price.text.replace(/[^0-9]/g, ""))
                await DetailHandler(res.images[0].receipt.result.subResults[0].items)
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
                    title="분석하기"
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