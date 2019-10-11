/* Library Imports */
import React from 'react';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
/* Component Import */
import TwoButtonModal from '../components/common/twoButtonModal';
/* Action Import */
import { closeAllModal, closeOTPModal } from '../redux/action/modalAction';
import { clearOTPToken, sendOTP, verifyOTP } from '../redux/action/otpAction';
/* Constant Import */
import { BUTTON_PROCEED, OTP, OTP_TIME_OUT, RESEND_OTP } from '../shared/constants';
import { BORDER_COLOR, CLEAR_ICON_COLOR, ERROR_COLOR, FONT_FAMILY, PRIMARY_COLOR, TEXT_COLOR, WARM_GREY_COLOR, BUTTON_DISABLED_COLOR } from '../shared/colors';
/* Style Import */
import modalStyles from '../style/modal';

class OTPVerification extends React.PureComponent {
	constructor(props){
        super(props);
        this.ref = [];
        this.state = {
            time: '',
            otpError: '',
            banned: false,
            timeOut: OTP_TIME_OUT,
            buttonDisabled: true,
            otp: ['','','','',''],
            focus: [false, false, false, false, false]
        }
        this.timer = null;
        this.proceed = this.proceed.bind(this);
        this.sendOTP = this.sendOTP.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this._renderButton = this._renderButton.bind(this);
        this.handleKeyEvent = this.handleKeyEvent.bind(this);
        this.handleInputValidation = this.handleInputValidation.bind(this);
        this.closeOTPModal = this.closeOTPModal.bind(this);

    }

    /** 
     *  Start the timer and call the timer count down function
     */

    closeOTPModal(){
        Keyboard.dismiss();
        if(this.state.timeOut === 0){
            this.props.closeOTPModal()
        }
    }
    startTimer(){
        if(this.timer){
            clearInterval(this.timer);
            this.setState({timeOut:OTP_TIME_OUT})
        }
        setTimeout(() => {
            this.setState({ timeOut: this.state.timeOut - 1, time: '00:59'}, () => {
                if(this.state.timeOut === OTP_TIME_OUT - 1){
                    this.timerCountDown();
                }
            });
        }, 0);
    }

    componentWillUnmount(){
        clearInterval(this.timer); 
    }

    /** 
     *  Update the timer count down for each second and 
	 *  once the timer is timed out clear the timer and 
     *  call resend otp
     */
	timerCountDown(){
		this.timer = setInterval(() => {
            let {timeOut} = this.state;
            if(timeOut > 1){
                let minute = parseInt((timeOut) / 60);
                let second = parseInt((timeOut)% 60);
                if(second < 10){
                    second = '0' + second;
                }      
                minute = '0' + minute;
                this.setState({ timeOut: timeOut-1, time: minute+ ':'+ second});
			}else{
                clearInterval(this.timer); 
                this.setState({ timeOut: 0, banned: false, otpError: '', time: '0:00'});
            }
		}, 1000);
	}
    
    /** Get fired when the otp is filled and user clicks verify otp
     *  Call the verify otp api and on success  necessary action
	 */
    proceed(){
        if(this.state.buttonDisabled || this.state.banned){
            return null;
        }
        let details  = {
            phoneNumber: this.props.mobileNumber ? this.props.mobileNumber : this.props.phoneNumber,
            token: this.props.token,
            otp: this.state.otp.join('')
        }
        this.props.verifyOTP.call(this, details);
    }

    /** 
     *  Call the send otp api and on success restart the timer
     */
    sendOTP(){        
        let phoneNumber = this.props.mobileNumber ? this.props.mobileNumber : this.props.phoneNumber;
        this.startTimer();
        this.props.sendOTP.call(this, {phoneNumber:  phoneNumber});
    }

    /** Gets fired on every input in the otp field
	 * 	Updates the value entered by user in state object otp 
     *  based on the id and focus the next field
     *	@param {String} value
     *  @param {Number} id
	 */
    handleChange(value, id){    
        let { otp } = this.state; 
       if(id === 4 && value != ''){
            otp[id] = value;
        }else{
            if(value){
                otp[id] = value;
                id = id + 1;
                this.ref[id].focus();
            }
        }
        this.setState({otp: [...otp]},() => {
            this.handleInputValidation();
        });
    }

