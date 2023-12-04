import { axiosGet, axiosPost } from "../axiosHelper";
import { UPLOAD_FILE_DATA } from "./actionType";

export function UploadFile(post, pg) {
    return dispatch => {
        return axiosPost(
            { url: "upload", reqBody: post }, 
            (response) => {
                dispatch({
                    type: UPLOAD_FILE_DATA,
                    [UPLOAD_FILE_DATA]: { ...response.data, name: post.name, module_type : post.module_type }
                });
            }, 
            pg
        )
    };
}

export function UploadSignature(post,cb) {
    return dispatch => {
        return axiosPost({ url: "upload", reqBody: post }, (response) => {
            if(typeof cb == "function") cb(response.data);
        })
    };
}


export function clearUploadFile() {
    return dispatch => {
        dispatch({
            type: UPLOAD_FILE_DATA,
            [UPLOAD_FILE_DATA]: []
        });
    };
}

export const getPincodeDetails = (pincode, callback) => {
    axiosGet({ url: 'https://api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6?api-key=579b464db66ec23bdd000001c3f11a9861964d297c6a1b895b9a107f&format=json&offset=0&limit=1&filters[pincode]=' + pincode }, function (res) {
        callback(res)
    })
    // return res.data.records
}
