import React from 'react';
import CustomButton from '../src/CustomButton';
import 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { View, Text, FlatList, StatusBar, StyleSheet, Platform, TouchableOpacity } from 'react-native';

// StatusBar의 배경을 투명하게 만들고, 폰트를 검정색을 설정
StatusBar.setBarStyle("dark-content");
if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
}
const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;


function Club({ route, navigation }) {

    const { club_title } = route.params;
    const { club_id } = route.params;
    const { club_balance } = route.params;

    console.log(club_balance, club_id, club_title);
    const sample_data =
    {
        "club_title": "소융대 학생회",
        "club_id": 1,
        "account_number": "123-45-678",
        "onwer_name": "안성열",
        "club_balance": '300,000',
        "joined_user": ["user_id1", "user_id3", "user_id2",],
        "receipts": [
            {
                "payment_place": "주경야돈",
                "payment_cost": 100000,
                "payment_date": "2022-04-01",
                "payment_item": [
                    {
                        "item_name": "소주",
                        "item_cost": 3000
                    },
                    {
                        "item_name": "맥주",
                        "item_cost": 4000
                    }]
            },
            {
                "payment_place": "스터디카페",
                "payment_cost": 50000,
                "payment_date": "2022-04-02",
                "payment_item": [
                    {
                        "item_name": "자리값",
                        "item_cost": 3000
                    },
                    {
                        "item_name": "커피값",
                        "item_cost": 4000
                    }]
            },
            {
                "payment_place": "스터디카페",
                "payment_cost": 50000,
                "payment_date": "2022-04-02",
                "payment_item": [
                    {
                        "item_name": "자리값",
                        "item_cost": 3000
                    },
                    {
                        "item_name": "커피값",
                        "item_cost": 4000
                    }]
            }
        ]
    }

    _renderItem = ({ item, i }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.push('Receipts')
                    navigation.navigate('Receipts', { club_title: item.club_title })
                    navigation.navigate('Receipts', { club_id: item.club_id })
                }}
            >
                <View style={styles.card} key={i}>
                    <View>
                        <Text style={styles.itemPlacetitle}>{item.payment_place}</Text>
                        <Text style={{ marginTop: 20 }}>결제일</Text>
                        <Text>{item.payment_date}</Text>
                    </View>
                    <View>
                        <Text style={{ textAlign: 'right', marginTop: 35 }}>사용금액</Text>
                        <Text style={styles.itemPaymentCost}>{item.payment_cost}</Text>
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

    return (
        <View style={styles.container}>
            <View style={styles.header}></View>
            <View style={styles.title}>
                <Text style={{ fontSize: 25, color: 'black', fontWeight: '700' }}>{club_title}{'\t'} 모임번호:{club_id} </Text>
            </View>
            <View style={styles.content}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: '700', color: 'black', marginTop: 15, marginLeft: 15 }}>잔액 : {club_balance}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: 'black', marginTop: 10, marginLeft: 15, marginBottom: 5 }}>회비 사용내역</Text>
                </View>
                <FlatList
                    style={styles.list}
                    data={sample_data.receipts}
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
                    //onPress={() => navigation.push('CreateClub')}
                    onPress={() => alert('총무 추가')}
                />
                <CustomButton
                    buttonColor={'#4169e1'}
                    title="회비 입금"
                    onPress={() => alert('회비 입금')}
                />
                <CustomButton
                    buttonColor={'#4169e1'}
                    title="회비 출금"
                    onPress={() => alert('회비 출금')}
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
    // logo: {
    //     width: '100%',
    //     height: '5%',
    //     justifyContent: 'space-evenly',
    //     paddingTop: 10,
    //     marginLeft: 15,
    // },

    title: {
        width: '100%',
        height: '5%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        // flexDirection: 'row'
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
                shadowColor: 'black',
                elevation: 4,
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
        fontSize: 25,
        fontWeight: '600',
        color: 'black'
    },
    itemPaymentCost: {
        textAlign: 'right',
        fontSize: 26,
        fontWeight: '700',
        color: 'black',
    },
    itemPercentText: {
        paddingTop: 6,
        textAlign: 'right',
        fontSize: 15,
        color: '#2090F8',
        fontWeight: '500',
    },
})
export default Club;