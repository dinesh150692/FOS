/* Library Imports */
import React from "react";
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
/* Component Imports */
import Header from '../components/header';
import { goToPage } from "./common/logout";
/* Action Imports */
import { updateEditFlowType } from '../redux/action/currentMerchantAction';
import { closeMerchantDetailsModal, openMerchantDetailsModal } from '../redux/action/modalAction';
/* Constant Import */
import { GENERATE_OTP } from '../shared/constants';
import { BACKGROUND_WHITE_COLOR, BOLD_FONT, EDIT_ICON_COLOR, FONT_FAMILY, FONT_STYLE, LABEL_COLOR, MEDIUM_FONT, PRIMARY_COLOR, REGULAR_FONT, TEXT_COLOR, UNDERLINE_COLOR } from '../shared/colors';

class MerchantDetails extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state ={}
        this.editFunction = this.editFunction.bind(this);
        this.renderWithEditDetails = this.renderWithEditDetails.bind(this);
    }

    /** 
     *  Redirect User to edit address page with address details
     */
    editFunction(){
        this.props.updateEditFlowType(true);
        goToPage('AddMerchant');
    }

    renderWithEditDetails(){
        return (
            <View style={styles.merchantEditContainer}>
                <View style={[styles.merchantItemContainer, {paddingTop: 0}]}>
                    <Text style={styles.merchantItemText}>SHOP NAME</Text>
                    <View style={[styles.merchantItemTopContainer]}>
                        <Text style={[styles.merchantItemValue]}>{this.props.merchantDetails.merchantName || ''}</Text>
                        <TouchableOpacity
                            delayLongPress={4000}  
                            onPress={this.editFunction}
                            activeOpacity={0.14}
                            disabled ={this.props.otpStatus === GENERATE_OTP } 
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                                <Icon ios='md-create' android="md-create" style={ this.props.otpStatus === GENERATE_OTP ? styles.editIconDisabled : styles.editIcon}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.merchantItemContainer}>
                    <Text style={styles.merchantItemText}>BUSINESS NAME</Text>
                    <Text style={styles.merchantItemValue}>{this.props.merchantDetails.businessName || ''}</Text>
                </View>
                <View style={styles.merchantItemContainer}>
                    <Text style={styles.merchantItemText}>PHONE NUMBER</Text>
                    <Text style={styles.merchantItemValue}>{this.props.merchantDetails.phoneNumber || ''}</Text>
                </View>
                <View style={styles.merchantItemContainer}>
                    <Text style={styles.merchantItemText}>CATEGORY</Text>
                    <Text style={styles.merchantItemValue}>{ this.props.categoryDetails.superCategory || ''}</Text>
                </View>
                <View style={styles.merchantItemContainer}>
                    <Text style={styles.merchantItemText}>SUB CATEGORY</Text>
                    <Text style={styles.merchantItemValue}>{ this.props.categoryDetails.category || 'N/A'}</Text>
                </View>
                <View style={styles.merchantItemContainer}>
                    <Text style={styles.merchantItemText}>TYPE</Text>
                    <Text style={styles.merchantItemValue}>{ this.props.categoryDetails.subCategory ||  'N/A'}</Text>
                </View>   
            </View>
        )
    }

    renderMerchantModal(){
        return (
            <View>
                <Modal   
                    animationType="fade"
                    transparent={false}
                    visible={this.props.openMerchantDetails}
                    onRequestClose={() => {
                        this.props.closeMerchantDetailsModal();
                    }}
                >
                    <View style={{flex:1, width: responsiveWidth(100), height: responsiveHeight(100)}}>
                        <Header main="no" headerName="Merchant Details"  goBack={this.props.closeMerchantDetailsModal} close={this.props.closeMerchantDetailsModal}/> 
                        {this.renderWithoutEditDetails(true)}
                        <View style={[styles.merchantItemContainer1, styles.bottomBorder]}>
                            <Text style={styles.merchantItemText}>BUSINESS NAME</Text>
                            <Text style={styles.merchantItemValue}>{this.props.merchantDetails.businessName || ''}</Text>
                        </View>
                        <View style={[styles.merchantItemContainer1, styles.bottomBorder]}>
                            <Text style={styles.merchantItemText}>CATEGORY</Text>
                            <Text style={styles.merchantItemValue}>{ this.props.categoryDetails.superCategory || ''}</Text>
                        </View>
                        <View style={[styles.merchantItemContainer1, styles.bottomBorder]}>
                            <Text style={styles.merchantItemText}>SUB CATEGORY</Text>
                            <Text style={styles.merchantItemValue}>{ this.props.categoryDetails.category || ''}</Text>
                        </View>
                        <View style={[styles.merchantItemContainer1, styles.bottomBorder]}>
                            <Text style={styles.merchantItemText}>TYPE</Text>
                            <Text style={styles.merchantItemValue}>{ this.props.categoryDetails.subCategory ||  'N/A'}</Text>
                        </View>   
                    </View>
                </Modal>
            </View>
        );
    }

    renderWithoutEditDetails(button = false){
        return(
            <View style={button ? [styles.merchantWithoutEditContainer, styles.bottomBorder]:styles.merchantWithoutEditContainer}>
                <View style={styles.merchantCircleContainer}>
                    <View style={styles.merchantCircle}>
                        <Text style={styles.circleText}>{
                            this.props.merchantDetails.hasOwnProperty('merchantName') && 
                            this.props.merchantDetails.merchantName && 
                            this.props.merchantDetails.merchantName.substring(0,2).toUpperCase()}
                        </Text>
                    </View>
                </View>
                <View style={styles.merchantContainer}>
                    <Text style={styles.merchantName}>{this.props.merchantDetails.merchantName || ''}</Text>
                    <View style={styles.merchantDetails}>
                        <Text style={styles.phoneNumber}>{this.props.merchantDetails.phoneNumber || ''}</Text>
                        <TouchableOpacity delayLongPress={4000}  onPress={this.props.openMerchantDetailsModal} activeOpacity={0.14} disable={button}>
                            <Text style={button ? [styles.button, {color: BACKGROUND_WHITE_COLOR}] : styles.button}>VIEW DETAILS</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
    
    render(){
        return ( 
            <React.Fragment>    
                {this.props.editable ? 
                    this.renderWithEditDetails()
                    :
                    <React.Fragment>
                        {this.renderWithoutEditDetails()}
                        {this.renderMerchantModal()}
                    </React.Fragment>
                }
            </React.Fragment>
        );
    } 
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        openMerchantDetails: state.modal.openMerchantDetails,
        merchantDetails: state.currentMerchantDetails.merchantDetails,
        categoryDetails: state.currentMerchantDetails.categoryDetails
    };
}

