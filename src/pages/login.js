/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import Permissions from 'react-native-permissions';
import SplashScreen from 'react-native-splash-screen';
import SmsListener from 'react-native-android-sms-listener'
import BackgroundTimer from 'react-native-background-timer';
import { Container, Content, Icon, Label, Spinner } from 'native-base';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Alert, BackHandler, Image, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
/* Component Import */
import GPSError from '../components/gpsError';
/* Action Imports */
import { enableLocation } from '../redux/action/locationAction';
import { getAppVersion } from '../redux/action/appUpdateAction';
import { appLogin, getInitialToken, requestOTP } from '../redux/action/loginAction';
/* Constant Import  */
import { LOGIN_BUTTON, MOBILE_REGEX, OTP_REGEX, LOGIN_TIMEOUT } from '../shared/constants';
import { BACKGROUND_WHITE_COLOR, SPINNER_BUTTON_COLOR, BOLD_FONT, BUTTON_COMPLETE_PRESS_COLOR, BACKGROUND_COLOR_GREY, BORDER_COLOR, BUTTON_DISABLED_COLOR, BUTTON_PRESS_COLOR, BUTTON_TEXT_COLOR, CLEAR_ICON_COLOR, ERROR_COLOR, FONT_FAMILY, MEDIUM_FONT, PRIMARY_COLOR, REGULAR_FONT, STATUS_BAR_COLOR, TEXT_COLOR, TEXT_COLOR_DISABLED, TEXT_COLOR_ERROR, WARM_GREY_COLOR } from '../shared/colors';
/* Logo Import */
import acelogo from '../assets/ace_logo.png';
import greyBackArrow from '../assets/grey_back_arrow.png';

class Login extends React.PureComponent {
	constructor(props){
        super(props);
        this.ref = [];
        this.state = {
            phoneNumber: "",
            otp: ['','','','',''],
            otpToken: '',
            otpText: 'Waiting for OTP...',
            focus: [false, false, false, false, false],
            error: {
                phoneNumber: '',
                apiError: ''
            },
            time: '01.00',
            timeOut: LOGIN_TIMEOUT,
            step: 0,
            loading: false,
            appUpdate: false,
            otpDetected: false,
            phoneNumberFocus: false,
            buttonDisabled: true
        }
        this.timer = null;
        this.button = null;
        this.smsSubscription = null;
        this.login = this.login.bind(this);
        this.sendOTP = this.sendOTP.bind(this);
        this.resetLogin = this.resetLogin.bind(this);
        this._renderOTP = this._renderOTP.bind(this);
        this.smsListener = this.smsListener.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this._renderHeader =this._renderHeader.bind(this);
        this.goBackHandler = this.goBackHandler.bind(this);
        this.checkAppUpdate = this.checkAppUpdate.bind(this);
        this.timerCountDown = this.timerCountDown.bind(this);
        this.handleKeyEvent = this.handleKeyEvent.bind(this);
        this.handleOTPChange = this.handleOTPChange.bind(this);
        this._renderPhoneNumber = this._renderPhoneNumber.bind(this);
        this.handleOTPValidation = this.handleOTPValidation.bind(this);
        this._renderTimeOutSection = this._renderTimeOutSection.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
        this.checkLocationPermission = this.checkLocationPermission.bind(this);
        this._requestCameraPermission = this._requestCameraPermission.bind(this);
        this._requestLocationPermission = this._requestLocationPermission.bind(this);
        this.handlePhoneNumberValidation = this.handlePhoneNumberValidation.bind(this);
    }

    componentDidMount(){
        SplashScreen.hide();
        this.props.enableLocation();
        this._requestLocationPermission();
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
    }

    smsListener(){
        this.smsSubscription = SmsListener.addListener(message => {
            let otp = message.body.match(OTP_REGEX);
            if(otp && otp.length === 2 && otp[1]){
                this.setState({otp: otp[1].split(''), otpText: 'OTP Detected', otpDetected: true, loading: false, buttonDisabled: false, focus:[true, true, true, true, true]}, () => {
                    setTimeout(() => {
                        this.login();
                    }, 500); 
                });    
            }
        });
    }

