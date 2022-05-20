import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import Plus from '../src/icon/plus.png';
import storage from '@react-native-firebase/storage';
import CustomButton from '../src/CustomButton';
import styles from '../src/Styles';


export function CameraScreen() {
    const navigation = useNavigation();
    const [receipt, captured_receipt] = useState({});

    runCamera = async () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true,
        }).then(image => {
            console.log(image);
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
            console.log("ok");
            console.log(receipt.uri);
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
                    onPress={() => {
                        navigation.navigate("ReceiptImage", {
                            mime: receipt.mime,
                            base64: receipt.data,
                            path: receipt.uri,
                        })
                    }}
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
