/* Library Import */
import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

/* Constant Import */
import { BUTTON_TEXT_COLOR, REGULAR_FONT, FONT_FAMILY, PRIMARY_COLOR } from '../../shared/colors';

const CategoryButton = (props) => (
    <View style={styles.buttonView}>
        {
            props.categoryValues.map((item, i) => {
                if(item.value !== '') {
                    return(
                        <TouchableOpacity key={item.value+i}
                            style={props.selectedIndex === item.categoryNodeId ? styles.buttonPressed : styles.button}
                            onPress= { () => {props.updateIndex(item.categoryNodeId, item.value)}}>
                            <Text style={props.selectedIndex === item.categoryNodeId ? [styles.buttonText, styles.buttonPressedText] : styles.buttonText}>
                                {item.value}
                            </Text>
                        </TouchableOpacity>
                    )
                }
            })
        }
    </View>
);

export default CategoryButton;

const styles = StyleSheet.create({
    buttonView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    button: {
        height: 44,
        marginTop: 8,
        marginLeft: 8,
        paddingTop: 14,
        borderWidth: 1,
        borderRadius: 2,
        paddingLeft: 24,
        paddingRight: 24, 
        paddingBottom: 14,
        borderStyle: 'solid',
        justifyContent: 'center',
        borderColor: PRIMARY_COLOR, 
        backgroundColor: "rgba(103, 58, 183, 0.1)"
    },
    buttonPressed: {
        height: 44,
        marginTop: 8,
        marginLeft: 8,
        borderWidth: 1,
        paddingTop: 14,
        borderRadius: 2,
        paddingLeft: 24,
        paddingRight: 24, 
        paddingBottom: 14,
        borderStyle: 'solid',
        justifyContent: 'center',
        borderColor: PRIMARY_COLOR, 
        backgroundColor: PRIMARY_COLOR
    },
    buttonText: {
        fontSize: 14, 
        color: PRIMARY_COLOR, 
        fontWeight: REGULAR_FONT,
        fontFamily: FONT_FAMILY
    },
    buttonPressedText: {
        color: BUTTON_TEXT_COLOR
    }
});