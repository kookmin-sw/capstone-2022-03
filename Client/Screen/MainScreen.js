import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Image, View, Text, FlatList, StatusBar, StyleSheet, Platform, TouchableOpacity, Button } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import CustomButton from '../src/CustomButton';
import router from '../src/Router.json';
import AsyncStorage from '@react-native-community/async-storage';

// StatusBar의 배경을 투명하게 만들고, 폰트를 검정색을 설정
StatusBar.setBarStyle("dark-content");
if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
}

// os 마다 다른 statusbar의 높이를 구함
const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

function MainScreen({ navigation, route }) {
    const isFocused = useIsFocused();
    const [user_id, setUser_id] = useState('');
    var sample_data = [];
    //데이터가 존재하는 경우
    _renderItem = ({ item, i }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.push('Club')
                    navigation.navigate('Club', { club_title: item.club_title })
                    navigation.navigate('Club', { club_title: item.club_id })
                    navigation.navigate('Club', { club_title: item.club_balance })
                }}
            >
                <View style={styles.card} key={i}>
                    <View>
                        <Text style={styles.itemClubtitle}>{item.club_title}</Text>
                        <Text>모임장: {item.accountConstructor}</Text>
                        <Text>모임 인원: {item.joined_user.length}</Text>
                    </View>
                    <View>
                        <Text style={styles.itemClubBalance}>{item.club_balance}</Text>
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
                    참가한 모임이 없습니다 {'\n'}
                    모임을 찾거나 만들어보세요
                </Text>
            </View>
        );
    };

    useEffect(() => {
        AsyncStorage.getItem('user_information', async (err, res) => {
            const user = JSON.parse(res);
            if (user.user_id != null) {
                setUser_id(user.user_id);
                console.log(user.user_id);
                await fetch(router.aws + '/my_clubs', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "user_id": user_id
                    })
                }).then(res => res.json())
                    .then(res => {
                        if (res) {
                            console.log(res);
                        }
                    })
            }
        })
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <View style={styles.header}></View>
            <View style={styles.title}>
                <Image
                    source={require('../src/icon/textlogo.png')}
                    style={{ width: wp(30), resizeMode: 'contain' }}
                />
            </View>
            <View style={styles.content}>
                <Text style={{ fontSize: 25, fontWeight: '700', color: 'black', marginTop: 15, marginLeft: 15, marginBottom: 5 }}>모임 목록</Text>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={sample_data}
                    renderItem={_renderItem}
                    ListEmptyComponent={EmptyListMessage}
                />
                <Text style={{ fontSize: 10, fontWeight: '700', color: 'white', marginLeft: 30, }}>emptyspace</Text>
            </View>
            <View style={styles.footer}>
                <CustomButton
                    buttonColor={'#4169e1'}
                    title="모임 생성"
                    onPress={() => navigation.push('CreateClub')}
                />
                <CustomButton
                    buttonColor={'#4169e1'}
                    title="모임 참가"
                    onPress={() => navigation.push('JoinClub')}
                />
                <CustomButton
                    buttonColor={'#4169e1'}
                    title="카메라 데모"
                    onPress={() => navigation.push('Camera')}
                />
                <CustomButton
                    buttonColor={'#4169e1'}
                    title="로그아웃"
                    onPress={() => navigation.reset({
                        routes: [{
                            name: 'Login',
                        }]
                    })}

                />
            </View>
        </View >
    );
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
        height: '10%',
        // alignItems: 'center',
        justifyContent: 'space-evenly',
        // flexDirection: 'row'
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
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
        // borderBottomLeftRadius: 30,
        // borderBottomRightRadius: 30,
        // borderWidth: 3,
        // borderStyle: 'solid',
        // borderColor: '#208cf7',
    },
    list: {
        paddingBottom: 10,
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        marginHorizontal: 12,
        paddingVertical: 20,
        paddingHorizontal: 15,
        height: 100,
        shadowColor: '#d3d3d3',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 1,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        borderColor: '#F2F3F4',
        borderWidth: 1,
    },
    footer: {
        width: '100%',
        height: '10%',
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        flexDirection: "row",
        paddingBottom: 15
    },
    itemClubtitle: {
        fontSize: 20,
    },
    itemClubBalance: {
        marginTop: 13,
        textAlign: 'right',
        fontSize: 28,
        fontWeight: '700',
    },
    itemPercentText: {
        paddingTop: 6,
        textAlign: 'right',
        fontSize: 15,
        color: '#2090F8',
        fontWeight: '500',
    },
})

export default MainScreen;
