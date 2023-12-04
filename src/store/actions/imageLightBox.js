import { LIGHTBOX_DEFAULT_URL, LIGHTBOX_IMAGES, LIGHTBOX_VIEW_STATUS } from "./actionType";

export function toggleLightBoxView(view = false) {
    
    return dispatch => {
        return dispatch({
            type: LIGHTBOX_VIEW_STATUS,
            [LIGHTBOX_VIEW_STATUS]: view
        });
    };
}

export function setLightBoxImageData(images) {
    
    return dispatch => {
        return dispatch({
            type: LIGHTBOX_IMAGES,
            [LIGHTBOX_IMAGES]: images
        });
    };
}

export function setLightBoxImageDefaultUrl(url) {
    
    return dispatch => {
        return dispatch({
            type: LIGHTBOX_DEFAULT_URL,
            [LIGHTBOX_DEFAULT_URL]: url
        });
    };
}