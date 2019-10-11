/* Library Imports */
import React from "react";
import {connect} from 'react-redux';
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {AsyncStorage, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ToastAndroid} from 'react-native';
/* Component Import */
import ImageModal from '../common/imageModal';
/* Action Import */
import {openImageModal} from '../../redux/action/modalAction';
/* Constant Imports  */
import {
    CLEAR_ICON_COLOR,
    FONT_FAMILY,
    FONT_STYLE,
    LABEL_COLOR,
    MEDIUM_FONT,
    REGULAR_FONT,
    TEXT_COLOR,
    UNDERLINE_COLOR
} from '../../shared/colors';
import { BRANDING } from '../../shared/constants';
import {  ERROR_CODES_AND_MESSAGES } from '../../shared/errorCodes';
/* Image Import */
import deleteImage from '../../assets/delete.png';
import noBranding from '../../assets/no_branding.png';
import noBrandingQR from '../../assets/no_branding_qr.png';
import Config from 'react-native-config';

const MERCHANT_ONBARDING_URL = Config.MERCHANT_ONBARDING_URL;
const DOC_DOWNLOAD_URL = Config.DOC_DOWNLOAD_URL;
const API_BASE_URL = Config.API_BASE_URL;

class Upload extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            uri: '',
            headerName: ''
        }
        this._renderList = this._renderList.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._renderContent = this._renderContent.bind(this);
        this.openImageModal = this.openImageModal.bind(this);
    }

    openImageModal(item, index, itemIndex) {
        //this.props.imageData[index].images[itemIndex].uri
        this.setState({
            headerName: this.props.imageData[index].headerName + ' Image',
            uri: item.uri
        }, () => {
            this.props.openImageModal();
        });
    }

    deleteDocument(item, index, itemIndex) {
        this.props.deleteDocument(item, index, itemIndex);
    }

    /**
     *  Format the data
     *  @param {String} date
     */
    formatDate(date) {
        var d = new Date(date);
        return d.toString().substring(4, 15).toUpperCase();
    }

    /**
     *  Format the data
     *  @param {String} date
     */
    formatTime(date) {
        let d = new Date(date);
        let hour = d.getHours();
        let minutes = d.getMinutes();
        minutes = minutes > 10 ? minutes : '0' + minutes;
        let meridiem = hour >= 12 ? "PM" : "AM";
        let time = ((hour + 11) % 12 + 1) + ":" + minutes + meridiem;
        return time;
    }

    _renderHeader(item) {
        let imageCountText = this.props.isBranding && BRANDING.BRANDING_IMAGE_COUNT - item.images.length > 0 ? ` / ${BRANDING.BRANDING_IMAGE_COUNT - item.images.length}  MORE IMAGE REQUIRED` : '';
        return (
            <View style={styles.headerContainer}>
                <Text style={styles.header}>{item.headerName}</Text>
                <Text style={styles.headerText}>{item.images.length + ' IMAGES UPLOADED' + imageCountText}</Text>
            </View>
        );
    }

    _renderList(items, index) {
        let imagesList = items.images;
        return (
            <View>
                {imagesList && imagesList.length > 0 && imagesList.map((itemData, itemIndex) => {

                    let item = {
                        ...itemData,
                        name: itemData.fileName,
                        time: itemData.createdAt,
                        // thumbNail: API_BASE_URL + MERCHANT_ONBARDING_URL + DOC_DOWNLOAD_URL + '/' + itemData.id,
                    }
                    return (
                        <View key={item + itemIndex} style={styles.listItemContainer}>
                            <TouchableOpacity delayLongPress={4000} activeOpacity={0.14}
                                //onPress={() => {this.openImageModal(item, index, itemIndex)}}
                            >
                                <AsyncImage fileID={item.id} merchantID={item.merchantId} category={item.category}
                                            isBranding={this.props.isBranding}/>
                            </TouchableOpacity>
                            <View style={styles.listItem}>
                                <View style={[styles.listContent, {marginBottom: 3}]}>
                                    <Text style={styles.name} ellipsizeMode='tail' numberOfLines={1}>
                                        {/*{(item.uri && item.uri.split('/').pop()) || item.name || ''}*/}
                                        {'Image' + (itemIndex + 1) }
                                    </Text>
                                    <TouchableOpacity delayLongPress={4000} activeOpacity={0.14}
                                                      style={{paddingLeft: responsiveWidth(2)}}
                                                      onPress={() => this.deleteDocument(item, index, itemIndex)}
                                    >
                                        <Image source={deleteImage} resizeMode={'contain'} style={styles.deleteImage}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.listContent, {marginBottom: 8}]}>
                                    <Text style={styles.date}>
                                        {this.formatDate(item.time)} AT {this.formatTime(item.time)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )
                })}

            </View>
        );
    }

    _renderContent() {
        return (
            <View>
                {this.props.imageData && this.props.imageData.length > 0 &&
                this.props.imageData.map((type, index) => {
                    return (
                        <React.Fragment key={type}>
                            {this._renderHeader(type)}
                            {this._renderList(type, index)}
                        </React.Fragment>
                    )
                })
                }
            </View>
        )
    }

    render() {
        if (this.props.imageData && this.props.imageData.length > 0) {
            return (
                <ScrollView keyboardShouldPersistTaps={"always"}>
                    {this._renderContent()}
                    {this.props.addImageButton()}
                    <ImageModal uri={this.state.uri} headerName={this.state.headerName}/>
                </ScrollView>
            );
        } else {
            return null;
        }
    }
}

