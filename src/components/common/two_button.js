/* Library Imports */
import React from "react";
import { Spinner } from "native-base";
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

/* Constant Imports  */
import { BACKGROUND_WHITE_COLOR, SPINNER_BUTTON_COLOR, BUTTON_DISABLED_COLOR, BUTTON_PRESS_COLOR, BUTTON_TEXT_COLOR, FONT_FAMILY, MEDIUM_FONT, PRIMARY_COLOR } from '../../shared/colors';

export default class TwoButton extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <View style={this.props.loading ? [styles.container, styles.backGroundColor] : styles.container}>
                { !this.props.loading &&
                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            delayLongPress={4000}                              
                            underlayColor={BUTTON_PRESS_COLOR}
                            style={[styles.button, styles.buttonWhite]}
                            onPress={this.props.button1Function}
                        >
                            <Text style={[styles.buttonText, styles.buttonTextWhite]}>{this.props.button1Text}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight 
                            delayLongPress={4000}
                            underlayColor={BUTTON_PRESS_COLOR}
                            disabled={this.props.buttonDisabled} 
                            style={this.props.buttonDisabled ? [ styles.button, styles.buttonDisabled ] :styles.button }
                            onPress={this.props.button2Function}
                        >
                            <Text style={styles.buttonText}>{this.props.button2Text}</Text>
                        </TouchableHighlight>
                    </View>
                }
                { this.props.loading && <Spinner color={SPINNER_BUTTON_COLOR}/>
                }
            </View>
        );
    } 
}

const styles = StyleSheet.create({
    button: {
        height:40,
        borderRadius: 2,
        paddingLeft: 20,
        paddingRight: 19,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PRIMARY_COLOR
    },
    buttonWhite: {
       marginRight: 8,
       borderWidth: 1,
       borderColor: PRIMARY_COLOR,
       backgroundColor: BACKGROUND_WHITE_COLOR 
    },
    buttonDisabled:{
        backgroundColor: BUTTON_DISABLED_COLOR
    },
    buttonText:{
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT,
        color: BUTTON_TEXT_COLOR        
    },
    buttonTextWhite:{
        color: PRIMARY_COLOR
    },
    container:{
        left: 0,
        bottom: 0,
        height: 60,
        borderTopWidth: 6,
        position: 'absolute',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        width: responsiveWidth(100),
        flexDirection: 'column-reverse',
        borderTopColor: 'rgba(0,0,0,0.03)'
    },
    backgroundColor: {
        backgroundColor: BUTTON_PRESS_COLOR
    },
    noKeyBoardContainer:{
        borderTopWidth: 0,
        borderTopColor: 'rgba(0,0,0,0)'
    },
    buttonContainer:{
        paddingVertical: 8,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'flex-end',
        
    }
});
