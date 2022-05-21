import React, { useState, useEffect } from 'react';
import { View, Text, Platform, Alert, StyleSheet, StatusBar } from 'react-native';
import CustomButton from '../src/CustomButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Styles from '../src/Styles';
import { TextInput, RadioButton } from 'react-native-paper';
import router from '../src/Router.json';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import RadioGroup from 'react-native-radio-buttons-group';
const theme = 'white'

StatusBar.setBarStyle("dark-content");
if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
}
const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

const radioButtonsData = [{
    id: '1',
    label: '일반 데이터베이스에 저장',
    value: 'DB'
}, {
    id: '2',
    label: '블록체인에 저장',
    value: 'BC'
}]

function CreateClub({ route, navigation }) {

    const isFocused = useIsFocused();
    const [user_id, setUser_Id] = useState('');
    const [user_name, setUser_Name] = useState('');
    const [user_email, setUser_Email] = useState('');
    const [user_address, setUser_Address] = useState('');
    const [club_title, setClub_Title] = useState('');
    const [club_bank_name, setClub_Bank_Name] = useState('');
    const [club_bank_account, setClub_Bank_Account] = useState('');
    const [club_bank_holder, setClub_Bank_Holder] = useState('');
    const [checked, setChecked] = useState('DB'); //초기값은 DB에 저장하도록 한다.

    const [radioButtons, setRadioButtons] = useState(radioButtonsData)

    useEffect(() => {
        AsyncStorage.getItem('user_information', (err, res) => {
            const user = JSON.parse(res);
            if (user.user_id != null) {
                setUser_Id(user.user_id);
                setUser_Email(user.user_email);
                setUser_Name(user.user_name);
                setUser_Address(user.user_address);
            }
        })
    }, [isFocused]);

    async function createClub() {
        if (!club_title || !club_bank_name || !club_bank_account) { //비밀번호 확인이 제대로 되었나 탐지
            Alert.alert("정보를 모두 입력해주세요")
        }
        else {
            if (Platform.OS === 'ios') {
                console.log(checked);
                fetch(router.aws + "/create_club", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "flag": checked,
                        "user_id": user_id,
                        "user_name": user_name,
                        "user_email": user_email,
                        "user_address": user_address,
                        "club_title": club_title,
                        "club_bank_name": club_bank_name,
                        "club_bank_account": club_bank_account,
                        "club_bank_holder": club_bank_holder,
                        "department": "head",
                    })
                }).then(res => res.json())
                    .then(res => {
                        if (res.success) {
                            console.log(res.message);
                            console.log("클럽생성완료");
                            navigation.navigate("Main");
                        }
                    })
            }
            else if (Platform.OS === 'android') {
                console.log(checked);
                fetch(router.aws + "/create_club", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "flag": checked,
                        "user_id": user_id,
                        "user_name": user_name,
                        "user_email": user_email,
                        "user_address": user_address,
                        "club_title": club_title,
                        "club_bank_name": club_bank_name,
                        "club_bank_account": club_bank_account,
                        "club_bank_holder": club_bank_holder,
                        "department": "head",
                    })
                }).then(res => res.json())
                    .then(res => {
                        if (res.success) {
                            console.log(res.message);
                            console.log("클럽생성완료");
                            navigation.navigate("Main");
                        }
                    })
            }
        }
    }

    function onPressRadioButton(radioButtonsArray) {
        radioButtonsArray.filter(function (e) {
            if (e.selected == true) {
                setChecked(e.value)
            }
        })
    }

    if (Platform.OS === 'ios') {
        return (
            <View style={styles.container}>
                <View style={styles.header}></View>
                <View style={styles.title}>
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: '400' }}>모임 생성</Text>
                </View>
                <View style={{ height: 10, backgroundColor: '#f2f2f2', }}></View>
                <View style={[styles.content, { alignItems: 'flex-start', paddingHorizontal: 15 }]}>
                    <View style={[styles.Login_container, { width: '100%', height: '90%', justifyContent: 'flex-start' }]}>
                        <Text style={[Styles.Font_Subtext1, { fontSize: 18 }]}>모임명</Text>
                        <TextInput
                            placeholder='모임명을 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={Styles.Color_Main2}
                            activeUnderlineColor={Styles.Color_Main1}
                            backgroundColor={theme}
                            onChangeText={newText => setClub_Title(newText)}
                        />
                        <Text style={[Styles.Font_Subtext1, { fontSize: 18, marginTop: 15, }]}>은행명</Text>
                        <TextInput
                            placeholder='은행명을 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={Styles.Color_Main2}
                            activeUnderlineColor={Styles.Color_Main1}
                            backgroundColor={theme}
                            onChangeText={newText => setClub_Bank_Name(newText)}
                        />
                        <Text style={[Styles.Font_Subtext1, { fontSize: 18, marginTop: 15, }]}>모임 계좌번호</Text>
                        <TextInput
                            placeholder='모임 계좌번호를 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={Styles.Color_Main2}
                            activeUnderlineColor={Styles.Color_Main1}
                            backgroundColor={theme}
                            onChangeText={newText => setClub_Bank_Account(newText)}
                        />
                        <Text style={[Styles.Font_Subtext1, { fontSize: 18, marginTop: 15, }]}>예금주</Text>
                        <TextInput
                            placeholder='예금주를 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={Styles.Color_Main2}
                            activeUnderlineColor={Styles.Color_Main1}
                            backgroundColor={theme}
                            onChangeText={newText => setClub_Bank_Holder(newText)}
                        />
                        <Text style={[Styles.Font_Subtext1, { fontSize: 18, marginTop: 15, }]}>저장방식</Text>
                        <View style={{ justifyContent: 'flex-start', marginTop: 15 }}>
                            <RadioGroup
                                layout='row'
                                radioButtons={radioButtons}
                                onPress={onPressRadioButton}
                            />
                        </View>
                    </View>
                </View>
                <View style={[styles.footer, { height: '8%', marginBottom: 20 }]}>
                    <CustomButton
                        buttonColor={Styles.Color_Main2}
                        title="모임 생성"
                        onPress={() => createClub()}
                    />
                </View>
            </View>
        );
    } else if (Platform.OS === 'android') {
        return (
            <View style={styles.container}>
                <View style={styles.header}></View>
                <View style={styles.title}>
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: '400' }}>모임 생성</Text>
                </View>
                <View style={{ height: 10, backgroundColor: '#f2f2f2', }}></View>
                <View style={[styles.content, { alignItems: 'flex-start', paddingHorizontal: 15 }]}>
                    <View style={[styles.Login_container, { width: '100%', height: '60%', justifyContent: 'flex-start' }]}>
                        <Text style={[Styles.Font_Subtext1, { fontSize: 18 }]}>모임명</Text>
                        <TextInput
                            placeholder='모임명을 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={Styles.Color_Main2}
                            activeUnderlineColor={Styles.Color_Main1}
                            backgroundColor={theme}
                            onChangeText={newText => setClub_Title(newText)}
                        />
                        <Text style={[Styles.Font_Subtext1, { fontSize: 18, marginTop: 15 }]}>은행명</Text>
                        <TextInput
                            placeholder='은행명을 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={Styles.Color_Main2}
                            activeUnderlineColor={Styles.Color_Main1}
                            backgroundColor={theme}
                            onChangeText={newText => setClub_Bank_Name(newText)}
                        />
                        <Text style={[Styles.Font_Subtext1, { fontSize: 18, marginTop: 15 }]}>모임 계좌번호</Text>
                        <TextInput
                            placeholder='모임 계좌번호를 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={Styles.Color_Main2}
                            activeUnderlineColor={Styles.Color_Main1}
                            backgroundColor={theme}
                            onChangeText={newText => setClub_Bank_Account(newText)}
                        />
                        <Text style={[Styles.Font_Subtext1, { fontSize: 18, marginTop: 15 }]}>예금주</Text>
                        <TextInput
                            placeholder='예금주를 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={Styles.Color_Main2}
                            activeUnderlineColor={Styles.Color_Main1}
                            backgroundColor={theme}
                            onChangeText={newText => setClub_Bank_Holder(newText)}
                        />
                        <Text style={[Styles.Font_Subtext1, { fontSize: 18, marginTop: 15 }]}>저장방식</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    color={styles.Color_Main2}
                                    value="DB"
                                    status={checked === "DB" ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked('DB')}
                                />
                                <Text style={{ marginTop: 7 }}>일반 데이터베이스에 저장</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    color={styles.Color_Main2}
                                    value="BC"
                                    status={checked === "BC" ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked('BC')}
                                />
                                <Text style={{ marginTop: 7 }}>블록체인에 저장</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[styles.footer, { height: '8%', marginBottom: 20 }]}>
                    <CustomButton
                        buttonColor={Styles.Color_Main2}
                        title="모임 생성"
                        onPress={() => createClub()}
                    />
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        width: '100%',
        height: StatusBarHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        width: '100%',
        height: '5%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: 'white',
        ...Platform.select({
            android: {
                marginTop: 7,
            }
        })
    },
    moneycard: {
        backgroundColor: 'white',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: 150,
        ...Platform.select({
            ios: {
                marginTop: 10,
                paddingBottom: 15,
            },
            android: {
                marginTop: 8,
                paddingBottom: 20,
            }
        })
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
    },
    Login_container: {
        marginTop: 30,
        width: '90%',
        height: '85%',
        backgroundColor: 'white'
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        marginHorizontal: 12,
        paddingVertical: 15,
        paddingHorizontal: 15,
        height: 100,
        ...Platform.select({
            ios: {
                shadowColor: '#D6D6DD',
                shadowOffset: {
                    width: 3,
                    height: 3
                },
                shadowOpacity: 10,
                shadowRadius: 6,
            },
            android: {
                paddingVertical: 10,
                shadowColor: 'black',
                elevation: 10,
            }
        }),
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        borderColor: '#F2F3F4',
        borderWidth: 1,
    },
    middle: {
        width: '100%',
        height: '8%',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        flexDirection: "row",
        paddingBottom: 10,
    },
    itemPlacetitle: {
        fontSize: 24,
        fontWeight: '700',
        color: 'black'
    },
    itemPaymentCost: {
        textAlign: 'right',
        fontSize: 26,
        fontWeight: '700',
        color: 'black',
        ...Platform.select({
            android: {
                marginBottom: 10,
            }
        })
    },
    itemdate: {
        ...Platform.select({
            ios: {
                marginTop: 20,
            },
            android: {
                marginTop: 10,
            }
        })
    },
    itemcost: {
        ...Platform.select({
            ios: {
                marginBottom: 5,
            },
            android: {
                marginBottom: 20,
            }
        })
    },
})
export default CreateClub;
