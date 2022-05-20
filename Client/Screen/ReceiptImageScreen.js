import React, { useState } from 'react';
import { View, Text, Platform, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import styles from '../src/Styles';
import router from "../src/Router.json";
import CustomButton from '../src/CustomButton';


const theme = 'white'

function CreateClub({ route, navigation }) {
    const { mime, base64, path } = route.params;

    return (
        <View style={[styles.container, { backgroundColor: styles.Color_Main2 }]}>
            <View style={{ marginTop: 150 }}></View>
            <View style={[styles.title, { height: '4%', backgroundColor: styles.Color_Main2 }]}>
                <Text style={[styles.Font_Title3]}>영수증 상세정보</Text>
            </View>
            <View style={[extra.input_container]}>
                <Image
                    source={{ uri: `data:${mime};base64,${base64}` }}
                    style={extra.images}
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
        alignItems: 'center',
    },
    imagecard: {
        paddingTop: 100,
        display: 'flex',
        marginTop: 10,
        width: '100%',
        height: 500,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        borderColor: '#F2F3F4',
        borderWidth: 1,
    },
    images: {
        marginBottom: 100,
        width: 350,
        height: 450,
        borderWidth: 3,
        borderColor: "#cccccc",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
})

export default CreateClub;