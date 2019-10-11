/* Library Imports */
import React from "react";
import {connect} from 'react-redux';
import {RNCamera} from 'react-native-camera';
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {Image, Modal, StyleSheet, Text, ToastAndroid, TouchableOpacity, View, Alert, Dimensions, Platform} from 'react-native';
import {Spinner} from 'native-base';
/* Component Import */
import {goToPage} from "./logout";
import QRScannerRectView from '../qrScanner/qrScanner';
/* Custom Action Import */
import {closeCameraModal} from '../../redux/action/modalAction';
/* Constant Imports  */
import {INVALID_QRCODE, QRCODE, QRCODE_REGEX, CAMERA_RETAKE} from '../../shared/constants';
import {
    BUTTON_TEXT_COLOR,
    ERROR_COLOR,
    FONT_FAMILY,
    MEDIUM_FONT,
    PRIMARY_COLOR,
    REGULAR_FONT
} from '../../shared/colors';
/* Image Imports */
import tick from '../../assets/tick.png';
import close from '../../assets/close.png';
import capture from '../../assets/capture.png';
import flashOff from '../../assets/flash_off.png';
import flipCamera from '../../assets/camera_flip.png';

import {timerCountdown} from '../timer';
import timerReducer from "../../redux/reducer/timerReducer";
import Orientation from 'react-native-orientation';

const DESIRED_RATIO = "16:9";

class CameraModal extends React.PureComponent {
    constructor(props) {
        super(props);
        if (this.props.isBranding) {
            Orientation.lockToLandscape();
        }
        else {
            Orientation.lockToPortrait();
        }
    }

    componentDidMount() {
        if (this.props.isBranding) {
            Orientation.lockToLandscape();
        }
        else {
            Orientation.lockToPortrait();

        }
    }

    componentWillUnmount() {
        Orientation.lockToPortrait();
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.props.openCamera}
                onRequestClose={() => {
                    return;
                }}
            >
                <View style={{flex: 1}}>
                    <CameraOrQRScan
                        {...this.props}
                        type={this.props.type}
                        close={() => {
                            Orientation.lockToPortrait();
                            this.props.closeCameraModal();
                        }}
                        time={this.props.timerDetails.time}
                    />
                </View>
            </Modal>
        );
    }
}

