import { GET_RFI_LIST } from '../actions/actionType';
const initialState={
    [GET_RFI_LIST] : [],
}

const reducer = (state=initialState,action) =>{
    switch(action.type){
        case GET_RFI_LIST:
            return Object.assign({},state,{
                [GET_RFI_LIST] : action[GET_RFI_LIST]
            })
        
        default :
        return state;
    }
}

export default reducer;