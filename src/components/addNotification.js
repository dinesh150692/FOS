/* Library Imports */
import React from "react";
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
/* Action Import */
import { sendOTP } from '../redux/action/otpAction';
import { closeAddNotificationModal, closeAllModal } from '../redux/action/modalAction';
/* Component Import */
import OTPVerification from './otpVerification';
import ModalButton from './common/modal_button';
/* Constant Import */
import { ERROR_CODES_AND_MESSAGES } from '../shared/errorCodes';
import { MOBILE_REGEX, NOTIFICATION, NUMBER_REGEX } from '../shared/constants';
import { BACKGROUND_COLOR, BORDER_COLOR, CLEAR_ICON_COLOR, ERROR_COLOR, FONT_FAMILY, PRIMARY_COLOR, TEXT_COLOR } from '../shared/colors';
/* Style Import */
import modalStyles from '../style/modal';

class AddNotification extends React.PureComponent {
	constructor(props){
        super(props);
        this.button = null;
        this.state ={
            mobile: '',
            focus: false,
            mobileError: '',
            smsVerified: false,
            mobileInputFulfilled: false
        }
        this.input =null;
        this.sendOTP = this.sendOTP.bind(this);
        this.proceed = this.proceed.bind(this);
        this.inputFocus = this.inputFocus.bind(this);
        this.handleChangeMobile = this.handleChangeMobile.bind(this);
        this.openCloseNotification = this.openCloseNotification.bind(this);
    }

    componentWillUnMount(){
        this.setState({
            mobile: '',
            focus: false,
            mobileError: '',
            smsVerified: false,
            mobileInputFulfilled: false
        });

    }
    
    /* 
     * Updates the mobile number to the parent component 
     *  and clear the state values
	 */
    proceed(){
        this.setState({smsVerified: true});
        this.props.updateNumber(this.state.mobile);
    }

    /** 
     *  Updates the input foucs value 
     */
    inputFocus(){
        this.setState({focus: !this.state.focus});
    }
    
    /** 
     *  Closes the notification modal and clear the 
     *  state values
     */
    openCloseNotification(){
        this.props.closeAddNotificationModal();
    }
    
    /** Gets fired on input of mobile number input element.
	 * 	Updates the mobileNumber in state object if input is valid mobile number
	 *	@param {String} value
	 */
    handleChangeMobile(value){
        if(value === ''){
          this.setState({ mobileError: '', mobile: '', mobileInputFulfilled: false});
        }else if(NUMBER_REGEX.test(value)) {
          if(!MOBILE_REGEX.test(value)){
            this.setState({ 
              mobileError: 'Enter a valid mobile number',
              mobileInputFulfilled: false,
              mobile: value
            });
          }else{
            if(this.state.mobileError !== ''){
              this.setState({ mobileError: ''})
            }
            if(value.length < 10){
              this.setState({
                mobile: value, 
                mobileInputFulfilled: false
              });
            }else if(value.length === 10){
              this.setState({
                mobile: value,
                mobileError: '',
                mobileInputFulfilled: true,
              });
            }
          }
        }else{
            this.setState({mobile: ''});
        }
    };

    /** 
     *  Close the send otp api and on success reponse close the modal and
     *  open the otp verification
     *  for further action
     */
    sendOTP(){
        if(!this.state.mobileInputFulfilled){
            return;
        }
        
        let notificationList = this.props.notificationList;
        for(let i = 0; i < notificationList.length; i++ ){
            if(notificationList[i].enabled && notificationList[i].phoneNumber == this.state.mobile){
                ToastAndroid.show(ERROR_CODES_AND_MESSAGES.NOTIFICATION_RECEIVER_ALREADY_EXISTS, ToastAndroid.LONG);
                this.openCloseNotification();
                return;
            }
        }

        this.props.sendOTP.call(this, {phoneNumber: this.state.mobile});
    }

