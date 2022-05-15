// ==UserScript==
// @name Instagram - Allow right click on images
// @namespace github.com/Brawl345
// @version 1.0.0
// @description Allow right-clicking on images on Instagram
// @author Brawl (https://github.com/Brawl345)
// @license Unlicense
// @grant GM_addStyle
// @run-at document-start
// @include http://instagram.com/*
// @include https://instagram.com/*
// @include http://*.instagram.com/*
// @include https://*.instagram.com/*
// ==/UserScript==

(function() {
let css = `
._ovg3g, ._si7dy, ._9AhH0 {
    display: none;
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
