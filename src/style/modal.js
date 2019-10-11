import { StyleSheet } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import {
    TEXT_COLOR,
    MEDIUM_FONT,
    FONT_FAMILY,
    MODAL_TEXT_COLOR
} from '../shared/colors';
module.exports = StyleSheet.create({
    modalContent:{
        height: responsiveHeight(41.9),
        marginTop: responsiveHeight(10),
        backgroundColor: "white",
        padding: 22,
        paddingBottom: 0,
        alignItems: "center",
        justifyContent: 'space-between',
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 8
    },
    modalContent2:{
        height: responsiveHeight(50.5),
        marginTop: responsiveHeight(5),
        backgroundColor: "white",
        padding: 22,
        paddingTop: 0,
        alignItems: "center",
        justifyContent: 'space-between',
        borderColor: "rgba(0, 0, 0, 0.1)",
        zIndex: 100,
        borderRadius: 8
    },
    modalHeader:{
        marginTop: 22,
        fontSize: 20,
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT
    },
    content:{
        color: MODAL_TEXT_COLOR,
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        textAlign: 'center',
        marginTop: 9,
        lineHeight: 22.7
    }
});







