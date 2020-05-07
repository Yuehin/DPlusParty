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
var dPlusInjected = false;

function injectDPlus() {
    // prevent multiple injections
    if (dPlusInjected) {
        return;
    }
    // inject js and css
    let jQuery = document.createElement('script');
    jQuery.setAttribute = ('class','dplus');
    jQuery.type = 'text/javascript';
    jQuery.src = chrome.extension.getURL('jquery-3.4.1.min.js');
    document.head.appendChild(jQuery);
    
    let dplusparty = document.createElement('script');
    dplusparty.setAttribute = ('class','dplus');
    dplusparty.type = 'text/javascript';
    dplusparty.src = chrome.extension.getURL('dplusparty.js');
    document.head.appendChild(dplusparty);

    let chatStyle = document.createElement('link');
    chatStyle.setAttribute = ('class','dplus');
    chatStyle.rel = 'stylesheet';
    chatStyle.type = 'text/css';
    chatStyle.href = chrome.extension.getURL('dplus_chat.css');
    document.head.appendChild(chatStyle);

    dPlusInjected = true;
    log('Extension has loaded');
}

window.addEventListener('joined', function() {
        joined = true;
        chrome.runtime.sendMessage({ 'status': 'joined' });
});

window.addEventListener('dplus_removed', function() {
    dPlusInjected = false;
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if(request.ping) { sendResponse({pong: true}); return; }
        if (request.message === 'clicked_join') {
            log('popup clicked');
            injectDPlus();
        }

        if (request.message === 'start_dplus') {
            log('popup clicked');
            injectDPlus();
            isHost = true;
        }
    
        if (request.message === 'clicked_popup') {
            chrome.runtime.sendMessage({ 'isHost': isHost });
            if (joined) {chrome.runtime.sendMessage({ 'status': 'joined' });}
        }
    }
);