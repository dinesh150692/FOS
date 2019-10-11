/* Library Imports */
import React from "react";
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
/* Component Import */
import ModalButton from './common/modal_button';
/* Action Import */
import { sendOTP } from '../redux/action/otpAction';
import { closeAllModal, closeSessionExpiredModal } from '../redux/action/modalAction';
/* Constants Import */
import { REGENERATE_OTP, SESSION_EXPIRED } from '../shared/constants';
import { CLEAR_ICON_COLOR,BACKGROUND_COLOR, ERROR_COLOR, FONT_FAMILY } from '../shared/colors';
/* Style Import */
import modalStyles from '../style/modal';

class SessionExpired extends React.PureComponent {
	
    constructor(props){
        super(props);
        this.state={
            error: ''
        }
        this.sendOTP = this.sendOTP.bind(this);
    }
    
    /** 
     *  Call the send otp api and on success restart the timer
     */
    sendOTP(){
        this.props.sendOTP.call(this, {phoneNumber: this.props.phoneNumber});
    }

	render() {
		return (
            <Modal 
                isVisible={this.props.openSessionExpired} 
                backdropColor={"black"}
                backdropOpacity={0.54}
                onBackButtonPress={this.props.closeSession}
            >
               <View style={{flex:1, alignItems: 'center', justifyContent: 'flex-start'}}>
                    <TouchableOpacity delayLongPress={4000} activeOpacity={1} onPress={() => null}
                        style={styles.modal}  
                    >
                        <React.Fragment>
                            <View style={styles.modalContent}>
                                <TouchableOpacity
                                    delayLongPress={4000}
                                    activeOpacity={0.14} 
                                    onPress={this.props.closeSession}
                                    style={styles.close}
                                >
                                    <Icon ios='md-close' android="md-close" style={styles.closeIcon}/>
                                </TouchableOpacity>
                                <Text style={modalStyles.modalHeader}>
                                    {SESSION_EXPIRED.HEADER}
                                </Text>
                                <Text style={modalStyles.content}>
                                    {SESSION_EXPIRED.TEXT}
                                </Text>
                                <Text style={[modalStyles.content, styles.error]}>{this.state.error}</Text>
                            </View>
                            <ModalButton
                                submit={this.sendOTP}
                                buttonDisabled={false}
                                loading={this.props.ajaxStatus.state === 'inprogress'} 
                            >
                                {REGENERATE_OTP}
                            </ModalButton>
                        </React.Fragment>
                    </TouchableOpacity>
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
        openSessionExpired: state.modal.openSessionExpired,
        phoneNumber: state.currentMerchantDetails.merchantDetails.phoneNumber
    };
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = { 
    sendOTP,
    closeAllModal,
    closeSessionExpiredModal
};

export default connect( mapStateToProps, mapDispatchToProps)(SessionExpired);

const styles = StyleSheet.create({
    buttonPadding:{
        marginTop: responsiveHeight(1)
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
    error:{
        textAlign:'left',
        color: ERROR_COLOR,
        fontFamily: FONT_FAMILY,
        fontSize: responsiveFontSize(2),
        marginTop: responsiveHeight(0.3)
    },
    modal:{
        width: 327,
        height: 155,
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
    }
})