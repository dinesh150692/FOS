/* Library Imports */
import { connect } from 'react-redux';
import React, { Component } from "react";
import { Container, Spinner } from 'native-base';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { BackHandler, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
/* Component Import */
import Timer from '../components/timer';
import Header from '../components/header';
import Button from '../components/common/button';
import Upload from '../components/common/upload';
import { goToPage } from '../components/common/logout';
import CameraModal from '../components/common/cameraModal';
/* Action Import*/
import { resetInitValue } from '../redux/action/timerAction';
import { openCameraModal } from '../redux/action/modalAction';
import { deleteDocuments, getDocumentList } from '../redux/action/uploadAction';
import { updatePageType } from '../redux/action/pageTypeAction';
/* Constant Import */
import { BUSINESS_PROOF, ID_PROOF, PAGE_NAVIGATION_TYPES, SERVER_ERROR, DOCUMENTS_TYPE } from '../shared/constants';
import { BACKGROUND_WHITE_COLOR, FONT_FAMILY, MEDIUM_FONT, PRIMARY_COLOR, WARM_GREY_COLOR } from '../shared/colors';
/* Image Import */
import addImage from '../assets/add_button.png';
/* Style Import */
import commonStyles from '../style/style';
import {getFetchHeaders} from "../redux/action/fetchHeaderAction";

class IdProof extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        }
        this.goBackHandler = this.goBackHandler.bind(this);
        this._renderContent = this._renderContent.bind(this);
        this.goToNextScreen = this.goToNextScreen.bind(this);
        this._renderEmptyContent = this._renderEmptyContent.bind(this);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
        const options = getFetchHeaders();
        let category = this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF
        ? DOCUMENTS_TYPE.ID_PROOF
        : DOCUMENTS_TYPE.BUSINESS_DOCUMENT;
        if (!this.props.editFlow) this.props.getDocumentList(this.props.merchantId, category, options);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);

    }

    goBackHandler() {
        this.props.resetInitValue(false);
        return goToPage('MerchantList');
    }

    goToNextScreen() {
        if (this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF) {
            this.props.updatePageType(PAGE_NAVIGATION_TYPES.BUSINESS_PROOF);
            goToPage('ProofSelection');
        } else {
            goToPage('ReviewDetails');
        }
    }

   /**
   *  Function to delete image document of Category
   */
    deleteImageDocuments(item, index, itemIndex) {
        //TODO: user confirmation promt
        const options = getFetchHeaders();
        this.props.deleteDocuments(item.id, item.merchantId, item.category, options);
    }

    _renderAddButtonBusinessProof() {
        return (
            <TouchableOpacity delayLongPress={4000} activeOpacity={0.14} style={styles.imageContainer} onPress={() => {
                this.props.updatePageType(PAGE_NAVIGATION_TYPES.BUSINESS_PROOF);
                if(this.props.editFlow){
                    this.props.navigation.push("ProofSelection", {
                        editFlow: true,
                    })
                }else{
                    goToPage('ProofSelection');
                }
            }}>
                <Image source={addImage} style={styles.addNewImage} />
                <Text style={styles.imageText}>{BUSINESS_PROOF.BRANDING_ADD_IMAGE_TEXT}</Text>
            </TouchableOpacity>
        )
    }

    _renderAddButtonIDProof() {
        return (
            <TouchableOpacity delayLongPress={4000} activeOpacity={0.14} style={styles.imageContainer} onPress={() => {
                this.props.updatePageType(PAGE_NAVIGATION_TYPES.ID_PROOF);
                if(this.props.editFlow){
                    this.props.navigation.push("ProofSelection", {
                        editFlow: true,
                    })
                }else{
                    goToPage('ProofSelection');
                }
            }}>
                <Image source={addImage} style={styles.addNewImage} />
                <Text style={styles.imageText}>{ID_PROOF.BRANDING_ADD_IMAGE_TEXT}</Text>
            </TouchableOpacity>
        )
    }

    /** 
     *  Function to render the content based on upload images action
     */
    _renderContent(imageList) {
        return (
            <ScrollView keyboardShouldPersistTaps={"always"} style={{ flex: 1 }}
                contentContainerStyle={styles.contentContainerStyle}
            >
                {imageList && imageList.length > 0
                    ?
                    this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF
                        ?
                        <View>
                            <Upload imageData={imageList}
                                deleteDocument={(item, index, itemIndex) => {
                                    this.deleteImageDocuments(item, index, itemIndex);
                                }} />
                            {this._renderAddButtonIDProof()}
                        </View>
                        :
                        <View>
                            <Upload imageData={imageList}
                                deleteDocument={(item, index, itemIndex) => {
                                    this.deleteImageDocuments(item, index, itemIndex);
                                }} />
                            {this._renderAddButtonBusinessProof()}
                        </View>
                    :
                    <View style={styles.emptyContainer}>
                        {this._renderEmptyContent()}
                    </View>
                }
            </ScrollView>
        )
    }

    /** 
     *  Function to render the error content based on linked bank details action
     */
    _renderEmptyContent() {
        if (this.props.ajaxStatus.state === 'error' || this.state.error) {
            return (<Text style={styles.emptyText}>{SERVER_ERROR}</Text>);
        } else {
            return (
                this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF
                    ? this._renderAddButtonIDProof()
                    : this._renderAddButtonBusinessProof()
            );
        }
    }

    render() {
        const imageList = this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF
            ? this.props.idProofImageList
            : this.props.businessProofImageList
        return (
            <Container style={commonStyles.contentBackground}>
                {
                    (!this.props.editFlow) && <Header
                    main="no"
                    goBack={this.goBackHandler}
                    close={this.goBackHandler}
                    headerName={
                        this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF
                            ? ID_PROOF.BRANDING_SCREEN_HEADER
                            : BUSINESS_PROOF.BRANDING_SCREEN_HEADER} 
                    timerStart={this.props.timerStart}
                    />
                }
                {/* {this.props.timerStart && <Timer />} */}
                {this.props.ajaxStatus.state !== 'inprogress'
                    ?
                    <React.Fragment>
                        {this._renderContent(imageList)}
                        {imageList && imageList.length > 0 && !this.props.editFlow &&
                            <Button
                                loading={false}
                                complete={false}
                                buttonDisabled={false}
                                submit={this.goToNextScreen}
                            >
                                {
                                    this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF
                                        ? ID_PROOF.BRANDING_BUTTON
                                        : BUSINESS_PROOF.BRANDING_BUTTON}
                            </Button>
                        }
                    </React.Fragment>
                    :
                    <Spinner color={PRIMARY_COLOR} />
                }
                {/* {this.props.openCamera &&
                    <CameraModal 
                        capturedImageList={this.capturedImageList}
                        type={'CAMERA'}
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
        openCamera: state.modal.openCamera,
        idProofImageList: state.imageList.idProof,
        timerStart: state.timerDetails.timerStart,
        merchantId: state.currentMerchantDetails.merchantId,
        businessProofImageList: state.imageList.businessProof,
        devicePrint: state.devicePrint,
        agentId: state.loginDetails.agentId,
        initialToken: state.loginDetails.initialToken,
    };
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = {
    deleteDocuments,
    resetInitValue,
    updatePageType,
    getDocumentList,
    openCameraModal
}
export default connect(mapStateToProps, mapDispatchToProps)(IdProof);

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
        color: PRIMARY_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT,
        marginLeft: 10,
    },
    contentContainerStyle: {
        flex: 1,
        paddingBottom: 63,
        maxHeight: responsiveHeight(100) - 56 - 75,
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        color: WARM_GREY_COLOR,
        fontFamily: FONT_FAMILY,
        marginHorizontal: responsiveWidth(10)
    }
});