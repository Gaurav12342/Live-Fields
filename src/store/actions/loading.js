export function stopLoading(action) {
    return dispatch => dispatch({
        type: action,
        [action]: false
    });
}

export function startLoading(action) {
    return dispatch => dispatch({
        type: action,
        [action]: true
    });
}
