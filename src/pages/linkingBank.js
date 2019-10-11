/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import { Container, Spinner, Icon } from 'native-base';
import FastImage from 'react-native-fast-image';
import {BackHandler, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
/* Component Import */
import Timer from '../components/timer';
import Header from '../components/header';
import Button from '../components/common/button';
import RadioButton from '../components/common/radio';
import { goToPage } from '../components/common/logout';
/* Action Import */
import { resetInitValue } from '../redux/action/timerAction';
import { getLinkedBankList, linkBankAccount } from '../redux/action/currentMerchantBankLinkAction';
/* Constant Import */
import { BANK_IMAGE_URL, BANK_LINKING } from '../shared/constants';
import { BACKGROUND_WHITE_COLOR, BOLD_FONT, FONT_FAMILY, LABEL_COLOR, MEDIUM_FONT, PRIMARY_COLOR, TEXT_COLOR, UNDERLINE_COLOR, WARM_GREY_COLOR } from '../shared/colors';
/* Image Import */
import noBank from '../assets/no_banks.png';
/* Style Import */
import commonStyles from '../style/style';

class LinkingBank extends React.PureComponent {
	constructor(props){
		super(props);
		this.state = {
            loading: false,
            linkedBank : this.props.linkedBank || '',
            error: '',
            success: false
        }
        this.goBackHandler = this.goBackHandler.bind(this);
        this._renderButton = this._renderButton.bind(this);
        this.submitLinkBank = this.submitLinkBank.bind(this);
        this._renderContent = this._renderContent.bind(this);
        this.handleLinkedBank = this.handleLinkedBank.bind(this);
        this.getLinkedBankList = this.getLinkedBankList.bind(this);
        this._renderErrorContent = this._renderErrorContent.bind(this);
        this.replaceXWithAsterix = this.replaceXWithAsterix.bind(this);
    }
    
    componentDidMount(){
        this.getLinkedBankList();
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
    }
   
    goBackHandler(){
        // this.props.resetInitValue(false);
        goToPage('ReviewDetails');
        return true;
    }

    getLinkedBankList(){
        this.props.getLinkedBankList.call(this, this.props.merchantId);
    }

	/** 
     *  Update the selected bank based on id to state
     *  @param {String} id
     */
    handleLinkedBank(id){
		this.setState({linkedBank: id});
    }

    /** 
     *  Dispatch action to store the selected bank and navigate to QR Page
     *  or review details page based on action
     */
    submitLinkBank(){
        let bankDetails = null;
        this.props.bankLinkedList.forEach(element => {
            if(element.accountId === this.state.linkedBank){
                bankDetails = element;
            }
        });
        if(!!bankDetails){
            this.setState({loading: true});
            this.props.linkBankAccount.call(this, this.props.merchantId, bankDetails);
        }
    }
    
    /** 
     *  Function to render the button based on linked bank details action
     */
    _renderButton(){
        if(this.state.success) {
            return (
                <Button
                    complete={true}
                    submit={()=>{return}}
                    loading={false}
                    buttonDisabled={false}
                >
                    <Text>{BANK_LINKING.LINKING_SUCCESSFUL+ '    '}</Text>
                    <Icon ios='md-checkmark' android="md-checkmark" style={styles.successIcon}/>
                </Button>
            );
        }else if(this.props.bankLinkedList.length > 0){
            return (
                <Button
                    complete={false}
                    submit={this.submitLinkBank}
                    loading={this.state.loading}
                    buttonDisabled={this.state.linkedBank.length === 0}
                >
                    {BANK_LINKING.LINK_ACCOUNT}
                </Button>
            );
        }else {
            return (
                <Button
                    complete={false}
                    submit={this.getLinkedBankList}
                    loading={false}
                    buttonDisabled={false}
                >
                    {BANK_LINKING.REFRESH}
                </Button>
            );
        }
    }

    /** 
     *  Replace X with asterix
    */
    replaceXWithAsterix(string){
        return string.replace(/x/gi, '*');
    }
    
    /** 
     *  Function to render the content based on linked bank details action
     */
    _renderContent(){
        return(
            <React.Fragment>
                <ScrollView keyboardShouldPersistTaps={"always"}>
                    {this.props.ajaxStatus.state === 'inprogress' 
                        ?   <Spinner color={PRIMARY_COLOR} />
                        :
                            <View>
                                { this.props.bankLinkedList && this.props.bankLinkedList.length > 0 
                                ? 
                                    <View style={{flex:1, justifyContent:'space-between'}}>
                                        <React.Fragment>
                                            { this.props.bankLinkedList.map( item => {
                                                return (
                                                <TouchableOpacity
                                                    key={item.accountId}
                                                    delayLongPress={4000}
                                                    activeOpacity={0.14}
                                                    onPress={ () => {
                                                        this.handleLinkedBank(item.accountId);
                                                    }}
                                                >
                                                    <View key={item.accountId} style={styles.bankItemContainer}>
                                                        <View>
                                                            <RadioButton id={item.accountId} selected={this.state.linkedBank === item.accountId}  onSelection={this.handleLinkedBank}/>  
                                                        </View>
                                                        <View style={[styles.bankItem, styles.bankAccount]}> 
                                                            <FastImage
                                                                    style={styles.bankImage}
                                                                    source={{
                                                                        uri: BANK_IMAGE_URL + item.ifsc +'.png',
                                                                        priority: FastImage.priority.high
                                                                    }}
                                                                />
                                                            <View style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
                                                                <Text style={styles.bankAccountText}>{this.replaceXWithAsterix(item.accountNo) || ''}</Text>
                                                                <Text style={styles.bankName}>{this.props.bankIfscMap[item.ifsc] || ''}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                );
                                            })}
                                        </React.Fragment>
                                    </View>
                                :
                                    <View style={styles.emptyContainer}>
                                        {this._renderErrorContent()}
                                    </View>
                                }
                            </View>
                    }
                </ScrollView>
            </React.Fragment>
        )
    }

    /** 
     *  Function to render the error content based on linked bank details action
     */
    _renderErrorContent(){
        if(this.props.ajaxStatus.state === 'error' || (this.state.error.length > 0 && this.state.error !== 'USER_NOT_REGISTERED')){
            return (
                <React.Fragment>
                    <Image source={noBank} resizeMode={'contain'} style={styles.noBankImage}/>
                    <Text style={styles.emptyText}>{this.state.error}</Text>
                </React.Fragment>
            );
        }else{
            return(
                <React.Fragment>
                    <Image source={noBank} resizeMode={'contain'}  style={[styles.noBankImage, { height:responsiveHeight(45), marginBottom: responsiveHeight(2)}]}/>
                    <Text style={styles.noItemTextHeader}>{BANK_LINKING.NO_BANK_FOUND}</Text>
                    <Text style={styles.emptyText}>
                    {this.state.error === 'USER_NOT_REGISTERED' 
                        ? BANK_LINKING.NO_LINK_FOUND
                        : BANK_LINKING.NO_BANK_FOUND_TEXT
                    }
                    </Text>
                </React.Fragment>
            ); 
        }                                            
    }

    render() {
		return (
			<Container style={commonStyles.contentBackground}>
                <Header main="no" headerName="Linking Bank"  goBack={this.goBackHandler} close={this.goBackHandler}
                    timerStart={this.props.timerStart}
                />
                { this.props.ajaxStatus.state !== 'inprogress'
                    ? 
                        <React.Fragment>
                            {this._renderContent()}
                            {this._renderButton()}
                        </React.Fragment>
                    :
                        <Spinner color={PRIMARY_COLOR} />
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
        ajaxStatus: state.ajaxStatus,
        bankIfscMap: state.bankList.bankIfscMap,
        timerStart: state.timerDetails.timerStart,
        bankLinkedList: state.currentMerchantbankLinkedList,
        merchantId: state.currentMerchantDetails.merchantId,
        linkedBank : state.currentMerchantDetails.bankDetails.accountId
    };
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = { 
    resetInitValue,
    linkBankAccount,
    getLinkedBankList
};

export default connect(mapStateToProps, mapDispatchToProps)(LinkingBank);

const styles = StyleSheet.create({
    bankItemContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: responsiveHeight(3),
        marginBottom: responsiveHeight(0.7)
    },
    bankItem:{
        display: 'flex',
        borderBottomWidth: 1,
        flexDirection: 'row',
        width: responsiveWidth(100),
        borderBottomColor: UNDERLINE_COLOR,
        paddingBottom: responsiveHeight(2)
    },
    bankName:{
        fontSize: 10,
        lineHeight: 20,
        color: WARM_GREY_COLOR,
        fontFamily: FONT_FAMILY,
        marginLeft: responsiveWidth(3)
    },
    bankAccount:{
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center'
    },
    bankAccountText:{
        letterSpacing: 2,
        fontSize: 16,
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT,
        marginLeft: responsiveWidth(3)
    },
    content:{
        flex:1,
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    emptyContainer:{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: responsiveHeight(5)
    },
    emptyText:{
        fontSize: 14,
        textAlign: 'center',
        color: WARM_GREY_COLOR,
        fontFamily: FONT_FAMILY,
        marginHorizontal: responsiveWidth(10)
    },
    bankImage:{
        marginLeft: responsiveWidth(3),
        width:  responsiveWidth(7.5),
        height: responsiveHeight(5)
    },
    noBankImage:{
        width: 320,
        height:245.9,
        marginBottom: responsiveHeight(5)
    },
    noItemTextHeader:{
        fontSize: 24,
        lineHeight: 28.8,
        color: LABEL_COLOR,
        textAlign: 'center',
        fontWeight: BOLD_FONT,
        fontFamily: FONT_FAMILY
    },
    successIcon:{
        marginLeft: 12.8,
        fontSize: 18,
        color: 'white'
    }
});