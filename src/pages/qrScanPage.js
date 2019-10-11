/* Library Imports */
import { connect } from 'react-redux';
import React, { Component } from "react";
import { Container, Spinner } from 'native-base';
import Geolocation from 'react-native-geolocation-service';
import { StatusBar, ToastAndroid, BackHandler, AppState } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';


/* Component Imports */
import Timer from '../components/timer';
import Header from '../components/header';
import GPSError from '../components/gpsError';
import { QRScannerView } from '../components/qrScanner';
import { goToPage } from '../components/common/logout';

/* Custom Action Import */
import { resetInitValue } from '../redux/action/timerAction';
import { addToQRPOS, addNewQRPOS } from '../redux/action/notificationAction';
import { loadCurrentMerchantOnboardingStage } from '../redux/action/currentMerchantAction';
import {
    closeAllModal,
    openGPSModal,
    closeGPSModal
} from '../redux/action/modalAction';
/* Constants Import */ 
import { 
    POS, 
    QRCODE, 
    QRCODE_REGEX,
    BARCODE_TYPES,
    INVALID_QRCODE
} from '../shared/constants';

/* Style Imports */
import commonStyles from '../style/style';
import {getFetchHeaders} from "../redux/action/fetchHeaderAction";

class QRScanPage extends Component {
	constructor(props){
        super(props);
        this.state = {
            lat: '',
            long: '',
            appState: AppState.currentState,
            toastTimeOut: 0,
            apiFetching: false,
            hideCamera: true
        }
        this.timer = null;
        this.scanResult = this.scanResult.bind(this);
        this.addNewQRPOS = this.addNewQRPOS.bind(this);
        this.toastTimeOut = this.toastTimeOut.bind(this);
        this.goBackHandler = this.goBackHandler.bind(this);
        this.processResult = this.processResult.bind(this);
        this.enableLocation = this.enableLocation.bind(this);
        this.getLocationData = this.getLocationData.bind(this);
        this._handleAppStateChange = this._handleAppStateChange.bind(this);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
        AppState.addEventListener('change', this._handleAppStateChange);
        this.enableLocation();
        this.setState({apiFetching: false});
    }

    
    componentWillUnmount(){
        AppState.removeEventListener('change', this._handleAppStateChange);
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
    }

    _handleAppStateChange(nextAppState){
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.setState({appState: nextAppState, hideCamera: false});
        }else if(nextAppState.match(/inactive|background/)){
            this.setState({appState: nextAppState, hideCamera: true});
        }
    }

    goBackHandler(){
        if(this.state.toastTimeOut){
            clearInterval(this.timer); 
            this.setState({toastTimeOut: 0});
        }
        this.setState({apiFetching: true},() => {
            // this.props.resetInitValue(false);
            return goToPage(this.props.navigation, 'ReviewDetails');
        });
    }

    getLocationData() {
        Geolocation.getCurrentPosition((position) => {
            this.setState({lat: position.coords.latitude, long:position.coords.longitude, hideCamera: false});
        },(error) => {
            ToastAndroid.show('Error fetching location details, retrying again...', ToastAndroid.SHORT);
            if(error.message.code == 3){
                this.getLocationData();
            }else{
                this.enableLocation();  
            } 
        },{enableHighAccuracy: true, timeout: 10000, maximumAge: 10000});     
    }

    enableLocation(){
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
        .then(data => {
            if(data === "enabled" || data === "already-enabled"){
                this.props.closeGPSModal();    
                this.getLocationData();
                ToastAndroid.show('Fetching location details', ToastAndroid.SHORT);
            }
        }).catch(err => {
            if(err.code){
                this.props.openGPSModal();
            }
        });   
    }

    /** 
     *  Fired on scanning of the QRCODE or POS
     */
    scanResult(data){
        if(!this.state || (!this.state.lat && !this.state.long)){
            this.getLocationData();
            return;
        }

        if(this.props.timerDetails.timeOut !== 0){
            if(data.type === QRCODE){
                let qrCode  = this.props.qrCode;
                if(data.data){
                    let qr = data.data.match(QRCODE_REGEX);
                    if(qr && qr.length > 0){
                        this.addNewQRPOS(QRCODE, qr[1], qrCode);
                    }else{
                        if(this.state.toastTimeOut === 0){
                            this.setState({toastTimeOut: 4}, () => {this.toastTimeOut()}) 
                            ToastAndroid.show(INVALID_QRCODE, ToastAndroid.SHORT)
                        } 
                    }
                }
            }else if(BARCODE_TYPES.indexOf(data.type) > -1 ){
                let posDevice  = this.props.posDevice;
                this.addNewQRPOS(POS, data.data, posDevice);
            }
        }
    }

     /** 
     *  Update the timer count down for each second and 
	 *  once the timer is timed out clear the timer and 
     *  call resend otp
     */
	toastTimeOut(){
        this.timer = setInterval(() => {
            let {toastTimeOut} = this.state;
            if(toastTimeOut > 1){
                this.setState({toastTimeOut: toastTimeOut -1});
            }else{
                clearInterval(this.timer); 
                this.setState({ toastTimeOut: 0});  
            }
        }, 1000);
    }
    
    /*
     * Call the Action to add new QR/POS and on 
     * success do the necessary action
     */
    addNewQRPOS(type, data, item){
        this.setState({hideCamera: true});
        let options = getFetchHeaders();
        
        let requestData = {
            merchantId: this.props.merchantId,
            latitude: this.state.lat,
            longitude: this.state.long
        }
        this.props.addNewQRPOS.call(this, type, data, requestData, options, item);
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

    render() {
		return (
			<Container style={commonStyles.contentBackground}>
                <StatusBar
                    backgroundColor="#6200ea"
                    barStyle="light-content"
                />
                <Header main="no" headerName="Scan QR/POS"  goBack={this.goBackHandler} close={this.goBackHandler}
                    timerStart={this.props.timerDetails.timerStart}
                />  
                {/*<Timer navigation={this.props.navigation} />*/}
                { this.props.ajaxStatus.state === 'inprogress' || this.state.apiFetching || this.state.hideCamera
                    ? <Spinner color="#7C4DFF" />
                    :
                    <QRScannerView
                        hintText={''}
                        rectWidth={300}
                        rectHeight={300}
                        scanBarColor={'#7C4DFF'}
                        maskColor={"rgba(0,0,0,0.4)"}
                        cornerColor={'#7C4DFF'}
                        onScanResultReceived={this.scanResult}
                        renderBottomMenuView={() => {return ;}}
                        renderTopBarView={() => {return;}}
                    />
                }
                {this.props.openGPS && <GPSError enableLocation={this.enableLocation}/>}
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
        devicePrint: state.devicePrint,
        timerDetails : state.timerDetails,
        agentId: state.loginDetails.agentId,
        openGPS: state.modal.openGPS,
        initialToken: state.loginDetails.initialToken,
        qrCode: state.currentMerchantDeviceDetails.qrCode,        
        merchantId: state.currentMerchantDetails.merchantId,
        posDevice: state.currentMerchantDeviceDetails.posDevice,
        phoneNumber : state.currentMerchantDetails.merchantDetails.phoneNumber
	};
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = { 
    addToQRPOS, 
    addNewQRPOS, 
    closeAllModal,
    openGPSModal,
    closeGPSModal,
    resetInitValue,
    loadCurrentMerchantOnboardingStage
};


export default connect(mapStateToProps, mapDispatchToProps)(QRScanPage);