import { combineReducers } from "redux";
import authReducer from './authReducer';
import UIreducer from './UIReducer';
import forgotPassReducer from './forgotPassReducer';
import profileReducer from './profileReducer';
import utilityReducer from './utilityReducer';
import notificationReducer from './notificationReducer';
import referralReducer from './referralReducer';
import deviceTokenReducer from './deviceTokenReducer';
import taskReducer from './taskReducer';
import projectReducer from './projectReducer';
import licenseReducer from './licenseReducer';
import loadingReducer from './loadingReducer';
import sheetplanReducer from './sheetplanReducer';
import storeroomReducer from './storeroomReducer';
import reportReducer from './reportReducer';
import imageLightBoxReducer from './imageLightBoxReducer';
import RFIReducer from './RFIReducer';
import issueReducer from './issueReducer';

const rootReducer = combineReducers({
    ui_red : UIreducer,
    auth : authReducer,
    forgotPass : forgotPassReducer,
    profile: profileReducer,
    project: projectReducer,
    utility: utilityReducer,
    notification: notificationReducer,
    referral: referralReducer,
    device_token: deviceTokenReducer,
    task: taskReducer,
    license: licenseReducer,
    loading: loadingReducer,
    sheetplan : sheetplanReducer,
    storeroom : storeroomReducer,
    report : reportReducer,
    image_lightbox : imageLightBoxReducer,
    RFI:RFIReducer,
    issues:issueReducer
});

export default rootReducer;