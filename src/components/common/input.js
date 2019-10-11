/* Library Imports */
import React from "react";
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
/* Constant Import */
import { BORDER_COLOR, ERROR_COLOR, FONT_FAMILY, LABEL_COLOR, PRIMARY_COLOR, REGULAR_FONT, TEXT_COLOR } from '../../shared/colors';

export default class Input extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            focus: false
        }
        this.handleBlurFocus = this.handleBlurFocus.bind(this);
    }

    /** 
     *  Update the blur or focus of the input element
     */
    handleBlurFocus= () => {
        // this.setState({focus: !this.state.focus});
        this.props.onFocus(this.props.id);
    }

    render(){
        return ( 
            <View style={styles.inputItem}>
                <Text style={this.state.focus || this.props.focus ? styles.labelFocus : this.props.error.length > 0 ? [styles.label, {color: ERROR_COLOR}] : styles.label}>
                    {this.props.fieldName !== 'E-mail' ? this.props.fieldName  : this.props.fieldName + ' (Optional)'}
                </Text>
                <TextInput
                    value={this.props.value}
                    ref={c => {this.props.handleRef(this.props.id, c); this.input = c;}}
                    selectionColor={PRIMARY_COLOR}
                    onFocus={this.handleBlurFocus}
                    keyboardType={this.props.type}
                    maxLength={this.props.maxLength}
                    underlineColorAndroid="transparent"
                    editable={this.props.editable ? false : true}
                    onBlur={() => {this.props.onBlur(this.props.fieldName)}}
                    returnKeyType={this.props.keyType || 'next'}
                    onSubmitEditing={() => this.props.onSubmit(this.props.id)}
                    style={this.state.focus || this.props.focus ? styles.inputFocus : 
                        this.props.error.length > 0 ? [styles.input,{borderColor: '#EC5745'}] : styles.input}
                    onChangeText={(value) => {this.props.handleChange(value.replace(this.props.regex,''), this.props.fieldName)}}
                />
                {this.props.error.length > 0 && <Text style={[styles.label, styles.error]}>{this.props.error}</Text>}
            </View>
        );
    } 
}

const styles = StyleSheet.create({
    inputItem:{
        marginTop: 21
    },
    input:{
        height: 40,
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 2,
        paddingLeft: 16,
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        borderColor: BORDER_COLOR,
        width: responsiveWidth(80),
        marginHorizontal: responsiveWidth(10) 
    },
    label:{
        fontSize: 14,
        marginBottom: 8,
        color: LABEL_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT,
        marginHorizontal: responsiveWidth(10)
    },
    labelFocus:{
        fontSize: 14,
        marginBottom: 8,
        color: PRIMARY_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT,
        marginHorizontal: responsiveWidth(10)
    },
    inputFocus:{
        height: 40,
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 2,
        paddingLeft: 16,
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        borderColor: PRIMARY_COLOR,
        width: responsiveWidth(80),
        marginHorizontal: responsiveWidth(10)  
    },
    error:{
        fontSize: 12,
        color: ERROR_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    }
});
