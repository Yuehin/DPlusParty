var url = null;
var getUrl = null;

$(document).ready(function () {
    $(function() {
        $('#donate-btn').click(function() {
            chrome.tabs.create({
               url: 'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=T3W58R6PZTVD4&item_name=Support+DPlus+Party%27s+server+expenses+and+helping+with+the+development+process+of+new+features%21&currency_code=USD&source=url'
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
            $('#share-txt').css('visibility', 'hidden');
            $('#share-txt').css('height', '0px');
            $('#share-url-div').css('visibility', 'hidden');
            $('#share-url-div').css('height', '0px');
            $('#copy-btn').css('visibility', 'hidden');
            $('#copy-btn').css('width', '0px');
            $('#copy-btn').css('float', '');
        } else {
            $('#join-txt').css('visibility', 'hidden');
            $('#join-txt').css('height', '0px');
            $('#join-btn').css('visibility', 'hidden');
            $('#join-btn').css('width', '0px');
            console.log("getUrl");
            if (getUrl == null) {
                console.log("getUrl2");
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
                console.log("start_dplus");
                chrome.tabs.sendMessage(tabs[0].id, { 'message': 'start_dplus' });
            }
        });
    }

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.isHost == true) {
                // Get URL and show copy functionalities
                $('#share-txt').css('visibility', 'visible');
                $('#share-txt').css('height', '');
                $('#share-url-div').css('visibility', 'visible');
                $('#share-url-div').css('height', '');
                $('#copy-btn').css('visibility', 'visible');
                $('#copy-btn').css('width', '');
                $('#copy-btn').css('float', 'right');

                $('#join-txt').css('visibility', 'hidden');
                $('#join-txt').css('height', '0px');
                $('#join-btn').css('visibility', 'hidden');
                $('#join-btn').css('width', '0px');
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    $('#share-url').val(tabs[0].url).focus().select();
                });
            }
            if (request.status == 'joined') {
                $('#join-btn').html("Joined");
                $('#join-btn').addClass('disabled');
                $('#join-btn').prop('disabled', true);
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