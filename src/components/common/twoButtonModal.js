/* Library Imports */
import React from "react";
import { Spinner } from "native-base";
import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
/* Constant Imports  */
import { BUTTON_DISABLED_COLOR, BUTTON_PRESS_COLOR, BUTTON_TEXT_COLOR, FONT_FAMILY, MEDIUM_FONT, PRIMARY_COLOR } from '../../shared/colors';

export default class TwoButtonModal extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render(){
        if(!this.props.loading){
            return (
                <View style={styles.buttonContainer}>
                     <TouchableOpacity
                            delayLongPress={4000} 
                            disabled={this.props.button1Disabled}
                            activeOpacity={0.14}
                            onPress={this.props.button1Function}
                        >
                            <Text style={this.props.button1Disabled ? [styles.button1Text, styles.buttonDisabledColor]: styles.button1Text}>{this.props.button1Text}</Text>
                        </TouchableOpacity>
                        <TouchableHighlight
                            delayLongPress={4000} 
                            disabled={this.props.button2Disabled}
                            underlayColor={BUTTON_PRESS_COLOR}
                            onPress={this.props.button2Function}
                        >
                            <Text style={this.props.button2Disabled  ? [styles.button2Text, styles.buttonDisabled] : styles.button2Text}>{this.props.button2Text}</Text>
                        </TouchableHighlight>
                </View>
            )
        }else{
            return(
                <View style={styles.spinnerContainer}>
                    <Spinner color={PRIMARY_COLOR} />
                </View>
            )
        }
    } 
}

const styles = StyleSheet.create({
    spinnerContainer:{
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer:{        
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    button2Text:{
        fontSize: 12,
        paddingVertical: 4,
        paddingHorizontal: 16,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY,
        color: BUTTON_TEXT_COLOR,
        backgroundColor: PRIMARY_COLOR
    },
    button1Text:{
        fontSize: 12,
        borderRadius: 2,
        paddingVertical: 4,
        color: PRIMARY_COLOR,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY
    },
    buttonDisabled:{
        backgroundColor: BUTTON_DISABLED_COLOR
    },
    buttonDisabledColor:{
        color: BUTTON_DISABLED_COLOR   
    }
});