	render() {
		return (
            <Modal 
                isVisible={this.props.openAddNotification} 
                backdropColor={"black"}
                backdropOpacity={0.54}
                onBackButtonPress={this.openCloseNotification}
            >
                <View style={{flex:1, alignItems: 'center', justifyContent: 'flex-start'}}>
                    <TouchableOpacity delayLongPress={4000} activeOpacity={1} onPress={() => null}
                        style={this.state.mobileError || this.props.error ? [styles.modal, styles.modalError] : styles.modal}  
                    >
                        <React.Fragment>
                            <TouchableOpacity
                                delayLongPress={4000} 
                                activeOpacity={0.14} 
                                onPress={this.openCloseNotification}
                                style={styles.close}
                            >
                                <Icon ios='md-close' android="md-close" style={styles.closeIcon}/>
                            </TouchableOpacity>    
                            <View style={styles.modalContent}>
                                <Text style={modalStyles.modalHeader}>
                                    { NOTIFICATION.HEADER }
                                </Text>
                                <Text style={[modalStyles.content, {textAlign: 'center'}]}>
                                    { NOTIFICATION.TEXT }
                                </Text>
                                <TextInput 
                                    maxLength={10}
                                    autoFocus={true} 
                                    keyboardType="numeric"
                                    onFocus={this.inputFocus}
                                    value={this.state.mobile}
                                    selectionColor={PRIMARY_COLOR}
                                    onSubmitEditing={this.state.smsVerified ? this.proceed : this.sendOTP}
                                    underlineColorAndroid="transparent" 
                                    onChangeText={this.handleChangeMobile} 
                                    style={this.state.focus ? [styles.inputNumber, styles.inputNumberFocus]: styles.inputNumber} 
                                /> 
                                <Text style={styles.error}>{this.state.mobileError || this.props.error || ''}</Text>
                                
                            </View>
                            <ModalButton
                                submit={this.state.smsVerified ? this.proceed : this.sendOTP}
                                loading={this.props.loading || this.props.ajaxStatus.state === 'inprogress'} 
                                buttonDisabled={!this.state.mobileInputFulfilled}
                            >
                                {NOTIFICATION.BUTTON}
                            </ModalButton>
                        </React.Fragment>
                    </TouchableOpacity>
                    {this.props.openOTP && !this.props.openSessionExpired &&
                        <OTPVerification
                            onSuccess={this.proceed}
                            mobileNumber={this.state.mobile} 
                        />
                    }
                </View>
            </Modal>
        );
	}
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        ajaxStatus: state.ajaxStatus,
        openOTP: state.modal.openOTP,
        openSessionExpired: state.modal.openSessionExpired,
        openAddNotification: state.modal.openAddNotification
    }; 
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = { 
    sendOTP,  
    closeAllModal,
    closeAddNotificationModal
};


export default connect(mapStateToProps, mapDispatchToProps)(AddNotification);

const styles = StyleSheet.create({
    inputNumber:{
        height: 50,
        width: 295,
        fontSize: 24,
        marginTop: 7.7,
        borderWidth: 1,
        paddingLeft: 16,
        color: TEXT_COLOR,
        paddingVertical: 11,
        fontFamily: FONT_FAMILY,
        borderColor: BORDER_COLOR,  
    },
    inputNumberFocus:{
        borderColor: PRIMARY_COLOR,
        borderWidth: responsiveWidth(0.5)
    },
    close:{
        right: 15,
        top: '5.5%',
        position: 'absolute'
    },
    error:{
        fontSize: 12,
        textAlign:'left',
        lineHeight: 30,
        color: ERROR_COLOR,
        fontFamily: FONT_FAMILY,
        marginTop: responsiveHeight(1)
    },
    modal:{
        width: 327,
        height: 227,
        marginTop: 56,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BACKGROUND_COLOR
    },
    modalContent:{
        paddingLeft: 17,
        paddingRight: 15,
        alignItems: 'center'
    },
    modalError:{
        height: 240
    },
    closeIcon:{
        paddingHorizontal: 10,
        color: CLEAR_ICON_COLOR,
        fontSize: responsiveFontSize(3)
    }
})