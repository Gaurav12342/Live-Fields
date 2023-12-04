import { axiosPost, axiosGet } from "../axiosHelper";
import { CREATE_FIREBASE_TOKEN, GET_ACTIVE_TOKEN } from "./actionType";

export function CreateFirebaseToken(post) {
    return dispatch => {
        return axiosPost({url :"firebase_token/create", reqBody :post} ,(response) => {
            dispatch({
                type: CREATE_FIREBASE_TOKEN,
                create_firebase_token: response.data
            });
        })
    };
}

export function GetFirebaseActiveToken(post) {
    return dispatch => {
        return axiosGet({url :"firebase_token/active/:id"} ,(response) => {
            dispatch({
                type: GET_ACTIVE_TOKEN,
                get_active_token: response.data
            });
        })
    };
}
