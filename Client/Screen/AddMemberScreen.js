import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Image, View, Text, FlatList, StatusBar, StyleSheet, Platform } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import CustomButton from '../src/CustomButton';
import router from '../src/Router.json';
import CheckBox from '@react-native-community/checkbox';

StatusBar.setBarStyle("dark-content");
if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
}

const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

function AddMember({ navigation, route }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const sample_data = [
        {
            name: "김상윤",
            email: "skwx50000@gmail.com"
        },
        {
            name: "안성열",
            email: "zxcv123594@gmail.com"
        },
        {
            name: "민태식",
            email: "test@gmail.com"
        },
    ]
    const _renderItem = ({ item, index }) => {
        return (
            <View style={styles.card}>
                <CheckBox
                    style={styles.checkBox}
                    disabled={false}
                    onAnimationType='fill'
                    offAnimationType='fade'
                    boxType='square'
                    onValueChange={() => on}
                />
                <Text style={styles.item}>{item.name} {item.email}</Text>
            </View>
        )
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

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: 'white', marginLeft: 30, }}> </Text>
            <View style={styles.content}>
                {/* <SelectableFlatlist>
                    data={sample_data}
                    state={STATE.EDIT}
                    multiSelect={false}
                    items
                </SelectableFlatlist> */}
                <FlatList
                    showsVerticalScrollIndicator={true}
                    style={styles.list}
                    data={sample_data}
                    renderItem={_renderItem}
                    ListEmptyComponent={EmptyListMessage}
                    // onRefresh={refreshItems}
                    refreshing={isRefreshing}
                />
                <Text style={{ fontSize: 10, fontWeight: '700', color: 'white', marginLeft: 30, }}> </Text>
            </View>
            <View style={styles.footer}>
                <CustomButton
                    buttonColor={'#4169e1'}
                    title="총무 추가"
                    onPress={() => navigation.navigation('Main')}
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
    },
    checkBox: {
        width: 20,
        height: 20,
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 8,
        marginHorizontal: 12,
        paddingVertical: 20,
        paddingHorizontal: 15,
        height: 60,
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
})
export default AddMember;