export default connect(mapStateToProps, {
    updateEditFlowType,
    openMerchantDetailsModal,
    closeMerchantDetailsModal
})(MerchantDetails);

const styles = StyleSheet.create({
    merchantEditContainer:{
        paddingTop: 18,
        paddingLeft: 16, 
        paddingBottom: 22,
        paddingRight: 17.5,
        width: responsiveWidth(100),
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    merchantWithoutEditContainer:{
        paddingTop: 31,
        paddingLeft: 14, 
        paddingBottom: 17,
        paddingRight: 17,
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: responsiveWidth(100),
        justifyContent: 'flex-start',
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    merchantItemContainer:{
        paddingTop: 39,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    merchantItemContainer1:{
        paddingTop: 25,
        paddingLeft: 16,
        paddingBottom: 22,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems:'flex-start',
        justifyContent: 'flex-start',
    },
    merchantItemTopContainer:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    merchantItemText:{
        width: responsiveWidth(35),
        height: 11,
        fontFamily: FONT_FAMILY,
        fontSize: 10,
        fontWeight: MEDIUM_FONT,
        fontStyle: FONT_STYLE,
        letterSpacing: 0,
        color: LABEL_COLOR,
    },
    merchantItemValue:{
        fontSize: 14,
        marginTop: -2,
        display: 'flex',
        flexWrap: 'wrap',
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT,
        width: responsiveWidth(53)
    },
    editIcon:{
        fontSize: 17.6,
        paddingLeft: 5,
        paddingRight: 3,
        color: EDIT_ICON_COLOR
    },
    editIconDisabled:{
        fontSize: 17.6,
        color: BACKGROUND_WHITE_COLOR
    },
    merchantCircle:{
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#b73aad'
    },
    merchantCircleContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(10)
    },
    circleText:{
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT,
        color: BACKGROUND_WHITE_COLOR
    },
    merchantContainer:{
        flexWrap: 'wrap',
        marginLeft: 15,
        flexDirection: 'column',
        width: responsiveWidth(70)
    },
    merchantName:{
        fontSize: 20,
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: BOLD_FONT
    },
    merchantDetails:{
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    button:{
        fontSize: 10,
        color: PRIMARY_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT 
    },
    bottomBorder:{
        borderBottomWidth: 1,
        borderBottomColor: UNDERLINE_COLOR
    },
    phoneNumber:{
        fontSize: 12,
        color: LABEL_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    }
});
