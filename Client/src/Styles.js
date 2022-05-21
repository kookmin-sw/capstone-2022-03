import { StyleSheet, StatusBar, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

/*
모든 Style resource를 이 곳에 정리하고 관리.
개발후 앱을 실행할 두 플랫폼인 ios와 android는 서로 다른 단위를 사용한다,
일단은 같은 값을 적용할 것이며 이 때문에 플랫폼에 따라 디자인이 일정부분 상이 할 수 있다.
기준 기종은 아이폰13, 픽셀 3a이다.
*/

/*
상단의 statusBar는 react-native-status-bar-height라이브러리를 통해 계산하며,
남은 공간은 flex를 통해 할당한다. 
*/
const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

//390px * 844px 기준 픽셀값  -> 추후 값 수정 예정   

/* 예상 디자인 스타일 값.
사이즈
메인페이지의 마진 : 15 (5배수), 서브페이지 마진: 22 (2배수)

아이콘 : 22, 아이콘 터치범뮈: 50
    이상적 터치범위 40 - 50
큰 버튼 : 390 * 53, 353 * 53, 345 * 53
    이상적 버튼 높이 53 -55
    작은 버튼의 경우 이상적 높이는 30 - 36
    패딩은 15 - 17 //패딩 혹은 마진은 단측의 거리를 기준으로 함
    가로 길이는 유동적으로 가져갈 것
뒤로가기 버튼 : 최소 사이즈로 높이 10에서 20 사이 고려 작으면 작을 수록 좋음

컬러
1에서 3으로 갈 수록 옅어진다.
메인 컬러 (블루 계열)  1. #1F4EF5 2. #4880EE 3. #83B4F9
서브 컬러 (그레이 계열) 1. #64768C 2. #B1B8C0 3. #D6DADF
텍스트 컬러           1. #1A1E27 2. #505866 3. #B1B8C0

타이포
Large 30 bold
title1 24 bold
title2 20 bold
subtext1 16 bold
subtext2 13 medium
caption 12 medium
navigation 12 medium      
    20 - 16 사이가 가장 가독성이 좋다. 나머지는 강조 혹은 추가정보 작성의 기준에서 조절

font는 상업적이용 무료폰트인 Minsans font를 적용 예정 
*/

// 스타일 적용시 StyleSheet와 inline을 동시에 작성하며 우측이 우선 순위가 된다
// style={[ styles.text, {fontSize: 10}]} text의 폰트크기가 20이라도 10으로 적용된다.
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    Center_Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Center_Container_2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        width: '100%',
        height: StatusBarHeight,
        backgroundColor: 'white'
    },
    title: {
        width: '100%',
        height: '18%',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
    },
    Login_container: {
        width: '90%',
        height: '85%',
        backgroundColor: 'white'
    },
    Login_Button_container: {
        width: '100%',
        height: '23%',
        backgroundColor: 'white'
    },
    footer: {
        marginTop: 300,
        width: '100%',
        height: '15%',
        backgroundColor: 'white',
    },
    footer_2: {
        marginTop: 300,
        width: '100%',
        height: '15%',
        backgroundColor: "#4880EE",
    },
    textInput: {
        borderBottomColor: 'white',
        height: 25,
        marginTop: 10
    },
    textInput_2: {
        borderBottomColor: "#4880EE",
        height: 25,
        marginTop: 10
    },
    PayMoneyInput: {
        flexDirection: 'row',
        flexGrow: 1,
        alignItems: 'center'
    },


    //colors
    Color_Main1: "#1F4EF5"
    ,
    Color_Main2: "#4880EE"
    ,
    Color_Main3: "#83B4F9"
    ,

    Color_Sub1: "#64768C"
    ,
    Color_Sub2: "#B1B8C0"
    ,
    Color_Sub3: "#D6DADF"
    ,

    Color_Text1: "#1A1E27"
    ,
    Color_Text2: "#505866"
    ,
    Color_Text3: "#B1B8C0"
    ,

    //font
    Font_Large: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black'
    },
    Font_Title1: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
    Font_Title2: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    Font_Title3: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    Font_Subtext1: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },
    Font_Subtext2: {
        fontSize: 13,
        fontWeight: 'normal',
        color: 'black'
    },
    Font_Navigation: {
        fontSize: 12,
        fontWeight: 'normal'
    },

});

export default styles;
