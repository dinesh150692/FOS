var DeviceInfo = require('react-native-device-info');
import { ACTION_TYPE } from '../actionType';

/** Action dispatch to save the data in the store as initialToken
 *  @param  {String}     initialToken
 * 	@return {Object}    
 */
export function getDevicePrint() {
    var devicePrint = DeviceInfo.getUniqueID();
    return { type: ACTION_TYPE.LOAD_DEVICE_PRINT, devicePrint };
}