    /** Gets fired on evey key press in the otp field
	 * 	Updates the value in state object otp 
     *  based on the id and focus the prev field
     *	@param {String} value
     *  @param {Number} id
	 */
    handleKeyEvent(event, id){
        if(event.nativeEvent.key === 'Backspace'){
            let { otp } = this.state;
            if(otp[id] === ''){
                if(id - 1 >=0){
                    otp[id-1] = '';
                    this.ref[id-1].focus();
                }
            }else{
                otp[id] = '';
            }
            this.setState({otp},() => {
                this.handleInputValidation();
            });
            event.stopPropagation();
        }
    }
    
    /** Gets fired on focus in the otp field
	 * 	Updates the value in state object focus 
     *  based on the id
     *  @param {Number} id
	 */
    handleFocus(id){
        let { focus } = this.state;
        let index = focus.indexOf(true);
        if(index >= 0){
            focus[index] = false;
        }
        focus[id] = true;
        this.setState({focus: [...focus]});
    }

    /** Gets fired on every state change
	 * 	Updates the button state based on otp validation
     */
    handleInputValidation(){
        let { otp } = this.state;
        if(otp.join('').length === 5 && this.props.token){
            Keyboard.dismiss();
            this.setState({buttonDisabled: false});
        }else{
            this.setState({buttonDisabled: true});
        }
    }

    _renderButton(){
        if(this.props.openOTP && this.state.timeOut === OTP_TIME_OUT){
            this.startTimer();
        }
        return(
            <TwoButtonModal
                loading={this.props.ajaxStatus.state === 'inprogress'}
                button1Disabled={!(this.state.timeOut === 0)}
                button2Disabled={this.state.buttonDisabled}
                button1Text={RESEND_OTP}
                button2Text={BUTTON_PROCEED}
                button1Function={this.sendOTP}
                button2Function={this.proceed}
            />
        );
    }

