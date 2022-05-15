// ==UserScript==
// @name         Youtube Unblocker
// @namespace    YTUB
// @version      6.1
// @description  Automatically forwards country-blocked YouTube videos to eachvideo.com and unblocks the video.
// @author       drhouse
// @include      https://www.youtube.com/watch*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @icon         https://s.ytimg.com/yts/img/favicon-vfldLzJxy.ico
// @locale       en
// ==/UserScript==

$(document).ready(function () {

	//classic youtube
	if ($('#player-unavailable:not(.hid)').length) {
		location.replace('https://eachvideo.com/watch' + location.search);
	}

	//new material design
	if ($('ytd-watch').attr('player-unavailable')==="") {
		location.replace('https://eachvideo.com/watch' + location.search);
	}

});