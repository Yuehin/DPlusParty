var url = null;
var getUrl = null;
var joining = false;

$(document).ready(function () {
    $(function() {
        $('#donate-btn').click(function() {
            chrome.tabs.create({
               url: 'https://ko-fi.com/dplusparty'
            });
        });
    });

    function ensureSendMessage(tabId, message, callback) {
        chrome.tabs.sendMessage(tabId, { ping: true }, function (response) {
            if (response && response.pong) { // Content script ready
                chrome.tabs.sendMessage(tabId, message, callback);
            } else { // No listener on the other end
                chrome.tabs.executeScript(tabId, { file: "content.js" }, function () {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                        throw Error("Unable to inject script into tab " + tabId);
                    }
                    // OK, now it's injected and ready
                    chrome.tabs.sendMessage(tabId, message, callback);
                });
            }
        });
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        ensureSendMessage(tabs[0].id, { greeting: "hello" });
        chrome.tabs.sendMessage(tabs[0].id, { 'message': 'clicked_popup' });
        if (tabs[0].url.includes('#')) {
            $('#share-txt').hide();
            $('#share-url-div').hide();
            $('#copy-btn').hide();
            $('#copy-btn').css('width', '0px');
            $('#copy-btn').css('float', '');
        } else {
            $('#join-txt').hide();
            $('#join-btn').hide();
            if (getUrl == null) {
                // get URL
                getUrl = setInterval(getURL, 1000);
            }
        }
    });

    function getURL() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if ((url !== null) && (url !== tabs[0].url)) {
                $('#share-url').val(tabs[0].url).focus().select();
                clearInterval(getUrl);
            }
            if (url == null) {
                url = tabs[0].url;
                chrome.tabs.sendMessage(tabs[0].id, { 'message': 'start_dplus' });
            }
        });
    }

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.isHost == true) {
                // Get URL and show copy functionalities
                $('#share-txt').show();
                $('#share-url-div').show();
                $('#copy-btn').show();
                $('#copy-btn').css('width', '');
                $('#copy-btn').css('float', 'right');

                $('#join-txt').hide();
                $('#join-btn').hide();
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    $('#share-url').val(tabs[0].url).focus().select();
                });
            }
            console.log(request);
            switch (request.status) {
                case 'joining':
                    $('#join-button-txt').hide();
                    $('.loader').show();
                    break;
                case 'joined':
                    $('#join-button-txt').show();
                    $('.loader').hide();
                    $('#join-button-txt').html("Joined");
                    $('#join-btn').addClass('disabled');
                    $('#join-btn').prop('disabled', true);
                    break;
                case 'join_failed':
                    $('#join-button-txt').show();
                    $('.loader').hide();
                    $('#error-msg').show();
                    break;
            }
        }
    );

    // listen for clicks on the 'Copy URL' button
    $('#copy-btn').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        $('#share-url').select();
        document.execCommand('copy');
    });

    // listen for clicks on the 'Join' button
    $('#join-btn').click(function (e) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { 'message': 'clicked_join' });
        });
    });
});