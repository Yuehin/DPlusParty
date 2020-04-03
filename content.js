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

function injectWebRTC() {
    // inject js
    let webrtc = document.createElement('script');
    webrtc.src = chrome.extension.getURL('webrtc.js');
    webrtc.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(webrtc);
    log("Extension has loaded");
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_join") {
            log("popup clicked");
            injectWebRTC();
        }

        if (request.message === "start_webRTC") {
            log("popup clicked");
            injectWebRTC();
            isHost = true;
        }
    
        if (request.message === "clicked_popup") {
            chrome.runtime.sendMessage({ "isHost": isHost });
        }
    }
);