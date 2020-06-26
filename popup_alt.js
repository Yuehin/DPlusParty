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

    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var splitURL = tabs[0].url.split('#');
        $('#share-url').val(splitURL[0]);
        $('#share-session').val('#' + splitURL[1]);
    });
});