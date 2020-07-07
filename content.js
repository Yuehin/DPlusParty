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
var joining = false;
var failed = false;
var dPlusInjected = false;

function injectDPlus() {
    // prevent multiple injections
    if (dPlusInjected) {
        return;
    }
    // inject js and css
    let jQuery = document.createElement('script');
    jQuery.className = 'dplus';
    jQuery.type = 'text/javascript';
    jQuery.src = chrome.extension.getURL('jquery-3.4.1.min.js');
    document.head.appendChild(jQuery);
    
    let dplusparty = document.createElement('script');
    dplusparty.className = 'dplus';
    dplusparty.type = 'text/javascript';
    dplusparty.src = chrome.extension.getURL('dplusparty.js');
    document.head.appendChild(dplusparty);

    let chatStyle = document.createElement('link');
    chatStyle.className = 'dplus';
    chatStyle.rel = 'stylesheet';
    chatStyle.type = 'text/css';
    chatStyle.href = chrome.extension.getURL('dplus_chat.css');
    document.head.appendChild(chatStyle);

    dPlusInjected = true;
    log('Extension has loaded');
}

window.addEventListener('joining', function() {
    joining = true;
    chrome.runtime.sendMessage({ 'status': 'joining' });
});

window.addEventListener('joined', function() {
    joining = false;
    joined = true;
    chrome.runtime.sendMessage({ 'status': 'joined' });
});

window.addEventListener('join_failed', function() {
    joining = false;
    failed = true;
    chrome.runtime.sendMessage({ 'status': 'join_failed' });
});

window.addEventListener('dplus_removed', function() {
    dPlusInjected = false;
});

window.addEventListener('save_usrname', function(e) {
    chrome.storage.sync.set({usr_name: e.detail}, function() {
        log('username is set to ' + e.detail);
    });
});

window.addEventListener('get_usrname', function() {
    chrome.storage.sync.get(['usr_name'], function(result) {
        if (result) {
            window.dispatchEvent(new CustomEvent('set_usrname', {detail: result.usr_name}));
        }
    });
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
            if (joining) {chrome.runtime.sendMessage({ 'status': 'joining' });}
            if (joined) {chrome.runtime.sendMessage({ 'status': 'joined' });}
            if (failed) {chrome.runtime.sendMessage({ 'status': 'join_failed' });}
        }
    }
);