/* Library Imports */
import React from "react";
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
/* Component Import */
import TwoButtonModal from './twoButtonModal';
/* Action Imports*/
import { closeAlertModal } from '../../redux/action/modalAction';
/* Constant Imports */
import { BOLD_FONT, CLEAR_ICON_COLOR, FONT_FAMILY, MODAL_TEXT_COLOR, REGULAR_FONT, TEXT_COLOR } from '../../shared/colors';

class AlertModal extends React.PureComponent {
	
    constructor(props){
        super(props);
    }

	render() {
		return (
            <Modal 
                isVisible={this.props.openAlert} 
                backdropColor={"black"}
                backdropOpacity={0.54}
                onBackButtonPress={this.props.closeAlertModal}
            >
                <View style={{flex:1}}>
                    <View style={styles.modal}>
                        <TouchableOpacity
                            delayLongPress={4000} 
                            activeOpacity={0.14} 
                            disabled={!this.props.displayCloseButton}
                            onPress={this.props.closeAlertModal}
                            style={styles.close}
                        >
                            <Icon ios='md-close' android="md-close" style={this.props.displayCloseButton ? styles.closeIcon: styles.closeIconHidden}/>
                        </TouchableOpacity>
                        <Text style={styles.headerText}>
                            {this.props.header}
                        </Text>
                        <Text style={styles.text}>
                            {this.props.text}
                        </Text>
                        <TwoButtonModal
                            loading={false}
                            button1Disabled={false}
                            button2Disabled={false}
                            button1Text={this.props.button1Text}
                            button2Text={this.props.button2Text}
                            button1Function={this.props.button1Function}
                            button2Function={this.props.button2Function}
                        />
                    </View>
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
        openAlert: state.modal.openAlert
    };
}

export default connect(mapStateToProps, {closeAlertModal})(AlertModal);

const styles = StyleSheet.create({
    modal:{
        height: 150,
        paddingTop: 22,
        display: 'flex',
        borderRadius: 8,
        paddingBottom: 20,
        alignItems: "center",
        paddingHorizontal: 17,
        flexDirection: 'column',
        backgroundColor: "white",
        marginTop: responsiveHeight(10),
        justifyContent: 'space-between',
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    headerText:{
        fontSize: 20,
        color: TEXT_COLOR,
        fontWeight: BOLD_FONT,
        fontFamily: FONT_FAMILY
    },
    text:{
        fontSize: 14,
        lineHeight: 22.7,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        color: MODAL_TEXT_COLOR,
        fontWeight: REGULAR_FONT
    },
    close:{
        right: 15,
        top: '5.5%',
        position: 'absolute'
    },
    closeIcon:{
        color: CLEAR_ICON_COLOR,
        fontSize: responsiveFontSize(3)
    },
    closeIconHidden:{
        color: 'white',
        fontSize: responsiveFontSize(3)
    }
})