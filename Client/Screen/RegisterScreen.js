import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import router from '../src/Router.json';

export function RegisterScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkpassword, setCheckPassword] = useState('');

    async function onRegister() {
        if (password != checkpassword) { //비밀번호 확인이 제대로 되었나 탐지
            Alert.alert("비밀번호를 다시 입력해주십시오.")
        } else if (!name || !email || !password || !checkpassword) {
            Alert.alert('정보를 모두 입력해주세요.')
        }
        else {
            if (Platform.OS === 'ios') {
                fetch(router.aws + '/register', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "name": name,
                        "email": email,
                        "password": password,
                    })
                }).then(res => res.json())
                    .then(res => {
                        if (res.success) {
                            console.log("회원정보 저장 완료!");
                            Alert.alert("회원가입이 완료되었습니다!")
                            navigation.navigate("Login");
                        }
                        else {
                            Alert.alert("회원가입에 실패하였습니다.");
                        }
                    })
            }
            else if (Platform.OS === 'android') {
                fetch(router.aws + '/register', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "name": name,
                        "email": email,
                        "password": password,
                    })
                }).then(res => res.json())
                    .then(res => {
                        if (res.success) {
                            console.log("회원정보 저장 완료!");
                            Alert.alert("회원가입이 완료되었습니다!")
                            navigation.navigate("Login");
                        }
                        else {
                            Alert.alert("회원가입에 실패하였습니다.");
                        }
                    })
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.topArea}>
                <View style={styles.titleArea}>
                    <Image
                        source={require('../src/icon/Register.png')}
                        style={{ width: wp(30), resizeMode: 'contain' }}
                    />
                </View>
                <View style={styles.TextArea}>
                    <Text style={styles.Text}>간편한 회원가입으로</Text>
                    <Text style={styles.Text}>'여기모영'의 일원이 되어보세요!</Text>
                </View>
            </View>
            <View style={styles.blankArea}></View>
            <View style={styles.formArea}>
                <TextInput
                    style={styles.textFormTop}
                    placeholder={'이름'}
                    autoCapitalize='none'
                    onChangeText={(text) => { setName(text); }}
                />
                <TextInput
                    style={styles.textFormBottom}
                    placeholder={'이메일'}
                    autoCapitalize='none'
                    onChangeText={(text) => { setEmail(text); }}
                />
                <TextInput
                    style={styles.textFormBottom}
                    placeholder={'비밀번호 (8자 이상, 특수문자 필수기입)'}
                    autoCapitalize='none'
                    onChangeText={(text) => { setPassword(text); }}
                    secureTextEntry={true} //텍스트 숨김처리
                />
                <TextInput
                    style={styles.textFormBottom}
                    placeholder={'비밀번호 확인'}
                    autoCapitalize='none'
                    onChangeText={(text) => { setCheckPassword(text); }}
                    secureTextEntry={true} //텍스트 숨김처리
                />
            </View>
            <View style={[styles.blankArea,]}></View>
            <View style={{ flex: 0.5 }}>
                <View style={[styles.btnArea, { marginTop: 50 }]}>
                    <TouchableOpacity style={styles.btn_register}
                        onPress={() => onRegister()}>
                        <Text style={(styles.Text, { color: 'white', fontSize: 20 })}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 2 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, //전체의 공간을 차지한다는 의미
        flexDirection: 'column',
        backgroundColor: '#f2f2f2',
        paddingLeft: wp(7),
        paddingRight: wp(7),
    },
    blankArea: {
        marginTop: 25,
        marginBottom: 25,
    },
    topArea: {
        flex: 1,
        marginTop: 100,
        paddingTop: wp(3),
    },
    titleArea: {
        flex: 0.7,
        justifyContent: 'center',
        paddingTop: wp(3),
    },
    TextArea: {
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

export default RegisterScreen
