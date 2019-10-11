/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import { Container, Spinner } from 'native-base';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { BackHandler, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View , ToastAndroid} from 'react-native';
/* Component Import */
import Timer from '../components/timer';
import Header from '../components/header';
import Button from '../components/common/button';
import Upload from '../components/common/upload';
import SMSLinking from '../components/smsLinking';
import { goToPage } from '../components/common/logout';
import CameraModal from '../components/common/cameraModal';
/* Action Import*/
import { resetInitValue } from '../redux/action/timerAction';
import { updatePageType } from '../redux/action/pageTypeAction';
import { closeCameraModal, openCameraModal, openSMSModal, closeSMSModal } from '../redux/action/modalAction';
import { updateBrandingImagesList, updateQRImagesList, getDocumentList, deleteDocuments, uploadDocuments } from '../redux/action/uploadAction';
/* Constant Import */
import { BRANDING, BRANDING_QR, BUTTON_TEXT, NO_BRANDING, NO_BRANDING_QR, PAGE_NAVIGATION_TYPES, SERVER_ERROR, DOCUMENTS_TYPE } from '../shared/constants';
import { BACKGROUND_WHITE_COLOR, BOLD_FONT, BUTTON_PRESS_COLOR, FONT_FAMILY, LABEL_COLOR, MEDIUM_FONT, PRIMARY_COLOR, WARM_GREY_COLOR } from '../shared/colors';
/* Image Import */
import addImage from '../assets/add_button.png';
import cameraImage from '../assets/camera.png';
import sample1 from '../assets/shop_sample/sample1.jpg';
import sample2 from '../assets/shop_sample/sample2.jpg';
import sample3 from '../assets/shop_sample/sample3.jpg';
import sample4 from '../assets/shop_sample/sample4.jpg';
import sample5 from '../assets/shop_sample/sample5.jpg';
import sample6 from '../assets/shop_sample/sample6.jpg';
import sample7 from '../assets/shop_sample/sample7.jpg';
import noBrandingQR from '../assets/no_branding_qr.png';
/* Style Import */
import commonStyles from '../style/style';
import { getMerchantList } from '../redux/action/merchantListAction';
import {getFetchHeaders} from "../redux/action/fetchHeaderAction";
import Orientation from 'react-native-orientation';
import Swiper from 'react-native-swiper';

