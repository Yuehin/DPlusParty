'use strict';

// only load for URLs that match www.disneyplus.com/video/*
chrome.runtime.onInstalled.addListener(function (details) {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        hostEquals: 'www.disneyplus.com',
                        pathPrefix: '/video/',
                        schemes: ['http', 'https']
                    }
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});