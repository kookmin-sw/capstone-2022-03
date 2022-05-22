import React, { useState, useEffect } from 'react';
import CustomButton from '../src/CustomButton';
import 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { View, Text, FlatList, StatusBar, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import router from '../src/Router.json';
import AsyncStorage from '@react-native-community/async-storage';
import Styles from '../src/Styles';
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
    const { user_id, club_title, club_id, club_balance, club_leader_id, members } = route.params;

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
                        mime: item.mime,
                        image: item.image,
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

    // 권한에 따라 분기
    const renderButton = (flag) => {
        console.log(members)
        if (flag == club_leader_id) {
            return (
                <View style={styles.middle}>
                    <CustomButton
                        buttonColor={'#4169e1'}
                        title="총무 추가"
                        onPress={() => navigation.navigate('AddMember', {
                            club_id: club_id,
                            joined_user: joined_user,
                        })}
                    />
                    <CustomButton
                        buttonColor={"#DDEBFC"}
                        titleColor={"#4593FC"}
                        title="채우기"
                        onPress={() => navigation.navigate('AddFee', {
                            club_title: club_title,
                            club_id: club_id,
                        })}
                    />
                    <CustomButton
                        buttonColor={'#4169e1'}
                        title="출금"
                        onPress={() => navigation.navigate("WithDraw",
                            {
                                club_id: club_id
                            },
                        )}
                    />
                </View>
            );
        } else if (members.includes(flag)) {
            return (
                <View style={styles.middle}>
                    <CustomButton
                        buttonColor={"#DDEBFC"}
                        titleColor={"#4593FC"}
                        title="채우기"
                        onPress={() => navigation.navigate('AddFee', {
                            club_title: club_title,
                            club_id: club_id,
                        })}
                    />
                    <CustomButton
                        buttonColor={'#4169e1'}
                        title="출금"
                        onPress={() => navigation.navigate("WithDraw",
                            {
                                club_id: club_id
                            },
                        )}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.middle}>
                    <CustomButton
                        buttonColor={"#DDEBFC"}
                        titleColor={"#4593FC"}
                        title="채우기"
                        onPress={() => navigation.navigate('AddFee', {
                            club_title: club_title,
                            club_id: club_id,
                        })}
                    />
                </View>
            );
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}></View>
            <View style={styles.title}>
                <Text style={{ fontSize: 20, color: 'black', fontWeight: '400' }}>{club_title} </Text>
            </View>
            <View style={{ height: 10, backgroundColor: '#f2f2f2', }}></View>
            <View style={styles.moneycard}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: 'black', marginTop: 10, marginLeft: 30, color: 'grey', textDecorationLine: 'underline' }}>{String(club_id).slice(-5)}</Text>
                <Text style={{ fontSize: 36, fontWeight: '700', color: 'black', marginLeft: 30 }}>{club_balance} 원</Text>
            </View>
            {renderButton(user_id)}
            <View style={{ height: 10, backgroundColor: '#f2f2f2', }}></View>
            <Text style={{ fontSize: 18, fontWeight: '500', color: 'black', marginTop: 10, marginLeft: 15, color: 'grey', }}>전체내역</Text>
            <View style={styles.content}>
                <FlatList
                    style={styles.list}
                    data={data}
                    renderItem={_renderItem}
                    ListEmptyComponent={EmptyListMessage}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            </View>
        </View >
    );
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

export default Club;