class Branding extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            error: '',
            openCamera: false,
            imageCount: this.getImageCount(props.brandingImageList),
        }
        this.goBackHandler = this.goBackHandler.bind(this);
        this._renderContent = this._renderContent.bind(this);
        this.goToNextScreen = this.goToNextScreen.bind(this);
        this.capturedImageList = this.capturedImageList.bind(this);
        this._renderEmptyContent = this._renderEmptyContent.bind(this);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
        const options = getFetchHeaders();
        let category = this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING
        ? DOCUMENTS_TYPE.BRAND_IMAGE
        : DOCUMENTS_TYPE.QR_IMAGE;
        if (!this.props.editFlow) this.props.getDocumentList(this.props.merchantId, category, options);
        Orientation.lockToPortrait();
    }

    componentDidUpdate() {
        this.state.imageCount = this.getImageCount(this.props.brandingImageList);
        console.log("componentDidUpdate --> this.state.imageCount",this.state.imageCount);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
    }

    goBackHandler(){
        // this.props.resetInitValue(false);
        return goToPage('ReviewDetails');
    }

    goToNextScreen(){
        if(this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING && this.state.imageCount >= BRANDING.BRANDING_IMAGE_COUNT){
            this.props.openSMSModal();
            goToPage('SMSLinking');
        } else if(this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING && this.state.imageCount < BRANDING.BRANDING_IMAGE_COUNT) {
            ToastAndroid.show('Minimum '+BRANDING.BRANDING_IMAGE_COUNT+' Branding Images required', ToastAndroid.LONG);
        } else{
            // this.props.updatePageType(PAGE_NAVIGATION_TYPES.ID_PROOF);
            goToPage('ReviewDetails'); // TODO: change it to idproof if id proof is applicable
        }
    }

    openCamera() {
        this.setState({
            openCamera: true,
        });
        this.props.openCameraModal();
        if(this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING) {
            Orientation.lockToLandscape();
        }
        else {
            Orientation.lockToPortrait();
        }
    }

    getImageCount(brandingImageList) {
        let imageCount = 0;
        if (brandingImageList && brandingImageList.length > 0 ){
            let brandImageObject = brandingImageList[0];
            if (brandImageObject && brandImageObject.images ) {
                imageCount = brandImageObject.images.length;
            }
            else {
                imageCount = 0;
            }
        }
        return imageCount;
    }

    capturedImageList(imageData){
        if(!imageData) return;
        
        let {imageCount} = this.state;
        let stageUpdate = true;
        this.props.closeCameraModal();
        this.setState({
            openCamera: false,
        });
        const options = getFetchHeaders();
        let category =  DOCUMENTS_TYPE.BRAND_IMAGE;
        let type = category;
        if(this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING) {
            imageCount = imageCount + 1;
            if(imageCount < BRANDING.BRANDING_IMAGE_COUNT) {
                stageUpdate = false;
            }
        }
        if(this.props.pageType === PAGE_NAVIGATION_TYPES.QR){
            category = DOCUMENTS_TYPE.QR_IMAGE;
            type = category;
        }
        this.props.uploadDocuments(imageData, this.props.merchantId, category, type, options, () =>{
            this.props.getDocumentList(this.props.merchantId, category, options);
            this.setState({imageCount});
        }, stageUpdate)
    }

    /**
    *  Function to delete image document of Category
    */
    deleteImageDocuments(item, index, itemIndex) {
        //TODO: user confirmation promt

        const options = getFetchHeaders();
        if(this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING) {
            let {imageCount} = this.state;
            if (imageCount < BRANDING.BRANDING_IMAGE_COUNT || imageCount > BRANDING.BRANDING_IMAGE_COUNT) {
                this.props.deleteDocuments(item.id, item.merchantId, item.category, options);
                imageCount = imageCount - 1;
                this.setState({imageCount});
            }else {
                ToastAndroid.show('Minimum '+(BRANDING.BRANDING_IMAGE_COUNT + 1)+' Branding Images required to delete one', ToastAndroid.LONG);
            }
        } else if(this.props.pageType === PAGE_NAVIGATION_TYPES.QR) {
            this.props.deleteDocuments(item.id, item.merchantId, item.category, options);
        }
    }

    /** 
     *  Function to render the content based on upload images action
     */
    _renderContent(imageList){
        return(
            <ScrollView keyboardShouldPersistTaps={"always"} style={{flex:1}}
                contentContainerStyle={imageList && imageList.length > 0 ? styles.contentContainerStyle : styles.contentContainerStyle1}
            >
                { imageList && imageList.length > 0
                    ? 
                        <View>
                            <Upload
                                imageData={imageList}
                                deleteDocument={(item, index, itemIndex) => {
                                    this.deleteImageDocuments(item, index, itemIndex);
                                }}
                                addImageButton={()=>{
                                return(
                                    <TouchableOpacity delayLongPress={4000} activeOpacity={0.14} style={styles.imageContainer} onPress={() => {
                                    this.openCamera()
                                }}>
                                    <Image source={addImage} style={styles.addNewImage}/>
                                    <Text style={styles.imageText}>{
                                        this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING
                                            ? BRANDING.BRANDING_ADD_IMAGE_TEXT
                                            : BRANDING_QR.BRANDING_ADD_IMAGE_TEXT
                                    }</Text>
                                </TouchableOpacity>
                                )}
                                }
                                isBranding={this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING}
                            />
                        </View>
                    :
                        this._renderEmptyContent()
                }
            </ScrollView>
        )
    }

    /** 
     *  Function to render the error content based on upload images action
     */
    _renderEmptyContent(){
        if(this.props.ajaxStatus.state === 'error' || this.state.error.length > 0){
            return ( <Text style={styles.emptyText}>{SERVER_ERROR}</Text>);
        }else{
              return(
                this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING
                ?
                    <React.Fragment>
                        <View style={{ height: responsiveHeight(55), width: responsiveWidth(100), marginBottom: responsiveHeight(1)}}>
                                <Swiper>
                                    <Image source={sample1} resizeMode={'contain'} style={[{height: this.props.editFlow? responsiveHeight(38)-40: responsiveHeight(38)}, styles.noBrandImage]}/>
                                    <Image source={sample2} resizeMode={'contain'} style={[{height: this.props.editFlow? responsiveHeight(38)-40: responsiveHeight(38)}, styles.noBrandImage]}/>
                                    <Image source={sample3} resizeMode={'contain'} style={[{height: this.props.editFlow? responsiveHeight(38)-40: responsiveHeight(38)}, styles.noBrandImage]}/>
                                    <Image source={sample4} resizeMode={'contain'} style={[{height: this.props.editFlow? responsiveHeight(38)-40: responsiveHeight(38)}, styles.noBrandImage]}/>
                                    <Image source={sample5} resizeMode={'contain'} style={[{height: this.props.editFlow? responsiveHeight(38)-40: responsiveHeight(38)}, styles.noBrandImage]}/>
                                    <Image source={sample6} resizeMode={'contain'} style={[{height: this.props.editFlow? responsiveHeight(38)-40: responsiveHeight(38)}, styles.noBrandImage]}/>
                                    <Image source={sample7} resizeMode={'contain'} style={[{height: this.props.editFlow? responsiveHeight(38)-40: responsiveHeight(38)}, styles.noBrandImage]}/>
                                </Swiper>
                        </View>
                        <Text style={styles.noItemTextHeader}>{NO_BRANDING.NO_BRANDING_HEADER}</Text>
                        <Text style={styles.noItemTextHeader}>{NO_BRANDING.NO_BRANDING_HEADER1}</Text>
                        <Text style={styles.noItemText}>{NO_BRANDING.NO_BRANDING_TEXT}</Text>
                        <TouchableOpacity delayLongPress={4000}  activeOpacity={0.14}  underlayColor={BUTTON_PRESS_COLOR} style={styles.floater} onPress={() =>{
                            this.openCamera();
                        }}>
                            <Image style={styles.addImage} resizeMode={'contain'} source={cameraImage}/>
                        </TouchableOpacity>
                    </React.Fragment>
                :
                    <React.Fragment>
                        <Image source={noBrandingQR} resizeMode={'contain'} style={[styles.noBrandImage]}/>
                        <Text style={styles.noItemTextHeader}>{NO_BRANDING_QR.NO_BRANDING_HEADER}</Text>
                        <Text style={styles.noItemTextHeader}>{NO_BRANDING_QR.NO_BRANDING_HEADER1}</Text>
                        <Text style={styles.noItemText}>{NO_BRANDING_QR.NO_BRANDING_TEXT}</Text>
                        <TouchableOpacity delayLongPress={4000}  activeOpacity={0.14}  underlayColor={BUTTON_PRESS_COLOR} style={styles.floater} onPress={() =>{
                            this.openCamera();
                        }}>
                            <Image style={styles.addImage} resizeMode={'contain'} source={cameraImage}/>
                        </TouchableOpacity>
                    </React.Fragment>
              );
            }   
    }                               

    render(){
        const imageList = this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING
        ? this.props.brandingImageList
        : this.props.qrImageList;
        return(
            <Container style={commonStyles.contentBackground}>
                {!(this.props.editFlow === true) && <Header
                    main="no" 
                    goBack={this.goBackHandler} 
                    close={this.goBackHandler}
                    headerName={this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING
                                ? BRANDING.BRANDING_SCREEN_HEADER
                                : BRANDING_QR.BRANDING_SCREEN_HEADER
                    }  
                    timerStart={this.props.timerStart}
                /> }
                {/* {this.props.timerStart && <Timer/>} */}
                { this.props.ajaxStatus.state !== 'inprogress' 
                    ? 
                      <React.Fragment>
                         {this._renderContent(imageList)}
                         {imageList && imageList.length > 0 && !(this.props.editFlow === true) &&
                            <Button
                                loading={false}    
                                complete={false}
                                buttonDisabled={this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING && this.state.imageCount < BRANDING.BRANDING_IMAGE_COUNT ? true : false}
                                submit={this.goToNextScreen}
                            >
                                { this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING
                                  ? BUTTON_TEXT.BRANDING_ADDED
                                  : BRANDING_QR.BRANDING_BUTTON
                                }
                            </Button>
                        }
                      </React.Fragment>
                    : <Spinner color={PRIMARY_COLOR} />
                }
                {this.state.openCamera &&
                    <CameraModal
                        capturedImageList={this.capturedImageList}
                        type={'CAMERA'}
                        isBranding={this.props.pageType === PAGE_NAVIGATION_TYPES.BRANDING}
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
            </Container>
        );
    }
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        pageType: state.pageType,
        ajaxStatus: state.ajaxStatus,
        openSMS: state.modal.openSMS,
        qrImageList: state.imageList.qr,
        openCamera: state.modal.openCamera,
        brandingImageList: state.imageList.branding,
        devicePrint: state.devicePrint,
        agentId: state.loginDetails.agentId,
        initialToken: state.loginDetails.initialToken,
        timerStart: state.timerDetails.timerStart,
        merchantId: state.currentMerchantDetails.merchantId
    };
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = {
    deleteDocuments,
    resetInitValue,
    openSMSModal,
    closeSMSModal,
    updatePageType,
    openCameraModal, 
    closeCameraModal,
    updateQRImagesList,
    getDocumentList,
    uploadDocuments,
    updateBrandingImagesList,
    getMerchantList,
};


