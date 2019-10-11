/* Library Imports */
import React from "react";
import { Spinner } from "native-base";
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { Keyboard, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
/* Constant Imports  */
import { SPINNER_BUTTON_COLOR, BUTTON_COMPLETE_COLOR, BUTTON_COMPLETE_PRESS_COLOR, BUTTON_DISABLED_COLOR, BUTTON_PRESS_COLOR, BUTTON_TEXT_COLOR, FONT_FAMILY, MEDIUM_FONT, PRIMARY_COLOR } from '../../shared/colors';

export default class Button extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state ={
            keyboardOpen : false
        }
    }

    componentDidMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardShowHandler);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHideHandler);
    }
    
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    
    
    _keyboardShowHandler = () => {
        this.setState({ keyboardOpen : true});
    }


    _keyboardHideHandler = ()  => {
        this.setState({ keyboardOpen : false});
    }

    render(){
        return (
            <View style={!this.state.keyboardOpen ? (this.props.complete ? [styles.container, styles.completeContainer]: styles.container) : {width:0, height: 0}}>
                { !this.state.keyboardOpen && !this.props.loading &&
                    <View>
                        <TouchableHighlight 
                            delayLongPress={4000} 
                            underlayColor={this.props.complete ? BUTTON_COMPLETE_PRESS_COLOR :BUTTON_PRESS_COLOR}
                            disabled={this.props.buttonDisabled} 
                            style={this.props.buttonDisabled ? [ styles.button, styles.buttonDisabled ] : this.props.complete ?  [ styles.button, styles.completeButton]: styles.button}
                            onPress={this.props.submit}
                        >
                           <Text style={styles.buttonText}>{this.props.children}</Text>
                        </TouchableHighlight>
                    </View>
                }
                { this.props.loading && 
                    <View>
                        <Spinner color={SPINNER_BUTTON_COLOR}/>
                    </View>
                }
            </View>
        );
    } 
}

const styles = StyleSheet.create({
    button: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(100),
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
        left: 0,
        bottom: 0,
        height: 56,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(100),
        backgroundColor: BUTTON_PRESS_COLOR
    },
    completeContainer:{
        backgroundColor: BUTTON_COMPLETE_PRESS_COLOR
    }
});
