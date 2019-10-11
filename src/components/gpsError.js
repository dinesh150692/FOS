/* Library Imports */
import React from 'react';
import { connect } from 'react-redux';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
/* Component Import */
import Button from './common/button';
/* Image Import */
import noGPS from '../assets/no_gps.png';
/* Constant Import */
import { ENABLE_GPS, GPS_TURNED_OFF, LOCATION_TEXT } from '../shared/constants';
import { BOLD_FONT, FONT_FAMILY, LABEL_COLOR, WARM_GREY_COLOR } from '../shared/colors';

class GPSError extends React.PureComponent {
	constructor(props){
        super(props);
    }

	render() {
		return (
            <View>
                <Modal   
                    animationType="fade"
                    transparent={false}
                    visible={this.props.openGPS}
                    onRequestClose={() => {}}
                >
                    <View style={{flex:1, width: responsiveWidth(100), height: responsiveHeight(100)}}>
                        <View keyboardShouldPersistTaps={"always"} style={styles.noItemContainer}>
                            <Image source={noGPS} resizeMode={'contain'} style={styles.noGPSImage}/> 
                            <Text style={styles.noItemTextHeader}>{GPS_TURNED_OFF}</Text>
                            <Text style={styles.noItemText}>{LOCATION_TEXT}</Text>
                        </View>
                        <Button
                            loading={false}
                            complete={false}
                            buttonDisabled={false}
                            submit={this.props.enableLocation}
                        >
                            {ENABLE_GPS}
                        </Button>
                    </View>
                </Modal>
            </View>
        );
	}
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        openGPS: state.modal.openGPS
    };
}

export default connect(mapStateToProps,{})(GPSError)

const styles = StyleSheet.create({
    noItemContainer:{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    noItemText:{
        fontSize: 14,
        lineHeight: 22.7,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        color: WARM_GREY_COLOR,
        marginTop: responsiveHeight(1),    
        marginHorizontal: responsiveWidth(10)
    },
    noItemTextHeader:{
        fontSize: 24,
        lineHeight: 28.8,
        color: LABEL_COLOR,
        textAlign: 'center',
        fontWeight: BOLD_FONT,
        fontFamily: FONT_FAMILY
    },
    noGPSImage:{
        width: responsiveWidth(80),
        height:responsiveHeight(50),
        marginBottom: responsiveHeight(5)
    }
});