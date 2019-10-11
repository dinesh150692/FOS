/* Library Imports */
import React from 'react';
import {Icon, Spinner, Container} from 'native-base';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {Modal, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, BackHandler} from 'react-native';
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
/* Component Import */
import Header from '../components/header';
import Button from '../components/common/button';
import RadioButton from '../components/common/radio';
/* Action Import */
import {closeSMSModal} from '../redux/action/modalAction';
import {getBankList, updateSearchBankList} from '../redux/action/bankListAction';
import {sendLinkSMS} from '../redux/action/currentMerchantBankLinkAction';
/* Constant Import */
import {SMS, BANK_IMAGE_URL, ONBOARDING_STAGES} from '../shared/constants';
import {
    FONT_FAMILY,
    PRIMARY_COLOR,
    MEDIUM_FONT,
    BORDER_COLOR,
    REGULAR_FONT,
    MODAL_TEXT_COLOR,
    TEXT_COLOR,
    BACKGROUND_COLOR,
    CLEAR_ICON_COLOR,
    BACKGROUND_COLOR_GREY
} from '../shared/colors';
/* Style Import */
import commonStyles from '../style/style';
import {goToPage} from '../components/common/logout';


class SMSLinking extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            bankSearch: '',
            supportedBank: '',
            displaySearch: false,
            stagesList: Object.keys(ONBOARDING_STAGES)
        }
        this.getBankList = this.getBankList.bind(this);
        this.sendLinkSMS = this.sendLinkSMS.bind(this);
        this.renderLists = this.renderLists.bind(this);
        this.handleBankSearch = this.handleBankSearch.bind(this);
        this.handleSupportedBank = this.handleSupportedBank.bind(this);
    }

    componentDidMount() {
        this.getBankList();
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
    }

    handleBankSearch(value) {
        this.setState({bankSearch: value});
        this.props.updateSearchBankList(value);
    }

    /**
     * Call get get bank list and apply error to page
     * incase of error
     */
    getBankList() {
        this.state.error && this.setState({error: ''});
        this.props.getBankList.call(this, this.props.bankList);
    }

    /**
     *  Update the selected bank based on id to state
     *  @param {String} id
     */
    handleSupportedBank(id) {
        this.setState({supportedBank: id});
    }

    sendLinkSMS() {
        this.props.sendLinkSMS.call(this, {
            merchantId: this.props.merchantId,
            bankCode: this.state.supportedBank,
            smsType: "SMS"
        })
    }

    goBackHandler() {
        // this.state.stagesList.indexOf(this.props.onboardingStage) > 3
        goToPage('ReviewDetails');
        return true;
    }

    renderList = (item) => {
        return (
            <TouchableOpacity
                key={item.ifscPrefix}
                delayLongPress={4000}
                activeOpacity={0.14}
                onPress={ () => {
                    this.handleSupportedBank(item.ifscPrefix);
                }}
            >
                <View key={item.ifscPrefix} style={styles.bankContent}>
                    <RadioButton id={item.ifscPrefix} selected={this.state.supportedBank === item.ifscPrefix}
                                 onSelection={this.handleSupportedBank}
                    />
                    <FastImage
                        style={styles.image}
                        source={{
                            uri: BANK_IMAGE_URL + item.ifscPrefix + '.png',
                            priority: FastImage.priority.high
                        }}
                    />
                    <View style={styles.bankContainer}>
                        {/* <Text style={styles.bankTextHeader}>{item.ifscPrefix}</Text> */}
                        {this.state.bankSearch && this.state.bankSearch.length > 0
                            ?
                            this.renderSearchList(item)
                            : <Text style={styles.bankText}>
                                {item.name}
                            </Text>
                        }

                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderSearchList = (item) => {
        let bankName = item.name.toLowerCase();
        let searchName = this.state.bankSearch.toLowerCase();
        let textFound = bankName.includes(searchName);
        return (
            <React.Fragment>
            {textFound ?
                    <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                        <Text style={styles.bankText}>
                            {item.name.substring(0, bankName.indexOf(searchName))}
                        </Text>
                        <Text style={[styles.bankText, {fontWeight: MEDIUM_FONT}]}>
                            {this.state.bankSearch}
                        </Text>
                        <Text style={styles.bankText}>
                            {item.name.substring(bankName.indexOf(searchName) + this.state.bankSearch.length)}
                        </Text>
                    </View> :
                    <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                        <Text style={styles.bankText}>
                            {item.name}
                        </Text>
                    </View> }
            </React.Fragment>
        );
    }

    renderInput() {
        return (
            <View style={styles.inputContainer}>
                <TextInput
                    maxLength={10}
                    autoFocus={true}
                    onBlur={this.blur}
                    style={styles.input}
                    keyboardType={"default"}
                    value={this.state.bankSearch}
                    selectionColor={PRIMARY_COLOR}
                    onChangeText={this.handleBankSearch}
                    ref={c => {
                        this.inputRef = c
                    }}
                    underlineColorAndroid="transparent"
                />
                <TouchableOpacity
                    delayLongPress={4000}
                    activeOpacity={0.14}
                    onPress={() => {
                        this.setState({bankSearch: '', displaySearch: false})
                    }}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                >
                    <Icon ios='md-close' android="md-close" style={styles.clearIcon}/>
                </TouchableOpacity>
            </View>
        )
    }

    renderLists() {
        if (this.props.bankList.length === 0 && this.props.ajaxStatus.state === 'inprogress') {
            return <Spinner color={PRIMARY_COLOR}/>
        } else {
            return (
                <ScrollView>
                    {this.state.bankSearch.length > 0
                        ?
                        (
                            this.props.bankSearchList.length === 0
                                ?
                                <Text style={styles.noBankFound}>No bank found for the search</Text>
                                :
                                this.props.bankSearchList.map(item => {
                                    return this.renderList(item);
                                })
                        )
                        :
                        this.props.bankList.map(item => {
                            return this.renderList(item);
                        })
                    }
                </ScrollView>
            )
        }
    }

    render() {
        return (
            <Container style={commonStyles.contentBackground}>
                <Header main="no" headerName={SMS.TOP_HEADER}
                        goBack={() => {
                            this.goBackHandler();
                        }}
                        close={() => {
                            this.goBackHandler();
                        }}
                        timerStart={this.props.timerStart}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.header}>
                        {SMS.HEADER}
                    </Text>
                    <Text style={styles.text}>
                        {SMS.TEXT}
                    </Text>
                </View>
                <View style={styles.bankHeader}>
                    {this.state.displaySearch
                        ? this.renderInput()
                        :
                        <React.Fragment>
                            <Text style={styles.bankHeaderText}>Choose from Bank</Text>
                            <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} delayLongPress={4000}
                                              activeOpacity={1} onPress={() => {
                                this.setState({displaySearch: true})
                            }}>
                                <Icon ios='md-search' android="md-search" style={styles.headerSearch}/>
                            </TouchableOpacity>
                        </React.Fragment>
                    }
                </View>
                {this.renderLists()}
                <Button
                    complete={false}
                    submit={this.sendLinkSMS}
                    buttonDisabled={this.state.supportedBank.length === 0}
                    loading={this.state.supportedBank.length > 0 && this.props.ajaxStatus.state === 'inprogress'}
                >
                    {SMS.BUTTON_TEXT}
                </Button>
            </Container>
        );
    }
}

