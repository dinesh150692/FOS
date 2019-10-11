/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import { Container, ScrollableTab, Tab, Tabs } from 'native-base';
import { BackHandler, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
/* Component Import */
import Timer from '../components/timer';
import Header from '../components/header';
import Upload from '../components/common/upload';
import { goToPage } from "../components/common/logout";

/* Page Import */
import Branding from './branding'
import IdProof from './idproof'

/*Action Import*/
import { updatePageType } from '../redux/action/pageTypeAction';
import { getFetchHeaders } from '../redux/action/fetchHeaderAction';
import { getDocumentList } from '../redux/action/uploadAction';


/* Constant Import */
import { BRANDING, BRANDING_QR, BUSINESS_PROOF, ID_PROOF, PAGE_NAVIGATION_TYPES, DOCUMENTS_TYPE } from '../shared/constants';
import { BACKGROUND_WHITE_COLOR, FONT_FAMILY, MEDIUM_FONT, PRIMARY_COLOR, REGULAR_FONT, UNDERLINE_COLOR, WARM_GREY_COLOR } from '../shared/colors';
/* Image Imports */
import addImage from '../assets/add_button.png';
/* Style Import */
import commonStyles from '../style/style';
// import {
//     deleteDocuments,
//     getDocumentList,
//     updateBrandingImagesList,
//     updateQRImagesList,
//     uploadDocuments
// } from "../redux/action/uploadAction";
// import {resetInitValue} from "../redux/action/timerAction";
// import {closeCameraModal, closeSMSModal, openCameraModal, openSMSModal} from "../redux/action/modalAction";
// import {getMerchantList} from "../redux/action/merchantListAction";

 class EditImages extends React.PureComponent {
    constructor(props){
        super(props);
        this.updateTabType = this.updateTabType.bind(this);
        this.updateTabType(0);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
    }
    
    goBackHandler(){
        goToPage('ReviewDetails');
        return true;
    }

    updateTabType(i){
        let category = DOCUMENTS_TYPE.BRAND_IMAGE ;
        let pageType = PAGE_NAVIGATION_TYPES.BRANDING;
        switch (i) {
            case 0: category = DOCUMENTS_TYPE.BRAND_IMAGE;
                    pageType = PAGE_NAVIGATION_TYPES.BRANDING;
                    break;
            case 1: category = DOCUMENTS_TYPE.QR_IMAGE;
                    pageType = PAGE_NAVIGATION_TYPES.QR;
                    break;
            // case 2: category = DOCUMENTS_TYPE.ID_PROOF;
            //         pageType = PAGE_NAVIGATION_TYPES.ID_PROOF;
            //         break;
            // case 3: category = DOCUMENTS_TYPE.BUSINESS_DOCUMENT;
            //         pageType = PAGE_NAVIGATION_TYPES.BUSINESS_PROOF;
            //         break;
            default: break;

        }
        this.props.updatePageType(pageType);
        this.props.getDocumentList(this.props.merchantId, category, getFetchHeaders());

    }

    render(){
        return(
            <Container style={commonStyles.contentBackground}>
                <Header main="no" headerName={"Images"}  goBack={this.goBackHandler} close={this.goBackHandler}
                timerStart={this.props.timerStart}
                />  
                <Tabs
                    locked={true}
                    initialPage={0}
                    tabBarUnderlineStyle={{opacity:0}}
                    // renderTabBar={()=> <ScrollableTab />}
                    onChangeTab={({i})=>{
                       this.updateTabType(i);
                    }}
                >
                    <Tab 
                        heading="BRANDING"
                        tabStyle={styles.tabStyle}
                        activeTabStyle={styles.activeTabStyle} 
                        textStyle={styles.tabTextStyle} 
                        activeTextStyle={styles.activeTabTextStyle}
                    >   
                        <Branding editFlow={true}/>
                    </Tab>
                    <Tab 
                        heading="QR CODE"
                        tabStyle={styles.tabStyle} 
                        activeTabStyle={styles.activeTabStyle} 
                        textStyle={styles.tabTextStyle} 
                        activeTextStyle={styles.activeTabTextStyle}
                    >
                        <Branding editFlow={true}/>
                    </Tab>
                    {/*<Tab */}
                        {/*heading="PERSONAL ID"*/}
                        {/*tabStyle={styles.tabStyle} */}
                        {/*activeTabStyle={styles.activeTabStyle} */}
                        {/*textStyle={styles.tabTextStyle} */}
                        {/*activeTextStyle={styles.activeTabTextStyle}*/}
                    {/*>   */}
                        {/*<IdProof editFlow={true} navigation={this.props.navigation}/>*/}
                    {/*</Tab>*/}
                    {/*<Tab */}
                        {/*heading="BUSINESS PROOF"*/}
                        {/*tabStyle={styles.tabStyle} */}
                        {/*activeTabStyle={styles.activeTabStyle} */}
                        {/*textStyle={styles.tabTextStyle} */}
                        {/*activeTextStyle={styles.activeTabTextStyle}*/}
                    {/*>*/}
                        {/*<IdProof editFlow={true} navigation={this.props.navigation}/>*/}
                    {/*</Tab>*/}
                </Tabs>
            </Container>  
        )
    }
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        imageList: state.imageList,
        ajaxStatus: state.ajaxStatus,
        devicePrint: state.devicePrint,
        openCamera: state.modal.openCamera,
        timerStart : state.timerDetails.timerStart,
        onboardingStage: state.currentMerchantDetails.onboardingStage,
        merchantId: state.currentMerchantDetails.merchantId
    };
}
const mapDispatchToProps = {
    updatePageType,
    getDocumentList
};

export default connect(mapStateToProps, mapDispatchToProps)(EditImages)

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
        backgroundColor: BACKGROUND_WHITE_COLOR
    
    },
    activeTabStyle: {
        borderBottomWidth: 6,
        borderColor: PRIMARY_COLOR,
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    contentContainerStyle:{
        display: 'flex',
        paddingBottom: 63
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
    imageContainer: {
        width: 200,
        marginTop: 21,
        marginLeft: 17,
        marginBottom: 21,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
});