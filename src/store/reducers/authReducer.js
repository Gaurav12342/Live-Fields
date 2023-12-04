import { LOGIN, REGISTRATION } from "../actions/actionType"

const initialState={
    login_user_data : {},
    [REGISTRATION] : {}
}

const reducer = (state=initialState,action) =>{
    switch(action.type){
        case LOGIN:
        return Object.assign({},state,{
            login_user_data : action.login_user_data
        })
        
        case REGISTRATION:
        return Object.assign({},state,{
            [REGISTRATION] : action[REGISTRATION]
        })

        default :
        return state;
    }
}

export default reducer;