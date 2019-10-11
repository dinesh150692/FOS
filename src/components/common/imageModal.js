
/* Library Imports */
import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'native-base';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
/* Component Imports */
import Header from '../header';
/* Action Imports */
import { closeImageModal } from '../../redux/action/modalAction';
/* Custom Imports */
import { TIME_TEXT } from '../../shared/constants';
import { FONT_FAMILY, MEDIUM_FONT, PRIMARY_COLOR, REGULAR_FONT } from '../../shared/colors';

class ImageModal extends React.PureComponent {
	constructor(props){
        super(props);
        this.state ={ 
            loading: true
        }
    }
	render() {
		return (
            <View>
                <Modal   
                    animationType="fade"
                    transparent={false}
                    visible={this.props.openImage}
                    onRequestClose={this.props.closeImageModal}
                >
                    <View style={{flex:1, width: responsiveWidth(100), height: responsiveHeight(100)}}>
                        <Header main="no" headerName={this.props.headerName} goBack={this.props.closeImageModal} close={this.props.closeImageModal}/> 
                        <View style={styles.error}>
                            <Text style={styles.timerText1}>{ TIME_TEXT }</Text>
                            <Text style={styles.timerText}>{this.props.timerDetails.time}</Text>
                        </View>
                        {this.props.uri && 
                            <Image 
                                source={{uri: this.props.uri}} 
                                style={{height: responsiveHeight(100)-150, width: responsiveWidth(100)}}
                                loadingIndicatorSource={<Spinner color={PRIMARY_COLOR} />}  
                            />
                        }
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
        openImage: state.modal.openImage,
        timerDetails: state.timerDetails
    };
}

export default connect(mapStateToProps, {closeImageModal})(ImageModal);

const styles = StyleSheet.create({
    timerText: {
		fontSize: 14,
		color: '#f44336',
		fontWeight: MEDIUM_FONT,
		fontFamily: FONT_FAMILY
	},
	timerText1:{
		fontSize: 12,
		color: '#f44336',
		fontFamily: FONT_FAMILY,
		fontWeight: REGULAR_FONT
	},
    error:{
		height: 30,
		elevation: 1,
		display: 'flex',
		flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(100),
        paddingVertical: responsiveHeight(1.5),
        backgroundColor: 'rgba(244, 67, 54, 0.1)'
    }
})