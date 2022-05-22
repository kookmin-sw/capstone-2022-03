import React, { useState } from 'react';
import { View, Text, Platform, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import styles from '../src/Styles';
import router from "../src/Router.json";
import CustomButton from '../src/CustomButton';


const theme = 'white'

function CreateClub({ route, navigation }) {
    const { place, date, cost, detail, mime, image } = route.params;

    const _renderItem = ({ item, i }) => {
        return (
            <View style={extra.itemcard} key={i}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ paddingBottom: 10, marginLeft: 10, }}>
                        <Text style={extra.itemClubtitle}>상품명: {item.item_name}</Text>
                        <Text style={{ marginTop: 3 }}>금액: {item.item_cost}</Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: styles.Color_Main2 }]}>
            <View style={{ marginTop: 150 }}></View>
            <View style={[styles.title, { height: '4%', backgroundColor: styles.Color_Main2 }]}>
                <Text style={[styles.Font_Title3]}>영수증 상세정보</Text>
            </View>
            <View style={[extra.input_container]}>
                <View style={extra.card}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ marginLeft: 10, }}>
                            <Text style={[extra.itemClubtitle, { marginTop: 3 }]}>사용처: {place}</Text>
                            <Text style={[extra.itemClubtitle, { marginTop: 5 }]}>거래일자: {date}</Text>
                            <Text style={[extra.itemClubtitle, { marginTop: 5 }]}>금액: {cost}</Text>
                        </View>
                    </View>
                </View>
                <View style={extra.flatlistcard}>
                    <FlatList
                        showsVerticalScrollIndicator={true}
                        style={styles.list}
                        data={detail}
                        renderItem={_renderItem}
                    />
                </View>
                <View><Text style={extra.emptyspace}>emptyspace</Text></View>
                <CustomButton
                    buttonColor={styles.Color_Main1}
                    title="영수증 이미지"
                    onPress={() => navigation.navigate("ReceiptImage", {
                        mime: mime,
                        base64: image,
                    })}
                />
            </View>


        </View>
    );

}

const extra = StyleSheet.create({
    input_container: {
        marginTop: 10,
        backgroundColor: "#4880EE",
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        height: '75%',
        paddingLeft: 10,
        paddingRight: 10,
    },
    card: {
        display: 'flex',
        marginTop: 10,
        width: '100%',
        height: 100,
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
    flatlistcard: {
        display: 'flex',
        marginTop: 10,
        width: '100%',
        height: 400,
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
    itemcard: {
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
    emptyspace: {
        color: "#4880EE",
        ...Platform.select({
            ios: {
                fontSize: 40,
            },
        }),
    }
})

export default CreateClub;
