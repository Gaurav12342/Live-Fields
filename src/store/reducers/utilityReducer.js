import { UPLOAD_FILE_DATA } from "../actions/actionType";

const initialState={
    [UPLOAD_FILE_DATA] : {}
}

const reducer = (state=initialState,action) =>{
    switch(action.type){
        case UPLOAD_FILE_DATA:
            return Object.assign({},state,{
                [UPLOAD_FILE_DATA] : action[UPLOAD_FILE_DATA]
            })
        
        default :
        return state;
    }
}

export default reducer;