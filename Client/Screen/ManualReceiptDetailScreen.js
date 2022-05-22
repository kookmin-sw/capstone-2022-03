import React, { useState } from 'react';
import { View, Text, Platform, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import CustomButton from '../src/CustomButton';
import styles from '../src/Styles';
import { TextInput } from 'react-native-paper';
import {
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import router from "../src/Router.json";
import AsyncStorage from '@react-native-community/async-storage';

const theme = 'white'

function CreateClub({ route, navigation }) {
    const { owner, place, date, cost, club_id } = route.params;

    const [itemname, setItemname] = useState("");
    const [itemcost, setItemcost] = useState("");
    const [data, setData] = useState([]);


    const itemnameHandler = name => {
        setItemname(name);
    };
    const itemcostHandler = cost => {
        setItemcost(cost);
    };

    const _renderItem = ({ item, i }) => {
        return (
            <View style={extra.card} key={i}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ paddingBottom: 10, marginLeft: 10, }}>
                        <Text style={extra.itemClubtitle}>상품명: {item.item_name}</Text>
                        <Text style={{ marginTop: 3 }}>금액: {item.item_cost}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteData(item.id)}>
                        <Image
                            source={require('../src/icon/minus.png')}
                            style={[extra.minusbutton, { width: wp(8), resizeMode: 'contain' }]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    async function insertData() {
        if (itemname == "") {
            Alert.alert("소비한 품명을 제대로 입력해주세요")
        } else {
            const tmp = {
                id: Math.random().toString(),
                item_name: itemname,
                item_cost: itemcost
            }
            await setData(data => [...data, tmp])
        }
    }

    async function deleteData(item) {
        setData(prevData => {
            return prevData.filter(data => data.id != item);
        })
    }

    function addReceipt() {
        AsyncStorage.getItem('user_information', async (err, res) => {
            const user = JSON.parse(res);
            console.log(data);
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
                        detail: data,
                    },
                })
            }).then(res => res.json())
                .then(res => {
                    if (res.success) {
                        console.log(res);
                        navigation.navigate('Club', {
                            club_title: res.club_title,
                            club_id: club_id,
                            club_balance: res.balance
                        })
                    }
                })
        })
    }

    // 데이터가 없는 경우
    const EmptyListMessage = ({ item }) => {
        return (
            <View style={{ flex: 1, alignItems: 'center', marginTop: 75 }}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: 'gray', textAlign: 'center' }}>
                    등록한 품목이 없습니다 {'\n'}
                    결제 품목을 등록해주세요
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: styles.Color_Main2 }]}>
            <View style={{ marginTop: 200 }}></View>
            <View style={[styles.title, { height: '4%', backgroundColor: styles.Color_Main2 }]}>
                <Text style={[styles.Font_Title3]}>영수증 상세정보 입력</Text>
            </View>
            <View style={[styles.content, { alignItems: 'flex-start', paddingHorizontal: 15, backgroundColor: styles.Color_Main2 }]}>
                <View style={[styles.Login_container, { width: '100%', height: '90%', justifyContent: 'flex-start', backgroundColor: styles.Color_Main }]}>
                    <View style={[extra.input_container]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.Font_Subtext1, { marginTop: 20, marginLeft: 10, fontSize: 24 }]}>상세내역</Text>
                            <TouchableOpacity onPress={() => insertData()}>
                                <Image
                                    source={require('../src/icon/add.png')}
                                    style={{ width: wp(10), resizeMode: 'contain' }}
                                />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            placeholder='상품명을 입력해주세요'
                            mode='flat'
                            style={styles.textInput}
                            selectionColor={styles.Color_Main2}
                            activeUnderlineColor={styles.Color_Main1}
                            backgroundColor={theme}
                            value={itemname}
                            onChangeText={itemnameHandler}
                        />
                        <TextInput
                            placeholder='상품금액을 입력해주세요'
                            mode='flat'
                            style={[styles.textInput, { marginTop: 30 }]}
                            selectionColor={styles.Color_Main2}
                            activeUnderlineColor={styles.Color_Main1}
                            backgroundColor={theme}
                            value={itemcost}
                            onChangeText={itemcostHandler}
                        />
                    </View>
                    <View style={[extra.input_container, { paddingBottom: 15 }]}>
                        <View style={extra.content}>
                            <FlatList
                                showsVerticalScrollIndicator={true}
                                style={extra.list}
                                ListEmptyComponent={EmptyListMessage}
                                data={data}
                                renderItem={_renderItem}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <View style={[styles.footer, { height: '8%', marginBottom: 20, backgroundColor: styles.Color_Main2 }]}>
                {/* <CustomButton
                    buttonColor={styles.Color_Main1}
                    title="등록하기"
                    onPress={() => addReceipt()}
                /> */}
                <CustomButton
                    buttonColor={styles.Color_Main1}
                    title="사진 등록하기"
                    onPress={() => navigation.navigate("Camera", {
                        owner: owner,
                        place: place,
                        date: date,
                        cost: cost,
                        detail: data,
                        club_id: club_id,
                    })}
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
        height: '100%',
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
    card: {
        display: 'flex',
        marginTop: 10,
        width: '100%',
        height: 60,
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                shadowColor: '#d3d3d3',
                shadowOffset: {
                    width: 1.5,
                    height: 1.5
                },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
            android: {
                paddingVertical: 8,
                shadowColor: 'black',
                elevation: 1,
            }
        }),
        backgroundColor: 'white',
        borderRadius: 12,
        borderColor: '#F2F3F4',
        borderWidth: 1,
    },
    content: {
        flex: 1,
        width: '100%',
        height: '70%',
        backgroundColor: 'white',
    },
    itemClubtitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    minusbutton: {
        ...Platform.select({
            ios: {
                marginTop: 3,
                marginRight: 5,
            },
            android: {
                marginTop: 5,
                marginRight: 5,
            }
        })
    },
    list: {
        paddingBottom: 10,
    },
})

export default CreateClub;