    componentWillUnmount(){
        this.smsSubscription && this.smsSubscription.remove();
        this.timer && BackgroundTimer.clearInterval(this.timer);
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
    }
    
    goBackHandler(){
        if(this.state.timeOut === 0 && this.state.step === 1){
            this.resetLogin();
        }else if(this.state.step === 0){
            BackHandler.exitApp();
        }
        return true;    
    }
    
    login(){
        let { error } = this.state;
        if(this.handleOTPValidation() || this.state.appUpdate){
            return;
        }
        error['apiError'] = '';
        this.setState({loading: true, error});
        
        let login = {
            phoneNumber: this.state.phoneNumber,
            otp: this.state.otp.join(''),
            token: this.state.otpToken
        };

        this.props.appLogin.call(this, login);
    }

    sendOTP(){
        if(this.handlePhoneNumberValidation()){
            return;
        }
        this.setState({loading: true});

        let login = {
            phoneNumber: this.state.phoneNumber
        };

        this.props.requestOTP.call(this, login);
    }

    checkAppUpdate(){
        this.props.getAppVersion.call(this);    
    }

    /** 
     * Gets fired when the location permission is not authorized and prompt for 
     * enabling location permission
     */
    checkLocationPermission() {
        Permissions.check('location').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            if(response !== 'authorized'){
                Alert.alert(
                    'Location Read Permission',
                    'Please allow access to read location to proceed further.',
                    [
                        { text: 'OK', onPress: () => {this._requestLocationPermission()}}
                    ],
                    { cancelable: false }
                )
            }
        });
    }

    /** 
     * Gets fired when the camera permission is not authorized and prompt for 
     * enabling camera permission
     */
    checkCameraPermission() {
        Permissions.check('camera').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            if(response !== 'authorized'){
                Alert.alert(
                    'Camera Access',
                    'Please allow access to camera to proceed further.',
                    [
                        { text: 'OK', onPress: () => {this._requestCameraPermission()}}
                    ],
                    { cancelable: false }
                )
            }
        });
    }

    /** 
     * Gets fired on every app start and check whether camera is permission
     * is authorized or not. If not authroized prompt for 
     * enabling camera permission
     */
    _requestCameraPermission() {
        Permissions.request('camera').then(response => {
            if(response !== 'authorized'){
                this.checkCameraPermission();
            }
            if(response === 'authorized'){
                this._requestRecieveSMSPermission();
            }
        });
    }

    /** 
     * Gets fired when the camera permission is not authorized and prompt for 
     * enabling receive sms permission
     */
    checkReceiveSMSPermission() {
        Permissions.check('receiveSms').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            if(response !== 'authorized'){
                Alert.alert(
                    'Receive SMS Access',
                    'Please allow access to recieve sms to proceed further.',
                    [
                        { text: 'OK', onPress: () => {this._requestRecieveSMSPermission()}}
                    ],
                    { cancelable: false }
                )
            }
        });
    }

    /** 
     * Gets fired on every app start and check whether receive sms is permission
     * is authorized or not. If not authroized prompt for 
     * enabling camera permission
     */
    _requestRecieveSMSPermission() {
        Permissions.request('receiveSms').then(response => {
            if(response !== 'authorized'){
                this.checkReceiveSMSPermission();
            }else if(response === 'authorized') {
                this._requestReadSMSPermission();
            }
        });
    }

    /** 
     * Gets fired when the camera permission is not authorized and prompt for 
     * enabling receive sms permission
     */
    checkReadSMSPermission() {
        Permissions.check('readSms').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            if(response !== 'authorized'){
                Alert.alert(
                    'Read SMS Access',
                    'Please allow access to read sms to proceed further.',
                    [
                        { text: 'OK', onPress: () => {this._requestReadSMSPermission()}}
                    ],
                    { cancelable: false }
                )
            }
        });
    }

    /** 
     * Gets fired on every app start and check whether read sms is permission
     * is authorized or not. If not authroized prompt for 
     * enabling camera permission
     */
    _requestReadSMSPermission() {
        Permissions.request('readSms').then(response => {
            if(response !== 'authorized'){
                this.checkReadSMSPermission();
            }
        });
    }

    /** 
     * Gets fired on every app start and check whether location is permission
     * is authorized or not. If authroized get location data or prompt for 
     * enabling location permission
     */
    _requestLocationPermission() {
        Permissions.request('location').then(response => {
            if(response == 'authorized'){
                this._requestCameraPermission();
            }else{
                this.checkLocationPermission();
            }
        });
    }

    
    handlePhoneNumberChange(value){
        value = value.replace(/[^\d]/gi,'');
        this.setState({phoneNumber: value, error: {
            phoneNumber: '',
            apiError: ''
        }},() => {
            if(MOBILE_REGEX.test(value)){  
                this.handlePhoneNumberValidation();
            }
        });
    }

    handlePhoneNumberValidation(){
        let { phoneNumber , error, buttonDisabled } = this.state;
        if(!MOBILE_REGEX.test(phoneNumber)){  
            error['phoneNumber']='Enter a valid phone number';
            buttonDisabled = true;
        }else{
            error['phoneNumber']='';
            buttonDisabled = false;
        }
        this.setState({error, buttonDisabled});
        return buttonDisabled;
    }

     /** Gets fired on every input in the otp field
	 * 	Updates the value entered by user in state object otp 
     *  based on the id and focus the next field
     *	@param {String} value
     *  @param {Number} id
	 */
    handleOTPChange(value, id){    
        this.smsSubscription && this.smsSubscription.remove();
        this.smsSubscription = null;
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
        this.setState({otp: [...otp], otpText: 'Enter OTP',loading: false},() => {
            this.handleOTPValidation();
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
                this.handleOTPValidation();
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
        this.setState({focus});
    }

    /** Gets fired on every state change
	 * 	Updates the button state based on otp validation
     */
    handleOTPValidation(){
        let { otp, otpToken } = this.state;
        if(otp.join('').length === 5 && otpToken){
            this.setState({buttonDisabled: false});
            return false;
        }else{
            this.setState({buttonDisabled: true});
            return true;
        }
    }

    /** 
     *  Update the timer count down for each second and 
	 *  open the session expired modal once the timer is timed out
     */
	timerCountDown(){
		this.timer = BackgroundTimer.setInterval(() => {
            let timeOut = this.state.timeOut;
            if(timeOut > 0){
                let minute = parseInt((timeOut) / 60);
                let second = parseInt((timeOut)% 60);
                if(second < 10){
                    second = '0' + second;
                }      
                if(minute < 10){
                    minute = '0' + minute;
                }
				this.setState({timeOut: timeOut - 1, time: minute + ':' + second});
			}else{
				BackgroundTimer.clearInterval(this.timer);   
				this.setState({ timeOut: 0, time: '00:00'});
            }
		}, 1000);
    }

    resetLogin(error = ''){
        this.setState({ 
            timeOut: LOGIN_TIMEOUT, 
            time: '05:00', 
            step: 0, 
            buttonDisabled: false,
            loading: false, 
            otp: ["","","","",""],
            otpToken: '',
            focus: [false, false, false, false, false],
            error: {
                phoneNumber: '',
                apiError: error
            },
            appUpdate: false,
            otpDetected: false
        });
        BackgroundTimer.clearInterval(this.timer);
    }

    _renderOTP(){
        const otpError = this.state.error.apiError;
        return(
            <React.Fragment>
                <Label style={this.state.focus.indexOf(true) >= 0 ? [styles.label, styles.labelFocus] : styles.label}>
                {this.state.otpText}
                </Label>
                <View style={styles.inputContainer}>
                    <TextInput
                        maxLength={1}
                        editable={!this.state.appUpdate}
                        keyboardType={"numeric"}
                        value={this.state.otp[0]}
                        ref={c => {this.ref[0] = c}} 
                        selectionColor={PRIMARY_COLOR}
                        onFocus={() => {this.handleFocus(0)}}
                        underlineColorAndroid={"transparent"}
                        onKeyPress={event => this.handleKeyEvent(event, 0)} 
                        onChangeText={(value) => {this.handleOTPChange(value, 0)}}
                        style={ otpError.length > 0? [styles.input, styles.errorInput] : this.state.focus[0] ? [styles.input, styles.inputFocus] :styles.input} 
                    />
                    <TextInput
                        maxLength={1}
                        editable={!this.state.appUpdate}
                        keyboardType={"numeric"}
                        value={this.state.otp[1]}
                        ref={c => {this.ref[1] = c}}
                        selectionColor={PRIMARY_COLOR} 
                        onFocus={() => {this.handleFocus(1)}}
                        underlineColorAndroid={"transparent"}
                        onKeyPress={event => this.handleKeyEvent(event, 1)}
                        onChangeText={(value) => {this.handleOTPChange(value, 1)}} 
                        style={ otpError.length > 0? [styles.input, styles.errorInput] : this.state.focus[1] ? [styles.input, styles.inputFocus] :styles.input} 
                    />
                    <TextInput
                        maxLength={1}
                        editable={!this.state.appUpdate}
                        keyboardType={"numeric"}
                        value={this.state.otp[2]}
                        ref={c => {this.ref[2] = c}} 
                        selectionColor={PRIMARY_COLOR}
                        onFocus={() => {this.handleFocus(2)}}
                        underlineColorAndroid={"transparent"}
                        onKeyPress={event => this.handleKeyEvent(event, 2)}
                        onChangeText={(value) => {this.handleOTPChange(value, 2)}} 
                        style={ otpError.length > 0 ? [styles.input, styles.errorInput] : this.state.focus[2] ? [styles.input, styles.inputFocus] :styles.input} 
                    />
                    <TextInput
                        maxLength={1}
                        editable={!this.state.appUpdate}
                        keyboardType={"numeric"}
                        value={this.state.otp[3]}
                        ref={c => {this.ref[3] = c}} 
                        selectionColor={PRIMARY_COLOR}
                        onFocus={() => {this.handleFocus(3)}}
                        underlineColorAndroid={"transparent"}
                        onKeyPress={event => this.handleKeyEvent(event, 3)}
                        onChangeText={(value) => {this.handleOTPChange(value, 3)}} 
                        style={ otpError.length > 0 ? [styles.input, styles.errorInput] : this.state.focus[3] ? [styles.input, styles.inputFocus] :styles.input} 
                    />
                    <TextInput
                        maxLength={1}
                        editable={!this.state.appUpdate}
                        returnKeyType={"done"}
                        keyboardType={"numeric"}
                        value={this.state.otp[4]}
                        ref={c => {this.ref[4] = c}} 
                        onSubmitEditing={this.login}
                        selectionColor={PRIMARY_COLOR}
                        onFocus={() => {this.handleFocus(4)}}
                        underlineColorAndroid={"transparent"}
                        onKeyPress={event => this.handleKeyEvent(event, 4)}
                        onChangeText={(value) => {this.handleOTPChange(value, 4)}} 
                        style={ otpError.length > 0 ? [styles.input, styles.errorInput] : this.state.focus[4] ? [styles.input, styles.inputFocus] :styles.input} 
                    />
                </View>
                {otpError
                    ? <Text style={styles.error}>{otpError}</Text>
                    : null
                }
                <View style={styles.buttonContainer}>
                    {this.state.loading 
                        ? <Spinner color={SPINNER_BUTTON_COLOR}/>
                        :
                            <TouchableHighlight
                                delayLongPress={4000} 
                                ref={c => {this.button = c}}
                                underlayColor={this.state.otpDetected ? BUTTON_COMPLETE_PRESS_COLOR : BUTTON_PRESS_COLOR}
                                disabled={this.state.buttonDisabled || this.state.appUpdate}
                                style={this.state.buttonDisabled ? [ styles.button, styles.buttonDisabled ] : this.state.otpDetected ? [styles.button, {backgroundColor: '#4caf50'}]:styles.button}
                                onPress={this.login}
                            >
                                {this.state.otpDetected
                                    ?  <Icon ios='md-checkmark' android="md-checkmark" style={styles.successIcon}/>
                                    :   <Text style={styles.buttonText}>{LOGIN_BUTTON}</Text>
                                }
                            </TouchableHighlight>
                }
                </View>
            </React.Fragment>
        )
    }

    _renderPhoneNumber(){
        return(
            <React.Fragment>
                <Label style={this.state.phoneNumberFocus ? [styles.label, styles.labelFocus] : this.state.error['phoneNumber'] !== '' ? [styles.label, styles.labelError] : styles.label}>Enter Phone Number</Label>
                <TextInput 
                    maxLength={10}
                    keyboardType="numeric"
                    selectionColor={PRIMARY_COLOR}
                    value={this.state.phoneNumber}
                    underlineColorAndroid="transparent" 
                    onSubmitEditing={this.sendOTP}
                    onBlur={() => {
                        this.handlePhoneNumberValidation();
                        this.setState({phoneNumberFocus: false})
                    }}
                    onChangeText={this.handlePhoneNumberChange} 
                    onFocus={() => {this.setState({phoneNumberFocus: true})}}
                    style={this.state.error.apiError.length > 0|| this.state.error.phoneNumber.length > 0 ?  [styles.inputNumber, styles.inputNumberError] : this.state.phoneNumberFocus ? [styles.inputNumber, styles.inputNumberFocus]: styles.inputNumber} 
                /> 
                {this.state.error.phoneNumber.length > 0 && <Text style={styles.error}>{this.state.error.phoneNumber}</Text>}
                {this.state.error.apiError.length > 0  && <Text style={styles.error}>{this.state.error.apiError}</Text>}
                <View style={styles.buttonContainer}>
                    {this.state.loading 
                        ? <Spinner color={SPINNER_BUTTON_COLOR}/>
                        :
                            <TouchableHighlight
                                delayLongPress={4000} 
                                underlayColor={BUTTON_PRESS_COLOR}
                                disabled={this.state.buttonDisabled}
                                style={this.state.buttonDisabled ? [ styles.button, styles.buttonDisabled ] : styles.button}
                                onPress={this.sendOTP}
                            >
                                <Text style={styles.buttonText}>{LOGIN_BUTTON}</Text>
                            </TouchableHighlight>
                    }
                </View>
                
            </React.Fragment>
        )
    }

    _renderTimeOutSection(){
        return(
            <View>
                <View style={styles.timeOutContainer}>
                    <Text style={styles.timeOutHeader}>Time out</Text>
                    <Text style={styles.timeOutText}>You need to sign in again</Text>
                    <Text style={styles.timeOutText1}>Redirecting you back to the sign in page</Text>
                </View>
                <TouchableHighlight
                    delayLongPress={4000} 
                    underlayColor={BUTTON_PRESS_COLOR}
                    style={styles.timeOutButton}
                    onPress={this.resetLogin}
                >
                    <Text style={styles.timeOutButtonText}>GOT IT</Text>
                </TouchableHighlight>
            </View>
        )
    }

    _renderHeader(){
        if(this.state.step === 0){
            return(
                <React.Fragment>
                    <Text style={styles.loginHeader}>Sign in</Text>
                    <Text style={styles.loginText}>to PhonePe Ace</Text>
                </React.Fragment>
            )
        }else{
            return(
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                    <TouchableOpacity 
                        disabled={this.state.timeOut > 0}
                        delayLongPress={4000} 
                        activeOpacity={0.14} 
                        style={{marginRight: 12}} 
                        hitSlop={{left: 10, right: 10}} 
                        onPress={this.resetLogin}
                    >
                        <Image source={greyBackArrow} style={{width: 16, height: 16}} resizeMode={'contain'}/>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.loginHeader}>Welcome</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                            <Icon ios="md-contact" android="md-contact"  style={{fontSize: 25, color: PRIMARY_COLOR}} />
                            <Text style={styles.phoneNumberText}>{this.state.phoneNumber}</Text>
                            <TouchableOpacity  disabled={true} delayLongPress={4000} activeOpacity={0.14} style={{marginLeft: 167}} onPress={this.resetLogin}>
                                <Icon ios="ios-arrow-down"  android="ios-arrow-down" style={{fontSize: 12, color: 'white'}}/>
                            </TouchableOpacity>
                        </View>
                        </View>
                </View>
            )
        }
    }

    render() {
		return (
			<Container style={styles.contentBackgroundColor}>
				<StatusBar
                    backgroundColor={STATUS_BAR_COLOR}
                    barStyle="light-content"
                />
                <Content>
                    <View style={styles.contentBackground}>
                        <Image source={acelogo} resizeMode={'contain'} style={styles.logo}/>
                        {this._renderHeader()}
                    </View>
                    <View style={[styles.contentBackground, {marginTop: 50, paddingTop: 0}]}>
                        {this.state.step === 0 
                            ? this._renderPhoneNumber()
                            : this._renderOTP()
                        }
                    </View>
                    
                    {this.state.step === 1 && 
                        <View>
                            <View style={styles.resendContainer}>
                                <TouchableOpacity
                                    disabled={this.state.timeOut > 0}
                                    delayLongPress={4000} 
                                    activeOpacity={0.14}
                                    onPress={this.sendOTP}    
                                >
                                    <Text style={this.state.timeOut === 0 ?  styles.resendActive : [styles.resendActive, styles.resendDisabled]}>RESEND OTP</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.timerContainer}>
                                <Text style={styles.timeRemText}>Time remaining: </Text>
                                <Text 
                                    style={this.state.timeOut < 20 ? 
                                        [styles.timeRemText, styles.timeRemErrorText] : 
                                        [styles.timeRemText, styles.timeRemValidText]
                                    }
                                >   
                                    {this.state.time}
                                </Text>
                            </View>
                        </View>
                    }
                </Content>
                {/* {this.state.timeOut === 0 && this._renderTimeOutSection()} */}
                {this.props.openGPS && <GPSError enableLocation={this.props.enableLocation}/>}
			</Container>
		);
	}
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        ajaxStatus: state.ajaxStatus,
        appVersion: state.appVersion,
        openGPS: state.modal.openGPS
    };
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = {
    appLogin, 
    requestOTP,
    getAppVersion,  
    enableLocation,
    getInitialToken
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
    buttonContainer:{
        width: responsiveWidth(85), 
        height: 44,
        borderRadius: 2,
        marginTop: 40,
        display:'flex', 
        alignItems: 'center', 
        flexDirection: 'row',
        justifyContent: 'center', 
        backgroundColor: BUTTON_PRESS_COLOR
    },
    button: {
        width: responsiveWidth(85),
        height: 44,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PRIMARY_COLOR
    },
    buttonDisabled:{
        borderRadius: 2,
        backgroundColor: BUTTON_DISABLED_COLOR
    },
    buttonText:{
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT,
        color: BUTTON_TEXT_COLOR       
    },
    contentBackground:{
        backgroundColor: BACKGROUND_WHITE_COLOR,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: responsiveWidth(10),
        paddingTop: 39
    },
    contentBackgroundColor:{
        flex:1,
        backgroundColor: BACKGROUND_WHITE_COLOR,
    },
    logo:{
        width: 44,
        height: 65, 
    },
    loginHeader:{
        marginTop: 20,
        fontSize: 20,
        fontWeight: BOLD_FONT,
        fontFamily: FONT_FAMILY,
        color: TEXT_COLOR
    },
    loginText:{
        marginTop: responsiveHeight(1),
        fontSize: 16,
        fontWeight: REGULAR_FONT,
        fontFamily: FONT_FAMILY,
        color: TEXT_COLOR
    },
    inputNumber:{
        width: responsiveWidth(85),
        height: 40,
        fontSize: 16,
        marginTop: 7.7,
        borderWidth: 1,
        paddingLeft: 16,
        borderRadius: 2,
        color: TEXT_COLOR,
        paddingVertical: 11,
        fontWeight: REGULAR_FONT,
        fontFamily: FONT_FAMILY,
        borderColor: BORDER_COLOR
    },
    inputNumberFocus:{
        borderWidth: 1,
        borderColor: PRIMARY_COLOR
    },
    inputNumberError:{
        borderWidth: 1,
        borderColor: ERROR_COLOR
    },
    label:{
        fontSize: 14,
        fontWeight: REGULAR_FONT,
        fontFamily: FONT_FAMILY,
        color: TEXT_COLOR_DISABLED
    },
    labelFocus: {
        color: PRIMARY_COLOR
    },
    labelError: {
        color: TEXT_COLOR_ERROR
    },
    error:{
        marginTop: 8,
        fontSize: 14,
        flexWrap: 'wrap',
        textAlign: 'left',
        color: ERROR_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    input:{
        width: 40,
        height: 40,
        padding: 0,
        fontSize: 18,
        borderWidth: 1,
        color: TEXT_COLOR,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT,
        margin: responsiveWidth(1),
        borderColor: WARM_GREY_COLOR,
        marginLeft: responsiveWidth(2)
    },
    inputFocus:{
        borderColor: PRIMARY_COLOR
    },
    errorInput:{
        borderColor: ERROR_COLOR
    },
    inputContainer:{
        width: responsiveWidth(85),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: responsiveWidth(-1),
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(0.5)
    },
    phoneNumberText:{
        fontSize: 16,
        marginLeft: 7,
        lineHeight: 27,
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    headerContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: responsiveWidth(80),
        justifyContent: 'space-between'
    },
    resendContainer:{
        marginTop: 24,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(100)
    },
    timerContainer:{
        marginTop: 40,
        marginBottom: 21,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(100)
    },
    timeOutContainer:{
        height: 157,
        paddingTop: 35,
        paddingBottom: 48.2,
        paddingHorizontal: 40,
        backgroundColor: BACKGROUND_COLOR_GREY,
        width: responsiveWidth(100)
    },
    timeOutHeader:{
        fontSize: 20,
        color: TEXT_COLOR,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY
    },
    timeOutText:{
        marginTop: 16,
        fontWeight: MEDIUM_FONT,
        fontSize: 12,
        color: TEXT_COLOR
    },
    timeOutText1:{
        marginTop: 9,
        fontWeight: REGULAR_FONT,
        fontSize: 12,
        color: '#616161'
    },
    timeOutButton:{
        height: 56,
        elevation: 2,
        borderTopWidth: 4,
        alignContent: 'center',
        justifyContent: 'center',
        width: responsiveWidth(100),
        borderTopColor: 'rgba(0,0,0,0.03)',
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    timeOutButtonText:{
        fontSize: 14,
        textAlign: 'center',
        color: PRIMARY_COLOR,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY
    },
    timeRemText:{
        color: WARM_GREY_COLOR,
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    timeRemErrorText:{
        color: ERROR_COLOR,
        fontWeight: MEDIUM_FONT
    },
    timeRemValidText:{
        color: '#02c979',
        fontWeight: MEDIUM_FONT
    },
    successIcon:{
        fontSize: 20,
        color: 'white'
    },
    resendActive:{
        fontSize: 14,
        textAlign: 'center',
        color: PRIMARY_COLOR,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY,
    },
    resendDisabled:{
        color: BUTTON_DISABLED_COLOR
    }
})
