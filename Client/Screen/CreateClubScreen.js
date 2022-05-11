import React, { useState } from 'react';
import { View, Text, } from 'react-native';
import CustomButton from '../src/CustomButton';
import styles from '../src/Styles';
import { TextInput, RadioButton } from 'react-native-paper';
import router from '../src/Router.json';
const theme = 'white'

function CreateClub({ route, navigation }) {

    const [club_title, setClub_Title] = useState('');
    const [club_leader_id, set_Club_Leader_Id] = useState('');
    const [club_bank_name, setClub_Bank_Name] = useState('');
    const [club_bank_account, setClub_Bank_Account] = useState('');
    const [checked, setChecked] = useState('DB'); //초기값은 DB에 저장하도록 한다.

    async function createClub() {
        if (!club_title || !club_bank_name || !club_bank_account) { //비밀번호 확인이 제대로 되었나 탐지
            Alert.alert("정보를 모두 입력해주세요")
        }
        else {
            if (Platform.OS === 'ios') {
                fetch(router.aws + "/create_club", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "club_title": club_title,
                        "club_bank_name": club_bank_name,
                        "club_bank_account": club_bank_account,
                        "flag": checked,
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
                fetch(router.aws + "/create_club", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "club_title": club_title,
                        "club_bank_name": club_bank_name,
                        "club_bank_account": club_bank_account,
                        "flag": checked,
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
    return (
        <View style={styles.container}>
            <View style={styles.header}></View>
            <View style={[styles.title, { height: '4%' }]}>
                <Text style={styles.Font_Title1}>모임 생성</Text>
            </View>
            <View style={[styles.content, { alignItems: 'flex-start', paddingHorizontal: 15 }]}>
                <View style={[styles.Login_container, { width: '100%', height: '90%', justifyContent: 'flex-start' }]}>
                    <Text style={[styles.Font_Subtext1, {}]}>모임명</Text>
                    <TextInput
                        placeholder='모임명을 입력해주세요'
                        mode='flat'
                        style={styles.textInput}
                        selectionColor={styles.Color_Main2}
                        activeUnderlineColor={styles.Color_Main1}
                        backgroundColor={theme}
                        onChangeText={newText => setClub_Title(newText)}
                    />
                    <Text style={[styles.Font_Subtext1, { marginTop: 15 }]}>은행명</Text>
                    <TextInput
                        placeholder='은행명을 입력해주세요'
                        mode='flat'
                        style={styles.textInput}
                        selectionColor={styles.Color_Main2}
                        activeUnderlineColor={styles.Color_Main1}
                        backgroundColor={theme}
                        onChangeText={newText => setClub_Bank_Name(newText)}
                    />
                    <Text style={[styles.Font_Subtext1, { marginTop: 15 }]}>모임 계좌번호</Text>
                    <TextInput
                        placeholder='모임 계좌번호를 입력해주세요'
                        mode='flat'
                        style={styles.textInput}
                        selectionColor={styles.Color_Main2}
                        activeUnderlineColor={styles.Color_Main1}
                        backgroundColor={theme}
                        onChangeText={newText => setClub_Bank_Account(newText)}
                    />
                    <Text style={[styles.Font_Subtext1, { marginTop: 15 }]}>예금주</Text>
                    <TextInput
                        placeholder='예금주를 입력해주세요'
                        mode='flat'
                        style={styles.textInput}
                        selectionColor={styles.Color_Main2}
                        activeUnderlineColor={styles.Color_Main1}
                        backgroundColor={theme}
                    />
                    <Text style={[styles.Font_Subtext1, { marginTop: 15 }]}>저장방식</Text>
                    <View >
                        <RadioButton
                            color={styles.Color_Main2}
                            value="DB"
                            status={checked === "DB" ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('DB')}
                        />
                        <Text>DB에 저장</Text>
                    </View>
                    <View>
                        <RadioButton
                            color={styles.Color_Main2}
                            value="BlockChain"
                            status={checked === "BlockChain" ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('BlockChain')}
                        />
                        <Text>블록체인에 저장</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.footer, { height: '8%', marginBottom: 20 }]}>
                <CustomButton
                    buttonColor={styles.Color_Main2}
                    title="모임 참가"
                    onPress={() => createClub()}
                />
            </View>
        </View>
    );
}

export default CreateClub;