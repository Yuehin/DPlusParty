// debugging logs
const debug = true;
function log(message) {
    if (debug) {
        console.log(message);
    }
}

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
        log("popup clicked");
        if (request.message === "clicked_popup") {
            log("popup clicked");
            // Generate random chat hash if needed
            if (!location.hash) {
                location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
            }
            injectWebRTC();
        }
    }
);