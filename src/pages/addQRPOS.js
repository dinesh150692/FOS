/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import { Container } from 'native-base';
import { BackHandler, ScrollView, StyleSheet } from 'react-native';
/* Component Import */
import Timer from '../components/timer';
import Header from '../components/header';
import GPSError from '../components/gpsError';
import Button from '../components/common/button';
import { goToPage } from '../components/common/logout';
import QRCodeDetails from '../components/qrCodeDetails';
import CameraModal from '../components/common/cameraModal';
/* Custom Action Import */
import { resetInitValue } from '../redux/action/timerAction';
import { updatePageType } from '../redux/action/pageTypeAction';
import { addNewQRPOS } from '../redux/action/notificationAction';
import { enableLocation } from '../redux/action/locationAction';
/* Constant Import */
import { BUTTON_PROCEED, PAGE_NAVIGATION_TYPES } from '../shared/constants';
import { BACKGROUND_WHITE_COLOR, FONT_FAMILY, PRIMARY_COLOR, REGULAR_FONT, UNDERLINE_COLOR, WARM_GREY_COLOR } from '../shared/colors';

 class AddQRPOS extends React.PureComponent {
    constructor(props){
        super(props);
        this.addNewQRPOS = this.addNewQRPOS.bind(this);
        this.goBackHandler = this.goBackHandler.bind(this);
        this.processResult = this.processResult.bind(this);
        this.goToBranding = this.goToBranding.bind(this);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
        this.props.enableLocation();
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
    }

    goToBranding(){
        goToPage('Branding');
        this.props.updatePageType(PAGE_NAVIGATION_TYPES.QR);
    }

    /*
     * Call the Action to add new QR and on 
     * success do the necessary action
     */
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

    goBackHandler(){
        // this.props.resetInitValue(false);
        return goToPage('ReviewDetails');
    }

    render(){
        return(
            <Container>
                <Header main="no" headerName={'Add QR Code'}  goBack={this.goBackHandler} close={this.goBackHandler}
                    timerStart={this.props.timerStart}
                />  
                {/* {this.props.timerStart && <Timer/>} */}
                <ScrollView  
                    ref={(e) => { this.fScroll = e }}
                    keyboardShouldPersistTaps={"always"}
                    contentContainerStyle={styles.contentContainerStyle}
                    style={{flex:1,flexGrow:10, backgroundColor: BACKGROUND_WHITE_COLOR}}
                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                        this.fScroll.scrollToEnd({animated: true})
                    }}              
                >
                    <QRCodeDetails /> 
                </ScrollView>
                <Button
                    complete={false}
                    buttonDisabled={this.props.qrCode.length === 0}
                    loading={!this.props.openAddNotification && this.props.ajaxStatus.state === 'inprogress' }
                    submit={this.goToBranding}
                >
                    {BUTTON_PROCEED}
                </Button>
                {this.props.openGPS &&<GPSError enableLocation={this.propsenableLocation}/>}
                {this.props.openCamera && 
                    <CameraModal 
                        type={'QR_POS'}
                        lat={this.props.lat} 
                        pageType={'ADDQRPOS'}
                        long={this.props.long} 
                        addNewQRPOS={this.addNewQRPOS}
                    />
                }
            </Container>  
        )
    }
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        lat: state.location.lat,
        long: state.location.long,
        ajaxStatus: state.ajaxStatus,
        openGPS: state.modal.openGPS,
        openCamera: state.modal.openCamera,
        timerStart: state.timerDetails.timerStart,
        qrCode: state.currentMerchantDeviceDetails.qrCode,
        merchantId: state.currentMerchantDetails.merchantId,
        openAddNotification: state.modal.openAddNotification
    };
}

export default connect(mapStateToProps,{  
    addNewQRPOS,
    updatePageType,
    resetInitValue,
    enableLocation
})(AddQRPOS)

const styles = StyleSheet.create({
    activeTabTextStyle: {
        fontSize: 14,
        textAlign: 'center',
        color: PRIMARY_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    tabTextStyle: {
        fontSize: 14,
        textAlign: 'center',
        color: WARM_GREY_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    tabStyle: {
        borderBottomWidth: 1,
        borderBottomColor: UNDERLINE_COLOR,
        backgroundColor: BACKGROUND_WHITE_COLOR,
    },
    activeTabStyle: {
        borderBottomWidth: 6,
        borderColor: PRIMARY_COLOR,
        backgroundColor: BACKGROUND_WHITE_COLOR,
    },
    contentContainerStyle:{
        display: 'flex',
        paddingBottom: 63
    }
});