/**
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        ajaxStatus: state.ajaxStatus
    };
}


class AsyncImage extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
        let {fileID, merchantID, category} = props;
        this.imageURIForFileID(fileID, merchantID, category);
    }

    imageURIForFileID(fileID, merchantID, category) {

        let key = fileID + merchantID + category;
        AsyncStorage.getItem(key, (err, uri) => {
            if (uri !== null) {
                this.setState({
                    [fileID]: uri,
                });
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        let {fileID, merchantID, category} = nextProps;
        this.imageURIForFileID(fileID, merchantID, category);
    }

    render() {
        // console.log('AsyncImage --> render --> ', this.state);
        return (
            <View>
                {this.state[this.props.fileID] ?
                    <Image style={styles.image} source={{
                    uri: this.state[this.props.fileID],
                }}/> :
                    <Image style={styles.image} source={ this.props.isBranding ? noBranding : noBrandingQR }/>
                }
            </View>
        )
    }
}


export default connect(mapStateToProps, {openImageModal})(Upload);


const styles = StyleSheet.create({
    headerContainer: {
        marginLeft: responsiveWidth(5),
        marginTop: responsiveHeight(1.5)
    },
    header: {
        fontStyle: FONT_STYLE,
        letterSpacing: 0,
        fontSize: 18,
        color: TEXT_COLOR,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY

    },
    headerText: {
        fontSize: 10,
        color: LABEL_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT,
        marginTop: responsiveHeight(0.5)
    },
    image: {
        width: 120,
        height: 120
    },
    listItemContainer: {
        width: '100%',
        paddingTop: 19,
        paddingLeft: 14,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    listItem: {
        flexGrow: 1,
        display: 'flex',
        marginLeft: 14,
        paddingRight: 5,
        borderBottomWidth: 1,
        flexDirection: 'column',
        borderBottomColor: UNDERLINE_COLOR,
        height: 125,
    },
    listContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 14,
        color: LABEL_COLOR,
        fontWeight: REGULAR_FONT,
        fontFamily: FONT_FAMILY,
        // width: responsiveWidth(65)
    },
    date: {
        fontSize: 10,
        fontStyle: FONT_STYLE,
        letterSpacing: 0,
        color: "rgba(33, 33, 33, 0.54)",
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    editIcon: {
        fontSize: 20,
        paddingLeft: 5,
        color: CLEAR_ICON_COLOR,
        marginRight: responsiveWidth(3)
    },
    deleteImage: {
        width: 22,
        height: 22
    }
});
