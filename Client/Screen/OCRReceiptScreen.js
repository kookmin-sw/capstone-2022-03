import React, { useState } from 'react';
import { View, Text, Platform, StyleSheet, Alert, Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import CustomButton from '../src/CustomButton';
import styles from '../src/Styles';
import { TextInput } from 'react-native-paper';

const theme = 'white'

function CreateClub({ route, navigation }) {
    const { place, date, cost, detail, user_id,
        club_title,
        club_id,
        club_leader_id,
        members, mime, data } = route.params;
    const [ownerInfo, setOwner] = useState("");
    const [placeInfo, setPlace] = useState(place);
    const [dateInfo, setDate] = useState(date);
    const [costInfo, setCost] = useState(cost);

    async function gotoDetail() {
        if (!ownerInfo || !placeInfo || !dateInfo || !costInfo) {
            Alert.alert('정보를 모두 입력해주세요.')
        } else {
            console.log(mime);
            console.log(data);
            navigation.navigate("OCRReceiptDetail", {
                owner: ownerInfo,
                place: placeInfo,
                date: dateInfo,
                cost: costInfo,
                detail: detail,
                user_id: user_id,
                club_title: club_title,
                club_id: club_id,
                club_leader_id: club_leader_id,
                members: members,
                mime: mime,
                image_data: data,
            })
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: styles.Color_Main2 }]}>
            <View style={{ marginTop: 200 }}></View>
            <View style={[styles.title, { height: '4%', backgroundColor: styles.Color_Main2 }]}>
                <Text style={[styles.Font_Title3]}>영수증 입력</Text>
            </View>
            <View style={[styles.content, { alignItems: 'flex-start', paddingHorizontal: 15, backgroundColor: styles.Color_Main2 }]}>
                <View style={[styles.Login_container, { width: '100%', height: '90%', justifyContent: 'flex-start', backgroundColor: styles.Color_Main }]}>
                    <View style={[extra.input_container, { paddingBottom: 15 }]}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <Text style={[styles.Font_Subtext1, { marginTop: 15, marginBottom: 5 }]}>결제자 이름</Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                            placeholder='결제한 사람의 이름을 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={styles.Color_Main2}
                            activeUnderlineColor={styles.Color_Main1}
                            backgroundColor={theme}
                            value={ownerInfo}
                            onChangeText={newText => setOwner(newText)}
                        />
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <Text style={[styles.Font_Subtext1, { marginTop: 15, marginBottom: 5 }]}>사용처</Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                            placeholder='결제한 장소명을 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={styles.Color_Main2}
                            activeUnderlineColor={styles.Color_Main1}
                            backgroundColor={theme}
                            value={placeInfo}
                            onChangeText={newText => setPlace(newText)}
                        />
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <Text style={[styles.Font_Subtext1, { marginTop: 15, marginBottom: 5 }]}>결제 일자</Text>
                        </TouchableWithoutFeedback>

                        <TextInput
                            placeholder='결제 일자를 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={styles.Color_Main2}
                            activeUnderlineColor={styles.Color_Main1}
                            backgroundColor={theme}
                            value={dateInfo}
                            onChangeText={newText => setDate(newText)}
                        />
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <Text style={[styles.Font_Subtext1, { marginTop: 15, marginBottom: 5 }]}>결제 금액</Text>
                        </TouchableWithoutFeedback>

                        <TextInput
                            placeholder='총 결제 금액을 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={styles.Color_Main2}
                            activeUnderlineColor={styles.Color_Main1}
                            backgroundColor={theme}
                            value={costInfo}
                            onChangeText={newText => setCost(newText)}
                        />
                    </View>

                </View>
            </View>
            <View style={[styles.footer, { height: '8%', marginBottom: 20, backgroundColor: styles.Color_Main2 }]}>
                <CustomButton
                    buttonColor={styles.Color_Main1}
                    title="다음"
                    onPress={() => gotoDetail()}
                />
            </View>
        </View>
    );

}

const extra = StyleSheet.create({
    input_container: {
        marginTop: 10,
        backgroundColor: 'white',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        width: '100%',
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
})

export default CreateClub;