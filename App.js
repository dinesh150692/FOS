/* Library Imports */
import React from 'react';
import { Easing, Animated, View, Text, TextInput } from 'react-native';
import { createStackNavigator } from 'react-navigation';

/* Page Imports */
import Login from './src/pages/login';
import IdProof from './src/pages/idproof';
import Branding from './src/pages/branding';
import AddQRPOS from  './src/pages/addQRPOS';
import EditImages from './src/pages/editImages';
import LinkingBank from './src/pages/linkingBank';
import SplashScreen from './src/pages/splashScreen';
import MerchantList from './src/pages/merchantList';
import ReviewDetails from './src/pages/reviewDetails';
import ProofSelection from './src/pages/proofSelection';
import AddAddressDetails from './src/pages/addAddressDetails';
import AddMerchantDetails from './src/pages/addMerchantDetails';
import SMSLinking from './src/components/smsLinking';

// Remove This
import Category from './src/pages/category';

import CameraModal from './src/components/common/cameraModal';

/* Component Import*/
import NoNetwork from './src/components/noNetwork';
import { setTopLevelNavigator } from './src/components/common/logout';

import Timer from './src/components/timer';
import logout from './src/components/common/logout';



/** Routes for the FOS App */
const Routes = createStackNavigator(
  {
    Login: { screen: Login, navigationOptions:({header: null})},
    IdProof: {screen: IdProof, navigationOptions:({header: null})},
    AddQRPOS: {screen: AddQRPOS, navigationOptions:({header: null})},
    Branding: {screen: Branding, navigationOptions:({header: null})},
    Category: {screen: Category, navigationOptions: ({header: null})},
    EditImages: {screen: EditImages,navigationOptions: ({header: null})},
    LinkingBank: {screen: LinkingBank , navigationOptions:({header: null})},
    SplashScreen: { screen: SplashScreen, navigationOptions:({header: null})},
    MerchantList : {screen: MerchantList, navigationOptions:({header: null})},
    ReviewDetails: {screen: ReviewDetails, navigationOptions:({header: null})},
    AddAddress: {screen: AddAddressDetails, navigationOptions:({header: null})},
    AddMerchant: {screen: AddMerchantDetails, navigationOptions:({header: null})},
    ProofSelection: {screen: ProofSelection,  navigationOptions: ({header: null})},
    SMSLinking: {screen: SMSLinking,  navigationOptions: ({header: null})}
  },
  {
    initialRouteName: 'SplashScreen',
    headerMode: 'screen',
    mode: 'card',
    transitionConfig
  }
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: Routes,
    },
    Camera: {
      screen: CameraModal,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { position, layout, scene, index, scenes } = sceneProps
      const toIndex = index
      const thisSceneIndex = scene.index
      const height = layout.initHeight
      
      const opacity = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex - 0.5, index],
        outputRange: [0, 0.5, 1],
      });
      
      const translateY = position.interpolate({
        inputRange: [0, thisSceneIndex],
        outputRange: [height, 0]
      })

      const slideFromBottom = { transform: [{ translateY }] }
      const lastSceneIndex = scenes[scenes.length - 1].index

      if (lastSceneIndex - toIndex > 1) {
        if (scene.index === toIndex) return
        if (scene.index !== lastSceneIndex) return { opacity: 0 }
        return slideFromBottom;
      }
      return {opacity}
    },
  }
}

export default class App extends React.PureComponent {

    componentWillMount() {
      // Disables auto font scaling on change of default device font size
        Text.defaultProps.allowFontScaling = false;
    }

    render() {
      return (
        <View style={{flex:1}}>
            <RootStack
                ref={navigatorRef => {
                    logout.setTopLevelNavigator(navigatorRef);
                }}
            />
            <Timer/>
            <NoNetwork />
        </View>
      );
    }
}