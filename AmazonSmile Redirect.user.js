// ==UserScript==
// @name        AmazonSmile Redirect
// @namespace   http://jdel.us
// @description Redirect Amazon to AmazonSmile
// @include     http://*.amazon.*/*
// @include     https://*.amazon.*/*
// @version     0.6
// @grant       none
// @run-at document-start
// ==/UserScript==
 
var url = window.location.host;
 
if (url.match("smile.amazon") === null) {
    url = window.location.href;
    if  (url.match("//www.amazon") !== null){
        url = url.replace("//www.amazon", "//smile.amazon");
    } else if (url.match("//amazon.") !== null){
        url = url.replace("//amazon.", "//smile.amazon.");
    } else {
    	return;
    }
    
    console.log(url);
    window.location.replace(url);
}