	render() {
        const otpError = this.state.otpError.length > 0 ? this.state.otpError : '';
		return (
            <Modal   
                isVisible={this.props.openOTP} 
                backdropColor={'black'}
                backdropOpacity={0.54}
                onBackButtonPress={this.closeOTPModal}
            >
                <ScrollView style={{flex:1}}>
                    <View style={otpError ? [modalStyles.modalContent2,{height: responsiveHeight(47.5)}] : modalStyles.modalContent2}>
                        <TouchableOpacity
                            delayLongPress={4000}
                            activeOpacity={0.14} 
                            onPress={this.closeOTPModal}
                            style={styles.close}
                            disabled={!(this.state.timeOut === 0)}
                        >
                            <Icon ios='md-close' android="md-close" style={!(this.state.timeOut === 0) ? styles.closeIconDisabled:styles.closeIcon}/>
                        </TouchableOpacity>
                        <Text style={modalStyles.modalHeader}>
                            {OTP.HEADER}
                        </Text>
                        <Text style={[modalStyles.content,{textAlign: 'center'}]}>
                            {OTP.TEXT1 + (this.props.mobileNumber || this.props.phoneNumber) + '.'}
                        </Text>
                        <Text style={[modalStyles.content,{marginTop: responsiveHeight(0), textAlign: 'center'}]}>
                            {OTP.TEXT2}
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                maxLength={1}
                                autoFocus={true}
                                keyboardType={"numeric"}
                                value={this.state.otp[0]}
                                ref={c => {this.ref[0] = c}} 
                                selectionColor={PRIMARY_COLOR}
                                onFocus={() => {this.handleFocus(0)}}
                                underlineColorAndroid={"transparent"}
                                onKeyPress={event => this.handleKeyEvent(event, 0)} 
                                onChangeText={(value) => {this.handleChange(value, 0)}}
                                style={ otpError.length > 0? [styles.input, styles.errorInput] : this.state.focus[0] ? [styles.input, styles.inputFocus] :styles.input} 
                            />
                           <TextInput
                                maxLength={1}
                                keyboardType={"numeric"}
                                value={this.state.otp[1]}
                                ref={c => {this.ref[1] = c}} 
                                selectionColor={PRIMARY_COLOR}
                                onFocus={() => {this.handleFocus(1)}}
                                underlineColorAndroid={"transparent"}
                                onKeyPress={event => this.handleKeyEvent(event, 1)}
                                onChangeText={(value) => {this.handleChange(value, 1)}} 
                                style={ otpError.length > 0? [styles.input, styles.errorInput] : this.state.focus[1] ? [styles.input, styles.inputFocus] :styles.input} 
                            />
                            <TextInput
                                maxLength={1}
                                keyboardType={"numeric"}
                                value={this.state.otp[2]}
                                ref={c => {this.ref[2] = c}}
                                selectionColor={PRIMARY_COLOR} 
                                onFocus={() => {this.handleFocus(2)}}
                                underlineColorAndroid={"transparent"}
                                onKeyPress={event => this.handleKeyEvent(event, 2)}
                                onChangeText={(value) => {this.handleChange(value, 2)}} 
                                style={ otpError.length > 0 ? [styles.input, styles.errorInput] : this.state.focus[2] ? [styles.input, styles.inputFocus] :styles.input} 
                            />
                            <TextInput
                                maxLength={1}
                                keyboardType={"numeric"}
                                value={this.state.otp[3]}
                                ref={c => {this.ref[3] = c}} 
                                selectionColor={PRIMARY_COLOR}
                                onFocus={() => {this.handleFocus(3)}}
                                underlineColorAndroid={"transparent"}
                                onKeyPress={event => this.handleKeyEvent(event, 3)}
                                onChangeText={(value) => {this.handleChange(value, 3)}} 
                                style={ otpError.length > 0 ? [styles.input, styles.errorInput] : this.state.focus[3] ? [styles.input, styles.inputFocus] :styles.input} 
                            />
                            <TextInput
                                maxLength={1}
                                returnKeyType={"done"}
                                keyboardType={"numeric"}
                                value={this.state.otp[4]}
                                ref={c => {this.ref[4] = c}} 
                                onSubmitEditing={this.proceed}
                                selectionColor={PRIMARY_COLOR}
                                onFocus={() => {this.handleFocus(4)}}
                                underlineColorAndroid={"transparent"}
                                onKeyPress={event => this.handleKeyEvent(event, 4)}
                                onChangeText={(value) => {this.handleChange(value, 4)}} 
                                style={ otpError.length > 0 ? [styles.input, styles.errorInput] : this.state.focus[4] ? [styles.input, styles.inputFocus] :styles.input} 
                            />
                        </View>
                        <Text style={styles.errorOTP}>{otpError}</Text>
                        <View style={styles.textContainer}>
                            <View>
                                <Text style={styles.timeText}>
                                    {OTP.TIME_TEXT} : <Text style={this.state.timeOut > 20 ? {color: '#EC5745'}: {color: '#EC5745'}}>{this.state.time}</Text>
                                </Text>
                            </View>
                        </View>
                        {this._renderButton()}
                    </View>
                 </ScrollView>
            </Modal>
        );
	}
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        token: state.otp.token,
        openOTP: state.modal.openOTP,
        ajaxStatus: state.ajaxStatus,
        openOTP: state.modal.openOTP,
        phoneNumber : state.currentMerchantDetails.merchantDetails.phoneNumber        
    };
}

export default connect(mapStateToProps, {verifyOTP, sendOTP, clearOTPToken, closeOTPModal, closeAllModal})(OTPVerification);

const styles = StyleSheet.create({
    input:{
        color: TEXT_COLOR,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        borderColor: BORDER_COLOR,
        margin: responsiveWidth(1),
        width: responsiveWidth(12),
        marginLeft: responsiveWidth(2),
        fontSize: responsiveFontSize(3),
        borderWidth: responsiveWidth(0.3)
    },
    inputFocus:{
        borderColor: PRIMARY_COLOR,
    },
    errorInput:{
        borderColor: ERROR_COLOR,
    },
    errorOTP:{
        flexWrap: 'wrap',
        marginBottom: 10,
        textAlign: 'left',
        color: ERROR_COLOR,
        fontFamily: FONT_FAMILY,
        width: responsiveWidth(80),
        marginLeft: responsiveWidth(7),
        fontSize: responsiveFontSize(2)
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: responsiveWidth(80),
        height: responsiveHeight(4),
        justifyContent: 'flex-start'
    },
    timeText: {
        color: WARM_GREY_COLOR,
        fontFamily: FONT_FAMILY,
        fontSize: responsiveHeight(1.8)
    },
    inputContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: responsiveWidth(-1),
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(0.5)
    },
    close:{
        right: 15,
        top: '5.5%',
        position: 'absolute'
    },
    closeIcon:{
        color: CLEAR_ICON_COLOR,
        fontSize: responsiveFontSize(3)
    },
    closeIconDisabled:{
        color: BUTTON_DISABLED_COLOR,
        fontSize: responsiveFontSize(3)
    }
})

