/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import { Container, Icon, Spinner } from 'native-base';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { BackHandler, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
/* Component Imports */
import Timer from '../components/timer';
import Header from '../components/header';
import GPSError from '../components/gpsError';
import Button from '../components/common/button';
import AlertModal from "../components/common/alertModal";
// import SMSLinking from '../components/smsLinking';
import BankDetails from '../components/bankDetails';
import { goToPage } from '../components/common/logout';
import AddressDetails from '../components/addressDetails';
import CameraModal from '../components/common/cameraModal';
import MerchantDetails from '../components/merchantDetails';
import OTPVerification from '../components/otpVerification';
/* Action Import */
import { sendOTP } from '../redux/action/otpAction';
import { updatePageType } from '../redux/action/pageTypeAction';
import { activateMerchant, getMerchantDetails } from '../redux/action/currentMerchantAction';
import { enableLocation } from '../redux/action/locationAction';
import { resetInitValue, startSuccessTimer, startTimer } from '../redux/action/timerAction';
import { addNewQRPOS } from '../redux/action/notificationAction';
import { closeAllModal, closeSMSModal, openCameraModal, openSMSModal, closeAlertModal, openAlertModal } from '../redux/action/modalAction';
/* Constant Import */
import {
    BUTTON_TEXT,
    CLOSE_BUTTON_REVIEW_DETAIL,
    GENERATE_OTP,
    ONBOARDING_STAGES,
    PAGE_NAVIGATION_TYPES,
    TIME_OUT
} from '../shared/constants';
import { BACKGROUND_COLOR, BACKGROUND_WHITE_COLOR, EDIT_ICON_COLOR, FONT_FAMILY, LABEL_COLOR, MEDIUM_FONT, PRIMARY_COLOR, REGULAR_FONT, TEXT_COLOR } from '../shared/colors';
/* Image Imports */
import tick from '../assets/check.png';
import image from '../assets/image.png';
import qrImage from '../assets/qr.png';
import errorTick from '../assets/error.png';
/* Style Imports */
import commonStyles from '../style/style';

class ReviewDetails extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            buttonText: '',
            loading: false,
            complete: false,
            stagesList: Object.keys(ONBOARDING_STAGES)
        }
        this.submit = this.submit.bind(this);
        this.sendOTP = this.sendOTP.bind(this);
        this.buttonText = this.buttonText.bind(this);
        this.otpVerified = this.otpVerified.bind(this);
        this.addNewQRPOS = this.addNewQRPOS.bind(this);
        this.processResult = this.processResult.bind(this);
        this.goBackHandler = this.goBackHandler.bind(this);
        this._renderDetails = this._renderDetails.bind(this);
        this._renderQRCodeDetails = this._renderQRCodeDetails.bind(this);
        this._renderBrandingDetails = this._renderBrandingDetails.bind(this);
    }

    componentDidMount(){
        this.props.getMerchantDetails.call(this, this.props.merchantId);
        this.props.enableLocation();
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
    }
  
    componentWillUnmount(){
        this.props.closeAllModal();
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
    }

    goBackHandler(){
        if(this.props.timerStart == true ){
            this.props.openAlertModal();
            return true;
        }else{
            this.props.resetInitValue(false);
            goToPage('MerchantList');
            return true;
        }

    }
   
    /** Get fired on otp verification or timer count out
     *  to decide the text on button and function call for it
	 */
    buttonText(timeOut = this.props.timeOut){
        if(timeOut === TIME_OUT  && !this.props.timerStart){
           this.setState({buttonText:  GENERATE_OTP});
        }else if(timeOut < TIME_OUT || this.props.timerStart){
            this.setState({buttonText: BUTTON_TEXT[this.props.onboardingStage]});
        }
    }

    /*
     * Get fired on click of button and will decide the action
     *  based on the current state of the merchant
     */
    submit(){
        this.setState({count: 1});
        if(this.state.buttonText === GENERATE_OTP){
            this.sendOTP();
        }else{
            switch(this.props.onboardingStage){
                case this.state.stagesList[0]:
                    this.props.updatePageType(PAGE_NAVIGATION_TYPES.BRANDING);
                    goToPage('Branding');
                    break;
                case this.state.stagesList[1]:
                    this.props.openSMSModal();
                    goToPage('SMSLinking');
                    break;
                case this.state.stagesList[2]:
                    this.props.openCameraModal();
                    break;
                case this.state.stagesList[3]:
                    this.props.updatePageType(PAGE_NAVIGATION_TYPES.QR);
                    goToPage('Branding');
                    break;
                case this.state.stagesList[4]:
                    this.setState({loading: true});
                    this.props.activateMerchant.call(this, this.props.merchantId);
                    // this.props.updatePageType(PAGE_NAVIGATION_TYPES.ID_PROOF);
                    // goToPage('ProofSelection');
                    break;
                case this.state.stagesList[5]:
                    // this.props.updatePageType(PAGE_NAVIGATION_TYPES.BUSINESS_PROOF);
                    // goToPage('ProofSelection');
                    break;
                default :
                    this.setState({loading: true});
                    this.props.activateMerchant.call(this, this.props.merchantId);
                    break;
            }
        }

    }

    addNewQRPOS(type, data, item){
        let requestData = {
            merchantId: this.props.merchantId,
            latitude: this.props.lat,
            longitude: this.props.long
        }
        this.props.addNewQRPOS.call(this, type, data, requestData, item);
    }

    /**
     *  Added Response to the pos or qr code item and
     *  returning update data
     */
    processResult(data, item, notificationItem){
        item.push({
            name: data,
            notificationList: [notificationItem]
        });
        return item;
    }

    /** Get fired on the otp verification to start the timer
     *  and update the button state
	 */
    otpVerified(){
        this.props.startTimer();
        this.buttonText(TIME_OUT-1);
    }

    /** 
     *  Close the send otp api and on success reponse close the modal and
     *  open the otp verification
     *  for further action
     */
    sendOTP(){
        this.props.sendOTP.call(this,{phoneNumber: this.props.phoneNumber});
    }

    _renderQRCodeDetails(){
        if(this.state.stagesList.indexOf(this.props.onboardingStage) >= 3 && this.props.qrCode && this.props.qrCode.length > 0){
            return(
                <View style={styles.qrPosContainer}>
                    <Image source={qrImage} resizeMode={'contain'} style={styles.qrPosImage}/>
                    <View style={styles.qrPosContentContainer}>
                        <View  style={styles.qrPosHeaderContainer}>
                            <Text style={styles.qrPosHeader}>QR CODES</Text>
                            <TouchableOpacity
                                delayLongPress={4000}
                                activeOpacity={0.14}
                                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                disabled ={
                                    this.state.buttonText === GENERATE_OTP || 
                                    this.state.stagesList.indexOf(this.props.onboardingStage) >3
                                } 
                                onPress={() => {
                                    goToPage('AddQRPOS')
                                }}
                            >
                                <Icon ios='md-create' android="md-create" style={ 
                                    (this.state.buttonText === GENERATE_OTP || 
                                    this.state.stagesList.indexOf(this.props.onboardingStage) > 3)  ? styles.editIconDisabled : styles.editIcon}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.qrPosText}>{this.props.qrCode.length} {this.props.qrCode.length == 1 ? 'code added' : 'codes added'}</Text>
                    </View>
                </View>
            )
        }else{
            return null;
        }
    }

    _renderBrandingDetails(){
        if(this.state.stagesList.indexOf(this.props.onboardingStage) >= 3){
            return(
                <View style={styles.qrPosContainer}>
                    <Image source={image} resizeMode={'contain'} style={styles.qrPosImage}/>
                    <View style={styles.qrPosContentContainer}>
                        <View  style={styles.qrPosHeaderContainer}>
                            <Text style={styles.qrPosHeader}>DOCUMENTS UPLOADED</Text>
                            <TouchableOpacity
                                delayLongPress={4000}
                                activeOpacity={0.14}
                                disabled ={this.state.buttonText === GENERATE_OTP } 
                                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}                                
                                onPress={() => {goToPage('EditImages')}}
                            >
                                <Icon ios='md-create' android="md-create" style={ this.state.buttonText === GENERATE_OTP ? styles.editIconDisabled : styles.editIcon}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.brandContainer}>
                            <Image source={this.props.uploadedStates.BRAND_IMAGE ? tick : errorTick} resizeMode={'contain'} style={styles.tickImage} />
                            <Text style={styles.brandText}>Branding</Text>
                        </View>
                        <View style={styles.brandContainer}>
                            <Image source={this.props.uploadedStates.QR_CODE ? tick : errorTick} resizeMode={'contain'} style={styles.tickImage} />
                            <Text style={styles.brandText}>QR Code</Text>
                        </View>
                        {/*<View style={styles.brandContainer}>*/}
                            {/*<Image source={this.props.uploadedStates.ID_PROOF ? tick : errorTick} resizeMode={'contain'} style={styles.tickImage} />*/}
                            {/*<Text style={styles.brandText}>ID Proof</Text>*/}
                        {/*</View>*/}
                        {/*<View style={[styles.brandContainer, {marginBottom: 0}]}>*/}
                            {/*<Image source={this.props.uploadedStates.BUSINESS_DOCUMENT ? tick : errorTick} resizeMode={'contain'} style={styles.tickImage} />*/}
                            {/*<Text style={styles.brandText}>Business Proof</Text>*/}
                        {/*</View>*/}
                    </View>
                </View>
            )
        }else{
            return null;
        }
    }

    _renderDetails(){
        const check = (this.state.count === 1 || this.props.openOTP || this.props.openSMS || this.props.openSessionExpired ||  this.props.ajaxStatus.state !== 'inprogress');
        if(check){
            return (
                <React.Fragment>
                    <ScrollView 
                        style={styles.container}
                        ref={(e) => { this.fScroll = e }}
                        keyboardShouldPersistTaps={"always"} 
                        contentContainerStyle={styles.contentContainer}
                        onContentSizeChange={(contentWidth, contentHeight)=>{        
                            this.fScroll.scrollToEnd({animated: true})
                        }}
                    >
                        <MerchantDetails
                            otpStatus={this.state.buttonText}
                            editable={this.state.stagesList.indexOf(this.props.onboardingStage) <= 2 }
                        />
                        <AddressDetails
                            otpStatus={this.state.buttonText}
                            editable={this.state.stagesList.indexOf(this.props.onboardingStage) <= 2 }
                        />
                        <BankDetails
                            otpStatus={this.state.buttonText}
                            editable={this.state.stagesList.indexOf(this.props.onboardingStage) <= 2 }
                        />
                        {this._renderQRCodeDetails()}
                        {this._renderBrandingDetails()}
                    </ScrollView>
                    <Button
                        submit={this.submit}
                        buttonDisabled={false}
                        loading={this.state.loading|| (this.state.buttonText === GENERATE_OTP && !this.props.openOTP &&  !this.props.openSMS && !this.props.openSessionExpired  && this.props.ajaxStatus.state === 'inprogress')}
                        complete={this.state.buttonText === BUTTON_TEXT.QR_DOC_ADDED}
                    >
                        {this.state.buttonText}
                    </Button>
                    {this.props.openOTP && !this.props.openSessionExpired &&
                        <OTPVerification onSuccess={this.otpVerified}/>
                    }
                    {this.props.openAlert &&
                    <AlertModal
                        button2Text={"EXIT"}
                        button1Text={"CANCEL"}
                        text={CLOSE_BUTTON_REVIEW_DETAIL.TEXT}
                        header={CLOSE_BUTTON_REVIEW_DETAIL.HEADER}
                        displayCloseButton={false}
                        button1Function={this.props.closeAlertModal}
                        button2Function={()=>{
                            this.props.closeAlertModal();
                            this.props.resetInitValue(false);
                            goToPage('MerchantList')
                        }}
                    />
                    }
                    {/* {this.props.openSMS &&
                        <SMSLinking 
                            onSuccess={() => {
                                this.props.closeSMSModal();
                                goToPage('LinkingBank');
                            }}
                        />
                    } */}
                </React.Fragment>
            )
        }else{
            return <Spinner color={PRIMARY_COLOR} />
        }
    }

    render(){
        return (
            <Container style={[commonStyles.contentBackground, {backgroundColor: this.state.count === 1 || this.props.ajaxStatus.state !== 'inprogress' ? BACKGROUND_COLOR : BACKGROUND_WHITE_COLOR, flexGrow: 1}]}>
                <Header main="no" headerName="Review Details"  goBack={this.goBackHandler} close={this.goBackHandler}
                    timerStart={this.props.timerStart}
                />
                {/*{this.props.timerStart && <Timer/>}*/}
                {this._renderDetails()}
                {this.props.openGPS &&<GPSError enableLocation={this.props.enableLocation}/>}
                {this.props.openCamera && 
                    <CameraModal 
                        type={'QR_POS'}
                        lat={this.props.lat}
                        long={this.props.long}
                        pageType={'ReviewDetails'}
                        addNewQRPOS={this.addNewQRPOS}
                    />
                }
            </Container>
        );
    } 
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        lat: state.location.lat,
        pageType: state.pageType,
        long: state.location.long,
        ajaxStatus: state.ajaxStatus,
        openOTP: state.modal.openOTP,
        openSMS: state.modal.openSMS,
        openGPS: state.modal.openGPS,
        openAlert:  state.modal.openAlert,
        openCamera: state.modal.openCamera,
        timeOut: state.timerDetails.timeOut,
        timerStart : state.timerDetails.timerStart,
        qrCode: state.currentMerchantDeviceDetails.qrCode,
        openSessionExpired: state.modal.openSessionExpired,
        merchantId: state.currentMerchantDetails.merchantId,
        openAddNotification: state.modal.openAddNotification,
        bankDetails: state.currentMerchantDetails.bankDetails,
        uploadedStates: state.currentMerchantDetails.uploadedStates,
        onboardingStage: state.currentMerchantDetails.onboardingStage,
        phoneNumber: state.currentMerchantDetails.merchantDetails.phoneNumber
	}; 
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = { 
    sendOTP, 
    startTimer, 
    addNewQRPOS,
    openSMSModal,
    closeAllModal,
    closeSMSModal,
    enableLocation,
    resetInitValue,
    updatePageType,
    openCameraModal,
    activateMerchant,
    startSuccessTimer,
    getMerchantDetails,
    closeAlertModal,
    openAlertModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewDetails);

