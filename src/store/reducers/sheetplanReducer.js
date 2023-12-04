import { PLAN_REVISION_INDEX_UPDATE, REVISION_RENAME, UPDATE_SHEET_PLAN } from '../actions/actionType'

const initialState = {
    UPDATE_SHEET_PLAN: {}
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SHEET_PLAN:
            return Object.assign({}, state, {
                [UPDATE_SHEET_PLAN]: action.UPDATE_SHEET_PLAN
            })
        case PLAN_REVISION_INDEX_UPDATE:
            return Object.assign({}, state, {
                [PLAN_REVISION_INDEX_UPDATE]: action.PLAN_REVISION_INDEX_UPDATE
            })
        case REVISION_RENAME:
            return Object.assign({}, state, {
                [REVISION_RENAME]: action.REVISION_RENAME
            })
        default:
            return state;
    }
}

export default reducer;