class CameraOrQRScan extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            flash: false,
            front: false,
            toastTimeOut: 0,
            capturedImage: null,
            orientation: 'PORTRAIT'
        }
        this.cam = null;
        this.timer = null;
        this.onOffFlash = this.onOffFlash.bind(this);
        this.scanResult = this.scanResult.bind(this);
        this.takePicture = this.takePicture.bind(this);
        this.toastTimeOut = this.toastTimeOut.bind(this);
        this.onOffFrontCam = this.onOffFrontCam.bind(this);
        this.sendCapturedImage = this.sendCapturedImage.bind(this);
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.cam = null;

        // Remember to remove listener
        Orientation.removeOrientationListener(this._orientationDidChange);
    }

    getHeight(h) {

        return this.props.isBranding ? responsiveWidth(h) : responsiveHeight(h);
    }

    getWidth(w) {
        return this.props.isBranding ? responsiveHeight(w) : responsiveWidth(w);
    }


    componentDidMount() {
        if (this.props.isBranding) {
            Orientation.lockToLandscape();
        }
        else {
            Orientation.lockToPortrait();
        }
        Orientation.addOrientationListener(this._orientationDidChange);
    }

    _orientationDidChange = (orientation) => {
        console.log('_orientationDidChange -->orientation',orientation);
        if (orientation === 'LANDSCAPE') {
            this.setState({
                orientation: 'LANDSCAPE'
            })
        } else {
            this.setState({
                orientation: 'PORTRAIT'
            })
        }
    }

    onOffFlash() {
        this.setState({flash: !this.state.flash});
    }

    onOffFrontCam() {
        this.setState({front: !this.state.front});
    }

    /**
     *  Fired on scanning of the QRCODE
     */
    scanResult(data) {

        if (!this.props.lat && !this.props.long) {
            return;
        }
        if (this.props.timerDetails.timeOut !== 0) {
            if (data.type === QRCODE) {
                let qrCode = this.props.qrCode;
                if (data.data) {
                    let qr = data.data.match(QRCODE_REGEX);
                    if (qr && qr.length > 0) {
                        this.props.closeCameraModal();
                        this.props.addNewQRPOS(QRCODE, qr[1], qrCode);
                        if (this.props.pageType === 'ReviewDetails') {
                            goToPage('AddQRPOS');
                        }
                    } else {
                        if (this.state.toastTimeOut === 0) {
                            this.setState({toastTimeOut: 4}, () => {
                                this.toastTimeOut()
                            })
                            ToastAndroid.show(INVALID_QRCODE, ToastAndroid.SHORT)
                        }
                    }
                }
            }
        }
    }

    /**
     *  Update the timer count down for each second and
     *  once the timer is timed out clear the timer and
     *  call resend otp
     */
    toastTimeOut() {
        this.timer = setInterval(() => {
            let {toastTimeOut} = this.state;
            if (toastTimeOut > 1) {
                this.setState({toastTimeOut: toastTimeOut - 1});
            } else {
                clearInterval(this.timer);
                this.setState({toastTimeOut: 0});
            }
        }, 1000);
    }

    sendCapturedImage() {
        this.props.capturedImageList(this.state.capturedImage);
    }

    /**
     * Capture the image async and store it in a new array
     */
    async takePicture() {
        if (this.cam) {
            const options = {quality: 0.4, width: 2880, fixOrientation: true};
            const data = await this.cam.takePictureAsync(options)
            data.time = Date.now();
            data.thumbNail = data.uri;
            data.uri && this.setState({capturedImage: data});
        }
    };

    renderTopBarView = () => {
        return (
            <View style={[styles.topContainer, {width: this.getWidth(100)}]}>
                {!this.state.capturedImage ?
                    <TouchableOpacity delayLongPress={4000} onPress={this.onOffFlash} activeOpacity={0.14}>
                        <Image source={this.state.flash ? flashOff : flashOff} resizeMode={'contain'}
                               style={styles.flashImage}/>
                    </TouchableOpacity> : <View/>}
                {this.props.timerDetails.timerStart && <CameraModalTimer/>}
                <TouchableOpacity delayLongPress={4000}
                                  onPress={() => {
                                      if (this.state.capturedImage) {
                                          this.setState({
                                              capturedImage: null
                                          });
                                      }
                                      else {
                                          this.props.close();
                                      }
                                  }}
                                  activeOpacity={0.14}>
                    <Image source={close} resizeMode={'contain'} style={styles.closeImage}/>
                </TouchableOpacity>
            </View>
        );
    }

    renderBottomMenuView = () => {
        return (
            <View style={[styles.bottomContainer, {width: this.getWidth(100)}]}>
                {!this.state.capturedImage ?
                    <TouchableOpacity delayLongPress={4000} onPress={this.onOffFrontCam} activeOpacity={0.14}>
                        <Image source={flipCamera} resizeMode={'contain'} style={styles.cameraFlipImage}/>
                    </TouchableOpacity> : <TouchableOpacity>
                        <Text style={styles.retakeText}
                              onPress={() => {
                                  if (this.state.capturedImage) {
                                      this.setState({capturedImage: null});
                                  }
                                  else {
                                      this.props.close();
                                  }
                              }}>
                            {CAMERA_RETAKE}
                        </Text>
                    </TouchableOpacity>}
                {this.state.capturedImage ?
                    <TouchableOpacity delayLongPress={4000} onPress={this.sendCapturedImage} activeOpacity={0.14}>
                        <Image source={tick} resizeMode={'contain'} style={styles.cameraFlipImage}/>
                    </TouchableOpacity> :
                    <TouchableOpacity delayLongPress={4000} onPress={this.takePicture} activeOpacity={0.14}>
                        <Image source={capture} resizeMode={'contain'} style={styles.captureImage}/>
                    </TouchableOpacity>
                }
                {!this.state.capturedImage && <View/>}
            </View>
        );
    }

    renderScanView = () => {
        return (
            <QRScannerRectView
                maskColor={"rgba(0,0,0,0.4)"}
                rectHeight={300}
                rectWidth={300}
                cornerBorderWidth={6}
                cornerBorderLength={80}
                cornerColor={PRIMARY_COLOR}
                scanBarColor={PRIMARY_COLOR}
                hintText={'Scan PhonePe QR'}
                hintTextPosition={parseInt(this.getHeight(75))}
                hintTextStyle={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY,
                    fontWeight: REGULAR_FONT,
                    color: BUTTON_TEXT_COLOR
                }}
            />
        );
    }

    prepareRatio = async () => {
        if (Platform.OS === 'android' && this.cam) {
            const ratios = await this.cam.getSupportedRatiosAsync();
            console.log("prepareRatio --> ratios",ratios);
            // See if the current device has your desired ratio, otherwise get the maximum supported one
            // Usually the last element of "ratios" is the maximum supported ratio
            const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];
            this.setState({ ratio });
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.props.type === 'QR_POS'
                    ?
                    <RNCamera
                        ref={(cam) => this.cam = cam}
                        onBarCodeRead={this.scanResult}
                        flashMode={this.state.flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                        style={{flex: 1}}
                    >
                        {this.renderTopBarView()}
                        {this.renderScanView()}
                    </RNCamera>
                    :
                    this.state.capturedImage ?
                        <View style={{flex: 1}}>
                            {this.state.capturedImage.uri &&
                                <Image
                                    source={{uri: this.state.capturedImage.uri}}
                                    resizeMode={'contain'}
                                    style={{
                                        width: this.getWidth(100),
                                        height: this.getHeight(100),
                                        backgroundColor: 'black'
                                    }}
                                    loadingIndicatorSource={<Spinner color={PRIMARY_COLOR}/>}>
                                </Image>
                            }
                            {this.renderTopBarView()}
                            {this.renderBottomMenuView()}
                        </View>
                        :
                        <RNCamera
                            ref={(cam) => this.cam = cam}
                            onCameraReady={this.prepareRatio} // You can only get the supported ratios when the camera is mounted
                            ratio={this.state.ratio}
                            flashMode={this.state.flash
                                ? RNCamera.Constants.FlashMode.on
                                : RNCamera.Constants.FlashMode.off
                            }
                            type={this.state.front
                                ? RNCamera.Constants.Type.front
                                : RNCamera.Constants.Type.back
                            }
                            style={{flex: 1}}>
                            {this.renderTopBarView()}
                            {this.renderBottomMenuView()}
                        </RNCamera>
                }
            </View>
        )
    }
}


