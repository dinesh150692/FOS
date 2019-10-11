/* Library Imports */
import React from "react";
import { Spinner } from "native-base";
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
/* Constant Imports  */
import { BUTTON_COMPLETE_COLOR, BUTTON_DISABLED_COLOR, BUTTON_PRESS_COLOR, BUTTON_TEXT_COLOR, FONT_FAMILY, MEDIUM_FONT, PRIMARY_COLOR } from '../../shared/colors';

export default class ModalButton extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <View style={styles.container}>
                { !this.props.loading &&
                    <TouchableHighlight
                        delayLongPress={4000}  
                        underlayColor={BUTTON_PRESS_COLOR}
                        disabled={this.props.buttonDisabled} 
                        style={this.props.buttonDisabled ? [ styles.button, styles.buttonDisabled ] : styles.button}
                        onPress={this.props.submit}
                    >
                        <Text style={styles.buttonText}>{this.props.children}</Text>
                    </TouchableHighlight>
                }
                { this.props.loading && <Spinner color={PRIMARY_COLOR}/>
                }
            </View>
        );
    } 
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: PRIMARY_COLOR
    },
    buttonDisabled:{
        backgroundColor: BUTTON_DISABLED_COLOR
    },
    completeButton:{
        backgroundColor: BUTTON_COMPLETE_COLOR
    },
    buttonText:{
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT,
        color: BUTTON_TEXT_COLOR        
    },
    container:{
        height: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
