import { axiosGet } from "../axiosHelper";
import { TRANSACTION_LIST } from "./actionType";

export function UploadFile() {
    return dispatch => {
        return axiosGet({url :"referral/transaction/:id"} ,(response) => {
            dispatch({
                type: TRANSACTION_LIST,
                transaction_list: response.data
            });
        })
    };
}

