$(document).ready(function () {
    // Send a message to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { "message": "clicked_popup" });
        // get URL after 1 second
        setTimeout(function () {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                $('#share-url').val(tabs[0].url).focus().select();
            });
        }, 1000);
    });



    // listen for clicks on the "Copy URL" link
    $('#copy-btn').click(function (e) {
        console.log("click");
        e.stopPropagation();
        e.preventDefault();
        $('#share-url').select();
        document.execCommand('copy');
    });
});