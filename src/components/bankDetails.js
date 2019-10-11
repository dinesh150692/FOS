/* Library Imports */
import React from "react";
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
/* Component Import */
import { goToPage } from '../components/common/logout';
/* Constant Import */
import { BANK_IMAGE_URL, GENERATE_OTP } from '../shared/constants';
import { BACKGROUND_WHITE_COLOR, EDIT_ICON_COLOR, FONT_FAMILY, FONT_STYLE, LABEL_COLOR, MEDIUM_FONT, REGULAR_FONT, TEXT_COLOR, WARM_GREY_COLOR } from '../shared/colors';
/* Image Import */
import bankImage from '../assets/bank.png';
import bankBlurDetails from '../assets/blurred_bank_section.png';

class BankDetails extends React.PureComponent {
	constructor(props){
        super(props);
        this.editFunction = this.editFunction.bind(this);
        this.replaceXWithAsterix = this.replaceXWithAsterix.bind(this);
        this.renderWithEditDetails = this.renderWithEditDetails.bind(this);
        this.renderWithoutEditDetails = this.renderWithoutEditDetails.bind(this);
    }

    /** 
     *  Redirect User to edit address page with bank details
     */
    editFunction(){
        goToPage('LinkingBank');
    }

    /** 
     *  Replace X with asterix
    */
    replaceXWithAsterix(string){
        return string.replace(/x/gi, '*');
    }

    renderWithEditDetails(){
        return (
            <View style={styles.bankContainer}>
                <Text style={styles.text}>BANK DETAILS</Text>
                <View style={styles.bankContentContainer}>
                    <FastImage
                        style={styles.image}
                        source={{
                            uri: BANK_IMAGE_URL + this.props.bankDetails.ifsc +'.png',
                            priority: FastImage.priority.high
                        }}
                    />
                    <View style={styles.flex}>
                        <View style={styles.bankContent}>
                            <React.Fragment>
                                <Text style={styles.bankAccount}>{ this.replaceXWithAsterix(this.props.bankDetails.accountNo) || ''}</Text>
                                <Text style={styles.bankName}>{this.props.bankIfscMap[this.props.bankDetails.ifsc] || '' }</Text>
                            </React.Fragment>
                        </View>
                        <TouchableOpacity
                            delayLongPress={4000}  
                            onPress={this.editFunction}
                            activeOpacity={0.14}
                            disabled ={this.props.otpStatus === GENERATE_OTP } 
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                                <Icon ios='md-create' android="md-create" style={ this.props.otpStatus === GENERATE_OTP ? styles.editIconDisabled : styles.editIconDisabled}/>
                        </TouchableOpacity>
                    </View> 
                </View>
            </View>
        );
    }

    renderWithoutEditDetails(){
        return (
            <View style={styles.bankContainerWithoutEdit}>
                <Image source={bankImage} resizeMode={'contain'} style={styles.bankImage}/>
                <View style={styles.bankContentContainerWithoutEdit}>
                    <Text style={styles.text}>BANK DETAILS</Text>
                    <View style={[styles.bankContentContainer, {marginTop: 6}]}>
                        <FastImage
                            style={styles.image}
                            source={{
                                uri: BANK_IMAGE_URL + this.props.bankDetails.ifsc +'.png',
                                priority: FastImage.priority.high
                            }}
                        />
                        <View style={styles.flex}>
                            <View style={styles.bankContent}>
                                <React.Fragment>
                                    <Text style={styles.bankAccount}>{ this.replaceXWithAsterix(this.props.bankDetails.accountNo) || ''}</Text>
                                    <Text style={styles.bankName}>{this.props.bankIfscMap[this.props.bankDetails.ifsc] || '' }</Text>
                                </React.Fragment>
                            </View>
                        </View> 
                    </View>
                </View>
            </View>
        );
    }

	render() {
        const otpStatus = (this.props.otpStatus === GENERATE_OTP);
        if(Object.keys(this.props.bankDetails).length > 0){
            return (
                otpStatus 
                ? <Image source={bankBlurDetails} resizeMode={'stretch'} style={styles.bankBlurImage}/>
                :
                <React.Fragment>
                    {this.props.editable 
                        ?this.renderWithEditDetails()
                        :this.renderWithoutEditDetails()
                    }
                </React.Fragment> 
            );
        }else{
            return null;
        }
	}
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        bankIfscMap: state.bankList.bankIfscMap,
        bankDetails: state.currentMerchantDetails.bankDetails
    };
}

export default connect(mapStateToProps, {})(BankDetails);

const styles = StyleSheet.create({
    image:{
        width: responsiveHeight(4),
        height: responsiveHeight(3.4),
        marginRight: responsiveWidth(3),
        marginTop: responsiveHeight(0.7)
    },
    bankBlurImage:{
        marginTop: 8,
        width: responsiveWidth(80),
        height: responsiveHeight(15)
    },
    bankContainer:{
        marginTop: 8,
        paddingTop: 18,
        paddingLeft: 16, 
        paddingBottom: 22,
        paddingRight: 17.5,
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: responsiveWidth(100),
        justifyContent: 'space-between',
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    bankContainerWithoutEdit:{
        marginTop: 2,
        paddingTop: 18,
        paddingLeft: 16, 
        paddingBottom: 22,
        paddingRight: 17.5,
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: responsiveWidth(100),
        justifyContent: 'space-between',
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    bankContentContainerWithoutEdit:{
        marginLeft: 16,
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: responsiveWidth(80),
        justifyContent: 'space-between'
    },
    text:{
        width: responsiveWidth(35),
        height: 11,
        fontFamily: FONT_FAMILY,
        fontSize: 10,
        fontWeight: MEDIUM_FONT,
        fontStyle: FONT_STYLE,
        letterSpacing: 0,
        color: LABEL_COLOR,
    },
    bankContentContainer:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: responsiveWidth(53),
        justifyContent: 'space-between'
    },
    bankContent:{
        marginLeft: 16,
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: responsiveWidth(40)
    },
    bankAccount:{
        fontSize: 14,
        display: 'flex',
        flexWrap: 'wrap',
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    bankName:{
        fontSize: 10,
        marginTop: 10,
        display: 'flex',
        flexWrap: 'wrap',
        color: WARM_GREY_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    editIcon:{
        fontSize: 17.6,
        paddingLeft: 5,
        color: EDIT_ICON_COLOR
    },
    editIconDisabled:{
        fontSize: 17.6,
        paddingLeft: 5,
        color: BACKGROUND_WHITE_COLOR
    },
    flex:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    bankImage:{
        width: 20,
        height:20
    }
});