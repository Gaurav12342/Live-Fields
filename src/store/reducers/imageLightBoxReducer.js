import { LIGHTBOX_DEFAULT_URL, LIGHTBOX_IMAGES, LIGHTBOX_VIEW_STATUS } from "../actions/actionType";

const initialState = {
    [LIGHTBOX_VIEW_STATUS]: false,
    [LIGHTBOX_IMAGES]: {},
    [LIGHTBOX_DEFAULT_URL]: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LIGHTBOX_VIEW_STATUS:
            return Object.assign({}, state, {
                [LIGHTBOX_VIEW_STATUS]: action[LIGHTBOX_VIEW_STATUS]
            })

        case LIGHTBOX_IMAGES:
            return Object.assign({}, state, {
                [LIGHTBOX_IMAGES]: action[LIGHTBOX_IMAGES]
            })

        case LIGHTBOX_DEFAULT_URL:
            return Object.assign({}, state, {
                [LIGHTBOX_DEFAULT_URL]: action[LIGHTBOX_DEFAULT_URL]
            })


        default:
            return state;
    }
}

export default reducer;