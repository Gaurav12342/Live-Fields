import { AUTH_LOADING, FILE_UPLOAD_LOADING } from "../actions/actionType"

const initialState={
    [AUTH_LOADING] : true,
    [FILE_UPLOAD_LOADING] : false
}

const reducer = (state=initialState,action) =>{
    switch(action.type){
        case AUTH_LOADING:
            return Object.assign({},state,{
                [AUTH_LOADING] : action[AUTH_LOADING]
            })

        case FILE_UPLOAD_LOADING:
            return Object.assign({},state,{
                [FILE_UPLOAD_LOADING] : action[FILE_UPLOAD_LOADING]
            })

        default :
        return state;
    }
}

export default reducer;