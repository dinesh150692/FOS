/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import { Animated, StyleSheet, Text } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
/* Action Import */
import { clearSuccessTimer } from '../redux/action/timerAction';
/* Constant Import */
import { MERCHANT_SUCCESSFULLY_ONBOARDED } from '../shared/constants';
import { BACKGROUND_WHITE_COLOR, BUTTON_COMPLETE_COLOR, FONT_FAMILY, REGULAR_FONT } from '../shared/colors';

class SuccessMessage extends React.PureComponent {
	constructor(props){
        super(props);
        this.opacity = new Animated.Value(0);
        this.closeToast = this.closeToast.bind(this);
	}
	
	componentDidMount(){
        Animated.timing(
            this.opacity,{ 
            toValue: 1,
            duration: 1000
        }).start(this.closeToast()) 
    }


    closeToast() {
        setTimeout(() => {
            Animated.timing(
            this.opacity,
            { 
              toValue: 0,
              duration: 1000
            }).start(() => {this.props.clearSuccessTimer()})
          }, 2000)
      }

		
	render(){
        return (
            <Animated.View     
                style={[styles.successContainer,{opacity: this.opacity}]}
            >
                <Text style={styles.successText}>{MERCHANT_SUCCESSFULLY_ONBOARDED || ''}</Text>
            </Animated.View>
        );
    }
}


/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = { 
	clearSuccessTimer
};

export default connect(null, mapDispatchToProps)(SuccessMessage);

const styles = StyleSheet.create({
    successContainer:{
        top: 56,
        left: 0,
        height: 30,
        zIndex: 100,
        elevation: 10,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(100),
        backgroundColor: BUTTON_COMPLETE_COLOR
    },
    successText:{
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT,
        color: BACKGROUND_WHITE_COLOR
    }
})
