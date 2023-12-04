

export function sendPostMessage(type, data = {}, key = 'data'){
    const lfiframe = document.getElementById('lfiframe')
    if(lfiframe){
        lfiframe.contentWindow.postMessage({type, [key] : data}, '*');
    }
}