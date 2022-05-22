import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Image, View, Text, FlatList, StatusBar, StyleSheet, Platform, Alert } from 'react-native';
import CustomButton from '../src/CustomButton';
import CheckBox from '@react-native-community/checkbox';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import router from '../src/Router.json';
import AsyncStorage from '@react-native-community/async-storage';

StatusBar.setBarStyle("dark-content");
if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
}

const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

function AddMember({ navigation, route }) {
    const { club_id, joined_user } = route.params;
    const [data, setData] = useState(joined_user);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onChangeValue = (itemSelected, index) => {
        console.log(itemSelected)
        const newData = data.map(item => {
            if (item.user_id == itemSelected.user_id) {
                return {
                    ...item,
                    department: !item.department
                }
            }
            return {
                ...item,
                department: item.department
            }
        })
        setData(newData)
    }

    const _renderItem = ({ item, index }) => {
        if (Platform.OS == 'ios') {
            return (
                <View style={styles.card}>
                    <CheckBox
                        style={styles.checkBox}
                        disabled={false}
                        onAnimationType='fill'
                        offAnimationType='fade'
                        boxType='circle'
                        onValueChange={() => onChangeValue(item, index)}
                    />
                    <Text style={styles.item}>{item.user_name}</Text>
                </View>
            )
        } else {
            return (
                <View style={styles.card}>
                    <BouncyCheckbox
                        size={20}
                        fillColor="#4880EE"
                        unfillColor="#FFFFFF"
                        onPress={() => onChangeValue(item, index)}
                    />
                    <Text style={styles.item}>{item.user_name}</Text>
                </View>
            )
        }
    }
    const EmptyListMessage = ({ item }) => {
        return (
            <View style={{ flex: 1, alignItems: 'center', marginVertical: '65%' }}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: 'gray', textAlign: 'center' }}>
                    참여한 인원이 없습니다 {'\n'}
                    모임 상대를 초대해 보세요
                </Text>
            </View>
        );
    };

    const onShowItemSelected = () => {
        const listSelected = data.filter(item => item.department == true);
        console.log(listSelected)
        AsyncStorage.getItem('user_information', async (err, res) => {
            const user = JSON.parse(res);
            fetch(router.aws + '/add_member', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "club_id": club_id,
                    "user_address": user.user_address,
                    "members": listSelected
                })
            }).then(res => res.json())
                .then(res => {
                    if (res.success) {
                        console.log(res)
                        navigation.goBack()
                    }
                })
        })
    }
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: 'white', marginLeft: 30, }}> </Text>
            <View style={styles.content}>
                <FlatList
                    showsVerticalScrollIndicator={true}
                    style={styles.list}
                    data={joined_user}
                    renderItem={_renderItem}
                    ListEmptyComponent={EmptyListMessage}
                    refreshing={isRefreshing}
                />
                <Text style={{ fontSize: 10, fontWeight: '700', color: 'white', marginLeft: 30, }}> </Text>
            </View>
            <View style={styles.footer}>
                <CustomButton
                    buttonColor={'#4169e1'}
                    title="확인"
                    onPress={onShowItemSelected}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    },
    list: {
        paddingBottom: 10,
    },
    item: {
        marginLeft: 30,
        fontSize: 15,
        fontWeight: 'bold'
    },
    checkBox: {
        width: 20,
        height: 20,
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 4,
        marginBottom: 4,
        marginHorizontal: 12,
        paddingVertical: 20,
        paddingHorizontal: 15,
        height: 60,
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
                elevation: 1,
            }
        }),
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
})
export default AddMember;
