/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import { Container, Icon, Spinner } from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import {Sentry} from "react-native-sentry";

import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { BackHandler, FlatList, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View, Modal } from 'react-native';
/* Image Import */
import addIcon from '../assets/add_new.png';
import noMerchant from '../assets/no_merchants.png';
/* Component Import */
import Header from '../components/header';
import SuccessMessage from '../components/success';
import { goToPage } from '../components/common/logout';
import AlertModal from '../components/common/alertModal';
/* Action Import */
import { clearTimer, initTimer, resetInitValue } from '../redux/action/timerAction';
import { clearCategoryDetails } from '../redux/action/categoryAction';
import { getMerchantList, updateSearchList, getMerchantOnboardedCount } from '../redux/action/merchantListAction';
import { closeAllModal, openAlertModal, closeAlertModal, openSearchModal, closeSearchModal} from '../redux/action/modalAction';
import { clearMerchantDetails, updateEditFlowType, dropMerchant, loadCurrentMerchantId } from '../redux/action/currentMerchantAction';
/* Constant Import */
import { NO_MERCHANT, ONBOARDING_STAGES, RETRY_AGAIN, CLOSE_ACCOUNT_ALERT } from '../shared/constants';
import { BOLD_FONT, BUTTON_PRESS_COLOR, BACKGROUND_WHITE_COLOR, BUTTON_TEXT_COLOR, CLEAR_ICON_COLOR, FONT_FAMILY, LABEL_COLOR, MEDIUM_FONT, MERCHANT_COLORS, MODAL_TEXT_COLOR, PRIMARY_COLOR, REGULAR_FONT, TEXT_COLOR, UNDERLINE_COLOR, WARM_GREY_COLOR, HEADER_TEXT_COLOR} from '../shared/colors';
import { ERROR_CODES_AND_MESSAGES } from '../shared/errorCodes';
/* Style Import */
import commonStyles from '../style/style';
/* Image Import */
import deleteImage from '../assets/delete.png';