/**
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        openSMS: state.modal.openSMS,
        ajaxStatus: state.ajaxStatus,
        bankList: state.bankList.bankList,
        bankSearchList: state.bankList.bankSearchList,
        merchantId: state.currentMerchantDetails.merchantId,
        onboardingStage: state.currentMerchantDetails.onboardingStage,
        timerStart: state.timerDetails.timerStart,
    };
}

export default connect(mapStateToProps, {
    closeSMSModal,
    sendLinkSMS,
    getBankList,
    updateSearchBankList
})(SMSLinking)

const styles = StyleSheet.create({
    textContainer: {
        paddingTop: 20,
        paddingLeft: 16,
        paddingRight: 17
    },
    header: {
        fontSize: 16,
        color: TEXT_COLOR,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY
    },
    text: {
        fontSize: 14,
        marginTop: 8,
        marginBottom: 12,
        flexWrap: 'wrap',
        lineHeight: 22.7,
        color: MODAL_TEXT_COLOR,
        fontWeight: REGULAR_FONT,
        fontFamily: FONT_FAMILY
    },
    bankHeader: {
        height: 44,
        marginTop: 25,
        paddingLeft: 17,
        paddingTop: 16,
        paddingRight: 22,
        paddingBottom: 9,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR_GREY,
        width: responsiveWidth(100),
        justifyContent: 'space-between'
    },
    bankHeaderText: {
        fontSize: 16,
        color: TEXT_COLOR,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY
    },
    bankContent: {
        display: 'flex',
        paddingTop: 12,
        paddingBottom: 11.5,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        width: responsiveWidth(100),
        paddingRight: responsiveWidth(10),
        borderBottomColor: BACKGROUND_COLOR
    },
    image: {
        width: 32,
        height: 32,
    },
    bankContainer: {
        display: 'flex',
        marginLeft: 21,
        flexDirection: 'column'
    },
    headerSearch: {
        justifyContent: 'center', 
        alignItems: 'center',
        fontSize: 30,
        color: CLEAR_ICON_COLOR
    },
    bankText: {
        fontSize: 16,
        flexWrap: 'wrap',
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    input: {
        width: '97%',
        fontSize: 16,
        paddingLeft: 16,
        borderRadius: 2,
        color: TEXT_COLOR,
        borderBottomWidth: 1,
        fontFamily: FONT_FAMILY,
        borderBottomColor: BORDER_COLOR
    },
    inputContainer: {
        height: 40,
        paddingRight: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BACKGROUND_COLOR_GREY
    },
    clearIcon: {
        fontSize: 18,
        color: CLEAR_ICON_COLOR
    },
    noBankFound: {
        fontSize: 16,
        marginTop: 10,
        flexWrap: 'wrap',
        color: TEXT_COLOR,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT
    }
});
