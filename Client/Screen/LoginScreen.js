import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, TextInput, Keyboard, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import router from '../src/Router.json';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errtext, setErrText] = useState('');

    async function onLogin() {
        if (!email || !password) { //비밀번호 확인이 제대로 되었나 탐지
            Alert.alert("아이디 혹은 비밀번호를 입력해주세요")
        }
        else {
            if (Platform.OS === 'ios') {
                fetch(router.aws + "/login", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "email": email,
                        "password": password,
                    })
                }).then(res => res.json())
                    .then(res => {
                        if (res.success) {
                            AsyncStorage.setItem('user_information', JSON.stringify(res)); //response로 받은 데이터 저장
                            navigation.reset({
                                routes: [{
                                    name: 'Main',
                                }]
                            })
                        } else {
                            Alert.alert("이메일 또는 비밀번호를 확인해주세요");
                        }
                    })
            }
            else if (Platform.OS === 'android') {
                fetch(router.aws + "/login", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "email": email,
                        "password": password,
                    })
                }).then(res => res.json())
                    .then(res => {
                        if (res.success) {
                            AsyncStorage.setItem('user_information', JSON.stringify(res)); //response로 받은 데이터 저장
                            navigation.reset({
                                routes: [{
                                    name: 'Main',
                                }]
                            })
                        } else {
                            Alert.alert("이메일 또는 비밀번호를 확인해주세요");
                        }
                    })
            }
        }
    }

    function goToRegister() {
        navigation.push("Register");
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.topArea}>
                    <View style={styles.titleArea}>
                        <Image
                            source={require('../src/icon/Login.png')}
                            style={{ width: wp(30), resizeMode: 'contain', marginTop: 30 }}
                        />
                    </View>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ height: 100, marginTop: 50 }}>
                        <View style={styles.TextArea}>
                            <Text style={styles.Text}>🧾여기, 모두의 영수증🧾</Text>
                            <Text style={styles.Text}>'여기모영' 에 오신것을 환영합니다!</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <View style={styles.formArea}>
                    <TextInput
                        style={styles.textFormTop}
                        placeholder={'아이디'}
                        autoCapitalize='none'
                        onChangeText={(text) => { setEmail(text); }}
                    />
                    <TextInput
                        style={styles.textFormBottom}
                        placeholder={'비밀번호'}
                        autoCapitalize='none'
                        onChangeText={(text) => { setPassword(text); }}
                        secureTextEntry={true} //텍스트 숨김처리
                    />
                    {errtext != '' ? (
                        <Text style={styles.TextValidation}> {errtext}</Text>
                    ) : null}
                </View>
                <View style={{ flex: 0.5 }}>
                    <View style={styles.btnArea}>
                        <TouchableOpacity style={styles.btn}
                            onPress={() => onLogin()}>
                            <Text style={(styles.Text, { color: 'white', fontSize: 20 })}>로그인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 0.5 }}>
                    <View style={styles.btnArea}>
                        <TouchableOpacity style={styles.btn_register}
                            onPress={() => goToRegister()}>
                            <Text style={(styles.Text, { color: 'white', fontSize: 20 })}>회원가입</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 2 }} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, //전체의 공간을 차지한다는 의미
        flexDirection: 'column',
        backgroundColor: '#f2f2f2',
    },
    content: {
        paddingLeft: 30,
        paddingRight: 30,
        height: '100%',
        backgroundColor: '#f2f2f2',
        ...Platform.select({
            ios: {
                paddingTop: 20
            },

            android: {
                paddingTop: 40
            }

        })
    },
    topArea: {
        flex: 1,
        marginTop: 150,
        paddingTop: wp(3),
    },
    titleArea: {
        flex: 0.7,
        justifyContent: 'center',
        paddingTop: wp(3),
    },
    TextArea: {
        marginTop: 30,
        flex: 0.3,
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
    },
    Text: {
        fontSize: wp('4%'),
    },
    TextValidation: {
        fontSize: wp('4%'),
        color: 'red',
        paddingTop: wp(2),
    },

    formArea: {
        justifyContent: 'center',
        flex: 1.5,
    },
    textFormTop: {
        backgroundColor: 'white',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        width: '100%',
        height: hp(6),
        paddingLeft: 10,
        paddingRight: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#d3d3d3',
                shadowOffset: {
                    width: 1.5,
                    height: 1.5
                },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
            android: {
                shadowColor: 'black',
                elevation: 4,
            }
        }),
    },
    textFormBottom: {
        marginTop: 10,
        backgroundColor: 'white',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        width: '100%',
        height: hp(6),
        paddingLeft: 10,
        paddingRight: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#d3d3d3',
                shadowOffset: {
                    width: 1.5,
                    height: 1.5
                },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
            android: {
                shadowColor: 'black',
                elevation: 4,
            }
        }),
    },
    btnArea: {
        height: hp(8),
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: hp(1.5),
    },
    btn: {
        flex: 1,
        width: '100%',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#208cf7',
    },
    btn_register: {
        flex: 1,
        width: '100%',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#215180',
    },
});

export default LoginScreen