class MerchantList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            phoneNumber: ''
        }
        this.closeAccount = this.closeAccount.bind(this);
        this.closeHandler = this.closeHandler.bind(this);
        this._renderContent = this._renderContent.bind(this);
        this.addNewMerchant = this.addNewMerchant.bind(this);
        this.getMerchantList = this.getMerchantList.bind(this);
        this.renderSearchModal = this.renderSearchModal.bind(this);
        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.editMerchantDetails = this.editMerchantDetails.bind(this);
        this._renderMerchantList = this._renderMerchantList.bind(this);
        this._renderMerchantOnboardedDetails = this._renderMerchantOnboardedDetails.bind(this);
    }

    componentDidMount(){
        this.props.clearTimer();
        this.getMerchantList();
        BackHandler.addEventListener('hardwareBackPress', this.closeHandler);
        this.props.updateEditFlowType(false);
        SplashScreen.hide();
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.closeHandler);
    }

    handleSearchInput(value){
        this.props.updateSearchList(value);
        this.setState({phoneNumber: value.replace(/[^0-9]+/g,'')});
    }

     /** 
     *  Dispatch action to close the account 
     */
    closeAccount(){
        if(this.state.merchantId){
            this.props.dropMerchant.call(this, this.state.merchantId);
        }
    }

    closeHandler(){
        BackHandler.exitApp();
    }

    /** 
     * Call get merchant list and apply error to merchant list page
     * incase of error
     */
    getMerchantList(){
        this.state.error ? this.setState({error: ''}) : null;
        this.props.getMerchantList.call(this);
        this.props.getMerchantOnboardedCount.call(this);
    }

    /** 
     * Navigate to the new merchant page and clear the existing merchant details
     * and call super category api 
     */
    addNewMerchant(){
        Keyboard.dismiss();
        this.props.clearMerchantDetails();
        this.props.resetInitValue(false);
        this.props.clearCategoryDetails();
        this.props.updateEditFlowType(false);
        goToPage('AddMerchant');
    }

    /** 
     * Navigate to the edit merchant page and clear the existing merchant details
     */
    editMerchantDetails(merchantId){
        Keyboard.dismiss();
        this.props.clearMerchantDetails();
        this.props.loadCurrentMerchantId(merchantId);
        this.props.updateEditFlowType(true);
        this.props.resetInitValue(false);
        this.props.initTimer();
        goToPage('ReviewDetails');
    }

    /** 
     *  Format the data  
     *  @param {String} date
     */
    formatDate(date) {
        var d = new Date(date);
        return d.toString().substring(4,15).toUpperCase();
    }

    _renderItemList = ({item, index}) => (
        <TouchableOpacity key={item.merchantId}
                          style={styles.listItemContainer}
                          delayLongPress={4000}
                          activeOpacity={0.14}
                          onPress={() => this.editMerchantDetails(item.merchantId)}
                          disabled={item.onboardingStage === ONBOARDING_STAGES.ACTIVE || item.onboardingStage === ONBOARDING_STAGES.DROPPED}
        >
            <View style={[{backgroundColor: MERCHANT_COLORS[index % MERCHANT_COLORS.length]}, styles.colorContainer]}>
                <Text style={{color: 'white', fontSize: responsiveFontSize(2)}}>{item.name.substring(0,2).toUpperCase()}</Text>
            </View>
            <View style={styles.listItem}>
                <View style={[styles.listContent, {marginBottom: 3}]}>
                        <Text style={styles.name} ellipsizeMode='tail' numberOfLines={1}>
                            {item.name}
                        </Text>
                    <TouchableOpacity 
                        delayLongPress={4000} 
                        activeOpacity={0.14} 
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        onPress={() => {
                            this.props.openAlertModal()
                            this.setState({merchantId: item.merchantId})
                        }}
                        disabled={item.onboardingStage === ONBOARDING_STAGES.ACTIVE || item.onboardingStage === ONBOARDING_STAGES.DROPPED}
                        
                    >
                       <Image source={deleteImage} resizeMode={'contain'} style={styles.deleteImage} />
                    </TouchableOpacity>  
                </View>
                <View style={[styles.listContent, {marginBottom: 8}]}>
                    {this.state.phoneNumber && this.state.phoneNumber.length > 0 
                        ?
                            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                                <Text style={styles.phone}>
                                    {item.phoneNumber.substring(0,item.phoneNumber.indexOf(this.state.phoneNumber))}
                                </Text>
                                <Text style={[styles.phone,{fontWeight: MEDIUM_FONT}]}>
                                    {this.state.phoneNumber}
                                </Text>
                                <Text style={styles.phone}>
                                    {item.phoneNumber.substring(item.phoneNumber.indexOf(this.state.phoneNumber)+ this.state.phoneNumber.length)}
                                </Text>
                            </View> 
                        :   <Text style={styles.phone}>
                            {item.phoneNumber}
                            </Text>
                    }
                </View>
                <View style={[styles.listContent, {marginBottom: 10}]}>
                    <Text style={styles.level}>
                        {ONBOARDING_STAGES[item.onboardingStage]}
                    </Text>
                    <Text style={styles.date}>
                        {this.formatDate(item.updatedAt)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );


    _renderContent(){
        if(this.props.ajaxStatus.state === 'inprogress'){
            return <Spinner color={PRIMARY_COLOR} />
        }else{
            return (
                <View style={{flex:1}}> 
                    {this._renderMerchantOnboardedDetails()}                
                    {this._renderMerchantList(this.props.merchantList, false)}
                    <TouchableHighlight delayLongPress={4000} underlayColor={BUTTON_PRESS_COLOR} style={styles.floater}  onPress={this.addNewMerchant}>
                        <Image style={styles.addImage} resizeMode={'contain'} source={addIcon}/>
                    </TouchableHighlight>
                </View>
            )
        }
    }

    _renderMerchantList(merchantList, displaySearchEmpty){
        if(merchantList.length === 0 ){
            return(
                <View style={styles.noItemContainer}>
                    {this.state.error 
                        ? 
                            <React.Fragment>
                                <Image source={noMerchant} resizeMode={'contain'} style={styles.noMerchantImage}/>
                                <Text style={styles.noItemText}>{ERROR_CODES_AND_MESSAGES.GENERIC_ERROR}</Text>
                                <TouchableHighlight 
                                    delayLongPress={4000}
                                    style={styles.errorButton}
                                    onPress={this.getMerchantList}
                                    underlayColor={BUTTON_PRESS_COLOR}
                                >
                                    <Text style={styles.errorButtonText}>{RETRY_AGAIN}</Text>
                                    {/* <Icon android="md-refresh" ios="md-refresh" style={styles.refreshIcon}/> */}
                                </TouchableHighlight>
                        
                            </React.Fragment>
                        : 
                            displaySearchEmpty 
                            ? 
                                <React.Fragment>
                                    <Image source={noMerchant} resizeMode={'contain'} style={styles.noMerchantImage}/>
                                    <Text style={styles.noItemText}>{NO_MERCHANT.NO_SEARCH_MERCHANT}</Text>
                                </React.Fragment>
                            : 
                            (
                                (this.props.merchantCountDetails.currentMonth > 0 || this.props.merchantCountDetails.lastMonth > 0 ) && merchantList.length === 0
                                ?
                                <React.Fragment>
                                    <Image source={noMerchant} resizeMode={'contain'} style={styles.addMerchant}/>
                                    <Text style={styles.noItemTextHeader}>{NO_MERCHANT.ADD_MORE_MERCHANTS}</Text>
                                    <Text style={styles.noItemText}>{NO_MERCHANT.NO_MERCHANT_LIST}</Text>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Image source={noMerchant} resizeMode={'contain'} style={styles.noMerchantImage}/>
                                    <Text style={styles.noItemTextHeader}>{NO_MERCHANT.NO_MERCHANT_HEADER}</Text>
                                    <Text style={styles.noItemTextHeader}>{NO_MERCHANT.NO_MERCHANT_HEADER1}</Text>
                                    <Text style={styles.noItemText}>{NO_MERCHANT.NO_MERCHANT_LIST}</Text>
                                </React.Fragment>
                            )
                    }
                </View>
            );
        }else{
            return (
                <FlatList
                    keyboardShouldPersistTaps={"always"}
                    automaticallyAdjustContentInsets={false}
                    data = {merchantList}
                    extraData = {this.props}
                    keyExtractor = {(item) => item.merchantId+item.name}
                    renderItem = {this._renderItemList}
                />
            )
        }
    }

    _renderMerchantOnboardedDetails(){
        if(this.props.merchantList.length === 0 && this.props.merchantCountDetails.lastMonth  === 0 && this.props.merchantCountDetails.currentMonth === 0 && this.props.merchantCountDetails.today === 0){
            return;
        }
        return(
            <View style={styles.merchantContainer}>
                <View style={styles.topContainer}>
                </View>
                <View style={styles.bottomContainer}>
                </View>
                <View style={styles.itemContainer}>
                    <View style={styles.itemOnboarded}>
                        <Text style={styles.itemOnboardedHeader}>{this.props.merchantCountDetails.lastMonth || 0}</Text>
                        <Text style={styles.itemOnboardedText}>{this.props.merchantCountDetails.lastMonth == 1 ? 'Merchant' : 'Merchants'} onboarded in {this.props.merchantCountDetails.lastMonthName}</Text>
                    </View>
                    <View style={styles.itemOnboarded}>
                        <Text style={styles.itemOnboardedHeader}>{this.props.merchantCountDetails.currentMonth || 0}</Text>
                        <Text style={styles.itemOnboardedText}>{this.props.merchantCountDetails.currentMonth == 1 ? 'Merchant' : 'Merchants'} onboarded in {this.props.merchantCountDetails.currentMonthName}</Text>
                    </View>
                    <View style={styles.itemOnboarded}>
                        <Text style={styles.itemOnboardedHeader}>{this.props.merchantCountDetails.today || 0}</Text>
                        <Text style={styles.itemOnboardedText}>{this.props.merchantCountDetails.today == 1 ? 'Merchant' : 'Merchants'} onboarded on {this.props.merchantCountDetails.currentMonthName + ' '+ this.props.merchantCountDetails.todayName}</Text>
                    </View>
                </View>
            </View>
        )
    }

    render(){
        return ( 
            <Container style={commonStyles.contentBackground}>
                <Header main="yes" headerName=" My Merchants" onSearchClick={this.props.openSearchModal}/>     
                {this._renderContent()}
                {this.props.successTimer && <SuccessMessage />}
                {this.props.openAlert && 
                    <AlertModal 
                        displayCloseButton={true}
                        text={CLOSE_ACCOUNT_ALERT.TEXT}
                        header={CLOSE_ACCOUNT_ALERT.HEADER}
                        button1Function={this.props.closeAlertModal}
                        button1Text={CLOSE_ACCOUNT_ALERT.BUTTON_TEXT1}
                        button2Text={CLOSE_ACCOUNT_ALERT.BUTTON_TEXT2}
                        button2Function={()=>{
                            this.props.closeAlertModal();
                            this.closeAccount()
                        }}
                    />
                }
                {this.renderSearchModal()}
             </Container>        
        );
    } 

    renderSearchModal() {
        if(this.refs.inputRef){
            this.refs.inputRef.focus();
        }
		return (
            <Modal 
                animationType="fade"
                transparent={false}
                visible={this.props.openSearch}
                onRequestClose={() => {
                    this.setState({phoneNumber: ''})
                    this.props.closeSearchModal()
                }}
            >
                <View style={{flex:1}}>
                    <View style={styles.headerItemSearch}>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                maxLength={10} 
                                autoFocus={true} 
                                onBlur={this.blur}
                                style={styles.input}
                                keyboardType={"numeric"}
                                value={this.state.phoneNumber}
                                selectionColor={PRIMARY_COLOR}
                                onChangeText={this.handleSearchInput}
                                ref={c => { this.inputRef = c}} 
                                underlineColorAndroid="transparent"
                            />
                            <TouchableOpacity
                                delayLongPress={4000}  
                                activeOpacity={0.14} 
                                onPress={() => {
                                    this.setState({phoneNumber: ''})
                                    // Keyboard.dismiss();
                                    this.props.closeSearchModal()
                                }}
                                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                            >
                                <Icon ios='md-close' android="md-close" style={styles.clearIcon}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this._renderMerchantList(this.props.searchMerchantList, true)}
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
        openAlert:  state.modal.openAlert, 
        openSearch: state.modal.openSearch,      
        successTimer: state.timerDetails.successTimer,
        merchantList: state.merchantList.merchantList,
        superCategory : state.categories.superCategory,
        searchMerchantList: state.merchantList.searchMerchantList,
        merchantCountDetails: state.merchantList.merchantCountDetails
    };
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = {
    initTimer,
    clearTimer,
    dropMerchant,
    closeAllModal,
    openAlertModal, 
    resetInitValue,
    openSearchModal,
    closeAlertModal,
    closeSearchModal,
    getMerchantList,  
    updateSearchList,
    updateEditFlowType,
    clearCategoryDetails,
    clearMerchantDetails,
    loadCurrentMerchantId,
    getMerchantOnboardedCount
};

export default connect(mapStateToProps, mapDispatchToProps)(MerchantList);

const styles = StyleSheet.create({
    colorContainer:{
        width: 40,
        height: 40, 
        display: 'flex',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItemContainer: {
        width: '100%',
        paddingTop: 19,
        paddingLeft: 14,
        display: 'flex',
        flexDirection:'row',
        alignItems: 'flex-start',
    },
    listItem: {
        flexGrow: 1,
        display: 'flex',
        marginLeft: 14,
        paddingRight: 17,
        borderBottomWidth: 1,
        flexDirection: 'column',
        borderBottomColor: UNDERLINE_COLOR
    },
    listContent:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 16,
        color: TEXT_COLOR,
        fontWeight: BOLD_FONT,
        fontFamily: FONT_FAMILY,
        width: responsiveWidth(65)
    },
    phone: {
        fontSize: 14,
        color: '#5F5F5F',
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    level:{
        fontSize: 10,
        color: '#F5A624',
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    date: {
        fontSize: 10,
        fontFamily: FONT_FAMILY,
        color: MODAL_TEXT_COLOR,
        fontWeight: REGULAR_FONT
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
        width: responsiveWidth(10),
        height: responsiveWidth(10)
    },
    editIcon:{
        fontSize: 20,
        paddingLeft: 5,
        color: CLEAR_ICON_COLOR
    },
    refreshIcon:{
        color: PRIMARY_COLOR,
        marginTop: responsiveHeight(1),
        fontSize: responsiveFontSize(4)
    },
    noItemContainer:{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    noItemText:{
        fontSize: 14,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        color: WARM_GREY_COLOR,
        fontWeight: REGULAR_FONT,
        marginHorizontal: responsiveWidth(10)
    },
    noMerchantImage:{
        width: 250,
        height: 191.2,
        marginTop: responsiveHeight(7),
        marginBottom: responsiveHeight(5)
    }, 
    errorButton:{
        left: 0,
        bottom: 0,
        width: responsiveWidth(80),
        marginTop: responsiveHeight(5),
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: responsiveHeight(3),
        marginHorizontal: responsiveWidth(10)
    },
    errorButtonText:{
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT,
        color: BUTTON_TEXT_COLOR,
        fontSize: responsiveFontSize(2)
    },
    noItemTextHeader:{
        fontSize: 25,
        color: LABEL_COLOR,
        textAlign: 'center',
        fontWeight: BOLD_FONT,
        fontFamily: FONT_FAMILY,
        marginBottom: responsiveHeight(1)
    },
    merchantContainer: {
        width: '100%',
        height: 136,
        display: 'flex',
        flexDirection:'column'
    },
    topContainer:{
        height: 68,
        width: '100%',
        backgroundColor: PRIMARY_COLOR,    
    },
    bottomContainer:{
        height: 68,
        width: '100%',
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    itemContainer: {
      width: '100%',
      height: '100%',
      zIndex: 1111,
      paddingHorizontal: 16,
      flexDirection: 'row',
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    itemOnboarded:{
        elevation: 2,
        width: responsiveWidth(28),
        height: 104,
        paddingVertical: 16,
        display: 'flex',
        borderRadius: 4,
        alignItems:'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    itemOnboardedHeader:{
        fontSize: 20,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY,
        color: PRIMARY_COLOR
    },
    itemOnboardedText:{
        fontSize: 12,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT,
        color: WARM_GREY_COLOR
    },
    headerItemSearch:{
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: PRIMARY_COLOR
    },
    input: {
        width: 200,
        fontSize: 16,
        paddingLeft: 16,
        borderRadius: 2,
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY
    },
    inputContainer:{
        height: 40,
        borderRadius: 2,
        paddingRight: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: HEADER_TEXT_COLOR
    },
    clearIcon:{
        fontSize: 22,
        color: CLEAR_ICON_COLOR
    },
    deleteImage:{
        width: 20,
        height: 21.4
    },
    addMerchant: {
        width: 250, 
        height: 191.2, 
        marginTop: responsiveHeight(3)
    }
});