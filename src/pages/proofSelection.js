/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import {Container, Spinner} from 'native-base';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
/* Component Import */
import Timer from '../components/timer';
import Header from '../components/header';
import RadioButton from '../components/common/radio';
import { goToPage } from '../components/common/logout';
import TwoButton from '../components/common/two_button';
import CameraModal from '../components/common/cameraModal';
/* Action Imports */
import { resetInitValue } from '../redux/action/timerAction';
import { updatePageType } from '../redux/action/pageTypeAction';
import { closeCameraModal, openCameraModal } from '../redux/action/modalAction';
import { updateBusinessProofImagesList, updateIDProofImagesList, uploadDocuments } from '../redux/action/uploadAction';
/* Constant Import */
import { BUSINESS_PROOF, BUSINESS_PROOF_TYPES, ID_PROOF, ID_PROOF_TYPES, PAGE_NAVIGATION_TYPES, DOCUMENTS_TYPE } from '../shared/constants';
import {
    FONT_FAMILY,
    LABEL_COLOR,
    MEDIUM_FONT,
    PRIMARY_COLOR,
    REGULAR_FONT,
    TEXT_COLOR,
    UNDERLINE_COLOR
} from '../shared/colors';
/* Style Import */
import commonStyles from '../style/style';
import {getFetchHeaders} from "../redux/action/fetchHeaderAction";

class ProofSelection extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            error: '',
            selectedType: '',
            openCamera: false
        }
        this.onSuccess = this.onSuccess.bind(this);
        this.goBackHandler = this.goBackHandler.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.processImageResult = this.processImageResult.bind(this);
    }
    
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
    }
    
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
    }

    goBackHandler(){
        this.props.resetInitValue(false);
        return goToPage('MerchantList');
    }

    handleSelection(type){
        this.setState({selectedType: type})
    }

    processImageResult(proofImageList, imageList){
        if(proofImageList){
            for(let i = 0; i < proofImageList.length; i++ ){
                if(proofImageList[i].headerName == this.state.selectedType){
                    let images  = proofImageList[i].images;
                    images = images.concat(imageList);
                    proofImageList[i].images = images;
                    return proofImageList;
                }
            }
        }
        
        let item = {
            images: imageList,
            headerName: this.state.selectedType
        };
        proofImageList.push(item);
        return proofImageList;
    }

    // onSuccess(imageList){
    //     // Do the redux action for the sending the captured image and also do the 
    //     // necessary navigation here
    //     this.props.closeCameraModal();
    //     let { idProofImageList, businessProofImageList } = this.props;
    //     if(this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF){
    //         //idProofImageList = this.processImageResult(idProofImageList, imageList);
    //         this.props.updateIDProofImagesList(idProofImageList);
    //         this.props.updatePageType(PAGE_NAVIGATION_TYPES.ID_PROOF);            
    //     }else{
    //         //businessProofImageList = this.processImageResult(businessProofImageList, imageList);
    //         this.props.updateBusinessProofImagesList(businessProofImageList);
    //         this.props.updatePageType(PAGE_NAVIGATION_TYPES.BUSINESS_PROOF);
    //     }
    //     goToPage('IdProof');
    // }

    onSuccess(imageData){
        if(!imageData) return;
        let { idProofImageList, businessProofImageList } = this.props;
        const editFlow = this.props.navigation.getParam('editFlow', false);
        this.props.closeCameraModal();
        this.setState({
            openCamera: false,
        });
        const options = getFetchHeaders();
        let category = this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF ?  DOCUMENTS_TYPE.ID_PROOF:DOCUMENTS_TYPE.BUSINESS_DOCUMENT;
        let type = this.state.selectedType;
        
        this.props.uploadDocuments(imageData, this.props.merchantId, category, type, options, () =>{
            if(this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF){
                this.props.updatePageType(PAGE_NAVIGATION_TYPES.ID_PROOF);
            }else{
                category = DOCUMENTS_TYPE.BUSINESS_DOCUMENT;
                this.props.updatePageType(PAGE_NAVIGATION_TYPES.BUSINESS_PROOF);
            }
            if(editFlow){
                this.props.navigation.goBack();
            }else{
                goToPage('IdProof');
            }
        });
    }

     /** 
     *  Function to render the content based on upload images action
     */
    _renderContent(){

        let dictionary = this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF ?  ID_PROOF_TYPES : BUSINESS_PROOF_TYPES
        return(
            <ScrollView keyboardShouldPersistTaps={"always"}
                style={{flex:1}}
                contentContainerStyle={{flex:1}}
            >
                <View>
                    { Object.keys(dictionary).map((item,index) => {
                        return (
                            <View key={item+index} style={styles.listItemContainer}>
                                <RadioButton id={item} 
                                    selected={this.state.selectedType === item}  
                                    onSelection={this.handleSelection}
                                />
                                <View style={styles.proofItem}>
                                   <Text style={ this.state.selectedType === item ? styles.proofTextSelected : styles.proofText}>{dictionary[item]}</Text>
                                </View>
                            </View>
                        );
                    })}
            </View>
            </ScrollView>
        )
    }

    render(){
        return(
            <Container style={commonStyles.contentBackground}>
                <Header 
                    main="no" 
                    close={this.goBackHandler}
                    goBack={this.goBackHandler} 
                    headerName={this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF 
                        ? ID_PROOF.BRANDING_SELECT_PROOF 
                        : BUSINESS_PROOF.BRANDING_SELECT_PROOF
                    }  
                    timerStart={this.props.timerStart}
                />  
                {/* { this.props.timerStart && <Timer/> } */}


                {this.props.ajaxStatus.state !== 'inprogress'  ?
                <View style={{flex:1}}>
                    {this._renderContent()}
                    <TwoButton
                        loading={false}
                        button2Text={'TAKE A PHOTO'}
                        buttonDisabled={!this.state.selectedType}
                        button2Function={() => {
                            this.setState({
                                openCamera: true,
                            });
                            this.props.openCameraModal();
                        }}
                        button1Function={() => {goToPage('ReviewDetails')}}
                        button1Text={this.props.pageType === PAGE_NAVIGATION_TYPES.ID_PROOF ? 'SKIP KYC': 'SKIP THIS STEP'}
                    />
                    {this.state.openCamera &&
                    <CameraModal
                        type={'CAMERA'}
                        capturedImageList={this.onSuccess}
                    />
                    }
                </View>: <Spinner color={PRIMARY_COLOR} />}


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
        timerStart: state.timerDetails.timerStart,
        openCamera: state.modal.openCamera,
        idProofImageList: state.imageList.idProof,
        businessProofImageList: state.imageList.businessProof,
        merchantId: state.currentMerchantDetails.merchantId,
        devicePrint: state.devicePrint,
        agentId: state.loginDetails.agentId,
        initialToken: state.loginDetails.initialToken,
    };
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = {
    resetInitValue,
    updatePageType,
    openCameraModal, 
    closeCameraModal, 
    updateIDProofImagesList,
    updateBusinessProofImagesList,
    uploadDocuments
};

export default connect(mapStateToProps,mapDispatchToProps)(ProofSelection);

const styles = StyleSheet.create({
    listItemContainer:{
        marginTop: 20,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    proofText:{
        fontSize: 14,
        marginBottom: 11,
        color: LABEL_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    proofTextSelected:{
        fontSize: 14,
        marginBottom: 11,
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT
    },
    proofItem:{
        display: 'flex',
        borderBottomWidth: 1,
        marginTop: 10,
        width: responsiveWidth(100),
        borderBottomColor: UNDERLINE_COLOR
    }
});
