// debugging logs
if (typeof debug !== 'undefined') {
    // the variable is defined
} else {
    debug = false;
}
function log(message) {
    if (debug) {
        console.log(message);
    }
}

var isHost = false;
var joined = false;

function injectWebRTC() {
    // inject js
    let jQuery = document.createElement('script');
    jQuery.src = chrome.extension.getURL('jquery-3.4.1.min.js');
    jQuery.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(jQuery);
    
    let webrtc = document.createElement('script');
    webrtc.src = chrome.extension.getURL('webrtc.js');
    webrtc.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(webrtc);
    log('Extension has loaded');
}

window.addEventListener('joined', function(){
        joined = true;
        chrome.runtime.sendMessage({ 'status': 'joined' });
    }
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === 'clicked_join') {
            log('popup clicked');
            injectWebRTC();
        }

        if (request.message === 'start_webRTC') {
            log('popup clicked');
            injectWebRTC();
            isHost = true;
        }
    
        if (request.message === 'clicked_popup') {
            chrome.runtime.sendMessage({ 'isHost': isHost });
            if (joined) {chrome.runtime.sendMessage({ 'status': 'joined' });}
        }
    }
);