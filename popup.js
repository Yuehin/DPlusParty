var url = null;
var getUrl = null;

$(document).ready(function () {
    $(function() {
        $('#donate-btn').click(function() {
           chrome.tabs.create({url: 'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=T3W58R6PZTVD4&currency_code=USD&source=url'});
        });
      });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { 'message': 'clicked_popup' });
        if (tabs[0].url.includes('#')) {
            $('#share-txt').css('visibility', 'hidden');
            $('#share-txt').css('height', '0px');
            $('#share-url-div').css('visibility', 'hidden');
            $('#share-url-div').css('height', '0px');
            $('#copy-btn').css('visibility', 'hidden');
            $('#copy-btn').css('width', '0px');
            $('#copy-btn').css('float', '');
            $('#donate-btn').css('float', 'left');
        } else {
            $('#join-txt').css('visibility', 'hidden');
            $('#join-txt').css('height', '0px');
            $('#join-btn').css('visibility', 'hidden');
            $('#join-btn').css('width', '0px');
            // get URL
            getUrl = setInterval(getURL, 1000);
        }
    });

    function getURL() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if ((url != null) && (url !== tabs[0].url)) {
                $('#share-url').val(tabs[0].url).focus().select();
                clearInterval(getUrl);
            }
            if (url == null) {
                url = tabs[0].url;
                chrome.tabs.sendMessage(tabs[0].id, { 'message': 'start_webRTC' });
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

                $('#join-txt').css('visibility', 'hidden');
                $('#join-txt').css('height', '0px');
                $('#join-btn').css('visibility', 'hidden');
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