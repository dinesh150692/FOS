/* Library Imports */
import React from "react";
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
/* Component Import */
import { goToPage } from '../components/common/logout';
/* Action Imports */
import { updateEditFlowType } from '../redux/action/currentMerchantAction';
/* Constants Imports */
import { GENERATE_OTP } from '../shared/constants';
import { BACKGROUND_WHITE_COLOR, EDIT_ICON_COLOR, FONT_FAMILY, FONT_STYLE, LABEL_COLOR, MEDIUM_FONT, REGULAR_FONT, TEXT_COLOR } from '../shared/colors';
/* Image Import */
import mapImage from '../assets/map.png';

class AddressDetails extends React.PureComponent {
	constructor(props){
        super(props);
        this.editFunction = this.editFunction.bind(this);
        this.renderWithEditDetails = this.renderWithEditDetails.bind(this);
        this.renderWithoutEditDetails = this.renderWithoutEditDetails.bind(this);
	}

    /** 
     *  Redirect User to edit address page with address details
     */
    editFunction(){
        this.props.updateEditFlowType(true);
        goToPage('AddAddress');
    }

    renderWithEditDetails(){
        return (
            <View style={styles.addressContainer}>
                <Text style={styles.text}>ADDRESS DETAILS</Text>
                <View style={[styles.addressContentContainer]}>
                    <Text style={styles.address}>
                        {this.props.addressDetails.building}, {this.props.addressDetails.street}, {this.props.addressDetails.locality}, {this.props.addressDetails.city}, {this.props.addressDetails.state}, {this.props.addressDetails.pinCode}.
                    </Text>  
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
        );
    }

    renderWithoutEditDetails(){
        return (
            <View style={styles.addressContainerWithoutEdit}>
                <Image source={mapImage} resizeMode={'contain'} style={styles.mapImage}/>
                <View style={styles.addressContentContainerWithoutEdit}>
                    <Text style={styles.text}>ADDRESS</Text>
                    <Text style={[styles.address, styles.addressWithoutEdit]}>
                        {this.props.addressDetails.building}, {this.props.addressDetails.street}, {this.props.addressDetails.locality}, {this.props.addressDetails.city}, {this.props.addressDetails.state}, {this.props.addressDetails.pinCode}.
                    </Text>  
                </View>
            </View>
        );
    }


	render() {
		return (
            <React.Fragment>
                {this.props.editable 
                    ?this.renderWithEditDetails()
                    :this.renderWithoutEditDetails()
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
        addressDetails: state.currentMerchantDetails.addressDetails
    };
}

export default connect(mapStateToProps, {updateEditFlowType})(AddressDetails);

const styles = StyleSheet.create({
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
    addressContainer:{
        marginTop: 8,
        paddingTop: 18,
        paddingLeft: 16, 
        paddingBottom: 22,
        paddingRight: 17.5,
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: responsiveWidth(100),
        justifyContent: 'flex-start',
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    addressContentContainer:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    address:{
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
    mapImage:{
        width: 20,
        height: 20  
    },
    addressContainerWithoutEdit:{
        marginTop: 2,
        paddingTop: 18,
        paddingLeft: 22, 
        paddingBottom: 22,
        paddingRight: 17,
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: responsiveWidth(100),
        backgroundColor: BACKGROUND_WHITE_COLOR,
    },
    addressContentContainerWithoutEdit:{
        marginLeft: 16,
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: responsiveWidth(80),
        justifyContent: 'space-between'
    },
    addressWithoutEdit:{
        width: 289,
        marginTop: 6   
    }
});