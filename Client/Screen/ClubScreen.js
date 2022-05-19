import React, { useState, useEffect } from 'react';
import CustomButton from '../src/CustomButton';
import 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { View, Text, FlatList, StatusBar, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import router from '../src/Router.json';
import AsyncStorage from '@react-native-community/async-storage';

// StatusBar의 배경을 투명하게 만들고, 폰트를 검정색을 설정
StatusBar.setBarStyle("dark-content");
if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
}
const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;


function Club({ route, navigation }) {
    const isFocused = useIsFocused();
    const [userdata, setUserData] = useState("");
    const [data, setData] = useState([]);
    const [joined_user, setJoined_User] = useState([]);
    const { club_title, club_id, club_balance, club_leader_id } = route.params;

    useEffect(() => {
        AsyncStorage.getItem('user_information', async (err, res) => {
            const user = JSON.parse(res);
            setUserData(user.user_id);
            fetch(router.aws + '/goto_club', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "club_id": club_id,
                    "user_id": user.user_id,
                    "user_address": user.user_address,
                })
            }).then(res => res.json())
                .then(res => {
                    if (res) {
                        setJoined_User(res.joined_user);
                        setData(res.receipt);
                        console.log(res);
                    }
                })
        })
    }, [isFocused]);

    const _renderItem = ({ item, i }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('ReceiptInfo', {
                        place: item.place,
                        date: item.date,
                        cost: item.cost,
                        detail: item.detail,
                    })
                }}
            >
                <View style={styles.card} key={i}>
                    <View>
                        <Text style={styles.itemPlacetitle}>{item.place}</Text>
                        <Text style={styles.itemdate}>결제일</Text>
                        <Text>{item.date}</Text>
                    </View>
                    <View style={styles.itemcost}>
                        <Text style={{ textAlign: 'right', marginTop: 35 }}>사용금액</Text>
                        <Text style={styles.itemPaymentCost}>{item.cost}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    // 데이터가 없는 경우
    const EmptyListMessage = ({ item }) => {
        return (
            <View style={{ flex: 1, alignItems: 'center', marginVertical: '65%' }}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: 'gray', textAlign: 'center' }}>
                    회비 내역이 없습니다
                </Text>
            </View>
        );
    };

    //총무 추가

    if (userdata != club_leader_id) {
        return (
            <View style={styles.container}>
                <View style={styles.header}></View>
                <View style={styles.title}>
                    <Text style={{ fontSize: 25, color: 'black', fontWeight: '700' }}>{club_title}{'\t'} {String(club_id).slice(-5)} </Text>
                </View>
                <View style={styles.content}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 25, fontWeight: '700', color: 'black', marginTop: 15, marginLeft: 15 }}>잔액 : {club_balance}</Text>
                        <Text style={{ fontSize: 15, fontWeight: '500', color: 'black', marginTop: 10, marginLeft: 15, marginBottom: 5 }}>회비 사용내역</Text>
                    </View>
                    <FlatList
                        style={styles.list}
                        data={data}
                        renderItem={_renderItem}
                        ListEmptyComponent={EmptyListMessage}
                        contentContainerStyle={{ flexGrow: 1 }}
                    />
                    <Text style={{ fontSize: 10, fontWeight: '700', color: 'white', marginLeft: 30, }}>emptyspace</Text>
                </View>
                <View style={styles.footer}>
                    <CustomButton
                        buttonColor={'#4169e1'}
                        title="회비 입금"
                        onPress={() => navigation.navigate('AddFee', {
                            club_title: club_title,
                            club_id: club_id,
                        })}
                    />
                    <CustomButton
                        buttonColor={'#4169e1'}
                        title="회비 출금"
                        onPress={() => navigation.navigate("WithDraw",
                            {
                                club_id: club_id
                            },
                        )}
                    />
                </View>
            </View >
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.header}></View>
                <View style={styles.title}>
                    <Text style={{ fontSize: 25, color: 'black', fontWeight: '700' }}>{club_title}{'\t'} {String(club_id).slice(-5)} </Text>
                </View>
                <View style={styles.content}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 25, fontWeight: '700', color: 'black', marginTop: 15, marginLeft: 15 }}>잔액 : {club_balance}</Text>
                        <Text style={{ fontSize: 15, fontWeight: '500', color: 'black', marginTop: 10, marginLeft: 15, marginBottom: 5 }}>회비 사용내역</Text>
                    </View>
                    <FlatList
                        style={styles.list}
                        data={data}
                        renderItem={_renderItem}
                        ListEmptyComponent={EmptyListMessage}
                        contentContainerStyle={{ flexGrow: 1 }}
                    />
                    <Text style={{ fontSize: 10, fontWeight: '700', color: 'white', marginLeft: 30, }}>emptyspace</Text>
                </View>
                <View style={styles.footer}>
                    <CustomButton
                        buttonColor={'#4169e1'}
                        title="총무 추가"
                        onPress={() => navigation.navigate('AddMember', {
                            club_id: club_id,
                            joined_user: joined_user,
                        })}
                    />
                    <CustomButton
                        buttonColor={'#4169e1'}
                        title="회비 입금"
                        onPress={() => navigation.navigate('AddFee', {
                            club_title: club_title,
                            club_id: club_id,
                        })}
                    />
                    <CustomButton
                        buttonColor={'#4169e1'}
                        title="회비 출금"
                        onPress={() => navigation.navigate("WithDraw",
                            {
                                club_id: club_id
                            },
                        )}
                    />
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
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
    },
    content: {
        flex: 1,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    list: {
        paddingBottom: 10,
        height: '90%'
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
                shadowColor: '#d3d3d3',
                shadowOffset: {
                    width: 1.5,
                    height: 1.5
                },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
            android: {
                paddingVertical: 10,
                shadowColor: 'black',
                elevation: 1,
            }
        }),
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        borderColor: '#F2F3F4',
        borderWidth: 1,
    },
    footer: {
        width: '100%',
        height: '8%',
        backgroundColor: '#f2f2f2',
        justifyContent: 'space-evenly',
        paddingTop: 2,
        paddingBottom: 10,
        flexDirection: "row",
        paddingHorizontal: 7.5,
    },
    modal: {
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        backgroundColor: 'white',
    },
    modalContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    modalsubmit: {
        height: '10%',
        width: '100%'
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
export default Club;