const styles = StyleSheet.create({
    container:{
        flex:1, 
        flexGrow: 10,
        backgroundColor: BACKGROUND_COLOR
    },
    contentContainer:{
        display: 'flex',
        paddingBottom: 63,
    },
    editIcon:{
        fontSize: 17.6,
        paddingLeft: 5,
        color: EDIT_ICON_COLOR
    },
    editIconDisabled:{
        fontSize: 17.6,
        paddingLeft: 5,
        color: BACKGROUND_WHITE_COLOR
    },
    qrPosContainer:{
        marginTop: 8,
        paddingTop: 21,
        paddingBottom: 17,
        paddingHorizontal:17,
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: responsiveWidth(100),
        justifyContent: 'flex-start',
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    qrPosImage:{
        width: 20,
        height: 20
    },
    tickImage:{
        width: 12,
        height: 12
    },
    brandText:{
        fontSize: 14,
        marginLeft: 17,
        lineHeight: 22.7,
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    brandContainer:{
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    qrPosContentContainer:{
        display: 'flex',
        marginLeft: 16,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    qrPosHeaderContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: responsiveWidth(83),
        justifyContent: 'space-between'
    },
    qrPosHeader:{
        fontSize: 10,
        marginBottom: 10,
        color: LABEL_COLOR,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY
    },
    qrPosText:{
        fontSize: 14,
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    }
});