import * as actionTypes from '../actions/actionType';
const initialState={
    create_firebase_token : {},
    get_active_token : {},
}

const reducer = (state=initialState,action) =>{
    switch(action.type){
        case actionTypes.CREATE_FIREBASE_TOKEN:
            return Object.assign({},state,{
                create_firebase_token : action.create_firebase_token
            })
    
            case actionTypes.GET_ACTIVE_TOKEN:
            return Object.assign({},state,{
                get_active_token : action.get_active_token
            })
        
        default :
        return state;
    }
}

export default reducer;