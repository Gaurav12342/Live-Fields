import * as actionTypes from '../actions/actionType';
const initialState={
    transaction_list : {}
}

const reducer = (state=initialState,action) =>{
    switch(action.type){
        case actionTypes.TRANSACTION_LIST:
            return Object.assign({},state,{
                transaction_list : action.transaction_list
            })
        
        default :
        return state;
    }
}

export default reducer;