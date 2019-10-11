/* Libary Imports */
import React from 'react';
import { Image, Modal, NetInfo, StyleSheet, Text, View } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
/* Component Import */
import Header from '../components/header';
import Button from '../components/common/button';
/* Constant Import */
import { NO_NETWORK_FOUND } from '../shared/constants';
import { BOLD_FONT, FONT_FAMILY, LABEL_COLOR, WARM_GREY_COLOR } from '../shared/colors';
/* Image Import */
import noWifi from '../assets/no_wifi.png';

export default class NoNetwork extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            isConnected : true
        }
        this.checkConnection = this.checkConnection.bind(this);
        this._handleConnectionChange = this._handleConnectionChange.bind(this);
    }
    
    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
    }

    _handleConnectionChange(isConnected){
        this.setState({isConnected});
    };

    checkConnection(){
        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({isConnected});
        });
    }

    render() {
        return (
            <Modal   
                animationType="slide"
                transparent={false}
                visible={!this.state.isConnected}
                onRequestClose={() => {
                    return null
                }}
            >
                <Header main="no" headerName="Page 404"  goBack={this.goBackHandler} close={this.goBackHandler}/>
                <View style={styles.container}>      
                    <Image source={noWifi} style={styles.image} resizeMode={'contain'}/>
                    <Text style={styles.noItemTextHeader}>{NO_NETWORK_FOUND.HEADER_TEXT}</Text>
                    <Text style={styles.text}>{NO_NETWORK_FOUND.TEXT_LINE1}</Text>
                    <Text style={styles.text}>{NO_NETWORK_FOUND.TEXT_LINE2}</Text>
                </View>
                <Button
                    loading={false}
                    complete={false}
                    buttonDisabled={false}    
                    submit={this.checkConnection}
                >
                    {NO_NETWORK_FOUND.REFRESH_BUTTON}
                </Button>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center', 
        backgroundColor: 'white',
        justifyContent: 'flex-start', 
        width: responsiveWidth(100), 
        height: responsiveHeight(100)
    },
    image:{
        width: 320,
        height: 244.5,
        marginTop: responsiveHeight(7), 
        marginBottom: responsiveHeight(5)
    },
    text:{
        textAlign: 'center',
        color: WARM_GREY_COLOR,
        fontFamily: FONT_FAMILY,
        fontSize: responsiveFontSize(2)
    },
    noItemTextHeader:{
        fontSize: 24,
        lineHeight: 28.8,
        color: LABEL_COLOR,
        textAlign: 'center',
        fontWeight: BOLD_FONT,
        fontFamily: FONT_FAMILY
    }
});

