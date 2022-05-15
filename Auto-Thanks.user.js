// ==UserScript==
// @name Auto-Thanks
// @namespace http://tampermonkey.net/
// @version 0.1
// @description Auto-Thanks for upload
// @author You
// @match https://www.deepbassnine.com/torrents.php*id=*
// @grant none
// ==/UserScript==

(() => {
'use strict';

const downloadButtons = document.querySelectorAll('a#download')
const thanksButton = document.querySelector('#thanksbutton')

const downloadButtonClick = () => {
thanksButton.click()
}

downloadButtons.forEach(button => button.addEventListener('click', downloadButtonClick))
})()	