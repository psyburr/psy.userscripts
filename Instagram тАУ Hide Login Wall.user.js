// ==UserScript==
// @name Instagram – Hide Login Wall
// @description Hide the nag preventing you from scrolling through profiles when not logged in to Instagram
// @namespace nyuszika7h@gmail.com
// @version 0.1.1
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include http://instagram.com/*
// @include https://instagram.com/*
// @include http://*.instagram.com/*
// @include https://*.instagram.com/*
// ==/UserScript==

(function() {
let css = `
    div[role="presentation"] {
        display: none;
    }

    body {
        overflow: visible !important;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