class CameraModalTimer extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            timeCounter: timerCountdown(),
        };
        this.timer = null;
    }

    componentWillMount() {
        this.timer = setInterval(() => {
            this.setState({timeCounter: timerCountdown()});
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <TouchableOpacity delayLongPress={4000} activeOpacity={1}
                              style={{alignItems: 'center', flexDirection: 'row'}}>
                <Text style={styles.timeRem}>TIME REMAINING: </Text>
                <Text style={styles.time}>{this.state.timeCounter || '10.00'}</Text>
            </TouchableOpacity>
        )
    }

}

/**
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        timerDetails: state.timerDetails,
        openCamera: state.modal.openCamera,
        qrCode: state.currentMerchantDeviceDetails.qrCode
    };
}

/**
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = {closeCameraModal};

export default connect(mapStateToProps, mapDispatchToProps)(CameraModal)

const styles = StyleSheet.create({
    bottomContainer: {
        left: 0,
        bottom: 0,
        height: 56,
        elevation: 1,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
    },
    topContainer: {
        top: 0,
        left: 0,
        height: 44,
        elevation: 1,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        backgroundColor: 'transparent',
        justifyContent: 'space-between'
    },
    topContent: {
        marginLeft: 18,
        marginRight: 18,
    },
    timeRem: {
        fontSize: 12,
        color: ERROR_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    time: {
        fontSize: 14,
        color: ERROR_COLOR,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY
    },
    retakeText: {
        height: 22,
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT,
        color: BUTTON_TEXT_COLOR
    },
    cameraFlipImage: {
        width: 24,
        height: 22
    },
    captureImage: {
        width: 56,
        height: 56
    },
    flashImage: {
        width: 24,
        height: 24
    },
    closeImage: {
        width: 20,
        height: 20,
        margin: 20,
        marginRight: 0
    }
});