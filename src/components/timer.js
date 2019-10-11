/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import {
    responsiveWidth,
    responsiveHeight,
    responsiveFontSize
} from 'react-native-responsive-dimensions';

/* Component Imports */
import SessionExpired from './sessionExpired';
import OTPVerification from './otpVerification';
import { goToPage } from './common/logout';

/* Action Import */
import { clearTimer, resetInitValue, updateTimer } from '../redux/action/timerAction';
import { closeAllModal, closeSessionExpiredModal, openSessionExpiredModal } from '../redux/action/modalAction';

/* Constant Import */
import {TIME_TEXT, TIME_OUT} from '../shared/constants';
import { FONT_FAMILY, MEDIUM_FONT, REGULAR_FONT } from '../shared/colors';


export const timerCountdown = (function () {
    let counter;
    return function (currentTime = null) { currentTime ? counter = currentTime : counter; return counter}
})();

class Timer extends React.PureComponent {
	constructor(props){
		super(props);
        this.state = {
            timerDetails: {
                ...props.timerDetails,
            },
        };
		this.timer = null;
		this.resetTimer = this.resetTimer.bind(this);
		this.closeSession = this.closeSession.bind(this);
        this.timerCountDown = this.timerCountDown.bind(this);
	}
	
	componentDidMount(){
        if (this.props.timerDetails.timerStart) {
            this.timerCountDown();
        }else {
            BackgroundTimer.clearInterval(this.timer);
            this.timer = null;
        }
	}

    componentWillReceiveProps(nextProps) {
        if (nextProps.timerDetails.timerStart) {
            this.setState({
                ...this.state,
                timerDetails: {
                    ...nextProps.timerDetails,
                }
            });
            this.timerCountDown();
        }
        else if (this.timer) {
            BackgroundTimer.clearInterval(this.timer);
            this.timer = null;
        }
    }

    componentWillUnmount() {
        if (this.timer) {
            BackgroundTimer.clearInterval(this.timer);
            this.timer = null;
        }
    }

	/** 
     *  Update the timer count down for each second and 
	 *  open the session expired modal once the timer is timed out
     */
    timerCountDown() {
        let minute = '';
        let second = '';
        // console.log("timerCountDown --> this.timer",this.timer);
        if (this.timer) return;
        this.timer = BackgroundTimer.setInterval(() => {
            // console.log("timerCountDown --> timer",this.state.timerDetails.timeOut);
            let timeOut = this.state.timerDetails.timeOut - 1;
            if (timeOut >= 1) {
                minute = parseInt((timeOut) / 60);
                second = parseInt((timeOut) % 60);
                if (second < 10) {
                    second = '0' + second;
                }
                if (minute < 10) {
                    minute = '0' + minute;
                }
                let timer = minute + ':' + second;
                this.setState({
                    timerDetails: {
                        ...this.state.timerDetails,
                        timeOut: timeOut,
                        time: timer
                    }
                });
                timerCountdown(timer);
            } else {
                BackgroundTimer.clearInterval(this.timer);
                this.timer = null;
                this.props.clearTimer(this.state.timerDetails);
                this.props.closeAllModal();
                setTimeout(() => {
                    this.props.openSessionExpiredModal();
                }, 1);
            }
        }, 1000);
    }

	/** 
     *  closes the session modal
     */
	closeSession(){
		this.props.closeAllModal();
		this.props.resetInitValue(false);
		goToPage('MerchantList');
	}

	
	/** 
     *  On OTP Verification, reset the timer
     */
	resetTimer(){
		this.props.resetInitValue(true);
		this.props.closeAllModal();
        this.timerCountDown();
	}
	
	render() {
		return (
			<View style={styles.timerContainer}>
                {this.props.timerDetails.timerStart &&<View style={styles.error}>
                    <Text style={styles.timerText1}>{ TIME_TEXT }</Text>
                    <Text style={styles.timerText}>{this.state.timerDetails.time}</Text>
                </View>}
				{this.props.openSessionExpired &&
					<View>
						<SessionExpired
							closeSession={this.closeSession}
							// navigation={this.props.navigation}
						/>
					</View>
				}
				{this.props.openOTP && this.props.openSessionExpired &&
					<OTPVerification
						onSuccess={this.resetTimer}
						// navigation={this.props.navigation}
					/>
				}
			</View>
		);
	}
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
		devicePrint: state.devicePrint,
		timerDetails : state.timerDetails,
		openOTP: state.modal.openOTP,
		openSessionExpired: state.modal.openSessionExpired
	};
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = { 
	clearTimer, 
	updateTimer,
	closeAllModal, 
	resetInitValue,
	openSessionExpiredModal, 
	closeSessionExpiredModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Timer);

const styles = StyleSheet.create({
    timerContainer:{
        top: 56,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(100),
        // zIndex: 0,
    },
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
        backgroundColor: '#FDECEA'
    }
})
