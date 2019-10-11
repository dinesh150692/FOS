/* Library Imports */
import React from "react";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
/* Constant Imports */
import { BORDER_COLOR, PRIMARY_COLOR } from '../../shared/colors';

export default class RadioButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            focus: false
        }
        this.handlePress = this.handlePress.bind(this);
    }
    
    /** 
     *  Update the selection of the radio to the parent 
     */
    handlePress(){
        if (this.props.onSelection) {
            this.props.onSelection(this.props.id);
        }
    }

    render(){
        return ( 
            <TouchableOpacity style={styles.container} delayLongPress={4000} onPress={this.handlePress}>
                <View style={ this.props.selected  ? styles.radioSelected : styles.radio}>
                {/* {
                  this.props.selected ?
                    <View style={styles.radioInnerSelected}/>
                : null
                } */}
              </View>
            </TouchableOpacity>
        );
    } 
}

const styles = StyleSheet.create({
    container:{
        height: 44,
        width: 60,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    radio:{
        height: 16,
        width: 16,
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor: BORDER_COLOR,
        marginLeft: responsiveWidth(5),
        marginRight: responsiveWidth(4)
    },
    radioSelected:{
        height: 16,
        width: 16,
        borderRadius: 8,
        borderWidth: 5,
        backgroundColor: 'white',
        borderColor: PRIMARY_COLOR,
        marginLeft: responsiveWidth(5),
        marginRight: responsiveWidth(4)
    },
    radioInnerSelected:{
        width: responsiveHeight(2),
        height: responsiveHeight(2),
        backgroundColor: PRIMARY_COLOR,
        borderRadius: responsiveHeight(1)
    }
});
