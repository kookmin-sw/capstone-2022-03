import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import Plus from '../src/icon/plus.png';
import storage from '@react-native-firebase/storage';
import config from '../config.json';
import test from '../src/icon/test.jpeg';
// import storage from '@react-native-firebase/storage';

export function CameraScreen() {
    const navigation = useNavigation();
    const [receipt, captured_receipt] = useState({});

    runCamera = async () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            console.log(image);
            captured_receipt({
                uri: image.path,
                width: image.width,
                height: image.height,
                mime: image.mime
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
                style={styles.images}
            />
        } else {
            return <View style={styles.images}>
                <Image
                    source={Plus}
                    style={styles.plusIcon}
                />
            </View>
        }
    }

    async function postImage() {
        if (receipt.uri === undefined) {
            Alert.alert('영수증 사진을 찍어주세요.')
        } else {
            navigation.navigate('Loading');
        }
    }

    const callGoogleVisionApi = async () => {
        console.log("ocr분석시작");
        console.log(config.googleCloud.api);
        console.log(config.googleCloud.apiKey);
        console.log(test.uri);
        let googleVisionRes = await fetch(config.googleCloud.api + config.googleCloud.apiKey, {
            method: 'POST',
            body: JSON.stringify({
                "requests": [
                    {
                        "features": [
                            { "type": "DOCUMENT_TEXT_DETECTION" },
                        ],
                        "image": {
                            "source": {
                                "imageUri": "gs://kookmin-sw-capstone-2022-03.appspot.com/test2.jpeg"
                            }
                        }
                    }
                ]
            })
        });
        await googleVisionRes.text()
            .then(googleVisionRes => {
                console.log(googleVisionRes)
                if (googleVisionRes) {
                    console.log('this.is response', googleVisionRes);
                }
            }).catch((error) => { console.log(error) })
        // .then((res) => console.log(res.json()))
        // await googleVisionRes.text()
        //     .then(googleVisionRes => {
        //         console.log(googleVisionRes.description);
        //     }).catch((err) => { console.log(err) })
    }


    const uploadImage = () => {
        let ext = receipt.uri.split('/').pop();
        console.log(ext)
        const imgRef = storage().ref(ext);
        let task = imgRef.putFile(receipt.uri);
        task.then(() => {
            console.log("Upload");
        }).catch((e) => console.log(e));
        // const filename = `${uuid()}.${ext}`;
        // const imgRef = firebase.storage().ref(`receipt/${filename}`);
    }
    return (
        <View style={styles.cameraScreen}>
            <View style={styles.TextView}>
                <Text style={styles.text}>+를 터치하여 <Text style={styles.highlight}>영수증</Text>을 찍어주세요</Text>
            </View>
            <TouchableOpacity onPress={runCamera} >
                {renderImage(1)}
            </TouchableOpacity>
            <Button onPress={uploadImage} title='제출하기'></Button>
            <Button onPress={callGoogleVisionApi} title='ocr분석'></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    cameraScreen: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },

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

    highlight: {
        width: 266,
        height: 19,
        // fontFamily: "AppleSDGothicNeo",
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: "#208cf7",
    }
})

export default CameraScreen