export default connect(mapStateToProps, mapDispatchToProps)(Branding);

const styles = StyleSheet.create({
    imageContainer: {
        width: 200,
        marginTop: 21,
        marginLeft: 17,
        marginBottom: 21,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    addNewImage: {
        width: 25,
        height: 25
    },
    imageText: {
        fontSize: 14,
        marginLeft: 10,
        color: PRIMARY_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT
    },
    contentContainerStyle:{
        flex:1, 
        paddingBottom: 63,
        maxHeight: responsiveHeight(100)-56-75, 
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    contentContainerStyle1:{
        flex:1,
        height: responsiveHeight(100),
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    emptyText:{
        fontSize: 14,
        textAlign: 'center',
        color: WARM_GREY_COLOR,
        fontFamily: FONT_FAMILY,
        marginHorizontal: responsiveWidth(10)
    },
    floater: {
        bottom: 8,
        right: 18,
        elevation: 2,
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        justifyContent: 'center',
        width: responsiveWidth(18),
        height: responsiveWidth(18),
        backgroundColor: PRIMARY_COLOR,
        borderRadius: responsiveWidth(9)
    },
    addImage: {
        width: 32,
        height: 29
    },
    noItemText:{
        fontSize: 14,
        lineHeight: 22.7,
        textAlign: 'center',
        color: WARM_GREY_COLOR,
        fontFamily: FONT_FAMILY,
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(5),
    },
    noItemTextHeader:{
        fontSize: 24,
        lineHeight: 28.8,
        color: LABEL_COLOR,
        textAlign: 'center',
        fontWeight: BOLD_FONT,
        fontFamily: FONT_FAMILY,
    },
    noBrandImage:{
        width: responsiveWidth(100),
        marginTop: responsiveHeight(5),
        paddingLeft: responsiveWidth(8),
        paddingRight: responsiveWidth(8),
        marginBottom: responsiveHeight(2)
    },
});
